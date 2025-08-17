import type { EnhancedScanResult } from "./enhanced-scanner"

export interface SecurityBenchmark {
  industry: string
  averageScore: number
  commonVulnerabilities: string[]
  recommendedMinScore: number
}

export interface SecurityPosture {
  currentScore: number
  previousScore?: number
  trend: "improving" | "declining" | "stable"
  industryRank: "top" | "above_average" | "average" | "below_average" | "poor"
  riskPriority: Array<{
    issue: string
    impact: "high" | "medium" | "low"
    effort: "easy" | "moderate" | "complex"
    scoreImprovement: number
  }>
  roiEstimate: {
    protectionCost: number
    downtimeCost: number
    riskReduction: number
  }
}

// Industry benchmarks (would be updated from real data)
const INDUSTRY_BENCHMARKS: Record<string, SecurityBenchmark> = {
  ecommerce: {
    industry: "E-commerce",
    averageScore: 72,
    commonVulnerabilities: ["Missing bot protection", "Weak SSL configuration", "No rate limiting"],
    recommendedMinScore: 85,
  },
  saas: {
    industry: "SaaS",
    averageScore: 78,
    commonVulnerabilities: ["DNS security gaps", "Missing HSTS preload", "Insufficient monitoring"],
    recommendedMinScore: 90,
  },
  gaming: {
    industry: "Gaming",
    averageScore: 65,
    commonVulnerabilities: ["Exposed origin IPs", "No DDoS protection", "Weak bot filtering"],
    recommendedMinScore: 80,
  },
  general: {
    industry: "General",
    averageScore: 68,
    commonVulnerabilities: ["Basic security gaps", "Missing edge protection", "Poor DNS hygiene"],
    recommendedMinScore: 75,
  },
}

export function calculateSecurityPosture(
  currentScan: EnhancedScanResult,
  previousScan?: EnhancedScanResult,
  industry = "general",
): SecurityPosture {
  const benchmark = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.general

  // Determine trend
  let trend: "improving" | "declining" | "stable" = "stable"
  if (previousScan) {
    const scoreDiff = currentScan.securityScore - previousScan.securityScore
    if (scoreDiff > 5) trend = "improving"
    else if (scoreDiff < -5) trend = "declining"
  }

  // Industry ranking
  const industryRank: SecurityPosture["industryRank"] =
    currentScan.securityScore >= benchmark.recommendedMinScore
      ? "top"
      : currentScan.securityScore >= benchmark.averageScore + 10
        ? "above_average"
        : currentScan.securityScore >= benchmark.averageScore - 10
          ? "average"
          : currentScan.securityScore >= benchmark.averageScore - 20
            ? "below_average"
            : "poor"

  // Risk prioritization
  const riskPriority: SecurityPosture["riskPriority"] = []

  if (!currentScan.dnsAnalysis.dnssec) {
    riskPriority.push({
      issue: "DNSSEC not enabled",
      impact: "high",
      effort: "moderate",
      scoreImprovement: 10,
    })
  }

  if (!currentScan.sslAnalysis.hstsPreload) {
    riskPriority.push({
      issue: "HSTS preload missing",
      impact: "medium",
      effort: "easy",
      scoreImprovement: 8,
    })
  }

  if (!currentScan.botProtection.challengeResponse) {
    riskPriority.push({
      issue: "No bot protection detected",
      impact: "high",
      effort: "moderate",
      scoreImprovement: 15,
    })
  }

  if (!currentScan.performance.cdnPresent) {
    riskPriority.push({
      issue: "No CDN/edge protection",
      impact: "high",
      effort: "easy",
      scoreImprovement: 12,
    })
  }

  if (currentScan.performance.responseTime > 2000) {
    riskPriority.push({
      issue: "Slow response time",
      impact: "medium",
      effort: "complex",
      scoreImprovement: 5,
    })
  }

  // Sort by impact and score improvement
  riskPriority.sort((a, b) => {
    const impactWeight = { high: 3, medium: 2, low: 1 }
    const aWeight = impactWeight[a.impact] * a.scoreImprovement
    const bWeight = impactWeight[b.impact] * b.scoreImprovement
    return bWeight - aWeight
  })

  // ROI estimation (simplified)
  const protectionCost = calculateProtectionCost(currentScan.securityScore)
  const downtimeCost = calculateDowntimeCost(industry)
  const riskReduction = Math.min(95, currentScan.securityScore + 20) - currentScan.securityScore

  return {
    currentScore: currentScan.securityScore,
    previousScore: previousScan?.securityScore,
    trend,
    industryRank,
    riskPriority,
    roiEstimate: {
      protectionCost,
      downtimeCost,
      riskReduction,
    },
  }
}

function calculateProtectionCost(currentScore: number): number {
  // Estimate monthly cost based on current security gaps
  if (currentScore >= 90) return 50 // Minimal additional protection needed
  if (currentScore >= 75) return 150 // Basic WAF/CDN
  if (currentScore >= 60) return 300 // Full protection suite
  return 500 // Comprehensive security overhaul
}

function calculateDowntimeCost(industry: string): number {
  // Estimated cost per hour of downtime by industry
  const costPerHour: Record<string, number> = {
    ecommerce: 5000,
    saas: 8000,
    gaming: 3000,
    general: 2000,
  }
  return costPerHour[industry] || costPerHour.general
}

export function generateSecurityReport(scanResult: EnhancedScanResult, posture: SecurityPosture): string {
  const sections = [
    `# Security Assessment Report for ${scanResult.host}`,
    `Generated: ${new Date(scanResult.timestamp).toLocaleString()}`,
    "",
    `## Overall Security Score: ${scanResult.securityScore}/100`,
    `Risk Level: ${scanResult.riskLevel.toUpperCase()}`,
    `Industry Ranking: ${posture.industryRank.replace("_", " ").toUpperCase()}`,
    "",
    "## Key Findings:",
    ...scanResult.recommendations.map((rec) => `- ${rec}`),
    "",
    "## Priority Actions:",
    ...posture.riskPriority
      .slice(0, 3)
      .map(
        (item, i) =>
          `${i + 1}. ${item.issue} (Impact: ${item.impact}, Effort: ${item.effort}, Score +${item.scoreImprovement})`,
      ),
    "",
    `## ROI Analysis:`,
    `- Estimated protection cost: $${posture.roiEstimate.protectionCost}/month`,
    `- Potential downtime cost: $${posture.roiEstimate.downtimeCost}/hour`,
    `- Risk reduction potential: ${posture.roiEstimate.riskReduction}%`,
  ]

  return sections.join("\n")
}
