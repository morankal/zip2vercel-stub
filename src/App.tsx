import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import WizardLayout from './components/WizardLayout'
import UploadStep from './components/steps/UploadStep'
import GitHubStep from './components/steps/GitHubStep'
import VercelStep from './components/steps/VercelStep'
import SuccessStep from './components/steps/SuccessStep'

export interface WizardData {
  upload: {
    fileId?: string
    fileName?: string
    fileSize?: number
    files?: string[]
  }
  github: {
    token?: string
    user?: any
    repoName?: string
    repoUrl?: string
  }
  vercel: {
    deploymentUrl?: string
    projectId?: string
  }
  user: {
    name?: string
    email?: string
  }
}

const steps = [
  { id: 1, title: 'העלאת קובץ ZIP', path: '/step/1' },
  { id: 2, title: 'חיבור ל-GitHub', path: '/step/2' },
  { id: 3, title: 'פריסה ב-Vercel', path: '/step/3' },
  { id: 4, title: 'הצלחה!', path: '/step/4' },
]

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>({
    upload: {},
    github: {},
    vercel: {},
    user: {},
  })

  useEffect(() => {
    const path = location.pathname
    const stepMatch = path.match(/\/step\/(\d+)/)
    
    if (stepMatch) {
      const step = parseInt(stepMatch[1])
      if (step >= 1 && step <= 4) {
        setCurrentStep(step)
      } else {
        navigate('/step/1')
      }
    } else {
      navigate('/step/1')
    }
  }, [location.pathname, navigate])

  const updateWizardData = (section: keyof WizardData, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      const next = currentStep + 1
      navigate(`/step/${next}`)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1
      navigate(`/step/${prev}`)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      navigate(`/step/${step}`)
    }
  }

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 gradient-animate">
      <WizardLayout
        currentStep={currentStep}
        steps={steps}
        onStepClick={goToStep}
        onNext={nextStep}
        onPrev={prevStep}
        canGoNext={currentStep < 4}
        canGoPrev={currentStep > 1}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/step/1"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <UploadStep
                    data={wizardData}
                    updateData={updateWizardData}
                    onNext={nextStep}
                  />
                </motion.div>
              }
            />
            <Route
              path="/step/2"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <GitHubStep
                    data={wizardData}
                    updateData={updateWizardData}
                    onNext={nextStep}
                    onPrev={prevStep}
                  />
                </motion.div>
              }
            />
            <Route
              path="/step/3"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <VercelStep
                    data={wizardData}
                    updateData={updateWizardData}
                    onNext={nextStep}
                    onPrev={prevStep}
                  />
                </motion.div>
              }
            />
            <Route
              path="/step/4"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SuccessStep data={wizardData} />
                </motion.div>
              }
            />
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </AnimatePresence>
      </WizardLayout>
      <Toaster position="top-center" />
    </div>
  )
}

export default App

