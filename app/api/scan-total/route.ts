import { NextResponse } from "next/server"
import { getSecurityMetrics } from "@/lib/metrics"

export async function GET() {
  try {
    const metrics = await getSecurityMetrics()

    return NextResponse.json({
      total: metrics.totalScans,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching scan total:", error)
    return NextResponse.json({ error: "Failed to fetch scan total", success: false }, { status: 500 })
  }
}
