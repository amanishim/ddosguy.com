"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import DoodleTheme from "@/components/doodle-theme"

type CheckResult = { vulnerable: boolean; details: string }
type ScanResult = {
  waf: CheckResult
  ip_exposed: CheckResult
  server_header: CheckResult
  meta?: { host: string }
}
export default function ReportPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch(`/api/scan/${params.id}`)
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || "Not found")
        setData(j.result)
      } catch (e: any) {
        setError(e?.message || "Could not load report")
      }
    })()
  }, [params.id])

  const copy = async () => {
    await navigator.clipboard.writeText(location.href)
    alert("Link copied!")
  }

  return (
    <div className="min-h-dvh">
      <DoodleTheme />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="no-print flex items-center justify-between mb-6">
          <Link href="/" className="font-heading text-3xl">{"DDoS Guy"}</Link>
          <div className="flex gap-2">
            <button className="doodle-btn bg-white" onClick={copy}>{"Copy link"}</button>
            <button className="doodle-btn bg-white" onClick={() => window.print()}>{"Export PDF"}</button>
          </div>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        {data && (
          <>
            <h1 className="font-heading text-4xl sm:text-5xl text-center mb-8">
              {"Scan Results for "}
              <span className="underline">{data.meta?.host}</span>
            </h1>

            <div className="space-y-6">
              <Result title="Firewall / WAF" r={data.waf} />
              <Result title="Direct IP Exposed" r={data.ip_exposed} />
              <Result title="Exposed Server Version" r={data.server_header} />
            </div>

            <div className="text-center mt-10">
              <Link href="/scanner" className="doodle-btn doodle-btn--accent">{"Run another scan"}</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Result({ title, r }: { title: string; r: CheckResult }) {
  const isV = r.vulnerable
  return (
    <article className="doodle-border bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-2xl sm:text-3xl">{title}</h3>
          <p className="mt-2 opacity-80 leading-relaxed">{r.details}</p>
        </div>
        <div className="text-right ml-4 shrink-0">
          <p className={`text-2xl font-bold ${isV ? "text-red-600" : "text-green-600"}`}>{isV ? "❗️" : "✅"}</p>
          <p className={`font-semibold ${isV ? "text-red-600" : "text-green-600"}`}>{isV ? "Vulnerable" : "Secure"}</p>
        </div>
      </div>
    </article>
  )
}
