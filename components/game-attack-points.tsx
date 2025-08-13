"use client"

type Endpoint = { target: string; port: number; priority?: number; weight?: number }
type GameCheckMeta = {
  host: string
  service?: string | null
  proto?: "tcp" | "udp"
  ipv6?: boolean
  dnssecValidated?: boolean
  endpoints: Endpoint[]
  ns?: string[]
  edgeProviders?: string[]
}

type GameCheckResult = {
  meta: GameCheckMeta
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

function Badge({ ok }: { ok: boolean }) {
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${ok ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{ok ? "OK" : "Action"}</span>
}

export default function GameAttackPoints({ data }: { data: GameCheckResult }) {
  const m = data.meta
  const p = data.points

  const cards: { title: string; ok: boolean; desc: string }[] = [
    { title: "Edge / Scrubbing", ok: p.edge.ok, desc: p.edge.note },
    { title: "Origin IP Exposure", ok: p.originIp.ok, desc: p.originIp.note },
    { title: "IPv6 Path", ok: p.ipv6.ok, desc: p.ipv6.note },
    { title: "DNSSEC", ok: p.dnssec.ok, desc: p.dnssec.note },
    { title: "Caching Hints", ok: p.caching.ok, desc: p.caching.note },
    { title: "Rate Limiting Signals", ok: p.ratelimit.ok, desc: p.ratelimit.note },
    { title: "HTTP/3 Hints", ok: p.h3.ok, desc: p.h3.note },
  ]

  return (
    <section className="mt-8">
      <h3 className="font-heading text-3xl sm:text-4xl mb-4">{"Game Server Attack Points"}</h3>

      <div className="doodle-border bg-white p-4">
        <div className="text-sm opacity-80">
          <p>
            {"Checked "} <strong>{m.host}</strong>
            {m.service ? <>{" ("}{m.service}{"/"}{m.proto}{")"}</> : null}
            {"."}
          </p>
          {m.endpoints?.length ? (
            <p className="mt-1">
              {"Resolved endpoints: "}
              {m.endpoints.map(e => `${e.target}:${e.port}`).join(", ")}
            </p>
          ) : null}
          {m.edgeProviders?.length ? (
            <p className="mt-1">
              {"Edge signals: "}{m.edgeProviders.join(", ")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mt-4">
        {cards.map((c, i) => (
          <article key={i} className="doodle-border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className={`text-lg font-semibold ${c.ok ? "text-green-700" : "text-amber-700"}`}>{c.title}</div>
              <Badge ok={c.ok} />
            </div>
            <p className="mt-2 text-[color:var(--ink)]/80">{c.desc}</p>
          </article>
        ))}
      </div>

      {data.notes?.length ? (
        <div className="mt-4 doodle-border bg-[#FFFDF7] p-4">
          <ul className="list-disc pl-5 text-sm">
            {data.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 doodle-border bg-[#FFFDF7] p-4">
        <p className="text-sm">
          {"Want to hide your origin quickly? Our Secure DNS partner "}
          <a href="https://callitdns.com" className="underline font-semibold" target="_blank" rel="noopener noreferrer">{"callitdns.com"}</a>
          {" is launching soon. Sign up in the “Use Secure DNS (Coming Soon)” modal to get notified."}
        </p>
      </div>
    </section>
  )
}
