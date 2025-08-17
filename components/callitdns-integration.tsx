"use client"

import { useState } from "react"
import type { EnhancedScanResult } from "@/lib/enhanced-scanner"

interface CallitDNSProps {
  scanResult: EnhancedScanResult
  onSetupComplete?: () => void
}

export default function CallitDNSIntegration({ scanResult, onSetupComplete }: CallitDNSProps) {
  const [step, setStep] = useState<"overview" | "setup" | "configuring" | "complete">("overview")
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | "enterprise">("basic")

  const plans = {
    basic: {
      name: "Basic Protection",
      price: "$9/month",
      features: [
        "Hide origin IP automatically",
        "Basic DDoS protection",
        "Global anycast DNS",
        "SSL certificate management",
      ],
    },
    pro: {
      name: "Pro Security",
      price: "$29/month",
      features: [
        "Everything in Basic",
        "Advanced bot protection",
        "Custom DNS policies",
        "Real-time threat blocking",
        "24/7 monitoring",
      ],
    },
    enterprise: {
      name: "Enterprise Shield",
      price: "Custom pricing",
      features: [
        "Everything in Pro",
        "Dedicated security team",
        "Custom integrations",
        "SLA guarantees",
        "White-glove setup",
      ],
    },
  }

  const getRecommendedPlan = () => {
    if (scanResult.securityScore < 60) return "enterprise"
    if (scanResult.securityScore < 80) return "pro"
    return "basic"
  }

  const handleOneClickSetup = async () => {
    setStep("configuring")

    // Simulate API call to CallitDNS
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setStep("complete")
    onSetupComplete?.()
  }

  if (step === "overview") {
    return (
      <div className="doodle-border bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">🛡️</div>
          <div className="flex-1">
            <h3 className="font-heading text-2xl mb-2">CallitDNS Protection</h3>
            <p className="text-[color:var(--ink)]/80 mb-4">
              Based on your scan results, we recommend upgrading your DNS security. CallitDNS can automatically hide
              your origin IP and add enterprise-grade protection.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-amber-600">⚠️</span>
                <span className="font-semibold text-amber-800">Security Issues Detected:</span>
              </div>
              <ul className="mt-2 text-sm text-amber-700">
                {scanResult.recommendations.slice(0, 3).map((rec, i) => (
                  <li key={i}>• {rec}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button className="doodle-btn doodle-btn--accent" onClick={() => setStep("setup")}>
                Set Up Protection
              </button>
              <a href="https://callitdns.com" target="_blank" rel="noopener noreferrer" className="doodle-btn bg-white">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "setup") {
    const recommended = getRecommendedPlan()

    return (
      <div className="doodle-border bg-white p-6">
        <h3 className="font-heading text-2xl mb-4">Choose Your Protection Level</h3>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPlan === key
                  ? "border-[color:var(--accent)] bg-[#FFF5BF]"
                  : "border-gray-200 hover:border-gray-300"
              } ${recommended === key ? "ring-2 ring-blue-200" : ""}`}
              onClick={() => setSelectedPlan(key as any)}
            >
              {recommended === key && (
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2 inline-block">
                  Recommended for you
                </div>
              )}
              <h4 className="font-heading text-lg font-bold">{plan.name}</h4>
              <div className="text-2xl font-bold text-[color:var(--accent)] mb-3">{plan.price}</div>
              <ul className="text-sm space-y-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">What happens next:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. We'll automatically configure DNS protection for {scanResult.host}</li>
            <li>2. Your origin IP will be hidden behind our anycast network</li>
            <li>3. DDoS protection activates immediately</li>
            <li>4. You'll get a dashboard to monitor threats and performance</li>
          </ol>
        </div>

        <div className="flex gap-3">
          <button className="doodle-btn doodle-btn--accent" onClick={handleOneClickSetup}>
            Set Up {plans[selectedPlan].name}
          </button>
          <button className="doodle-btn bg-white" onClick={() => setStep("overview")}>
            Back
          </button>
        </div>
      </div>
    )
  }

  if (step === "configuring") {
    return (
      <div className="doodle-border bg-white p-6 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="loader border-blue-500" />
        </div>
        <h3 className="font-heading text-2xl mb-2">Setting Up Your Protection</h3>
        <p className="text-[color:var(--ink)]/80 mb-4">We're configuring DNS protection for {scanResult.host}...</p>
        <div className="text-sm text-[color:var(--ink)]/60">
          This usually takes 2-3 minutes. We're updating DNS records and activating protection.
        </div>
      </div>
    )
  }

  if (step === "complete") {
    return (
      <div className="doodle-border bg-white p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="font-heading text-2xl mb-2">Protection Activated!</h3>
        <p className="text-[color:var(--ink)]/80 mb-4">
          {scanResult.host} is now protected by CallitDNS. Your origin IP is hidden and DDoS protection is active.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-green-900 mb-2">What's now protected:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>✓ Origin IP hidden behind anycast network</li>
            <li>✓ DDoS protection active (up to 10Gbps)</li>
            <li>✓ Bot filtering and rate limiting enabled</li>
            <li>✓ SSL certificate automatically managed</li>
          </ul>
        </div>

        <div className="flex gap-3 justify-center">
          <a
            href="https://dashboard.callitdns.com"
            target="_blank"
            rel="noopener noreferrer"
            className="doodle-btn doodle-btn--accent"
          >
            Open Dashboard
          </a>
          <button className="doodle-btn bg-white" onClick={() => window.location.reload()}>
            Run New Scan
          </button>
        </div>
      </div>
    )
  }

  return null
}
