"use client"

import { useState } from "react"

type Props = {
  open?: boolean
  onClose?: () => void
  defaultDomain?: string
}

export default function ComingSoonModal({ open = false, onClose = () => {}, defaultDomain = "" }: Props) {
  const [email, setEmail] = useState("")
  const [domain, setDomain] = useState(defaultDomain)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null); setMessage(null)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.")
      return
    }
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
      setError("Please enter a valid domain like example.com.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, domain }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Something went wrong")
      setMessage("Got it! We’ll email you when Secure DNS is live.")
      setEmail("")
    } catch (e: any) {
      setError(e?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="doodle-border bg-[color:var(--paper)] max-w-lg w-full p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-3xl">{"Secure DNS — Coming Soon"}</h3>
          <button className="doodle-btn bg-white px-3 py-1 text-sm" onClick={onClose}>{"Close"}</button>
        </div>
        <p className="mt-2 opacity-80">
          {"We’re partnering with "}
          <a
            href="https://callitdns.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            {"callitdns.com"}
          </a>
          {" to make hiding your origin IP simple. Leave your email to get notified at launch."}
        </p>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-1 text-left">
            <label htmlFor="cs-email" className="text-sm font-semibold">{"Email"}</label>
            <input
              id="cs-email"
              className="doodle-input p-3 bg-white"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1 text-left">
            <label htmlFor="cs-domain" className="text-sm font-semibold">{"Your domain"}</label>
            <input
              id="cs-domain"
              className="doodle-input p-3 bg-white"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="doodle-btn doodle-btn--accent px-4 py-2" onClick={submit} disabled={loading}>
              {loading ? "Sending..." : "Notify me"}
            </button>
            <button className="doodle-btn bg-white px-4 py-2" onClick={onClose}>{"Maybe later"}</button>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          {message && <p className="text-green-700">{message}</p>}
          <p className="text-xs opacity-70 mt-2">
            {"We only use your email to let you know when this feature is ready. No spam."}
          </p>
        </div>
      </div>
    </div>
  )
}
