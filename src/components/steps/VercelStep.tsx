import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { WizardData } from '@/App'

interface VercelStepProps {
  data: WizardData
  updateData: (section: keyof WizardData, data: any) => void
  onNext: () => void
  onPrev: () => void
}

export default function VercelStep({ data, updateData, onNext, onPrev }: VercelStepProps) {
  const [isDeploying, setIsDeploying] = useState(false)

  const handleDeploy = async () => {
    setIsDeploying(true)
    
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    updateData('vercel', {
      deploymentUrl: 'https://my-website-abc123.vercel.app',
      projectId: 'prj_abc123'
    })
    
    setIsDeploying(false)
    onNext()
  }

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
              <Globe className="w-8 h-8 text-blue-500" />
              <span>פריסה ב-Vercel</span>
            </CardTitle>
            <CardDescription>
              נפרוס את האתר שלך ב-Vercel ונקבל כתובת אינטרנט
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {!data.vercel.deploymentUrl ? (
              <div className="bg-blue-50 rounded-lg p-6">
                <Globe className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 hebrew-text">
                  מוכן לפריסה
                </h3>
                <p className="text-gray-600 text-sm hebrew-text mb-4">
                  נפרוס את האתר שלך ב-Vercel ונקבל כתובת אינטרנט ציבורית
                </p>
                <Button 
                  onClick={handleDeploy} 
                  disabled={isDeploying}
                  className="hebrew-text"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      מפרוס...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 ml-2" />
                      פרוס באינטרנט
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 hebrew-text mb-2">
                  האתר פורס בהצלחה!
                </h3>
                <p className="text-green-600 text-sm hebrew-text">
                  האתר שלך זמין בכתובת:
                </p>
                <div className="mt-2 p-2 bg-white rounded border">
                  <code className="text-sm english-text">{data.vercel.deploymentUrl}</code>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

