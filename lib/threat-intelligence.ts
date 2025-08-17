export interface ThreatFeedResult {
  source: string
  status: "clean" | "suspicious" | "malicious" | "unknown"
  confidence: number
  lastSeen?: string
  categories: string[]
  details?: string
}

export interface DarkWebMention {
  id: string
  source: string
  content: string
  timestamp: string
  severity: "low" | "medium" | "high"
  type: "credential_leak" | "attack_planning" | "data_breach" | "general_mention"
}

export interface AttackPattern {
  id: string
  industry: string
  attackType: string
  frequency: "increasing" | "stable" | "decreasing"
  severity: "low" | "medium" | "high"
  description: string
  indicators: string[]
  mitigation: string[]
  lastUpdated: string
}

export interface ThreatIntelligence {
  domain: string
  ipAddresses: string[]
  threatFeeds: ThreatFeedResult[]
  darkWebMentions: DarkWebMention[]
  industryThreats: AttackPattern[]
  riskScore: number
  recommendations: string[]
}

// Simulated threat feed sources (in production, these would be real APIs)
const THREAT_FEED_SOURCES = [
  "VirusTotal",
  "AbuseIPDB",
  "Spamhaus",
  "Malware Domain List",
  "PhishTank",
  "URLVoid",
  "Cisco Talos",
  "IBM X-Force",
]

async function checkThreatFeeds(domain: string, ips: string[]): Promise<ThreatFeedResult[]> {
  const results: ThreatFeedResult[] = []

  // Simulate threat feed checks
  for (const source of THREAT_FEED_SOURCES) {
    // In production, this would make real API calls to threat intelligence providers
    const isClean = Math.random() > 0.1 // 90% chance of being clean
    const confidence = Math.floor(Math.random() * 40) + 60 // 60-100% confidence

    results.push({
      source,
      status: isClean ? "clean" : Math.random() > 0.5 ? "suspicious" : "malicious",
      confidence,
      categories: isClean ? [] : ["ddos-source", "malware", "phishing"].slice(0, Math.floor(Math.random() * 3) + 1),
      details: isClean ? undefined : "Detected in recent attack campaigns",
    })
  }

  return results
}

async function checkDarkWebMentions(domain: string): Promise<DarkWebMention[]> {
  // Simulate dark web monitoring (in production, this would use services like Recorded Future, Digital Shadows, etc.)
  const mentions: DarkWebMention[] = []

  // Simulate occasional mentions
  if (Math.random() < 0.2) {
    // 20% chance of having mentions
    mentions.push({
      id: `mention-${Date.now()}`,
      source: "Underground Forum",
      content: `Discussion about targeting ${domain} in upcoming campaign`,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      severity: "medium",
      type: "attack_planning",
    })
  }

  if (Math.random() < 0.1) {
    // 10% chance of credential mentions
    mentions.push({
      id: `cred-${Date.now()}`,
      source: "Credential Database",
      content: `Potential credentials for ${domain} found in leaked database`,
      timestamp: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      severity: "high",
      type: "credential_leak",
    })
  }

  return mentions
}

function getIndustryThreats(industry: string): AttackPattern[] {
  const basePatterns: AttackPattern[] = [
    {
      id: "ecommerce-cart-attacks",
      industry: "ecommerce",
      attackType: "Application Layer DDoS",
      frequency: "increasing",
      severity: "high",
      description: "Attackers targeting shopping cart and checkout processes during peak seasons",
      indicators: ["High traffic to /cart endpoints", "Abandoned cart rate spikes", "Payment gateway errors"],
      mitigation: ["Rate limit checkout processes", "Implement queue systems", "Use bot protection"],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "saas-api-floods",
      industry: "saas",
      attackType: "API Flooding",
      frequency: "stable",
      severity: "medium",
      description: "Sustained attacks on API endpoints to exhaust rate limits and resources",
      indicators: ["API rate limit violations", "Authentication endpoint abuse", "Resource exhaustion"],
      mitigation: ["Implement API rate limiting", "Use API gateways", "Monitor API usage patterns"],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "gaming-udp-floods",
      industry: "gaming",
      attackType: "UDP Flood",
      frequency: "increasing",
      severity: "high",
      description: "Large-scale UDP floods targeting game servers during tournaments and events",
      indicators: ["UDP packet floods", "Game server timeouts", "Player connection issues"],
      mitigation: ["Use DDoS protection services", "Implement connection rate limiting", "Deploy anycast networks"],
      lastUpdated: new Date().toISOString(),
    },
  ]

  return basePatterns.filter((pattern) => pattern.industry === industry || pattern.industry === "general")
}

