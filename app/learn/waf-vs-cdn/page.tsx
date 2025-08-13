import Link from "next/link"
import DoodleTheme from "@/components/doodle-theme"

export const metadata = {
  title: "WAF vs CDN: what’s the difference? · DDoS Guy",
  description: "Understand how a CDN accelerates delivery and how a WAF filters attacks. Learn when you need both.",
  alternates: { canonical: "/learn/waf-vs-cdn" },
  openGraph: {
    title: "WAF vs CDN: what’s the difference? · DDoS Guy",
    description: "Compare roles, pros/cons, and how WAF and CDN work together to keep your site online.",
    url: "/learn/waf-vs-cdn",
    images: [{ url: "/og.png" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
}

export default function WafVsCdnPage() {
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
        <span>{"WAF vs CDN"}</span>
      </nav>

      <h1 className="font-heading text-5xl mb-4">{"WAF vs CDN: what’s the difference?"}</h1>
      <p className="opacity-80 mb-6">
        {"Both are edge technologies, but they solve different problems—and together they’re strongest."}
      </p>

      <div className="doodle-border bg-white p-6 space-y-4">
        <section>
          <h2 className="font-heading text-3xl mb-2">{"CDN (Content Delivery Network)"}</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>{"Caches and serves static assets close to users; improves speed and resilience."}</li>
            <li>{"Reduces load on origin, smoothing traffic spikes."}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-3xl mb-2">{"WAF (Web Application Firewall)"}</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>{"Inspects requests to block abusive or malicious patterns at L7."}</li>
            <li>{"Adds rules, challenges, bot management, and rate limits."}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-3xl mb-2">{"When do you need both?"}</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>{"Sites with dynamic pages/APIs benefit from WAF filtering and CDN caching for static bits."}</li>
            <li>{"WAF blocks bad requests; CDN reduces origin work—together they keep you online under stress."}</li>
          </ul>
          <div className="mt-3 flex gap-3">
            <Link href="/scanner" className="doodle-btn doodle-btn--accent">
              {"Run a free scan"}
            </Link>
            <Link href="/guide/ddos-protection" className="doodle-btn bg-white">
              {"Open DDoS guide"}
            </Link>
          </div>
        </section>
      </div>

      {/* Article + small FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WAF vs CDN: what’s the difference?",
            description: "How a CDN boosts performance and a WAF filters attacks, and why both matter under load.",
            mainEntityOfPage: "/learn/waf-vs-cdn",
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
                name: "Does a CDN replace a WAF?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. A CDN accelerates and caches; a WAF filters attacks. They complement each other.",
                },
              },
              {
                "@type": "Question",
                name: "Will a WAF slow my site?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A well‑tuned WAF at the edge has minimal impact and may improve reliability under spikes.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  )
}
