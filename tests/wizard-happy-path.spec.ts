import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('Zip2Vercel Wizard - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete the full wizard flow successfully', async ({ page }) => {
    // Step 1: Upload ZIP file
    await test.step('Upload ZIP file', async () => {
      // Check if we're on step 1
      await expect(page.locator('text=העלאת קובץ ZIP')).toBeVisible()
      
      // Check for upload area
      const uploadArea = page.locator('.upload-area')
      await expect(uploadArea).toBeVisible()
      
      // Upload the sample ZIP file
      const fileInput = page.locator('input[type="file"]')
      const sampleZipPath = path.join(__dirname, '../samples/hello-world.zip')
      await fileInput.setInputFiles(sampleZipPath)
      
      // Wait for upload to complete
      await expect(page.locator('text=קובץ הועלה בהצלחה')).toBeVisible({ timeout: 10000 })
      
      // Check that we automatically advance to step 2
      await expect(page.locator('text=חיבור ל-GitHub')).toBeVisible({ timeout: 5000 })
    })

    // Step 2: GitHub Authentication (mocked)
    await test.step('GitHub Authentication', async () => {
      // Check if we're on step 2
      await expect(page.locator('text=חיבור ל-GitHub')).toBeVisible()
      
      // Click GitHub auth button
      const githubButton = page.locator('button:has-text("התחבר ל-GitHub")')
      await expect(githubButton).toBeVisible()
      await githubButton.click()
      
      // In a real test, we would handle OAuth flow
      // For now, we'll wait for the mocked success
      await expect(page.locator('text=מחובר בתור')).toBeVisible({ timeout: 5000 })
      
      // Advance to step 3
      await expect(page.locator('text=פריסה ב-Vercel')).toBeVisible({ timeout: 5000 })
    })

    // Step 3: Vercel Deployment (mocked)
    await test.step('Vercel Deployment', async () => {
      // Check if we're on step 3
      await expect(page.locator('text=פריסה ב-Vercel')).toBeVisible()
      
      // Click deploy button
      const deployButton = page.locator('button:has-text("פרוס באינטרנט")')
      await expect(deployButton).toBeVisible()
      await deployButton.click()
      
      // Wait for deployment to complete (mocked)
      await expect(page.locator('text=האתר פורס בהצלחה')).toBeVisible({ timeout: 10000 })
      
      // Advance to step 4
      await expect(page.locator('text=הצלחה!')).toBeVisible({ timeout: 5000 })
    })

    // Step 4: Success Page
    await test.step('Success Page', async () => {
      // Check if we're on step 4
      await expect(page.locator('text=האתר עלה באוויר')).toBeVisible()
      
      // Check for confetti (canvas element)
      await expect(page.locator('canvas')).toBeVisible()
      
      // Check for Vercel URL
      await expect(page.locator('code:has-text("vercel.app")')).toBeVisible()
      
      // Check for copy button
      const copyButton = page.locator('button:has-text("Copy")')
      await expect(copyButton).toBeVisible()
      
      // Check for open site button
      const openButton = page.locator('button:has-text("פתח אתר")')
      await expect(openButton).toBeVisible()
      
      // Check for WhatsApp CTA
      const whatsappButton = page.locator('button:has-text("צור קשר ב-WhatsApp")')
      await expect(whatsappButton).toBeVisible()
    })
  })

  test('should navigate between steps using navigation buttons', async ({ page }) => {
    // Start at step 1
    await expect(page.locator('text=העלאת קובץ ZIP')).toBeVisible()
    
    // Upload a file to enable navigation
    const fileInput = page.locator('input[type="file"]')
    const sampleZipPath = path.join(__dirname, '../samples/hello-world.zip')
    await fileInput.setInputFiles(sampleZipPath)
    
    // Wait for upload and auto-advance
    await expect(page.locator('text=חיבור ל-GitHub')).toBeVisible({ timeout: 10000 })
    
    // Test back button
    const backButton = page.locator('button:has-text("חזור")')
    await expect(backButton).toBeVisible()
    await backButton.click()
    
    // Should be back at step 1
    await expect(page.locator('text=העלאת קובץ ZIP')).toBeVisible()
    
    // Test next button
    const nextButton = page.locator('button:has-text("המשך")')
    await expect(nextButton).toBeVisible()
    await nextButton.click()
    
    // Should be at step 2
    await expect(page.locator('text=חיבור ל-GitHub')).toBeVisible()
  })

  test('should show progress correctly', async ({ page }) => {
    // Check initial progress (step 1 of 4 = 25%)
    const progressBar = page.locator('[role="progressbar"]')
    await expect(progressBar).toBeVisible()
    
    // Check step indicators
    const stepIndicators = page.locator('.w-10.h-10.rounded-full')
    await expect(stepIndicators).toHaveCount(4)
    
    // First step should be active
    const activeStep = page.locator('.bg-blue-500.text-white')
    await expect(activeStep).toBeVisible()
  })

  test('should display Hebrew text correctly', async ({ page }) => {
    // Check RTL direction
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
    await expect(html).toHaveAttribute('lang', 'he')
    
    // Check Hebrew text elements
    await expect(page.locator('text=אשף Zip2Vercel')).toBeVisible()
    await expect(page.locator('text=העלאה מהירה לאינטרנט בקלות')).toBeVisible()
    await expect(page.locator('text=שלב 1 מתוך 4')).toBeVisible()
  })

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that elements are still visible and properly arranged
    await expect(page.locator('text=אשף Zip2Vercel')).toBeVisible()
    await expect(page.locator('.upload-area')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // Check that layout adapts
    await expect(page.locator('text=אשף Zip2Vercel')).toBeVisible()
    await expect(page.locator('.upload-area')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Check that layout works on large screens
    await expect(page.locator('text=אשף Zip2Vercel')).toBeVisible()
    await expect(page.locator('.upload-area')).toBeVisible()
  })
})

