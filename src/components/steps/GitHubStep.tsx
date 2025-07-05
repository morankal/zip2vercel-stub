import { motion } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { WizardData } from '@/App'

interface GitHubStepProps {
  data: WizardData
  updateData: (section: keyof WizardData, data: any) => void
  onNext: () => void
  onPrev: () => void
}

export default function GitHubStep({ data, updateData, onNext, onPrev }: GitHubStepProps) {
  const handleGitHubAuth = () => {
    // Placeholder for GitHub OAuth
    updateData('github', {
      token: 'mock_token',
      user: { login: 'testuser', name: 'Test User' },
      repoName: 'my-website',
      repoUrl: 'https://github.com/testuser/my-website'
    })
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
              <Github className="w-8 h-8 text-gray-800" />
              <span>חיבור ל-GitHub</span>
            </CardTitle>
            <CardDescription>
              התחבר ל-GitHub כדי ליצור repository חדש לאתר שלך
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <Github className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 hebrew-text">
                נדרש חיבור ל-GitHub
              </h3>
              <p className="text-gray-600 text-sm hebrew-text mb-4">
                נצור repository חדש עבור האתר שלך ונעלה את הקבצים
              </p>
              <Button onClick={handleGitHubAuth} className="hebrew-text">
                <Github className="w-4 h-4 ml-2" />
                התחבר ל-GitHub
              </Button>
            </div>
            
            {data.github.user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <p className="text-green-800 hebrew-text">
                  מחובר בתור: {data.github.user.name}
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

