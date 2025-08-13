import Link from "next/link"
import DoodleTheme from "@/components/doodle-theme"

export const metadata = {
  title: "DDoS Protection Guide · Keep Your Site Online",
  description:
    "A practical, vendor‑neutral checklist to harden your site against floods and abusive traffic: edge/WAF, Secure DNS, HTTPS, rate limits, caching, and monitoring.",
  alternates: { canonical: "/guide/ddos-protection" },
  openGraph: {
    title: "DDoS Protection Guide · Keep Your Site Online",
    description:
      "Step‑by‑step actions to resist L3/L4/L7 floods: add an edge/WAF, hide origin IP, enforce HTTPS, rate limit, cache, protect admin, and monitor.",
    url: "/guide/ddos-protection",
  },
  twitter: { card: "summary_large_image" },
}

const steps = [
  {
    id: "edge",
    title: "Put an edge in front of your origin (WAF/CDN).",
    body: "This soaks up L3/L4/L7 traffic and hides your server. Enable caching for static assets to reduce origin work.",
  },
  {
    id: "secure-dns",
    title: "Hide your origin IP with Secure DNS.",
    body: "Keep DNS pointing to your edge, not your server. If you need custom DNS to mask origin, check our partner callitdns.com (launching soon).",
  },
  {
    id: "https",
    title: "Lock in HTTPS.",
    body: "Force HTTP→HTTPS redirects, add HSTS, and prefer HTTP/2/3 for resilience under load.",
  },
  {
    id: "rate",
    title: "Add basic rate limiting.",
    body: "Throttle high‑cost endpoints (auth, search, forms, APIs). Consider IP + token buckets and circuit breakers.",
  },
  {
    id: "reduce",
    title: "Reduce dynamic work.",
    body: "Cache pages where safe, precompute results, and move heavy tasks to queues/background jobs.",
  },
  {
    id: "protect-admin",
    title: "Protect admin/origin endpoints.",
    body: "Restrict by IP or auth, avoid exposing origin hostnames publicly, and block direct hits at the provider firewall.",
  },
  {
    id: "monitor",
    title: "Monitor and alert.",
    body: "Track request rates, error spikes, and cache hit ratio. Alert on anomalies and auto‑scale where possible.",
  },
]

export default function DdosProtectionGuide() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <DoodleTheme />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/" className="underline">
          {"Home"}
        </Link>
        {" / "}
        <span className="opacity-70">{"DDoS Protection Guide"}</span>
      </nav>

      {/* Hero */}
      <header className="text-left">
        <h1 className="font-heading text-5xl sm:text-6xl mb-3">{"DDoS Protection Guide"}</h1>
        <p className="opacity-80 max-w-2xl">
          {"A quick, practical checklist to harden your site against floods and abusive traffic."}
        </p>
        <div className="mt-3 text-xs opacity-70">
          {"Updated "} {new Date().toLocaleDateString()}
        </div>
      </header>

      {/* TOC */}
      <aside className="mt-6 doodle-border bg-white p-4">
        <h2 className="font-heading text-2xl mb-2">{"What you'll do"}</h2>
        <ol className="list-decimal pl-5 grid gap-1">
          {steps.map((s) => (
            <li key={s.id}>
              <a className="underline" href={`#${s.id}`}>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </aside>

      {/* Steps */}
      <section className="mt-6 grid gap-4">
        {steps.map((s, i) => (
          <article id={s.id} key={s.id} className="doodle-border bg-white p-5 scroll-mt-24">
            <div className="flex items-start gap-3">
              <div className="font-heading text-3xl shrink-0">{i + 1}.</div>
              <div>
                <h3 className="font-heading text-2xl">{s.title}</h3>
                <p className="mt-2 text-[color:var(--ink)]/80">{s.body}</p>
                {s.id === "secure-dns" && (
                  <p className="mt-2 text-sm">
                    {"Partner: "}
                    <a
                      href="https://callitdns.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold"
                    >
                      {"callitdns.com"}
                    </a>
                    {" — Secure DNS made simple (launching soon)."}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* CTAs */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link href="/scanner" className="doodle-btn doodle-btn--accent">
          {"Run a free scan"}
        </Link>
        <Link href="/learn/hide-origin-ip" className="doodle-btn bg-white">
          {"How to hide your origin IP"}
        </Link>
        <Link href="/learn/waf-vs-cdn" className="doodle-btn bg-white">
          {"WAF vs CDN"}
        </Link>
      </div>

      {/* Footnote */}
      <p className="text-sm opacity-70 mt-6">
        {
          "This guide is vendor‑neutral; use any reputable edge/WAF. We’ll publish a Secure DNS setup flow at launch with callitdns.com."
        }
      </p>

      {/* Schema: Breadcrumb + HowTo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "DDoS Protection Guide", item: "/guide/ddos-protection" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "DDoS Protection Guide",
            description:
              "A practical, vendor‑neutral checklist to harden your site against floods and abusive traffic.",
            step: steps.map((s, idx) => ({
              "@type": "HowToStep",
              position: idx + 1,
              name: s.title.replace(/\.$/, ""),
              text: s.body,
              url: `/guide/ddos-protection#${s.id}`,
            })),
            tool: [
              { "@type": "HowToTool", name: "WAF/CDN (edge)" },
              { "@type": "HowToTool", name: "DNS manager" },
            ],
          }),
        }}
      />
    </main>
  )
}
