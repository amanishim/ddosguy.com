import { NextResponse } from "next/server"
import { SafeSimulationEngine } from "@/lib/simulation-engine"
import { rateLimit } from "@/lib/scanner-store"
import type { SimulationEnvironment } from "@/lib/simulation-safety"
import { ATTACK_SIMULATIONS } from "@/lib/incident-response"

function normalizeHost(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  try {
    const asUrl = new URL(raw.match(/^https?:\/\//) ? raw : `https://${raw}`)
    const host = asUrl.hostname
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) return null
    return host.toLowerCase()
  } catch {
    if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(raw)) return raw.toLowerCase()
    return null
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { domain: domainParam, simulationType, environment } = body

  if (!domainParam || !simulationType || !environment) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  const domain = normalizeHost(domainParam)
  if (!domain) {
    return NextResponse.json({ error: "Please provide a valid domain like example.com" }, { status: 400 })
  }

  // Rate limit - simulations are resource intensive
  const ip = (request.headers.get("x-forwarded-for") || "local").split(",")[0].trim()
  const rl = await rateLimit(ip, 3, 30 * 60 * 1000) // 3 simulations per 30 minutes
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Simulations are limited to 3 per 30 minutes for safety." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs || 60000) / 1000)) } },
    )
  }

  // Find the simulation
  const simulation = ATTACK_SIMULATIONS.find((s) => s.type === simulationType)
  if (!simulation) {
    return NextResponse.json({ error: "Unknown simulation type" }, { status: 400 })
  }

  // Validate environment
  const simulationEnvironment: SimulationEnvironment = {
    isProduction: Boolean(environment.isProduction),
    hasMonitoring: Boolean(environment.hasMonitoring),
    hasRollbackPlan: Boolean(environment.hasRollbackPlan),
    hasEmergencyContacts: Boolean(environment.hasEmergencyContacts),
    resourceLimits: {
      maxConcurrentConnections: Math.min(
        100,
        Math.max(1, Number.parseInt(environment.resourceLimits?.maxConcurrentConnections) || 50),
      ),
      maxRequestRate: Math.min(100, Math.max(1, Number.parseInt(environment.resourceLimits?.maxRequestRate) || 25)),
      maxDuration: Math.min(600, Math.max(30, Number.parseInt(environment.resourceLimits?.maxDuration) || 300)),
    },
  }

  try {
    const engine = new SafeSimulationEngine(domain, simulationEnvironment)
    const result = await engine.runSimulation(simulation)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Simulation failed:", error)
    return NextResponse.json({ error: error?.message || "Simulation failed" }, { status: 500 })
  }
}
