import multer from 'multer'
import JSZip from 'jszip'
import { Request } from 'express'

// Configure multer for file uploads
const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '20971520'), // 20MB
    files: 1,
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = (process.env.ALLOWED_MIME_TYPES || 'application/zip,application/x-zip-compressed').split(',')
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only ZIP files are allowed.'))
    }
  },
})

// Validate ZIP file structure and content
export const validateZipFile = async (buffer: Buffer): Promise<{ valid: boolean; error?: string; files?: string[] }> => {
  try {
    const zip = new JSZip()
    const zipContent = await zip.loadAsync(buffer)
    
    const files = Object.keys(zipContent.files)
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\.\.\//,  // Directory traversal
      /^\//, // Absolute paths
      /\x00/, // Null bytes
    ]
    
    for (const filename of files) {
      if (suspiciousPatterns.some(pattern => pattern.test(filename))) {
        return { valid: false, error: 'Suspicious file path detected' }
      }
    }
    
    // Check for minimum required files (at least one HTML file or index file)
    const hasIndexFile = files.some(file => 
      file.toLowerCase().includes('index.html') || 
      file.toLowerCase().includes('index.htm') ||
      file.toLowerCase().includes('index.js') ||
      file.toLowerCase().includes('package.json')
    )
    
    if (!hasIndexFile) {
      return { 
        valid: false, 
        error: 'ZIP file must contain at least one index file (index.html, index.htm, index.js, or package.json)' 
      }
    }
    
    // Check total uncompressed size to prevent zip bombs
    let totalSize = 0
    for (const filename of files) {
      const file = zipContent.files[filename]
      if (!file.dir) {
        const content = await file.async('uint8array')
        totalSize += content.length
        
        // Prevent individual files that are too large
        if (content.length > 50 * 1024 * 1024) { // 50MB per file
          return { valid: false, error: 'Individual file too large' }
        }
      }
    }
    
    // Prevent total uncompressed size that's too large
    if (totalSize > 200 * 1024 * 1024) { // 200MB total
      return { valid: false, error: 'Total uncompressed size too large' }
    }
    
    return { valid: true, files }
  } catch (error) {
    return { valid: false, error: 'Invalid ZIP file format' }
  }
}

// Extract and sanitize file contents
export const extractZipContents = async (buffer: Buffer): Promise<{ [filename: string]: Buffer }> => {
  const zip = new JSZip()
  const zipContent = await zip.loadAsync(buffer)
  const extractedFiles: { [filename: string]: Buffer } = {}
  
  for (const filename of Object.keys(zipContent.files)) {
    const file = zipContent.files[filename]
    if (!file.dir) {
      const content = await file.async('nodebuffer')
      // Sanitize filename
      const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._\-\/]/g, '_')
      extractedFiles[sanitizedFilename] = content
    }
  }
  
  return extractedFiles
}

