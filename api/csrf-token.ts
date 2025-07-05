import { Request, Response } from 'express'
import { generateCSRFToken, cookieConfig } from './utils/security'

export default function handler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const csrfToken = generateCSRFToken()
    
    // Store CSRF token in session (in production, use a proper session store)
    if (!req.session) {
      req.session = {}
    }
    req.session.csrfToken = csrfToken
    
    // Set secure cookie
    res.cookie('csrf-token', csrfToken, cookieConfig)
    
    res.json({
      csrfToken,
      message: 'CSRF token generated successfully'
    })
  } catch (error) {
    console.error('CSRF token generation error:', error)
    res.status(500).json({ error: 'Failed to generate CSRF token' })
  }
}

