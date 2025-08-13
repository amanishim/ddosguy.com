"use client"

import { useEffect, useState } from "react"

type Day = { date: string; count: number }
type Analytics = { total: number; byDay: Day[] }

export default function WeeklyAnalytics({ className = "" }: { className?: string }) {
  const [data, setData] = useState<Analytics | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch("/api/analytics", { cache: "no-store" })
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || "Failed to load analytics")
        setData(j)
      } catch (e: any) {
        setErr(e?.message || "Analytics unavailable")
      }
    })()
  }, [])

  return (
    <div className={`doodle-border bg-white p-5 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-2xl">{"Scanned this week"}</h3>
          <p className="text-sm opacity-70">{"Last 7 days (quick, anonymous count)"}</p>
        </div>
        <div className="text-right">
          <div className="font-heading text-4xl">{data ? data.total : "—"}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {(data?.byDay || Array.from({ length: 7 })).map((d: any, idx: number) => {
          const count = d ? d.count : 0
          const max = Math.max(...(data?.byDay?.map(x => x.count) || [1]))
          const h = max > 0 ? Math.max(4, Math.round((count / max) * 40)) : 4
          return (
            <div key={d?.date || idx} className="flex flex-col items-center">
              <div
                className="w-6 rounded-sm"
                style={{
                  height: `${h}px`,
                  background: "var(--accent)",
                  border: "2px solid var(--ink)",
                }}
                aria-label={d ? `${d.date}: ${d.count}` : "loading"}
                title={d ? `${d.date}: ${d.count}` : ""}
              />
              <span className="mt-1 text-[10px] opacity-60">{d?.date?.slice(5) || ""}</span>
            </div>
          )
        })}
      </div>
      {err && <p className="mt-3 text-red-600 text-sm">{err}</p>}
    </div>
  )
}
