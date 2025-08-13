import Link from "next/link"
import DoodleTheme from "@/components/doodle-theme"

export const metadata = {
  title: "What is a DDoS attack? · DDoS Guy",
  description:
    "Understand DDoS in simple terms: network floods (L3/L4), application floods (L7), and how protection works.",
  alternates: { canonical: "/learn/what-is-a-ddos-attack" },
  openGraph: {
    title: "What is a DDoS attack? · DDoS Guy",
    description: "A plain‑English overview of L3/L4/L7 attacks, symptoms, and first steps to defend your site.",
    url: "/learn/what-is-a-ddos-attack",
    images: [{ url: "/og.png" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
}

export default function WhatIsDdosPage() {
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
        <span>{"What is a DDoS attack?"}</span>
      </nav>

      <h1 className="font-heading text-5xl mb-4">{"What is a DDoS attack?"}</h1>
      <p className="opacity-80 mb-6">
        {
          "A DDoS (Distributed Denial of Service) attack overwhelms your network or app with traffic to make it slow or unreachable."
        }
      </p>

      <div className="doodle-border bg-white p-6 space-y-4">
        <section>
          <h2 className="font-heading text-3xl mb-2">{"Layers of attack"}</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>{"L3/L4 (network/transport):"}</strong>
              {" High‑volume floods (UDP, TCP SYN) to saturate pipes or overwhelm firewalls."}
            </li>
            <li>
              <strong>{"L7 (application):"}</strong>
              {" Looks like real users (HTTP/HTTPS), but targets expensive endpoints (search, login, APIs)."}{" "}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-3xl mb-2">{"Common symptoms"}</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>{"Site/API slow or unreachable; error spikes (503/504); connection timeouts."}</li>
            <li>{"Sudden traffic bursts from many networks/regions; low cache hit ratio."}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-3xl mb-2">{"First steps to defend"}</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>{"Put a protective edge (WAF/CDN) in front of origin to absorb floods and hide your IP."}</li>
            <li>{"Enforce HTTPS + HSTS; cache static assets; rate‑limit dynamic endpoints."}</li>
            <li>{"Monitor request rates and errors; prepare an incident checklist."}</li>
          </ul>
          <div className="mt-3">
            <Link href="/guide/ddos-protection" className="doodle-btn bg-white">
              {"Read the protection guide"}
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-6">
        <Link href="/scanner" className="doodle-btn doodle-btn--accent">
          {"Scan your site"}
        </Link>
      </div>

      {/* Article + FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "What is a DDoS attack?",
            description:
              "DDoS explained: network floods (L3/L4), application floods (L7), symptoms, and first defensive steps.",
            mainEntityOfPage: "/learn/what-is-a-ddos-attack",
            author: { "@type": "Person", name: "DDoS Guy" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is a DDoS the same as hacking?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. A DDoS overwhelms capacity with traffic; it doesn’t require breaking into your systems.",
                },
              },
              {
                "@type": "Question",
                name: "Can HTTPS stop DDoS?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "HTTPS is essential, but you also need an edge/WAF to absorb floods and block abusive patterns.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  )
}
