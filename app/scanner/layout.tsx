import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free DDoS Website Scanner · DDoS Guy",
  description:
    "Run a safe, public-signal scan of your website. We check DNS and HTTP headers to spot DDoS weak points and give clear, vendor‑neutral advice.",
  alternates: { canonical: "/scanner" },
  openGraph: {
    title: "Free DDoS Website Scanner · DDoS Guy",
    description:
      "Check DNS and headers to surface DDoS risks like exposed origin IPs, missing WAF/CDN, and weak HTTPS posture.",
    url: "/scanner",
    images: [{ url: "/og.png" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
}

export default function ScannerLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement
}
