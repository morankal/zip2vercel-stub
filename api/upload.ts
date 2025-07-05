import { Request, Response } from 'express'
import { apiRateLimit, validateFileUpload, validateCSRFToken } from './utils/security'
import { upload, validateZipFile } from './utils/upload'

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
    // Handle file upload
    await new Promise((resolve, reject) => {
      upload.single('zipFile')(req, res, (err) => {
        if (err) reject(err)
        else resolve(undefined)
      })
    })

    // Validate CSRF token
    await new Promise((resolve, reject) => {
      validateCSRFToken(req, res, (err) => {
        if (err) reject(err)
        else resolve(undefined)
      })
    })

    // Validate file upload
    await new Promise((resolve, reject) => {
      validateFileUpload(req, res, (err) => {
        if (err) reject(err)
        else resolve(undefined)
      })
    })

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Validate ZIP file
    const validation = await validateZipFile(req.file.buffer)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    // Store file temporarily (in production, use a secure temporary storage)
    const fileId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // In a real implementation, you would store this in a secure temporary location
    // For now, we'll just return the file info
    res.json({
      success: true,
      fileId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      files: validation.files,
      message: 'קובץ ZIP הועלה בהצלחה'
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ 
      error: 'שגיאה בהעלאת הקובץ',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

