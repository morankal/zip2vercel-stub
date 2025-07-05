import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { CheckCircle, Copy, ExternalLink, MessageCircle, Check } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { copyToClipboard, openWhatsApp } from '@/lib/utils'
import { toast } from 'sonner'
import { WizardData } from '@/App'

interface SuccessStepProps {
  data: WizardData
}

export default function SuccessStep({ data }: SuccessStepProps) {
  const [showConfetti, setShowConfetti] = useState(true)
  const [copied, setCopied] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)
    
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    
    // Send notification to Slack
    sendSlackNotification()
    
    return () => {
      window.removeEventListener('resize', updateWindowSize)
      clearTimeout(timer)
    }
  }, [])

  const sendSlackNotification = async () => {
    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL
      if (!webhookUrl) return

      const payload = {
        name: data.user.name || 'Anonymous',
        email: data.user.email || 'not-provided',
        repo: data.github.repoUrl || 'unknown',
        vercelUrl: data.vercel.deploymentUrl || 'unknown'
      }

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🎉 New website deployed!\nUser: ${payload.name} (${payload.email})\nRepo: ${payload.repo}\nURL: ${payload.vercelUrl}`
        })
      })
    } catch (error) {
      console.error('Failed to send Slack notification:', error)
    }
  }

  const handleCopyUrl = async () => {
    if (data.vercel.deploymentUrl) {
      try {
        await copyToClipboard(data.vercel.deploymentUrl)
        setCopied(true)
        toast.success('הכתובת הועתקה ללוח!')
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        toast.error('שגיאה בהעתקת הכתובת')
      }
    }
  }

  const handleOpenSite = () => {
    if (data.vercel.deploymentUrl) {
      window.open(data.vercel.deploymentUrl, '_blank')
    }
  }

  const handleWhatsAppContact = () => {
    const message = `שלום! זה עתה השתמשתי באשף Zip2Vercel ופרסתי את האתר שלי: ${data.vercel.deploymentUrl}`
    openWhatsApp('972523456789', message)
  }

  return (
    <div className="space-y-6">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="inline-block"
        >
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 success-bounce" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-green-600 hebrew-text mb-2"
        >
          ✅ האתר עלה באוויר!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-gray-600 hebrew-text"
        >
          מזל טוב! האתר שלך פורס בהצלחה ונגיש לכולם
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="hebrew-text">האתר שלך מוכן!</CardTitle>
            <CardDescription className="hebrew-text">
              האתר שלך זמין בכתובת הבאה
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <code className="text-sm english-text flex-1 text-blue-600">
                  {data.vercel.deploymentUrl || 'https://your-site.vercel.app'}
                </code>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="hebrew-text"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleOpenSite}
                    className="hebrew-text"
                  >
                    <ExternalLink className="w-4 h-4 ml-2" />
                    פתח אתר
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-800 hebrew-text">
                      פריסה הושלמה
                    </h3>
                    <p className="text-sm text-green-600 hebrew-text">
                      האתר זמין ברחבי העולם
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <ExternalLink className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-800 hebrew-text">
                      HTTPS מאובטח
                    </h3>
                    <p className="text-sm text-blue-600 hebrew-text">
                      תעודת SSL אוטומטית
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* WhatsApp CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold hebrew-text mb-2">
              צריך עזרה או יש שאלות?
            </h3>
            <p className="text-gray-600 text-sm hebrew-text mb-4">
              צור קשר איתנו ב-WhatsApp לתמיכה מהירה
            </p>
            <Button
              onClick={handleWhatsAppContact}
              className="bg-green-500 hover:bg-green-600 hebrew-text"
            >
              <MessageCircle className="w-4 h-4 ml-2" />
              צור קשר ב-WhatsApp
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">סיכום הפריסה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 hebrew-text">קובץ שהועלה:</span>
                <span className="font-medium">{data.upload.fileName || 'לא זמין'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 hebrew-text">GitHub Repository:</span>
                <span className="font-medium english-text">{data.github.repoName || 'לא זמין'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 hebrew-text">כתובת האתר:</span>
                <span className="font-medium english-text text-blue-600">
                  {data.vercel.deploymentUrl || 'לא זמין'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

