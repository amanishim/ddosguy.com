export interface SecurityMetrics {
  totalScans: number
  averageScore: number
  commonVulnerabilities: Array<{
    name: string
    count: number
    percentage: number
  }>
  protectionLevels: {
    high: number
    medium: number
    low: number
  }
}

export interface WeeklyBreakdown {
  day: string
  scans: number
}

// Simple in-memory storage (in production, use a database)
let scanCount = 0

export async function getSecurityMetrics(): Promise<SecurityMetrics> {
  // In a real app, this would fetch from a database
  // For now, return realistic mock data
  return {
    totalScans: scanCount,
    averageScore: 78,
    commonVulnerabilities: [
      { name: "Missing HTTPS", count: 23, percentage: 49 },
      { name: "No CDN Protection", count: 18, percentage: 38 },
      { name: "Weak Security Headers", count: 15, percentage: 32 },
      { name: "DNS Vulnerabilities", count: 12, percentage: 26 },
    ],
    protectionLevels: {
      high: 15,
      medium: 20,
      low: 12,
    },
  }
}

export function incrementScanCount(): void {
  scanCount++
}

export async function getWeeklyBreakdown(): Promise<WeeklyBreakdown[]> {
  // Mock weekly data - in production, this would come from a database
  return [
    { day: "Mon", scans: 12 },
    { day: "Tue", scans: 19 },
    { day: "Wed", scans: 8 },
    { day: "Thu", scans: 15 },
    { day: "Fri", scans: 22 },
    { day: "Sat", scans: 6 },
    { day: "Sun", scans: 9 },
  ]
}

export function calculateRiskLevel(score: number, criticalIssues: number): "LOW" | "MEDIUM" | "HIGH" {
  if (criticalIssues > 2) return "HIGH"
  if (criticalIssues > 0 || score < 60) return "MEDIUM"
  return "LOW"
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-yellow-600"
  return "text-red-600"
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case "LOW":
      return "text-green-600"
    case "MEDIUM":
      return "text-yellow-600"
    case "HIGH":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}
