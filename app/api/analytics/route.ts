import { NextResponse } from "next/server"
import { getWeeklyBreakdown } from "@/lib/metrics"

export async function GET() {
  try {
    const data = await getWeeklyBreakdown()
    return NextResponse.json(data, { headers: { "cache-control": "no-store" } })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to load analytics" }, { status: 500 })
  }
}
