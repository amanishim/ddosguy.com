import type { AttackSimulation } from "./incident-response"
import type { SimulationEnvironment, SimulationResult } from "./simulation-safety"
import { calculateSafetyScore, calculateEffectivenessScore } from "./simulation-safety"

export class SafeSimulationEngine {
  private domain: string
  private environment: SimulationEnvironment
  private aborted = false
  private startTime = 0

  constructor(domain: string, environment: SimulationEnvironment) {
    this.domain = domain
    this.environment = environment
  }

  async runSimulation(simulation: AttackSimulation): Promise<SimulationResult> {
    this.startTime = Date.now()
    this.aborted = false

    const result: SimulationResult = {
      status: "failed",
      safetyScore: 0,
      effectivenessScore: 0,
      riskAssessment: "safe",
      metrics: {
        requestsSent: 0,
        responsesReceived: 0,
        errorRate: 0,
        averageResponseTime: 0,
        defenseActivations: [],
        anomaliesDetected: [],
        resourceUsage: {
          maxCpu: 0,
          maxMemory: 0,
          maxBandwidth: 0,
        },
      },
      findings: [],
      recommendations: [],
      timestamp: this.startTime,
    }

    try {
      // Set up abort timeout
      const maxDuration = this.environment.resourceLimits.maxDuration * 1000
      const abortTimeout = setTimeout(() => {
        this.aborted = true
      }, maxDuration)

      // Run the specific simulation
      switch (simulation.type) {
        case "http-flood":
          await this.runHttpFloodSimulation(result)
          break
        case "syn-flood":
          await this.runSynFloodSimulation(result)
          break
        case "dns-amplification":
          await this.runDnsAmplificationTest(result)
          break
        case "bot-detection":
          await this.runBotDetectionTest(result)
          break
        default:
          throw new Error(`Unknown simulation type: ${simulation.type}`)
      }

      clearTimeout(abortTimeout)

      result.status = this.aborted ? "aborted" : "completed"
      result.metrics.duration = Date.now() - this.startTime

      // Calculate scores
      result.safetyScore = calculateSafetyScore(this.environment, [], result.metrics)
      result.effectivenessScore = calculateEffectivenessScore(result.metrics)

      // Determine risk assessment
      if (result.safetyScore < 60 || result.metrics.anomaliesDetected.length > 3) {
        result.riskAssessment = "dangerous"
      } else if (result.safetyScore < 80 || result.metrics.anomaliesDetected.length > 1) {
        result.riskAssessment = "concerning"
      } else {
        result.riskAssessment = "safe"
      }

      // Generate findings and recommendations
      this.generateFindings(result)
    } catch (error: any) {
      result.status = "failed"
      result.findings.push(`Simulation failed: ${error.message}`)
    }

    return result
  }

  private async runHttpFloodSimulation(result: SimulationResult): Promise<void> {
    const maxRequests = Math.min(this.environment.resourceLimits.maxRequestRate * 10, 500)
    const requestInterval = Math.max(1000 / this.environment.resourceLimits.maxRequestRate, 20)

    const responseTimes: number[] = []
    let errorCount = 0

    for (let i = 0; i < maxRequests && !this.aborted; i++) {
      const startTime = Date.now()

      try {
        const response = await fetch(`https://${this.domain}`, {
          method: "GET",
          headers: {
            "User-Agent": `DDoSGuy-Simulator-${i}`,
            "X-Forwarded-For": `192.168.1.${(i % 254) + 1}`,
          },
          signal: AbortSignal.timeout(5000),
        })

        const responseTime = Date.now() - startTime
        responseTimes.push(responseTime)
        result.metrics.responsesReceived++

        // Check for defense activations
        if (response.status === 429) {
          result.metrics.defenseActivations.push("Rate limiting detected")
        }
        if (response.status === 403) {
          result.metrics.defenseActivations.push("WAF blocking detected")
        }
        if (response.headers.get("cf-ray")) {
          result.metrics.defenseActivations.push("Cloudflare protection active")
        }
        if (response.headers.get("x-ratelimit-limit")) {
          result.metrics.defenseActivations.push("API rate limiting detected")
        }

        // Check for anomalies
        if (responseTime > 10000) {
          result.metrics.anomaliesDetected.push(`Very slow response: ${responseTime}ms`)
        }
        if (response.status >= 500) {
          result.metrics.anomaliesDetected.push(`Server error: ${response.status}`)
          errorCount++
        }
      } catch (error: any) {
        errorCount++
        if (error.name === "TimeoutError") {
          result.metrics.anomaliesDetected.push("Request timeout")
        }
      }

      result.metrics.requestsSent++

      // Safety check - abort if error rate too high
      if (result.metrics.requestsSent > 10 && errorCount / result.metrics.requestsSent > 0.5) {
        result.metrics.anomaliesDetected.push("High error rate detected - aborting for safety")
        this.aborted = true
        break
      }

      // Wait before next request
      await new Promise((resolve) => setTimeout(resolve, requestInterval))
    }

    // Calculate metrics
    result.metrics.errorRate = result.metrics.requestsSent > 0 ? errorCount / result.metrics.requestsSent : 0
    result.metrics.averageResponseTime =
      responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0
  }

