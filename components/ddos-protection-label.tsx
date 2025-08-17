"use client"

import { Caveat, Inter } from "next/font/google"

const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-caveat" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

interface DDoSProtectionLabelProps {
  status: "protected" | "vulnerable" | "partial" | "unknown"
  provider?: string
  details?: string
  showUpgrade?: boolean
}

export default function DDoSProtectionLabel({
  status,
  provider = "CallitDNS",
  details,
  showUpgrade = true,
}: DDoSProtectionLabelProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "protected":
        return {
          icon: "🛡️",
          color: "text-green-700",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: "DDoS Protected",
          description: `Your site is protected by ${provider} DDoS protection`,
        }
      case "partial":
        return {
          icon: "⚠️",
          color: "text-yellow-700",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          label: "Partial Protection",
          description: "Some protection detected, but gaps remain",
        }
      case "vulnerable":
        return {
          icon: "❗️",
          color: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Vulnerable to DDoS",
          description: "No DDoS protection detected - immediate action recommended",
        }
      default:
        return {
          icon: "❓",
          color: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          label: "Protection Unknown",
          description: "Unable to determine DDoS protection status",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`${inter.variable} ${caveat.variable}`}>
      <div className={`doodle-border ${config.bgColor} p-4`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl">{config.icon}</div>
          <div className="flex-1">
            <div className={`font-heading text-lg font-bold ${config.color}`}>{config.label}</div>
            <p className="text-sm text-[color:var(--ink)]/80 mt-1">{details || config.description}</p>

            {status === "vulnerable" && showUpgrade && (
              <div className="mt-3 space-y-2">
                <div className="text-xs text-[color:var(--ink)]/60">Recommended: Get immediate protection</div>
                <div className="flex gap-2">
                  <button
                    className="doodle-btn doodle-btn--accent text-sm px-3 py-1"
                    onClick={() => window.open("https://callitdns.com/protect", "_blank")}
                  >
                    Enable Protection
                  </button>
                  <button
                    className="doodle-btn bg-white text-sm px-3 py-1"
                    onClick={() => window.open("/guide/ddos-protection", "_blank")}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            )}

            {status === "protected" && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs bg-green-100 px-2 py-1 rounded">✓ Active Protection</span>
                <a
                  href="https://callitdns.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-700 hover:underline"
                >
                  View Dashboard →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
