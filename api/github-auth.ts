import { Request, Response } from 'express'
import { apiRateLimit, generateJWT, cookieConfig } from './utils/security'
import { GitHubService } from './utils/github'
import crypto from 'crypto'

export default async function handler(req: Request, res: Response) {
  // Apply rate limiting
  await new Promise((resolve, reject) => {
    apiRateLimit(req, res, (err) => {
      if (err) reject(err)
      else resolve(undefined)
    })
  })

  if (req.method === 'GET') {
    // Initiate OAuth flow
    try {
      const clientId = process.env.GITHUB_CLIENT_ID
      if (!clientId) {
        return res.status(500).json({ error: 'GitHub OAuth not configured' })
      }

      const state = crypto.randomBytes(32).toString('hex')
      const redirectUri = `${req.protocol}://${req.get('host')}/api/github-callback`
      
      // Store state in session for verification
      if (!req.session) {
        req.session = {}
      }
      req.session.githubOAuthState = state

      const authUrl = GitHubService.generateOAuthUrl(clientId, redirectUri, state)

      res.json({
        authUrl,
        state,
        message: 'Redirect to GitHub for authentication'
      })
    } catch (error) {
      console.error('GitHub OAuth initiation error:', error)
      res.status(500).json({ error: 'Failed to initiate GitHub OAuth' })
    }
  } else if (req.method === 'POST') {
    // Handle OAuth callback
    try {
      const { code, state } = req.body

      if (!code || !state) {
        return res.status(400).json({ error: 'Missing code or state parameter' })
      }

      // Verify state parameter
      if (!req.session?.githubOAuthState || req.session.githubOAuthState !== state) {
        return res.status(400).json({ error: 'Invalid state parameter' })
      }

      const clientId = process.env.GITHUB_CLIENT_ID
      const clientSecret = process.env.GITHUB_CLIENT_SECRET

      if (!clientId || !clientSecret) {
        return res.status(500).json({ error: 'GitHub OAuth not configured' })
      }

      // Exchange code for access token
      const accessToken = await GitHubService.exchangeCodeForToken(clientId, clientSecret, code)

      // Get user information
      const githubService = new GitHubService(accessToken)
      const user = await githubService.getUser()

      // Generate JWT token for our app
      const jwt = generateJWT({
        githubToken: accessToken,
        user: user,
        type: 'github_auth'
      })

      // Set secure cookie
      res.cookie('github-token', jwt, cookieConfig)

      // Clear OAuth state
      delete req.session.githubOAuthState

      res.json({
        success: true,
        user,
        message: 'GitHub authentication successful'
      })
    } catch (error) {
      console.error('GitHub OAuth callback error:', error)
      res.status(500).json({ 
        error: 'GitHub authentication failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