export async function runThreatIntelligenceCheck(domain: string, industry = "general"): Promise<ThreatIntelligence> {
  // Simulate IP resolution
  const ipAddresses = [
    `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  ]

  const [threatFeeds, darkWebMentions] = await Promise.all([
    checkThreatFeeds(domain, ipAddresses),
    checkDarkWebMentions(domain),
  ])

  const industryThreats = getIndustryThreats(industry)

  // Calculate risk score based on findings
  let riskScore = 0

  // Threat feed results
  const maliciousFeeds = threatFeeds.filter((f) => f.status === "malicious").length
  const suspiciousFeeds = threatFeeds.filter((f) => f.status === "suspicious").length
  riskScore += maliciousFeeds * 20 + suspiciousFeeds * 10

  // Dark web mentions
  const highSeverityMentions = darkWebMentions.filter((m) => m.severity === "high").length
  const mediumSeverityMentions = darkWebMentions.filter((m) => m.severity === "medium").length
  riskScore += highSeverityMentions * 30 + mediumSeverityMentions * 15

  // Industry threat level
  const highSeverityIndustryThreats = industryThreats.filter((t) => t.severity === "high").length
  riskScore += highSeverityIndustryThreats * 10

  // Generate recommendations
  const recommendations: string[] = []

  if (maliciousFeeds > 0) {
    recommendations.push("Your domain/IP appears on threat feeds - investigate and clean up any compromised systems")
  }

  if (darkWebMentions.length > 0) {
    recommendations.push("Dark web mentions detected - consider enhanced monitoring and proactive security measures")
  }

  if (industryThreats.some((t) => t.frequency === "increasing")) {
    recommendations.push(`${industry} industry is seeing increased attack activity - review your defenses`)
  }

  return {
    domain,
    ipAddresses,
    threatFeeds,
    darkWebMentions,
    industryThreats,
    riskScore: Math.min(100, riskScore),
    recommendations,
  }
}

export interface EarlyWarning {
  id: string
  title: string
  severity: "info" | "warning" | "critical"
  category: "new_attack_type" | "industry_threat" | "infrastructure_risk" | "geopolitical"
  description: string
  affectedIndustries: string[]
  indicators: string[]
  recommendations: string[]
  publishedAt: string
  source: string
}

export function getEarlyWarnings(industry?: string): EarlyWarning[] {
  // Simulate early warning system (in production, this would aggregate from multiple threat intelligence sources)
  const warnings: EarlyWarning[] = [
    {
      id: "warning-001",
      title: "New HTTP/2 Rapid Reset Attack Vector",
      severity: "critical",
      category: "new_attack_type",
      description: "A new attack method exploiting HTTP/2 rapid reset functionality to overwhelm servers",
      affectedIndustries: ["all"],
      indicators: [
        "Unusual HTTP/2 connection patterns",
        "Rapid stream creation and cancellation",
        "Server resource exhaustion without high bandwidth usage",
      ],
      recommendations: [
        "Update web servers and load balancers to latest versions",
        "Implement HTTP/2 connection limits",
        "Monitor for rapid reset patterns",
        "Consider temporarily disabling HTTP/2 if under attack",
      ],
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      source: "DDoS Guy Threat Intelligence",
    },
    {
      id: "warning-002",
      title: "Increased Gaming Server Attacks During Holiday Season",
      severity: "warning",
      category: "industry_threat",
      description: "Gaming industry seeing 300% increase in DDoS attacks targeting popular game servers",
      affectedIndustries: ["gaming"],
      indicators: [
        "UDP flood attacks on game ports",
        "Connection exhaustion attacks",
        "Attacks timed with major gaming events",
      ],
      recommendations: [
        "Implement connection rate limiting",
        "Use DDoS protection services",
        "Prepare incident response procedures",
        "Consider geographic traffic filtering",
      ],
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Gaming Security Consortium",
    },
  ]

  if (industry) {
    return warnings.filter((w) => w.affectedIndustries.includes(industry) || w.affectedIndustries.includes("all"))
  }

  return warnings
}
