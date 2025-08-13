import Link from "next/link"
import DoodleTheme from "@/components/doodle-theme"

export const metadata = {
  title: "Learn about DDoS · Guides and Tutorials",
  description:
    "Understand DDoS basics, compare WAF vs CDN, and learn how to hide your origin IP. Clear, vendor‑neutral guides from DDoS Guy.",
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "Learn about DDoS · Guides and Tutorials",
    description: "DDoS fundamentals, WAF vs CDN differences, and step‑by‑step to hide your origin IP.",
    url: "/learn",
    images: [{ url: "/og.png" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
}

export default function LearnIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <DoodleTheme />
      <h1 className="font-heading text-5xl mb-4">{"Learn about DDoS"}</h1>
      <p className="mb-6 opacity-80">
        {"A quick collection of guides to help you understand attacks and protect your site."}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="doodle-border bg-white p-5">
          <h2 className="font-heading text-2xl">
            <Link href="/learn/what-is-a-ddos-attack" className="underline">
              {"What is a DDoS attack?"}
            </Link>
          </h2>
          <p className="mt-2 text-[color:var(--ink)]/80">
            {"A plain‑English overview of how DDoS works (L3/L4/L7) and what attackers try to do."}
          </p>
        </article>

        <article className="doodle-border bg-white p-5">
          <h2 className="font-heading text-2xl">
            <Link href="/learn/waf-vs-cdn" className="underline">
              {"WAF vs CDN: what's the difference?"}
            </Link>
          </h2>
          <p className="mt-2 text-[color:var(--ink)]/80">
            {"How they help, where each fits, and when you need both to stay online."}
          </p>
        </article>

        <article className="doodle-border bg-white p-5 sm:col-span-2">
          <h2 className="font-heading text-2xl">
            <Link href="/learn/hide-origin-ip" className="underline">
              {"How to hide your origin IP (step‑by‑step)"}
            </Link>
          </h2>
          <p className="mt-2 text-[color:var(--ink)]/80">
            {"A simple How‑To to mask your server with an edge and Secure DNS so attackers can’t hit it directly."}
          </p>
        </article>
      </div>

      <div className="mt-8">
        <Link href="/scanner" className="doodle-btn doodle-btn--accent">
          {"Run a free scan"}
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Learn", item: "/learn" },
            ],
          }),
        }}
      />
    </main>
  )
}
