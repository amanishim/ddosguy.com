import type React from "react"
import type { Metadata } from "next"
import { Kalam } from "next/font/google"
import "./globals.css"

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
})

export const metadata: Metadata = {
  title: "What is DDoS? DDoS Guy - Free DDoS Protection Scanner & Meaning Explained",
  description:
    "Learn what is DDoS, DDoS meaning, and get free DDoS protection scanning. DDoS Guy explains DDoS attacks, provides DDoS protection tools, and helps secure your website from DDoS threats.",
  keywords:
    "what is ddos, ddos meaning, ddos protection, ddos attack, ddos scanner, ddos definition, dos attack, ddos mitigation, website security, cyber security",
  authors: [{ name: "DDoS Guy", url: "https://ddosguy.com" }],
  creator: "CallitDNS",
  publisher: "CallitDNS",
  robots: "index, follow",
  openGraph: {
    title: "What is DDoS? DDoS Guy - Free DDoS Protection Scanner",
    description:
      "Learn what is DDoS, DDoS meaning, and get free DDoS protection scanning. Expert DDoS analysis and protection tools.",
    url: "https://ddosguy.com",
    siteName: "DDoS Guy",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "DDoS Guy - What is DDoS Protection Scanner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What is DDoS? DDoS Guy - Free DDoS Protection Scanner",
    description: "Learn what is DDoS, DDoS meaning, and get free DDoS protection scanning.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "https://ddosguy.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={kalam.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DDoS Guy",
              description: "Learn what is DDoS, DDoS meaning, and get free DDoS protection scanning",
              url: "https://ddosguy.com",
              publisher: {
                "@type": "Organization",
                name: "CallitDNS",
                url: "https://callitdns.com",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://ddosguy.com/scanner?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
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
                  name: "What is DDoS?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "DDoS (Distributed Denial of Service) is a cyber attack where multiple compromised systems flood a target server with traffic, making it unavailable to legitimate users.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What does DDoS mean?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "DDoS means Distributed Denial of Service - a type of cyber attack that uses multiple systems to overwhelm a target with traffic.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does DDoS protection work?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "DDoS protection works by filtering malicious traffic, rate limiting requests, and distributing load across multiple servers to maintain service availability.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-kalam bg-[#fef7ed] text-gray-800 min-h-screen">{children}</body>
    </html>
  )
}
