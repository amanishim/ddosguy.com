"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Loader2 } from "lucide-react"

interface ProgressStepsProps {
  isScanning: boolean
}

const steps = [
  { id: 1, name: "DNS Analysis", description: "Checking DNS records and configuration" },
  { id: 2, name: "Security Headers", description: "Analyzing HTTP security headers" },
  { id: 3, name: "Protection Detection", description: "Identifying security services" },
  { id: 4, name: "Risk Assessment", description: "Calculating security score" },
]

export function ProgressSteps({ isScanning }: ProgressStepsProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    if (!isScanning) {
      setCurrentStep(0)
      setCompletedSteps([])
      return
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          setCompletedSteps((completed) => [...completed, prev])
          return prev + 1
        }
        return prev
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isScanning])

  if (!isScanning && completedSteps.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index)
        const isCurrent = currentStep === index && isScanning
        const isPending = index > currentStep

        return (
          <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex-shrink-0">
              {isCompleted ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : isCurrent ? (
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-gray-300 bg-gray-100" />
              )}
            </div>
            <div className="flex-1">
              <h3
                className={`font-semibold font-heading ${
                  isCompleted ? "text-green-600" : isCurrent ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.name}
              </h3>
              <p
                className={`text-sm font-heading ${
                  isCompleted ? "text-green-600" : isCurrent ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
