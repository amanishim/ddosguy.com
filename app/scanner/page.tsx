"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ScanTotalBadge } from "@/components/scan-total-badge"

export default function ScannerPage() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim()) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ host: domain.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Scan failed")
      }

      const data = await response.json()
      router.push(`/scan-results?id=${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fef7ed]">
      {/* Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center transform rotate-3">
              <span className="text-2xl font-bold text-black">🛡️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">DDoS Guy</h1>
              <p className="text-sm text-gray-600">A CallitDNS Company</p>
            </div>
          </Link>
          <ScanTotalBadge />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black mb-6 transform -rotate-1">Free DDoS Protection Scanner 🔍</h1>
          <p className="text-xl text-gray-700 mb-8">
            Check if your website is protected against DDoS attacks. Get instant analysis and expert recommendations!
          </p>
        </div>

        {/* Scanner Form */}
        <div className="bg-white border-4 border-black p-8 transform rotate-1 shadow-[8px_8px_0px_0px_#000] mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="domain" className="block text-xl font-bold text-black mb-3">
                Enter your website domain:
              </label>
              <input
                type="text"
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="w-full px-4 py-3 text-lg border-4 border-black focus:outline-none focus:ring-4 focus:ring-blue-200 font-kalam"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-100 border-4 border-red-500 p-4 transform -rotate-1">
                <p className="text-red-700 font-bold">❌ {error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !domain.trim()}
              className="w-full bg-red-400 hover:bg-red-500 disabled:bg-gray-300 text-black font-bold py-4 px-8 border-4 border-black transform hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_#000] text-xl disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full"></div>
                  <span>Scanning...</span>
                </span>
              ) : (
                "🚀 Start DDoS Protection Scan"
              )}
            </button>
          </form>
        </div>

        {/* What We Check */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-100 border-4 border-black p-6 transform -rotate-1 shadow-[6px_6px_0px_0px_#000]">
            <h3 className="text-2xl font-bold mb-4 text-black">🛡️ DDoS Protection Checks</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Web Application Firewall (WAF) detection</li>
              <li>• CDN and edge protection analysis</li>
              <li>• Origin server IP exposure check</li>
              <li>• Security headers validation</li>
            </ul>
          </div>
          <div className="bg-green-100 border-4 border-black p-6 transform rotate-1 shadow-[6px_6px_0px_0px_#000]">
            <h3 className="text-2xl font-bold mb-4 text-black">🤖 AI-Powered Analysis</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Intelligent threat assessment</li>
              <li>• Personalized security recommendations</li>
              <li>• Risk level evaluation</li>
              <li>• Expert protection advice</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
