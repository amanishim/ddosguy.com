import { NextResponse } from "next/server"
import { getById } from "@/lib/scanner-store"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const e = await getById(params.id)
  if (!e) return NextResponse.json({ error: "Not found or expired" }, { status: 404 })
  return NextResponse.json({ id: e.id, result: e.result })
}
