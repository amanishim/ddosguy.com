"use client"

import { useState, useEffect } from "react"

interface AIAnalystProps {
  scanResult: any
  host: string
}

export function AIAnalyst({ scanResult, host }: AIAnalystProps) {
  const [analysis, setAnalysis] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function generateAnalysis() {
      try {
        const response = await fetch("/api/ai-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scanResult, host }),
        })

        if (response.ok) {
          const data = await response.json()
          setAnalysis(data.analysis)
        } else {
          setAnalysis("Unable to generate AI analysis at this time.")
        }
      } catch (error) {
        console.error("Failed to generate AI analysis:", error)
        setAnalysis("Unable to generate AI analysis at this time.")
      } finally {
        setLoading(false)
      }
    }

    generateAnalysis()
  }, [scanResult, host])

  return (
    <div className="bg-blue-50 border-4 border-black p-6 transform -rotate-1 shadow-[6px_6px_0px_0px_#000] mb-8">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-400 rounded-full border-2 border-black flex items-center justify-center mr-3">
          <span className="text-xl">🤖</span>
        </div>
        <h3 className="text-2xl font-bold text-black">AI Security Analyst</h3>
      </div>

      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
          <span className="text-gray-600">Analyzing your DDoS protection...</span>
        </div>
      ) : (
        <p className="text-gray-700 text-lg leading-relaxed">{analysis}</p>
      )}
    </div>
  )
}
