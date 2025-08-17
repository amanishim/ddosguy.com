export interface SafetyCheck {
  id: string
  name: string
  status: "pass" | "warning" | "fail" | "pending"
  message: string
  details?: string
  required: boolean
}

export interface SimulationEnvironment {
  isProduction: boolean
  hasMonitoring: boolean
  hasRollbackPlan: boolean
  hasEmergencyContacts: boolean
  resourceLimits: {
    maxConcurrentConnections: number
    maxRequestRate: number
    maxDuration: number
  }
}

export interface SimulationResult {
  status: "completed" | "aborted" | "failed"
  safetyScore: number
  effectivenessScore: number
  riskAssessment: "safe" | "concerning" | "dangerous"
  metrics: {
    duration?: number
    requestsSent: number
    responsesReceived: number
    errorRate: number
    averageResponseTime: number
    defenseActivations: string[]
    anomaliesDetected: string[]
    resourceUsage: {
      maxCpu: number
      maxMemory: number
      maxBandwidth: number
    }
  }
  findings: string[]
  recommendations: string[]
  timestamp: number
}

export async function runPreFlightChecks(
  domain: string,
  simulationType: string,
  environment: SimulationEnvironment,
): Promise<SafetyCheck[]> {
  const checks: SafetyCheck[] = []

  // Domain accessibility check
  checks.push({
    id: "domain-accessible",
    name: "Domain Accessibility",
    status: "pending",
    message: "Checking if domain is accessible...",
    required: true,
  })

  try {
    const response = await fetch(`https://${domain}`, { method: "HEAD", signal: AbortSignal.timeout(5000) })
    checks[0].status = response.ok ? "pass" : "warning"
    checks[0].message = response.ok
      ? "Domain is accessible and responding"
      : `Domain returned ${response.status} - simulation may have limited effectiveness`
  } catch (error) {
    checks[0].status = "fail"
    checks[0].message = "Domain is not accessible - cannot run simulation"
    checks[0].details = `Error: ${error}`
  }

  // Production environment check
  checks.push({
    id: "production-warning",
    name: "Production Environment",
    status: environment.isProduction ? "warning" : "pass",
    message: environment.isProduction
      ? "⚠️ Production environment detected - extra caution required"
      : "Non-production environment - safer for testing",
    required: false,
  })

  // Monitoring systems check
  checks.push({
    id: "monitoring-active",
    name: "Monitoring Systems",
    status: environment.hasMonitoring ? "pass" : "warning",
    message: environment.hasMonitoring
      ? "Monitoring systems are active"
      : "No monitoring systems - simulation will proceed with basic safety checks only",
    required: false,
  })

  // Emergency contacts check
  checks.push({
    id: "emergency-contacts",
    name: "Emergency Contacts",
    status: environment.hasEmergencyContacts ? "pass" : "warning",
    message: environment.hasEmergencyContacts
      ? "Emergency contacts are available"
      : "No emergency contacts configured - consider having support available",
    required: false,
  })

  // Resource limits validation
  const resourceCheck: SafetyCheck = {
    id: "resource-limits",
    name: "Resource Limits",
    status: "pass",
    message: "Resource limits are within safe ranges",
    required: true,
  }

  if (environment.resourceLimits.maxConcurrentConnections > 100) {
    resourceCheck.status = "warning"
    resourceCheck.message = "High connection limit - may impact target system"
  }

  if (environment.resourceLimits.maxRequestRate > 100) {
    resourceCheck.status = "fail"
    resourceCheck.message = "Request rate too high - exceeds safety limits"
    resourceCheck.required = true
  }

  if (environment.resourceLimits.maxDuration > 600) {
    resourceCheck.status = "warning"
    resourceCheck.message = "Long duration - consider shorter tests first"
  }

  checks.push(resourceCheck)

  // Time-based safety check
  const currentHour = new Date().getHours()
  const isBusinessHours = currentHour >= 9 && currentHour <= 17

  checks.push({
    id: "timing-check",
    name: "Timing Recommendation",
    status: environment.isProduction && isBusinessHours ? "warning" : "pass",
    message:
      environment.isProduction && isBusinessHours
        ? "Running during business hours on production - consider off-hours testing"
        : "Good timing for simulation",
    required: false,
  })

  // Simulation-specific checks
  if (simulationType === "http-flood") {
    checks.push({
      id: "http-flood-safety",
      name: "HTTP Flood Safety",
      status: "pass",
      message: "HTTP flood simulation configured with safe parameters",
      details: `Max ${environment.resourceLimits.maxRequestRate} req/s, ${environment.resourceLimits.maxDuration}s duration`,
      required: true,
    })
  }

  return checks
}

export function calculateSafetyScore(
  environment: SimulationEnvironment,
  checks: SafetyCheck[],
  metrics: SimulationResult["metrics"],
): number {
  let score = 100

  // Deduct for failed safety checks
  const failedChecks = checks.filter((c) => c.status === "fail")
  score -= failedChecks.length * 20

  // Deduct for warnings
  const warningChecks = checks.filter((c) => c.status === "warning")
  score -= warningChecks.length * 10

  // Deduct for high error rates
  if (metrics.errorRate > 0.1)
    score -= 20 // >10% error rate
  else if (metrics.errorRate > 0.05) score -= 10 // >5% error rate

  // Deduct for anomalies
  score -= metrics.anomaliesDetected.length * 5

  // Bonus for good practices
  if (environment.hasMonitoring) score += 5
  if (environment.hasRollbackPlan) score += 5
  if (!environment.isProduction) score += 10

  return Math.max(0, Math.min(100, score))
}

export function calculateEffectivenessScore(metrics: SimulationResult["metrics"]): number {
  let score = 0

  // Base score for successful execution
  if (metrics.responsesReceived > 0) score += 20

  // Score for defense activations
  score += Math.min(40, metrics.defenseActivations.length * 10)

  // Score for appropriate response times (not too fast, not too slow)
  if (metrics.averageResponseTime > 100 && metrics.averageResponseTime < 5000) {
    score += 20
  } else if (metrics.averageResponseTime >= 5000) {
    score += 30 // Slow responses might indicate rate limiting
  }

  // Score for controlled error rates
  if (metrics.errorRate > 0.1 && metrics.errorRate < 0.5) {
    score += 20 // Some errors expected when defenses activate
  }

  return Math.max(0, Math.min(100, score))
}
