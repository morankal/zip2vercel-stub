import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileArchive, Download, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { formatFileSize } from '@/lib/utils'
import { toast } from 'sonner'
import { WizardData } from '@/App'

interface UploadStepProps {
  data: WizardData
  updateData: (section: keyof WizardData, data: any) => void
  onNext: () => void
}

export default function UploadStep({ data, updateData, onNext }: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      toast.error('אנא בחר קובץ ZIP בלבד')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('גודל הקובץ חייב להיות קטן מ-20MB')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const formData = new FormData()
      formData.append('zipFile', file)

      // Get CSRF token first
      const csrfResponse = await fetch('/api/csrf-token')
      const { csrfToken } = await csrfResponse.json()

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'שגיאה בהעלאת הקובץ')
      }

      const result = await response.json()
      
      updateData('upload', {
        fileId: result.fileId,
        fileName: file.name,
        fileSize: file.size,
        files: result.files,
      })

      toast.success('הקובץ הועלה בהצלחה!')
      
      // Auto-advance after a short delay
      setTimeout(() => {
        onNext()
      }, 1500)

    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'שגיאה בהעלאת הקובץ')
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const downloadSample = () => {
    // This would download the sample ZIP file
    const link = document.createElement('a')
    link.href = '/samples/hello-world.zip'
    link.download = 'hello-world.zip'
    link.click()
    toast.success('דוגמת ZIP הורדה בהצלחה')
  }

  const hasUploadedFile = data.upload.fileName

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
              <Upload className="w-8 h-8 text-blue-500" />
              <span>העלאת קובץ ZIP</span>
            </CardTitle>
            <CardDescription>
              בחר או גרור קובץ ZIP המכיל את האתר שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasUploadedFile ? (
              <div
                className={`upload-area p-8 rounded-lg text-center transition-all ${
                  isDragging ? 'dragover' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <motion.div
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <FileArchive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                </motion.div>
                
                <h3 className="text-lg font-semibold mb-2 hebrew-text">
                  {isDragging ? 'שחרר כאן' : 'גרור קובץ ZIP או לחץ לבחירה'}
                </h3>
                <p className="text-gray-500 text-sm hebrew-text">
                  גודל מקסימלי: 20MB
                </p>
                
                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2 hebrew-text">
                      מעלה... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800 hebrew-text">
                      קובץ הועלה בהצלחה!
                    </h3>
                    <p className="text-sm text-green-600 hebrew-text">
                      {data.upload.fileName} ({formatFileSize(data.upload.fileSize || 0)})
                    </p>
                    {data.upload.files && (
                      <p className="text-xs text-green-500 mt-1 hebrew-text">
                        {data.upload.files.length} קבצים נמצאו
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateData('upload', {})}
                    className="hebrew-text"
                  >
                    שנה קובץ
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Sample Download */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Download className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold hebrew-text">דוגמת ZIP</h3>
                  <p className="text-sm text-gray-600 hebrew-text">
                    הורד דוגמה לקובץ ZIP תקין
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={downloadSample} className="hebrew-text">
                הורד דוגמה
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              <span>דרישות הקובץ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 hebrew-text">
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>קובץ ZIP בלבד</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>גודל מקסימלי: 20MB</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>חייב להכיל קובץ index.html או package.json</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>ללא קבצים זדוניים או נתיבים חשודים</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