  private async runSynFloodSimulation(result: SimulationResult): Promise<void> {
    // Simulate SYN flood by attempting many concurrent connections
    const maxConnections = Math.min(this.environment.resourceLimits.maxConcurrentConnections, 50)
    const connectionPromises: Promise<void>[] = []

    for (let i = 0; i < maxConnections && !this.aborted; i++) {
      const connectionPromise = this.attemptConnection(i)
      connectionPromises.push(connectionPromise)

      result.metrics.requestsSent++

      // Small delay between connection attempts
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    // Wait for all connections to complete or timeout
    const results = await Promise.allSettled(connectionPromises)

    let successCount = 0
    let errorCount = 0

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        successCount++
      } else {
        errorCount++
        if (result.reason?.message?.includes("timeout")) {
          this.addDefenseActivation("Connection timeout protection")
        }
      }
    })

    result.metrics.responsesReceived = successCount
    result.metrics.errorRate = result.metrics.requestsSent > 0 ? errorCount / result.metrics.requestsSent : 0

    if (errorCount > successCount) {
      result.metrics.defenseActivations.push("Connection limiting detected")
    }
  }

  private async attemptConnection(index: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()

      fetch(`https://${this.domain}`, {
        method: "HEAD",
        signal: AbortSignal.timeout(3000),
      })
        .then((response) => {
          const responseTime = Date.now() - startTime
          if (responseTime > 5000) {
            throw new Error("Connection too slow")
          }
          resolve()
        })
        .catch(reject)
    })
  }

  private async runDnsAmplificationTest(result: SimulationResult): Promise<void> {
    // Test DNS amplification vulnerability by checking DNS response sizes
    const dnsQueries = [
      { name: this.domain, type: "A" },
      { name: this.domain, type: "AAAA" },
      { name: this.domain, type: "MX" },
      { name: this.domain, type: "TXT" },
      { name: this.domain, type: "NS" },
    ]

    for (const query of dnsQueries) {
      if (this.aborted) break

      try {
        const response = await fetch(
          `https://dns.google/resolve?name=${encodeURIComponent(query.name)}&type=${query.type}`,
          { signal: AbortSignal.timeout(3000) },
        )

        if (response.ok) {
          const data = await response.json()
          result.metrics.responsesReceived++

          // Check for large responses that could be used for amplification
          const responseSize = JSON.stringify(data).length
          if (responseSize > 1000) {
            result.metrics.anomaliesDetected.push(`Large DNS response for ${query.type}: ${responseSize} bytes`)
          }
        }

        result.metrics.requestsSent++
        await new Promise((resolve) => setTimeout(resolve, 200))
      } catch (error: any) {
        result.metrics.anomaliesDetected.push(`DNS query failed: ${error.message}`)
      }
    }

    result.metrics.errorRate =
      result.metrics.requestsSent > 0
        ? (result.metrics.requestsSent - result.metrics.responsesReceived) / result.metrics.requestsSent
        : 0
  }

  private async runBotDetectionTest(result: SimulationResult): Promise<void> {
    const userAgents = [
      "curl/7.68.0",
      "wget/1.20.3",
      "python-requests/2.25.1",
      "Go-http-client/1.1",
      "Mozilla/5.0 (compatible; DDoSGuy/1.0)",
    ]

    for (let i = 0; i < userAgents.length && !this.aborted; i++) {
      const userAgent = userAgents[i]

      try {
        const response = await fetch(`https://${this.domain}`, {
          method: "GET",
          headers: {
            "User-Agent": userAgent,
          },
          signal: AbortSignal.timeout(5000),
        })

        result.metrics.requestsSent++

        if (response.ok) {
          result.metrics.responsesReceived++
        } else if (response.status === 403) {
          result.metrics.defenseActivations.push(`Bot blocking for: ${userAgent}`)
        } else if (response.status === 429) {
          result.metrics.defenseActivations.push(`Rate limiting for: ${userAgent}`)
        }

        // Check for challenge pages
        const contentType = response.headers.get("content-type") || ""
        if (contentType.includes("text/html")) {
          const text = await response.text()
          if (text.includes("challenge") || text.includes("captcha") || text.includes("verify")) {
            result.metrics.defenseActivations.push(`Challenge page detected for: ${userAgent}`)
          }
        }
      } catch (error: any) {
        result.metrics.anomaliesDetected.push(`Bot test failed for ${userAgent}: ${error.message}`)
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    result.metrics.errorRate =
      result.metrics.requestsSent > 0
        ? (result.metrics.requestsSent - result.metrics.responsesReceived) / result.metrics.requestsSent
        : 0
  }

  private addDefenseActivation(defense: string): void {
    if (!this.aborted) {
      // Avoid duplicates
      if (!this.aborted) {
        // This method would be called from various simulation methods
        // Implementation depends on the current result context
      }
    }
  }

  private generateFindings(result: SimulationResult): void {
    // Generate findings based on results
    if (result.metrics.defenseActivations.length === 0) {
      result.findings.push("No defensive responses detected - system may be vulnerable")
      result.recommendations.push("Consider implementing rate limiting and bot protection")
    } else {
      result.findings.push(`${result.metrics.defenseActivations.length} defensive systems activated`)
    }

    if (result.metrics.errorRate > 0.3) {
      result.findings.push("High error rate indicates strong defensive measures")
      result.recommendations.push("Monitor error rates to ensure legitimate traffic isn't blocked")
    }

    if (result.metrics.averageResponseTime > 5000) {
      result.findings.push("Slow response times may indicate rate limiting or overload protection")
    }

    if (result.metrics.anomaliesDetected.length > 0) {
      result.findings.push(`${result.metrics.anomaliesDetected.length} anomalies detected during testing`)
      result.recommendations.push("Review anomalies to identify potential issues")
    }

    // Add general recommendations
    if (result.effectivenessScore < 70) {
      result.recommendations.push("Consider implementing additional DDoS protection measures")
    }

    if (result.safetyScore < 80) {
      result.recommendations.push("Improve monitoring and safety measures before running production tests")
    }
  }
}
