"use client"

import { Caveat, Inter } from "next/font/google"

const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-caveat" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

interface CallitDNSBrandingProps {
  variant?: "header" | "footer" | "inline" | "badge"
  showLogo?: boolean
  showTagline?: boolean
}

export default function CallitDNSBranding({
  variant = "inline",
  showLogo = true,
  showTagline = true,
}: CallitDNSBrandingProps) {
  const baseClasses = `${inter.variable} ${caveat.variable}`

  if (variant === "header") {
    return (
      <div className={baseClasses}>
        <div className="flex items-center gap-3">
          {showLogo && (
            <div className="w-10 h-10 bg-[color:var(--accent)] rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-[color:var(--ink)]">C</span>
            </div>
          )}
          <div>
            <a
              href="https://callitdns.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-2xl font-bold text-[color:var(--ink)] hover:text-[color:var(--accent)] transition-colors"
            >
              CallitDNS
            </a>
            {showTagline && <div className="text-sm text-[color:var(--ink)]/70">AI-Powered DNS with Dotty</div>}
          </div>
        </div>
      </div>
    )
  }

  if (variant === "footer") {
    return (
      <div className={baseClasses}>
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🤖</span>
            <a
              href="https://callitdns.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-xl font-bold text-[color:var(--ink)] hover:text-[color:var(--accent)] transition-colors"
            >
              CallitDNS
            </a>
          </div>
          {showTagline && (
            <p className="text-sm text-[color:var(--ink)]/70">AI-powered DNS service with Dotty assistant</p>
          )}
          <div className="text-xs text-[color:var(--ink)]/50">Sister product from the DDoS Guy team</div>
        </div>
      </div>
    )
  }

  if (variant === "badge") {
    return (
      <div className={baseClasses}>
        <div className="inline-flex items-center gap-2 bg-[color:var(--accent)] px-3 py-1 rounded-full">
          <span className="text-sm">🤖</span>
          <span className="text-sm font-semibold text-[color:var(--ink)]">Sister Product: CallitDNS</span>
        </div>
      </div>
    )
  }

  // Default inline variant
  return (
    <div className={baseClasses}>
      <div className="flex items-center gap-2">
        {showLogo && <span className="text-lg">🤖</span>}
        <span className="text-sm text-[color:var(--ink)]/70">
          Sister product:{" "}
          <a
            href="https://callitdns.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[color:var(--ink)] hover:text-[color:var(--accent)] underline transition-colors"
          >
            CallitDNS
          </a>
        </span>
        {showTagline && <span className="text-xs text-[color:var(--ink)]/50">- AI DNS with Dotty</span>}
      </div>
    </div>
  )
}
