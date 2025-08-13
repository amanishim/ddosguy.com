import { NextResponse } from "next/server"
import { insertNotification } from "@/lib/db"

// In-memory fallback for preview
const mem: { email: string; domain: string; createdAt: number }[] = []

export async function POST(req: Request) {
  try {
    const { email, domain } = await req.json()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain || "")) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 })
    }
    mem.push({ email, domain, createdAt: Date.now() })
    insertNotification(email, domain).catch(() => {})
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Bad Request" }, { status: 400 })
  }
}
