"use client"

import { useEffect, useState } from "react"

type Props = {
  className?: string
  size?: "sm" | "md"
}

export default function ScanTotalBadge({ className = "", size = "md" }: Props) {
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const r = await fetch("/api/scan-total", { cache: "no-store" })
        const j = await r.json()
        if (active) setTotal(typeof j.total === "number" ? j.total : 0)
      } catch {
        if (active) setTotal(0)
      }
    }
    load()
    const id = setInterval(load, 20000) // refresh every 20s
    return () => { active = false; clearInterval(id) }
  }, [])

  const pad = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
  return (
    <div
      className={`doodle-border bg-white inline-flex items-center ${pad} font-semibold ${className}`}
      title="Total scans run"
      aria-label={`Total scans run: ${total ?? "loading"}`}
    >
      <span className="opacity-70 mr-2">Scans</span>
      <span className="font-heading text-lg leading-none">{total ?? "—"}</span>
    </div>
  )
}
