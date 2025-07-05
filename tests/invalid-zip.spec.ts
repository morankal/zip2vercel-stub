import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

test.describe('Zip2Vercel Wizard - Invalid ZIP Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should reject non-ZIP files', async ({ page }) => {
    // Create a temporary text file
    const tempDir = path.join(__dirname, 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }
    
    const textFilePath = path.join(tempDir, 'test.txt')
    fs.writeFileSync(textFilePath, 'This is not a ZIP file')
    
    try {
      // Try to upload the text file
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(textFilePath)
      
      // Should show error message
      await expect(page.locator('text=אנא בחר קובץ ZIP בלבד')).toBeVisible({ timeout: 5000 })
      
      // Should not advance to next step
      await expect(page.locator('text=חיבור ל-GitHub')).not.toBeVisible()
    } finally {
      // Clean up
      if (fs.existsSync(textFilePath)) {
        fs.unlinkSync(textFilePath)
      }
      if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir)
      }
    }
  })

  test('should reject files that are too large', async ({ page }) => {
    // Create a large dummy ZIP file (simulate > 20MB)
    const tempDir = path.join(__dirname, 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }
    
    const largeFilePath = path.join(tempDir, 'large.zip')
    
    // Create a file that's larger than 20MB (simulate)
    // In a real test, you would create an actual large ZIP file
    // For this test, we'll just check the client-side validation
    
    try {
      // Mock a large file by creating a File object with large size
      await page.evaluate(() => {
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        if (fileInput) {
          // Create a mock file that's too large
          const largeFile = new File([''], 'large.zip', { 
            type: 'application/zip',
            lastModified: Date.now()
          })
          
          // Override the size property to simulate a large file
          Object.defineProperty(largeFile, 'size', {
            value: 25 * 1024 * 1024, // 25MB
            writable: false
          })
          
          // Trigger the file selection
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(largeFile)
          fileInput.files = dataTransfer.files
          
          // Trigger change event
          fileInput.dispatchEvent(new Event('change', { bubbles: true }))
        }
      })
      
      // Should show error message
      await expect(page.locator('text=גודל הקובץ חייב להיות קטן מ-20MB')).toBeVisible({ timeout: 5000 })
      
      // Should not advance to next step
      await expect(page.locator('text=חיבור ל-GitHub')).not.toBeVisible()
    } finally {
      // Clean up
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }
    }
  })

  test('should handle corrupted ZIP files', async ({ page }) => {
    // Create a corrupted ZIP file
    const tempDir = path.join(__dirname, 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }
    
    const corruptedZipPath = path.join(tempDir, 'corrupted.zip')
    
    // Create a file with ZIP extension but invalid content
    fs.writeFileSync(corruptedZipPath, 'PK\x03\x04corrupted zip content')
    
    try {
      // Try to upload the corrupted ZIP
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(corruptedZipPath)
      
      // Should show error message (this would be caught by server-side validation)
      await expect(page.locator('text=שגיאה בהעלאת הקובץ')).toBeVisible({ timeout: 10000 })
      
      // Should not advance to next step
      await expect(page.locator('text=חיבור ל-GitHub')).not.toBeVisible()
    } finally {
      // Clean up
      if (fs.existsSync(corruptedZipPath)) {
        fs.unlinkSync(corruptedZipPath)
      }
      if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir)
      }
    }
  })

  test('should handle ZIP without required files', async ({ page }) => {
    // This test would require creating a ZIP file without index.html or package.json
    // For now, we'll test the UI behavior when server returns an error
    
    // Mock server response for invalid ZIP structure
    await page.route('/api/upload', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'ZIP file must contain at least one index file (index.html, index.htm, index.js, or package.json)'
        })
      })
    })
    
    // Upload any ZIP file (will be intercepted)
    const fileInput = page.locator('input[type="file"]')
    const sampleZipPath = path.join(__dirname, '../samples/hello-world.zip')
    await fileInput.setInputFiles(sampleZipPath)
    
    // Should show the specific error message
    await expect(page.locator('text=ZIP file must contain at least one index file')).toBeVisible({ timeout: 10000 })
    
    // Should not advance to next step
    await expect(page.locator('text=חיבור ל-GitHub')).not.toBeVisible()
  })

  test('should handle network errors during upload', async ({ page }) => {
    // Mock network error
    await page.route('/api/upload', async route => {
      await route.abort('failed')
    })
    
    // Try to upload a file
    const fileInput = page.locator('input[type="file"]')
    const sampleZipPath = path.join(__dirname, '../samples/hello-world.zip')
    await fileInput.setInputFiles(sampleZipPath)
    
    // Should show error message
    await expect(page.locator('text=שגיאה בהעלאת הקובץ')).toBeVisible({ timeout: 10000 })
    
    // Should not advance to next step
    await expect(page.locator('text=חיבור ל-GitHub')).not.toBeVisible()
  })

  test('should handle CSRF token errors', async ({ page }) => {
    // Mock CSRF error
    await page.route('/api/upload', async route => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid CSRF token'
        })
      })
    })
    
    // Try to upload a file
    const fileInput = page.locator('input[type="file"]')
    const sampleZipPath = path.join(__dirname, '../samples/hello-world.zip')
    await fileInput.setInputFiles(sampleZipPath)
    
    // Should show error message
    await expect(page.locator('text=שגיאה בהעלאת הקובץ')).toBeVisible({ timeout: 10000 })
    
    // Should not advance to next step
    await expect(page.locator('text=חיבור ל-GitHub')).not.toBeVisible()
  })

  test('should handle rate limiting', async ({ page }) => {
    // Mock rate limiting error
    await page.route('/api/upload', async route => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Too many requests from this IP, please try again later.',
          retryAfter: '1 minute'
        })
      })
    })
    
    // Try to upload a file
    const fileInput = page.locator('input[type="file"]')
    const sampleZipPath = path.join(__dirname, '../samples/hello-world.zip')
    await fileInput.setInputFiles(sampleZipPath)
    
    // Should show rate limiting message
    await expect(page.locator('text=Too many requests')).toBeVisible({ timeout: 10000 })
    
    // Should not advance to next step
    await expect(page.locator('text=חיבור ל-GitHub')).not.toBeVisible()
  })

  test('should validate drag and drop functionality', async ({ page }) => {
    // Test drag and drop with invalid file
    const uploadArea = page.locator('.upload-area')
    await expect(uploadArea).toBeVisible()
    
    // Create a temporary non-ZIP file for drag and drop
    const tempDir = path.join(__dirname, 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }
    
    const textFilePath = path.join(tempDir, 'test.txt')
    fs.writeFileSync(textFilePath, 'This is not a ZIP file')
    
    try {
      // Simulate drag and drop
      await page.evaluate(async (filePath) => {
        const uploadArea = document.querySelector('.upload-area') as HTMLElement
        if (uploadArea) {
          // Create a mock file
          const file = new File(['content'], 'test.txt', { type: 'text/plain' })
          
          // Create drag event
          const dragEvent = new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: new DataTransfer()
          })
          
          dragEvent.dataTransfer?.items.add(file)
          
          // Dispatch the event
          uploadArea.dispatchEvent(dragEvent)
        }
      }, textFilePath)
      
      // Should show error for non-ZIP file
      await expect(page.locator('text=אנא בחר קובץ ZIP בלבד')).toBeVisible({ timeout: 5000 })
    } finally {
      // Clean up
      if (fs.existsSync(textFilePath)) {
        fs.unlinkSync(textFilePath)
      }
      if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir)
      }
    }
  })
})

