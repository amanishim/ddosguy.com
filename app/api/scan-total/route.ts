import { NextResponse } from "next/server"
import { getTotalCount } from "@/lib/metrics"

export async function GET() {
  try {
    const total = await getTotalCount()
    return NextResponse.json({ total }, { headers: { "cache-control": "no-store" } })
  } catch (e: any) {
    return NextResponse.json({ total: 0 }, { headers: { "cache-control": "no-store" } })
  }
}
