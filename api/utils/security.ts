import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'
import crypto from 'crypto'

// Rate limiting configurations
export const globalRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '600000'), // 10 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const apiRateLimit = rateLimit({
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
  max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS || '10'), // 10 requests per minute
  message: {
    error: 'Too many API requests from this IP, please try again later.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Helmet configuration for security headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.github.com", "https://api.vercel.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
})

// CORS configuration
export const corsConfig = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://morankal-standup.co.il', 'https://*.vercel.app']
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
})

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

export const validateCSRFToken = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next()
  }

  const token = req.headers['x-csrf-token'] as string
  const sessionToken = req.session?.csrfToken

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' })
  }

  next()
}

// File upload validation
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '20971520') // 20MB
  const allowedMimes = (process.env.ALLOWED_MIME_TYPES || 'application/zip,application/x-zip-compressed').split(',')

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  if (req.file.size > maxSize) {
    return res.status(413).json({ error: 'File too large. Maximum size is 20MB.' })
  }

  if (!allowedMimes.includes(req.file.mimetype)) {
    return res.status(415).json({ error: 'Invalid file type. Only ZIP files are allowed.' })
  }

  // Basic zip bomb protection - check compression ratio
  const compressionRatio = req.file.size / (req.file.buffer?.length || req.file.size)
  if (compressionRatio > 100) {
    return res.status(400).json({ error: 'Suspicious file detected. Upload rejected.' })
  }

  next()
}

// Secure cookie configuration
export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 86400000, // 24 hours
}

// JWT token utilities
export const generateJWT = (payload: any): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key'
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payloadStr = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 86400000 })).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${payloadStr}`).digest('base64url')
  
  return `${header}.${payloadStr}.${signature}`
}

export const verifyJWT = (token: string): any => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key'
    const [header, payload, signature] = token.split('.')
    
    const expectedSignature = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature')
    }
    
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString())
    
    if (decodedPayload.exp < Date.now()) {
      throw new Error('Token expired')
    }
    
    return decodedPayload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

