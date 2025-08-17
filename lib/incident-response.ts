export interface IncidentPlaybook {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  estimatedTime: string
  steps: Array<{
    id: string
    title: string
    description: string
    action: string
    timeEstimate: string
    priority: "immediate" | "urgent" | "normal"
  }>
}

export interface EmergencyContact {
  id: string
  name: string
  type: "hosting" | "security" | "dns" | "support" | "internal"
  phone: string
  email: string
  website?: string
  notes?: string
  available24x7: boolean
}

export interface AttackSimulation {
  id: string
  name: string
  type: "l3_flood" | "l4_syn" | "l7_http" | "dns_amplification" | "bot_attack"
  description: string
  safetyLevel: "safe" | "moderate" | "advanced"
  estimatedDuration: string
  requirements: string[]
}

// Predefined incident playbooks
export const INCIDENT_PLAYBOOKS: IncidentPlaybook[] = [
  {
    id: "ddos-l3-l4",
    title: "Network Layer DDoS (L3/L4)",
    severity: "high",
    estimatedTime: "15-30 minutes",
    steps: [
      {
        id: "assess",
        title: "Assess the Attack",
        description: "Determine attack type and scale",
        action: "Check server metrics, bandwidth usage, and connection counts",
        timeEstimate: "2-3 minutes",
        priority: "immediate",
      },
      {
        id: "enable-protection",
        title: "Enable DDoS Protection",
        description: "Activate your edge protection if not already enabled",
        action: "Log into your WAF/CDN provider and enable 'Under Attack' mode",
        timeEstimate: "1-2 minutes",
        priority: "immediate",
      },
      {
        id: "contact-provider",
        title: "Contact Your Provider",
        description: "Alert your hosting provider about the attack",
        action: "Call your hosting provider's emergency line with attack details",
        timeEstimate: "5-10 minutes",
        priority: "urgent",
      },
      {
        id: "monitor",
        title: "Monitor and Document",
        description: "Track attack progress and document for analysis",
        action: "Monitor traffic patterns, take screenshots, log timeline",
        timeEstimate: "Ongoing",
        priority: "normal",
      },
    ],
  },
  {
    id: "ddos-l7",
    title: "Application Layer DDoS (L7)",
    severity: "high",
    estimatedTime: "20-45 minutes",
    steps: [
      {
        id: "identify-pattern",
        title: "Identify Attack Pattern",
        description: "Analyze request patterns and target endpoints",
        action: "Check access logs for unusual patterns, high-frequency requests",
        timeEstimate: "3-5 minutes",
        priority: "immediate",
      },
      {
        id: "enable-rate-limiting",
        title: "Enable Rate Limiting",
        description: "Implement aggressive rate limiting",
        action: "Set rate limits to 10 requests/minute per IP for affected endpoints",
        timeEstimate: "2-3 minutes",
        priority: "immediate",
      },
      {
        id: "block-sources",
        title: "Block Attack Sources",
        description: "Block malicious IP ranges and user agents",
        action: "Add IP blocks and user-agent filters to your WAF",
        timeEstimate: "5-10 minutes",
        priority: "urgent",
      },
      {
        id: "scale-resources",
        title: "Scale Resources",
        description: "Increase server capacity if possible",
        action: "Enable auto-scaling or manually add server instances",
        timeEstimate: "10-15 minutes",
        priority: "normal",
      },
    ],
  },
  {
    id: "dns-attack",
    title: "DNS-based Attack",
    severity: "critical",
    estimatedTime: "10-20 minutes",
    steps: [
      {
        id: "verify-dns",
        title: "Verify DNS Resolution",
        description: "Check if DNS is resolving correctly",
        action: "Use multiple DNS checkers to verify resolution from different locations",
        timeEstimate: "1-2 minutes",
        priority: "immediate",
      },
      {
        id: "contact-dns-provider",
        title: "Contact DNS Provider",
        description: "Alert your DNS provider immediately",
        action: "Call DNS provider emergency line, report potential DNS attack",
        timeEstimate: "2-5 minutes",
        priority: "immediate",
      },
      {
        id: "backup-dns",
        title: "Activate Backup DNS",
        description: "Switch to backup DNS if available",
        action: "Update registrar to point to backup DNS servers",
        timeEstimate: "5-10 minutes",
        priority: "urgent",
      },
    ],
  },
]

