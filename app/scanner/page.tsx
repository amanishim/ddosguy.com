"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Caveat, Inter } from 'next/font/google'
import DoodleTheme from "@/components/doodle-theme"
import { ProgressSteps } from "@/components/progress-steps"
import ComingSoonModal from "@/components/coming-soon-modal"
import ScanTotalBadge from "@/components/scan-total-badge"
import AttackPoints from "@/components/attack-points"
import GameAttackPoints from "@/components/game-attack-points"

const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-caveat" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

type CheckResult = { vulnerable: boolean; details: string }
type ScanResponse = {
  id: string
  result: {
    waf: CheckResult
    ip_exposed: CheckResult
    server_header: CheckResult
    meta?: {
      host: string
      ipv6?: boolean
      edgeProviders?: string[]
      dnssecValidated?: boolean
      headers?: Record<string, string>
      subdomains?: string[]
      asnHints?: string[]
      httpsRedirect?: boolean
      hsts?: string
    }
  }
}

type GameCheckResult = {
  id: string
  result: {
    meta: {
      host: string
      service?: string | null
      proto?: "tcp" | "udp"
      ipv6?: boolean
      dnssecValidated?: boolean
      endpoints: { target: string; port: number; priority?: number; weight?: number }[]
      ns?: string[]
      edgeProviders?: string[]
    }
    points: {
      edge: { ok: boolean; note: string }
      originIp: { ok: boolean; note: string }
      ipv6: { ok: boolean; note: string }
      dnssec: { ok: boolean; note: string }
      caching: { ok: boolean; note: string }
      ratelimit: { ok: boolean; note: string }
      h3: { ok: boolean; note: string }
    }
    notes?: string[]
  }
}

