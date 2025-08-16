import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "DDoS Guy · Keep Your Site Online",
    template: "%s · DDoS Guy",
  },
  description:
    "Free DDoS protection scanner and honest security advice. Check your website for vulnerabilities and get clear, vendor-neutral recommendations to stay online.",
  keywords: ["DDoS protection", "website security", "DDoS scanner", "WAF", "CDN", "cybersecurity"],
  authors: [{ name: "DDoS Guy" }],
  creator: "DDoS Guy",
  publisher: "DDoS Guy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ddosguy.com",
    siteName: "DDoS Guy",
    title: "DDoS Guy · Keep Your Site Online",
    description:
      "Free DDoS protection scanner and honest security advice. Check your website for vulnerabilities and get clear recommendations.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "DDoS Guy - Keep Your Site Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DDoS Guy · Keep Your Site Online",
    description: "Free DDoS protection scanner and honest security advice.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://ddosguy.com",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
