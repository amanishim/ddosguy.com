"use client"

import { Shield, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react"

interface SecurityScoreProps {
  results: {
    overallScore: number
    categoryScores: {
      dns: number
      ssl: number
      botProtection: number
      performance: number
    }
    industryRanking: {
      percentile: number
      trend: "improving" | "declining" | "stable"
    }
    priorityActions: Array<{
      title: string
      impact: "high" | "medium" | "low"
      effort: "high" | "medium" | "low"
      description: string
    }>
    roiAnalysis: {
      potentialSavings: number
      implementationCost: number
      paybackPeriod: number
    }
  }
}

export function SecurityScoreDisplay({ results }: SecurityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Poor"
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="doodle-border bg-white p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Security Posture Analysis</h2>
      </div>

      {/* Overall Score */}
      <div className="text-center mb-8">
        <div
          className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${getScoreColor(results.overallScore)}`}
        >
          {results.overallScore}
        </div>
        <div className="mt-2 text-xl font-semibold">{getScoreLabel(results.overallScore)} Security</div>
        <div className="text-gray-600">Overall Security Score</div>
      </div>

      {/* Industry Ranking */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Industry Ranking</div>
            <div className="text-2xl font-bold text-blue-600">{results.industryRanking.percentile}th percentile</div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp
              className={`w-5 h-5 ${
                results.industryRanking.trend === "improving"
                  ? "text-green-600"
                  : results.industryRanking.trend === "declining"
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            />
            <span className="capitalize">{results.industryRanking.trend}</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Security Categories</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="doodle-border bg-gray-50 p-3 rounded flex justify-between items-center">
            <span>DNS Security</span>
            <span className={`font-bold ${getScoreColor(results.categoryScores.dns).split(" ")[0]}`}>
              {results.categoryScores.dns}/100
            </span>
          </div>
          <div className="doodle-border bg-gray-50 p-3 rounded flex justify-between items-center">
            <span>SSL/TLS</span>
            <span className={`font-bold ${getScoreColor(results.categoryScores.ssl).split(" ")[0]}`}>
              {results.categoryScores.ssl}/100
            </span>
          </div>
          <div className="doodle-border bg-gray-50 p-3 rounded flex justify-between items-center">
            <span>Bot Protection</span>
            <span className={`font-bold ${getScoreColor(results.categoryScores.botProtection).split(" ")[0]}`}>
              {results.categoryScores.botProtection}/100
            </span>
          </div>
          <div className="doodle-border bg-gray-50 p-3 rounded flex justify-between items-center">
            <span>Performance</span>
            <span className={`font-bold ${getScoreColor(results.categoryScores.performance).split(" ")[0]}`}>
              {results.categoryScores.performance}/100
            </span>
          </div>
        </div>
      </div>

      {/* Priority Actions */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Priority Actions</h3>
        <div className="space-y-3">
          {results.priorityActions.map((action, index) => (
            <div key={index} className="doodle-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getImpactIcon(action.impact)}
                  <span className="font-medium">{action.title}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded ${
                      action.impact === "high"
                        ? "bg-red-100 text-red-700"
                        : action.impact === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {action.impact} impact
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      action.effort === "high"
                        ? "bg-red-100 text-red-700"
                        : action.effort === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {action.effort} effort
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Analysis */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold">ROI Analysis</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ${results.roiAnalysis.potentialSavings.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Potential Annual Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${results.roiAnalysis.implementationCost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Implementation Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{results.roiAnalysis.paybackPeriod} months</div>
            <div className="text-sm text-gray-600">Payback Period</div>
          </div>
        </div>
      </div>
    </div>
  )
}