// Default emergency contacts (user can customize)
export const DEFAULT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "cloudflare",
    name: "Cloudflare Support",
    type: "security",
    phone: "+1-888-993-5273",
    email: "support@cloudflare.com",
    website: "https://support.cloudflare.com",
    available24x7: true,
    notes: "Enterprise customers have priority support",
  },
  {
    id: "aws",
    name: "AWS Support",
    type: "hosting",
    phone: "+1-206-266-4064",
    email: "aws-support@amazon.com",
    website: "https://console.aws.amazon.com/support",
    available24x7: true,
    notes: "Support level depends on your plan",
  },
  {
    id: "callitdns",
    name: "CallitDNS Emergency",
    type: "dns",
    phone: "+1-555-CALLIT-DNS",
    email: "emergency@callitdns.com",
    website: "https://callitdns.com/emergency",
    available24x7: true,
    notes: "Our partner for DNS security",
  },
]

// Attack simulation definitions
export const ATTACK_SIMULATIONS: AttackSimulation[] = [
  {
    id: "http-flood-test",
    name: "HTTP Flood Test",
    type: "l7_http",
    description: "Simulate a moderate HTTP flood to test your WAF and rate limiting",
    safetyLevel: "safe",
    estimatedDuration: "5-10 minutes",
    requirements: ["WAF enabled", "Rate limiting configured", "Monitoring in place"],
  },
  {
    id: "syn-flood-test",
    name: "SYN Flood Test",
    type: "l4_syn",
    description: "Test your network's ability to handle SYN flood attacks",
    safetyLevel: "moderate",
    estimatedDuration: "3-5 minutes",
    requirements: ["DDoS protection enabled", "Network monitoring", "Coordination with hosting provider"],
  },
  {
    id: "dns-amplification-test",
    name: "DNS Amplification Test",
    type: "dns_amplification",
    description: "Verify DNS protection against amplification attacks",
    safetyLevel: "safe",
    estimatedDuration: "2-3 minutes",
    requirements: ["DNS protection enabled", "Monitoring tools"],
  },
  {
    id: "bot-attack-test",
    name: "Bot Attack Simulation",
    type: "bot_attack",
    description: "Test bot detection and mitigation capabilities",
    safetyLevel: "safe",
    estimatedDuration: "10-15 minutes",
    requirements: ["Bot protection enabled", "Challenge system configured"],
  },
]

export interface MitigationSuggestion {
  id: string
  title: string
  urgency: "immediate" | "urgent" | "normal"
  category: "network" | "application" | "dns" | "general"
  description: string
  steps: string[]
  estimatedTime: string
  effectiveness: "high" | "medium" | "low"
}

export function generateMitigationSuggestions(
  attackType: string,
  severity: string,
  currentProtections: string[],
): MitigationSuggestion[] {
  const suggestions: MitigationSuggestion[] = []

  if (attackType.includes("l7") || attackType.includes("http")) {
    if (!currentProtections.includes("waf")) {
      suggestions.push({
        id: "enable-waf",
        title: "Enable Web Application Firewall",
        urgency: "immediate",
        category: "application",
        description: "Deploy a WAF to filter malicious HTTP requests",
        steps: [
          "Sign up for Cloudflare, Sucuri, or similar WAF service",
          "Update DNS to point through the WAF",
          "Configure basic security rules",
          "Enable 'Under Attack' mode if available",
        ],
        estimatedTime: "10-15 minutes",
        effectiveness: "high",
      })
    }

    suggestions.push({
      id: "rate-limiting",
      title: "Implement Aggressive Rate Limiting",
      urgency: "immediate",
      category: "application",
      description: "Limit requests per IP to reduce attack impact",
      steps: [
        "Set rate limit to 10 requests/minute per IP",
        "Apply stricter limits to login/API endpoints",
        "Whitelist known good IPs if needed",
        "Monitor for false positives",
      ],
      estimatedTime: "5 minutes",
      effectiveness: "high",
    })
  }

  if (attackType.includes("l3") || attackType.includes("l4")) {
    suggestions.push({
      id: "upstream-filtering",
      title: "Request Upstream Filtering",
      urgency: "urgent",
      category: "network",
      description: "Contact your ISP/hosting provider for network-level filtering",
      steps: [
        "Call your hosting provider's emergency line",
        "Provide attack details (source IPs, traffic volume)",
        "Request null routing of attack traffic",
        "Ask for temporary bandwidth increase if needed",
      ],
      estimatedTime: "10-20 minutes",
      effectiveness: "high",
    })
  }

  if (attackType.includes("dns")) {
    suggestions.push({
      id: "dns-protection",
      title: "Activate DNS Protection",
      urgency: "immediate",
      category: "dns",
      description: "Enable DNS-level DDoS protection",
      steps: [
        "Switch to a protected DNS service (Cloudflare, Route53)",
        "Enable DNS query rate limiting",
        "Configure DNS response rate limiting",
        "Set up DNS monitoring and alerts",
      ],
      estimatedTime: "15-30 minutes",
      effectiveness: "high",
    })
  }

  return suggestions
}
