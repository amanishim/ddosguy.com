import Link from "next/link"
import DoodleTheme from "@/components/doodle-theme"

export const metadata = {
  title: "How to hide your origin IP (step‑by‑step) · DDoS Guy",
  description:
    "Mask your server behind an edge and Secure DNS so attackers can’t hit it directly. A simple step‑by‑step guide.",
  alternates: { canonical: "/learn/hide-origin-ip" },
  openGraph: {
    title: "How to hide your origin IP (step‑by‑step) · DDoS Guy",
    description:
      "Move traffic to an edge, update DNS, restrict origin access, and validate. Practical steps and checks.",
    url: "/learn/hide-origin-ip",
    images: [{ url: "/og.png" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
}

export default function HideOriginIpPage() {
  const steps = [
    {
      name: "Put an edge in front",
      text: "Create a site/app at your edge provider (WAF/CDN). Point it at your origin via hostname, not raw IP, when possible.",
    },
    {
      name: "Move DNS to the edge",
      text: "Update A/AAAA/CNAME to the provider endpoints. Remove public A/AAAA that point directly at your origin hostnames.",
    },
    {
      name: "Restrict direct origin access",
      text: "Allowlist only provider networks (or a VPN) at your host/firewall. Block all public traffic hitting the origin IP.",
    },
    {
      name: "Harden HTTPS",
      text: "Force HTTP→HTTPS redirects and enable HSTS. Prefer HTTP/2/3. Set sane caching for static paths.",
    },
    {
      name: "Validate",
      text: "Use our scanner to confirm your origin IP isn’t visible in public DNS and that edge headers are present.",
    },
  ]

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <DoodleTheme />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/" className="underline">
          {"Home"}
        </Link>
        {" / "}
        <Link href="/learn" className="underline">
          {"Learn"}
        </Link>
        {" / "}
        <span>{"Hide origin IP"}</span>
      </nav>

      <h1 className="font-heading text-5xl mb-4">{"How to hide your origin IP (step‑by‑step)"}</h1>
      <p className="opacity-80 mb-6">
        {"Mask your origin behind a protective edge and Secure DNS. This prevents direct L3/L4 attacks on your server."}
      </p>

      <ol className="list-decimal pl-6 space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="doodle-border bg-white p-4">
            <h2 className="font-heading text-2xl">{s.name}</h2>
            <p className="mt-2 text-[color:var(--ink)]/80">{s.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex gap-3">
        <Link href="/scanner" className="doodle-btn doodle-btn--accent">
          {"Run a free scan"}
        </Link>
        <Link href="/guide/ddos-protection" className="doodle-btn bg-white">
          {"Open DDoS guide"}
        </Link>
      </div>

      {/* HowTo schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to hide your origin IP",
            description: "Mask your server behind an edge and Secure DNS so attackers can’t hit it directly.",
            step: steps.map((s, idx) => ({
              "@type": "HowToStep",
              position: idx + 1,
              name: s.name,
              text: s.text,
            })),
            supply: [{ "@type": "HowToSupply", name: "Edge/WAF provider" }],
            tool: [{ "@type": "HowToTool", name: "DNS manager" }],
          }),
        }}
      />
    </main>
  )
}
