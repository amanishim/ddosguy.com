"use client"

import { useEffect, useState } from "react"
import type { ThreatIntelligence, EarlyWarning } from "@/lib/threat-intelligence"
import { getEarlyWarnings } from "@/lib/threat-intelligence"

interface ThreatIntelligenceProps {
  domain: string
  industry?: string
}

export default function ThreatIntelligenceDisplay({ domain, industry = "general" }: ThreatIntelligenceProps) {
  const [threatData, setThreatData] = useState<ThreatIntelligence | null>(null)
  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarning[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"feeds" | "darkweb" | "industry" | "warnings">("feeds")

  useEffect(() => {
    async function loadThreatData() {
      try {
        const response = await fetch(
          `/api/threat-intelligence?domain=${encodeURIComponent(domain)}&industry=${industry}`,
        )
        const data = await response.json()
        setThreatData(data)
        setEarlyWarnings(getEarlyWarnings(industry))
      } catch (error) {
        console.error("Failed to load threat intelligence:", error)
      } finally {
        setLoading(false)
      }
    }

    loadThreatData()
  }, [domain, industry])

  if (loading) {
    return (
      <div className="doodle-border bg-white p-6 text-center">
        <div className="loader mx-auto mb-4" />
        <p>Loading threat intelligence...</p>
      </div>
    )
  }

  if (!threatData) {
    return (
      <div className="doodle-border bg-white p-6 text-center">
        <p className="text-red-600">Failed to load threat intelligence data</p>
      </div>
    )
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600 bg-red-100"
    if (score >= 40) return "text-yellow-600 bg-yellow-100"
    return "text-green-600 bg-green-100"
  }

  return (
    <div className="space-y-6">
      {/* Risk Score Overview */}
      <div className="doodle-border bg-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading text-2xl">Threat Intelligence</h3>
          <div className={`px-3 py-1 rounded-full font-semibold ${getRiskColor(threatData.riskScore)}`}>
            Risk Score: {threatData.riskScore}/100
          </div>
        </div>

        {threatData.recommendations.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <h4 className="font-semibold text-amber-800 mb-2">⚠️ Recommendations:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              {threatData.recommendations.map((rec, i) => (
                <li key={i}>• {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="doodle-border bg-white p-1 flex">
        {[
          { id: "feeds", label: "🔍 Threat Feeds", count: threatData.threatFeeds.length },
          { id: "darkweb", label: "🕵️ Dark Web", count: threatData.darkWebMentions.length },
          { id: "industry", label: "🏢 Industry Threats", count: threatData.industryThreats.length },
          { id: "warnings", label: "⚠️ Early Warnings", count: earlyWarnings.length },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 p-3 text-center ${
              activeTab === tab.id ? "bg-[color:var(--accent)]" : "bg-transparent hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <div className="font-semibold">{tab.label}</div>
            <div className="text-xs opacity-70">{tab.count} items</div>
          </button>
        ))}
      </div>

      {/* Threat Feeds Tab */}
      {activeTab === "feeds" && (
        <div className="space-y-4">
          <h4 className="font-heading text-xl">Threat Feed Analysis</h4>
          <div className="grid gap-3">
            {threatData.threatFeeds.map((feed, i) => (
              <div key={i} className="doodle-border bg-white p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-semibold">{feed.source}</h5>
                    <div className="text-sm opacity-70">
                      Confidence: {feed.confidence}%{feed.lastSeen && ` • Last seen: ${feed.lastSeen}`}
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      feed.status === "clean"
                        ? "bg-green-100 text-green-700"
                        : feed.status === "suspicious"
                          ? "bg-yellow-100 text-yellow-700"
                          : feed.status === "malicious"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {feed.status.toUpperCase()}
                  </div>
                </div>

                {feed.categories.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm font-semibold">Categories:</div>
                    <div className="flex gap-1 mt-1">
                      {feed.categories.map((cat, j) => (
                        <span key={j} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {feed.details && <div className="mt-2 text-sm opacity-70">{feed.details}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dark Web Tab */}
      {activeTab === "darkweb" && (
        <div className="space-y-4">
          <h4 className="font-heading text-xl">Dark Web Monitoring</h4>

          {threatData.darkWebMentions.length === 0 ? (
            <div className="doodle-border bg-white p-6 text-center">
              <div className="text-4xl mb-2">✅</div>
              <h5 className="font-semibold mb-2">No Dark Web Mentions Found</h5>
              <p className="text-sm opacity-70">
                Your domain hasn't been mentioned in monitored dark web sources recently.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {threatData.darkWebMentions.map((mention) => (
                <div key={mention.id} className="doodle-border bg-white p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold">{mention.source}</h5>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          mention.severity === "high"
                            ? "bg-red-100 text-red-700"
                            : mention.severity === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {mention.severity.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">{mention.type.replace("_", " ")}</span>
                    </div>
                  </div>

                  <p className="text-sm mb-2">{mention.content}</p>

                  <div className="text-xs opacity-70">{new Date(mention.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Industry Threats Tab */}
      {activeTab === "industry" && (
        <div className="space-y-4">
          <h4 className="font-heading text-xl">Industry Threat Patterns</h4>

          <div className="space-y-4">
            {threatData.industryThreats.map((threat) => (
              <div key={threat.id} className="doodle-border bg-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold">{threat.attackType}</h5>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        threat.severity === "high"
                          ? "bg-red-100 text-red-700"
                          : threat.severity === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {threat.severity.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        threat.frequency === "increasing"
                          ? "bg-red-100 text-red-700"
                          : threat.frequency === "stable"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {threat.frequency}
                    </span>
                  </div>
                </div>

                <p className="text-sm opacity-70 mb-3">{threat.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-sm mb-2">Indicators:</h6>
                    <ul className="text-sm space-y-1">
                      {threat.indicators.map((indicator, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h6 className="font-semibold text-sm mb-2">Mitigation:</h6>
                    <ul className="text-sm space-y-1">
                      {threat.mitigation.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-3 text-xs opacity-60">
                  Last updated: {new Date(threat.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Early Warnings Tab */}
      {activeTab === "warnings" && (
        <div className="space-y-4">
          <h4 className="font-heading text-xl">Early Warning System</h4>

          <div className="space-y-4">
            {earlyWarnings.map((warning) => (
              <div key={warning.id} className="doodle-border bg-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold">{warning.title}</h5>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      warning.severity === "critical"
                        ? "bg-red-100 text-red-700"
                        : warning.severity === "warning"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {warning.severity.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm opacity-70 mb-3">{warning.description}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <h6 className="font-semibold text-sm mb-2">Indicators to Watch:</h6>
                    <ul className="text-sm space-y-1">
                      {warning.indicators.map((indicator, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">⚠️</span>
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h6 className="font-semibold text-sm mb-2">Recommended Actions:</h6>
                    <ul className="text-sm space-y-1">
                      {warning.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between text-xs opacity-60">
                  <span>Source: {warning.source}</span>
                  <span>Published: {new Date(warning.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