function validateAndNormalizeInput(input: string): string | null {
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

export default function ScannerPage() {
  const search = useSearchParams()
  const [mode, setMode] = useState<"web" | "game">("web")

  // initialize mode from query param
  useEffect(() => {
    const m = (search.get("mode") || "").toLowerCase()
    if (m === "game") setMode("game")
    else if (m === "web") setMode("web")
  }, [search])

  // Shared UI
  const [modalOpen, setModalOpen] = useState(false)

  // Web scan state
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ScanResponse | null>(null)

  // Game check state
  const [gHost, setGHost] = useState("")
  const [gService, setGService] = useState<string>("minecraft")
  const [gProto, setGProto] = useState<"tcp" | "udp">("tcp")
  const [gPort, setGPort] = useState<string>("")
  const [gLoading, setGLoading] = useState(false)
  const [gError, setGError] = useState<string | null>(null)
  const [gData, setGData] = useState<GameCheckResult | null>(null)

  // Steps animation (web)
  const [steps, setSteps] = useState([
    { label: "DNS", status: "idle" as const },
    { label: "HTTP headers", status: "idle" as const },
    { label: "Advice", status: "idle" as const },
  ])
  useEffect(() => {
    if (!loading) return
    setSteps([{ label: "DNS", status: "active" }, { label: "HTTP headers", status: "idle" }, { label: "Advice", status: "idle" }])
    const t1 = setTimeout(() => setSteps([{ label: "DNS", status: "done" }, { label: "HTTP headers", status: "active" }, { label: "Advice", status: "idle" }]), 700)
    const t2 = setTimeout(() => setSteps([{ label: "DNS", status: "done" }, { label: "HTTP headers", status: "done" }, { label: "Advice", status: "active" }]), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [loading])

  const vulnerabilities = useMemo(() => {
    if (!data) return []
    const r = data.result
    const list: { name: string; type: "ddos" | "dns" }[] = []
    if (r.waf.vulnerable) list.push({ name: "Firewall / WAF", type: "ddos" })
    if (r.ip_exposed.vulnerable) list.push({ name: "Direct IP Exposed", type: "dns" })
    if (r.server_header.vulnerable) list.push({ name: "Exposed Server Version", type: "ddos" })
    return list
  }, [data])

  const aiSummaryFallback = useMemo(() => {
    if (!data) return ""
    const names = vulnerabilities.map((v) => v.name)
    return names.length === 0
      ? "From what we can see publicly, your setup looks solid. We didn’t spot obvious red flags. Keep HTTPS and security headers in place, and review DNS periodically."
      : "We noticed a couple of items that may increase exposure (for example, a visible origin IP or server version details). Consider placing a protective edge in front of your origin and tightening HTTP security headers. These are straightforward changes and don’t require app code changes."
  }, [data, vulnerabilities])

  const [aiText, setAiText] = useState<string | null>(null)
  useEffect(() => {
    async function runAI() {
      if (mode !== "web" || !data) return
      setAiText(null)
      try {
        const names = vulnerabilities.map((v) => v.name)
        const res = await fetch("/api/ai-summary", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ vulnerabilities: names }),
        })
        const j = await res.json()
        if (res.ok && j.text) setAiText(j.text)
        else setAiText(aiSummaryFallback)
      } catch {
        setAiText(aiSummaryFallback)
      } finally {
        setSteps((s) => s.map((it) => ({ ...it, status: "done" as const })))
      }
    }
    runAI()
  }, [mode, data, vulnerabilities, aiSummaryFallback])

  // Actions
  const onSubmitWeb = useCallback(async () => {
    setError(null)
    setData(null)
    const host = validateAndNormalizeInput(input)
    if (!host) {
      setError("Please enter a valid domain like example.com")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/scan?url=${encodeURIComponent(host)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Something went wrong")
      setData(json as ScanResponse)
    } catch (e: any) {
      setError(e?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [input])

  const onSubmitGame = useCallback(async () => {
    setGError(null)
    setGData(null)
    const host = validateAndNormalizeInput(gHost)
    if (!host) {
      setGError("Please enter a valid domain like example.com")
      return
    }
    const qs = new URLSearchParams({
      host,
      service: gService || "",
      proto: gProto,
    })
    if (gPort.trim()) qs.set("port", gPort.trim())
    setGLoading(true)
    try {
      const res = await fetch(`/api/game-check?${qs.toString()}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Something went wrong")
      setGData(json as GameCheckResult)
    } catch (e: any) {
      setGError(e?.message || "Something went wrong")
    } finally {
      setGLoading(false)
    }
  }, [gHost, gService, gProto, gPort])

  const copyWebLink = async () => {
    if (!data) return
    const url = `${location.origin}/scan/${data.id}`
    await navigator.clipboard.writeText(url)
    alert("Link copied!")
  }
  const copyGameLink = async () => {
    if (!gData) return
    const url = `${location.origin}/game/${gData.id}`
    await navigator.clipboard.writeText(url)
    alert("Link copied!")
  }

  return (
    <div className={`${inter.variable} ${caveat.variable} min-h-dvh text-[color:var(--ink)]`}>
      <DoodleTheme />
      <ComingSoonModal open={modalOpen} onClose={() => setModalOpen(false)} defaultDomain={mode === "web" ? (data?.result.meta?.host || "") : (gHost || "")} />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="relative text-center mb-10">
          <div className="absolute right-0 top-0 hidden sm:block">
            <ScanTotalBadge size="sm" />
          </div>
          <Link href="/" className="font-heading text-4xl text-[color:var(--ink)]">{"DDoS Guy"}</Link>
          <h1 className="font-heading text-5xl md:text-7xl mt-4 leading-tight">{"Website & Game Server Scanner"}</h1>
          <p className="text-lg opacity-80 mt-2">
            {"Safe, public-signal checks to spot weak points and plan DDoS protection."}
          </p>
          <div className="mt-4 max-w-2xl mx-auto doodle-border bg-[#FFFDF7] p-3">
            <p className="text-sm">
              {"We only read public info (DNS + response headers). No logins, no attacks, nothing invasive."}
            </p>
          </div>
        </header>

        {/* Mode toggle */}
        <div className="mx-auto max-w-2xl mb-6">
          <div className="doodle-border bg-white p-1 flex">
            <button
              className={`flex-1 py-2 font-semibold ${mode === "web" ? "bg-[color:var(--accent)]" : "bg-transparent"}`}
              onClick={() => setMode("web")}
            >
              {"Website"}
            </button>
            <button
              className={`flex-1 py-2 font-semibold ${mode === "game" ? "bg-[color:var(--accent)]" : "bg-transparent"}`}
              onClick={() => setMode("game")}
            >
              {"Game Server"}
            </button>
          </div>
        </div>

        {/* Website mode */}
        {mode === "web" && (
          <>
            <section id="scan-section" className="max-w-2xl mx-auto text-center">
              <div className="flex flex-col sm:flex-row gap-4">
                <label htmlFor="url-input" className="sr-only">{"Website domain"}</label>
                <input
                  id="url-input"
                  type="text"
                  inputMode="url"
                  placeholder="Enter your website URL (e.g., mysite.com)"
                  className="doodle-input flex-grow p-4 text-lg bg-white"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") onSubmitWeb() }}
                  aria-invalid={!!error}
                />
                <button
                  id="scan-button"
                  className="doodle-btn doodle-btn--accent font-bold py-4 px-8 text-xl"
                  onClick={onSubmitWeb}
                  disabled={loading}
                >
                  {loading ? "Scanning..." : "Scan Now"}
                </button>
              </div>
              {error && <p role="alert" className="mt-3 text-red-600 font-medium">{error}</p>}
            </section>

            <section aria-live="polite" id="results-section" className="max-w-4xl mx-auto mt-12">
              {loading && (
                <div id="loader" className="text-center p-8">
                  <ProgressSteps steps={steps} />
                  <div className="loader mx-auto" aria-hidden="true" />
                  <p className="font-heading text-4xl mt-4">{"Scanning..."}</p>
                </div>
              )}

              {data && (
                <div id="report">
                  <div className="no-print flex flex-wrap items-center justify-center gap-3 mb-4">
                    <Link href={`/scan/${data.id}`} className="doodle-btn bg-white">{"View shareable report"}</Link>
                    <button onClick={copyWebLink} className="doodle-btn bg-white">{"Copy link"}</button>
                    <button onClick={() => window.print()} className="doodle-btn bg-white">{"Export PDF"}</button>
                  </div>

                  <h2 className="font-heading text-4xl sm:text-5xl text-center mb-8">
                    {"Scan Results for "}
                    <span id="scanned-url" className="underline">{data.result.meta?.host}</span>
                  </h2>

                  <ProgressSteps steps={[
                    { label: "DNS", status: "done" },
                    { label: "HTTP headers", status: "done" },
                    { label: "Advice", status: "done" },
                  ]} />

                  <div className="space-y-6" id="scan-results-container">
                    <ResultCard name="Firewall / WAF" result={data.result.waf} />
                    <ResultCard name="Direct IP Exposed" result={data.result.ip_exposed} />
                    <ResultCard name="Exposed Server Version" result={data.result.server_header} />
                  </div>

                  <div className="doodle-border bg-white p-8 mt-10">
                    <h3 className="font-heading text-3xl sm:text-4xl mb-4">{"🤖 AI-Powered Summary"}</h3>
                    <div id="ai-summary" className="text-[color:var(--ink)]/80 text-lg leading-relaxed bg-[#FFF5BF] p-4 rounded-lg">
                      {aiText ?? aiSummaryFallback}
                    </div>

                    <AttackPoints result={data.result} />

                    <div className="mt-5 rounded-md border-2 border-[color:var(--ink)]/20 bg-[#FFFDF7] p-4">
                      <p className="text-sm">
                        {"Partner: "}
                        <a href="https://callitdns.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">{"callitdns.com"}</a>
                        {" — Secure DNS made simple (launching soon)."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* Game mode */}
        {mode === "game" && (
          <>
            <section id="game-section" className="max-w-3xl mx-auto">
              <div className="doodle-border bg-white p-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <label htmlFor="g-host" className="text-sm font-semibold">{"Domain or hostname"}</label>
                    <input
                      id="g-host"
                      className="doodle-input p-3 bg-white"
                      placeholder="play.example.com"
                      value={gHost}
                      onChange={(e) => setGHost(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") onSubmitGame() }}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="g-service" className="text-sm font-semibold">{"Service (optional)"}</label>
                    <select id="g-service" className="doodle-input p-3 bg-white"
                      value={gService} onChange={(e) => setGService(e.target.value)}>
                      <option value="">{"None / custom SRV not used"}</option>
                      <option value="minecraft">{"Minecraft (_minecraft)"}</option>
                      <option value="cs2">{"CS/CS2 (_cs / 27015)"}</option>
                      <option value="rust">{"Rust (28015)"}</option>
                      <option value="valheim">{"Valheim (2456)"}</option>
                    </select>
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="g-proto" className="text-sm font-semibold">{"Protocol"}</label>
                    <select id="g-proto" className="doodle-input p-3 bg-white"
                      value={gProto} onChange={(e) => setGProto(e.target.value as any)}>
                      <option value="tcp">{"TCP"}</option>
                      <option value="udp">{"UDP"}</option>
                    </select>
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="g-port" className="text-sm font-semibold">{"Port (optional)"}</label>
                    <input id="g-port" className="doodle-input p-3 bg-white" placeholder="e.g., 25565"
                      value={gPort} onChange={(e) => setGPort(e.target.value)} />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button className="doodle-btn doodle-btn--accent text-lg px-6 py-3" onClick={onSubmitGame} disabled={gLoading}>
                    {gLoading ? "Checking..." : "Check Game Server"}
                  </button>
                </div>
                {gError && <p role="alert" className="mt-3 text-red-600 font-medium text-center">{gError}</p>}
              </div>
            </section>

            <section className="max-w-4xl mx-auto mt-10">
              {gData && (
                <div className="doodle-border bg-white p-6">
                  <div className="no-print flex flex-wrap items-center justify-center gap-3 mb-4">
                    <Link href={`/game/${gData.id}`} className="doodle-btn bg-white">{"View shareable report"}</Link>
                    <button onClick={copyGameLink} className="doodle-btn bg-white">{"Copy link"}</button>
                    <button onClick={() => window.print()} className="doodle-btn bg-white">{"Export PDF"}</button>
                  </div>

                  <h2 className="font-heading text-4xl text-center mb-6">{"Game Server Results"}</h2>
                  <GameAttackPoints data={gData.result} />
                  <div className="mt-6 text-center">
                    <button className="doodle-btn bg-white" onClick={() => setModalOpen(true)}>
                      {"Use Secure DNS (Coming Soon)"}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

function ResultCard({ name, result }: { name: string; result: CheckResult }) {
  const isVuln = result.vulnerable
  const statusIcon = isVuln ? "❗️" : "✅"
  const statusText = isVuln ? "Vulnerable" : "Secure"
  const statusColor = isVuln ? "text-red-600" : "text-green-600"
  return (
    <article className="doodle-border bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-2xl sm:text-3xl">{name}</h3>
          <p className="mt-2 opacity-80 leading-relaxed">{result.details}</p>
        </div>
        <div className="text-right ml-4 shrink-0">
          <p className={`text-2xl font-bold ${statusColor}`}>{statusIcon}</p>
          <p className={`font-semibold ${statusColor}`}>{statusText}</p>
        </div>
      </div>
    </article>
  )
}
