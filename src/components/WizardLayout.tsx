import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Upload, Github, Globe, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  path: string
}

interface WizardLayoutProps {
  children: ReactNode
  currentStep: number
  steps: Step[]
  onStepClick: (step: number) => void
  onNext: () => void
  onPrev: () => void
  canGoNext: boolean
  canGoPrev: boolean
}

const stepIcons = [Upload, Github, Globe, CheckCircle]

export default function WizardLayout({
  children,
  currentStep,
  steps,
  onStepClick,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
}: WizardLayoutProps) {
  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <Upload className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold hebrew-text bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  אשף Zip2Vercel
                </h1>
                <p className="text-gray-600 hebrew-text">
                  העלאה מהירה לאינטרנט בקלות
                </p>
              </div>
            </div>
            
            <div className="text-left rtl:text-right">
              <div className="text-sm text-gray-600 mb-2 hebrew-text">
                שלב {currentStep} מתוך {steps.length}
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Step Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-8 rtl:space-x-reverse overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = stepIcons[index]
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep
              const isClickable = step.id <= currentStep
              
              return (
                <motion.div
                  key={step.id}
                  className={cn(
                    "flex items-center space-x-3 rtl:space-x-reverse whitespace-nowrap cursor-pointer transition-smooth",
                    isClickable ? "hover:scale-105" : "cursor-not-allowed opacity-50"
                  )}
                  onClick={() => isClickable && onStepClick(step.id)}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                >
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-smooth",
                      isActive
                        ? "bg-blue-500 text-white shadow-lg"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    )}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span className={cn(
                    "text-sm font-medium hebrew-text",
                    isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                  )}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-0.5 bg-gray-200 mx-4" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={onPrev}
              disabled={!canGoPrev}
              className="flex items-center space-x-2 rtl:space-x-reverse hebrew-text"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              <span>חזור</span>
            </Button>

            <div className="text-center">
              <div className="text-sm text-gray-500 hebrew-text">
                {steps[currentStep - 1]?.title}
              </div>
            </div>

            <Button
              onClick={onNext}
              disabled={!canGoNext}
              className="flex items-center space-x-2 rtl:space-x-reverse hebrew-text"
            >
              <span>המשך</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

