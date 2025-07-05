import { Request, Response } from 'express'
import { apiRateLimit, validateCSRFToken, verifyJWT } from './utils/security'
import { GitHubService } from './utils/github'
import { VercelService } from './utils/vercel'
import { extractZipContents } from './utils/upload'

export default async function handler(req: Request, res: Response) {
  // Apply rate limiting
  await new Promise((resolve, reject) => {
    apiRateLimit(req, res, (err) => {
      if (err) reject(err)
      else resolve(undefined)
    })
  })

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Validate CSRF token
    await new Promise((resolve, reject) => {
      validateCSRFToken(req, res, (err) => {
        if (err) reject(err)
        else resolve(undefined)
      })
    })

    const { fileId, repoName, projectName, userInfo } = req.body

    if (!fileId || !repoName || !projectName) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Verify GitHub token
    const githubToken = req.cookies['github-token']
    if (!githubToken) {
      return res.status(401).json({ error: 'GitHub authentication required' })
    }

    let githubAuth
    try {
      githubAuth = verifyJWT(githubToken)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid GitHub token' })
    }

    // Initialize services
    const githubService = new GitHubService(githubAuth.githubToken)
    const vercelService = new VercelService(
      process.env.VERCEL_TOKEN!,
      process.env.VERCEL_ORG_ID
    )

    // Step 1: Create GitHub repository
    let repo
    try {
      repo = await githubService.createRepository(repoName, `Website deployed via Zip2Vercel Wizard`)
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: 'Repository name already exists. Please choose a different name.' })
      }
      throw error
    }

    // Step 2: Upload files to GitHub
    // In a real implementation, you would retrieve the uploaded file from temporary storage
    // For now, we'll simulate with a basic HTML file
    const files = {
      'index.html': `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>האתר שלי</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 3em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        p {
            font-size: 1.2em;
            margin-bottom: 30px;
        }
        .success {
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            display: inline-block;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 האתר שלי עלה באוויר!</h1>
        <p>האתר נוצר בהצלחה באמצעות אשף Zip2Vercel</p>
        <div class="success">✅ פריסה הושלמה בהצלחה</div>
        <p style="margin-top: 30px; font-size: 0.9em; opacity: 0.8;">
            נוצר ב-${new Date().toLocaleDateString('he-IL')}
        </p>
    </div>
</body>
</html>`,
      'README.md': `# ${repoName}

האתר נוצר באמצעות אשף Zip2Vercel.

## פרטים
- נוצר: ${new Date().toISOString()}
- משתמש: ${githubAuth.user.name}
- Repository: ${repo.html_url}

## טכנולוגיות
- HTML5
- CSS3
- פריסה ב-Vercel

---
נוצר עם ❤️ באמצעות Zip2Vercel Wizard`
    }

    await githubService.uploadFiles(repoName, files, 'Initial deployment from Zip2Vercel Wizard')

    // Step 3: Create Vercel project
    const vercelProjectName = VercelService.generateProjectName(projectName)
    const vercelProject = await vercelService.createProject(vercelProjectName, {
      type: 'github',
      repo: repo.full_name
    })

    // Step 4: Deploy to Vercel
    const deployment = await vercelService.deployFromGitHub(vercelProject.id, {
      type: 'github',
      repo: repo.full_name
    })

    // Step 5: Wait for deployment to complete
    const finalDeployment = await vercelService.waitForDeployment(deployment.id, 180000) // 3 minutes timeout

    // Step 6: Send success notification to Slack (if configured)
    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL
      if (webhookUrl && userInfo) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🎉 New website deployed!\nUser: ${userInfo.name || 'Anonymous'} (${userInfo.email || 'not-provided'})\nRepo: ${repo.html_url}\nURL: https://${finalDeployment.url}`
          })
        })
      }
    } catch (slackError) {
      console.error('Failed to send Slack notification:', slackError)
      // Don't fail the deployment for Slack errors
    }

    res.json({
      success: true,
      github: {
        repoName: repo.name,
        repoUrl: repo.html_url,
        cloneUrl: repo.clone_url
      },
      vercel: {
        projectId: vercelProject.id,
        deploymentId: finalDeployment.id,
        deploymentUrl: `https://${finalDeployment.url}`,
        state: finalDeployment.state
      },
      message: 'האתר פורס בהצלחה!'
    })

  } catch (error) {
    console.error('Deployment error:', error)
    res.status(500).json({ 
      error: 'שגיאה בפריסת האתר',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

