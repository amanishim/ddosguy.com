"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Share2, Copy, Download, Bot, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface ScanResult {
  id: string
  domain: string
  timestamp: string
  overallScore: number
  checks: {
    waf: { status: "pass" | "fail" | "warning"; message: string }
    originIP: { status: "pass" | "fail" | "warning"; message: string }
    ipv6: { status: "pass" | "fail" | "warning"; message: string }
    dnssec: { status: "pass" | "fail" | "warning"; message: string }
    httpsRedirect: { status: "pass" | "fail" | "warning"; message: string }
    cacheHeaders: { status: "pass" | "fail" | "warning"; message: string }
  }
  aiSummary: string
}

export default function ScanResultsPage() {
  const searchParams = useSearchParams()
  const scanId = searchParams.get("id")
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (scanId) {
      // Simulate API call
      setTimeout(() => {
        setResult({
          id: scanId,
          domain: "example.com",
          timestamp: new Date().toISOString(),
          overallScore: 65,
          checks: {
            waf: {
              status: "fail",
              message:
                "No protective edge found in DNS/headers. Put a WAF/CDN in front of your origin to absorb floods.",
            },
            originIP: { status: "pass", message: "We didn't see a direct origin IP in public DNS." },
            ipv6: { status: "pass", message: "No IPv6 records detected." },
            dnssec: {
              status: "warning",
              message: "We didn't see a DNSSEC validation flag. Consider enabling DNSSEC for integrity.",
            },
            httpsRedirect: {
              status: "fail",
              message: "HTTP didn't redirect to HTTPS. Enforce HTTPS and redirect all HTTP traffic.",
            },
            cacheHeaders: {
              status: "warning",
              message: "We didn't see cache headers. Enable caching for better performance and DDoS resilience.",
            },
          },
          aiSummary:
            "A recent scan of your website revealed potential vulnerabilities in the firewall or web application firewall setup, which could leave your site exposed to unauthorized access or attacks. Public signals suggest that certain security rules or configurations might not be fully protecting against common threats like malicious traffic or exploits. While no specific breach is confirmed, these gaps may increase the risk of data theft or service disruption if not addressed. **Next steps:** - Review your firewall settings to ensure they block suspicious traffic and enforce strict access rules. - Test your web application protections by simulating common attack patterns to identify weaknesses. - Consult...",
        })
        setLoading(false)
      }, 1000)
    }
  }, [scanId])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const exportPDF = () => {
    // Simulate PDF export
    const link = document.createElement("a")
    link.href = "#"
    link.download = `ddos-scan-${result?.domain}-${Date.now()}.pdf`
    link.click()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "fail":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "border-green-500 bg-green-50"
      case "fail":
        return "border-red-500 bg-red-50"
      case "warning":
        return "border-yellow-500 bg-yellow-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  if (loading) {
    return (
      <>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
          
          * {
            font-family: 'Kalam', cursive !important;
          }
          
          body {
            background: #FEFCF3;
          }
          
          .loader {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#FEFCF3" }}>
          <div className="text-center">
            <div className="loader mx-auto mb-4"></div>
            <p className="text-gray-600">Loading scan results...</p>
          </div>
        </div>
      </>
    )
  }

  if (!result) {
    return (
      <>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
          
          * {
            font-family: 'Kalam', cursive !important;
          }
          
          body {
            background: #FEFCF3;
          }
          
          .doodle-btn {
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 12px 24px;
            font-weight: bold;
            text-decoration: none;
            color: #333;
            display: inline-flex;
            align-items: center;
            transition: all 0.2s ease;
            box-shadow: 3px 3px 0px #333;
          }
          
          .doodle-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 5px 5px 0px #333;
          }
        `}</style>
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#FEFCF3" }}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Scan not found</h1>
            <Link href="/" className="doodle-btn">
              Go Home
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
        
        * {
          font-family: 'Kalam', cursive !important;
        }
        
        body {
          background: #FEFCF3;
        }
        
        .doodle-btn {
          background: white;
          border: 2px solid #333;
          border-radius: 8px;
          padding: 12px 24px;
          font-weight: bold;
          text-decoration: none;
          color: #333;
          display: inline-flex;
          align-items: center;
          transition: all 0.2s ease;
          box-shadow: 3px 3px 0px #333;
          cursor: pointer;
        }
        
        .doodle-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0px #333;
        }
        
        .doodle-btn--accent {
          background: #FFE066;
          border-color: #333;
        }
        
        .doodle-border {
          border: 2px solid #333;
          border-radius: 8px;
          box-shadow: 3px 3px 0px #333;
        }
        
        .footer-link {
          color: #333;
          text-decoration: underline;
          text-decoration-style: wavy;
        }
        
        .footer-link:hover {
          color: #666;
        }
      `}</style>
      <div className="min-h-screen" style={{ background: "#FEFCF3" }}>
        {/* Header */}
        <header className="border-b-2 border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                DDoS Guy
              </Link>
              <Link href="/" className="doodle-btn">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Scan Results for {result.domain}</h1>
            <p className="text-gray-600">Scanned on {new Date(result.timestamp).toLocaleDateString()}</p>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="doodle-btn">
              <Share2 className="w-4 h-4 mr-2" />
              View shareable report
            </button>
            <button onClick={copyLink} className="doodle-btn">
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy link"}
            </button>
            <button onClick={exportPDF} className="doodle-btn">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>

          {/* AI-Powered Summary - MOVED TO TOP */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">🤖 AI-Powered Security Analysis</h2>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-8 shadow-lg">
              <div className="bg-white/70 rounded-lg p-6 backdrop-blur-sm">
                <p className="text-gray-800 leading-relaxed text-lg">{result.aiSummary}</p>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Bot className="w-4 h-4" />
                    <span>Analysis powered by advanced AI • Generated in real-time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Score Overview */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100 border-4 border-yellow-400 text-3xl font-bold text-yellow-800 shadow-lg">
                {result.overallScore}
              </div>
              <div className="mt-3 text-xl font-semibold text-gray-900">Security Score</div>
              <div className="text-gray-600">Out of 100 points</div>
            </div>
          </div>

          {/* Attack Points */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Attack Points Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`doodle-border p-6 ${getStatusColor(result.checks.waf.status)}`}>
                <div className="flex items-start gap-4">
                  {getStatusIcon(result.checks.waf.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                      {result.checks.waf.status === "fail"
                        ? "❌ Edge/WAF missing"
                        : result.checks.waf.status === "pass"
                          ? "✅ Edge/WAF detected"
                          : "⚠️ Edge/WAF unclear"}
                    </h3>
                    <p className="text-gray-700">{result.checks.waf.message}</p>
                  </div>
                </div>
              </div>

              <div className={`doodle-border p-6 ${getStatusColor(result.checks.originIP.status)}`}>
                <div className="flex items-start gap-4">
                  {getStatusIcon(result.checks.originIP.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">✅ Origin IP hidden</h3>
                    <p className="text-gray-700">{result.checks.originIP.message}</p>
                  </div>
                </div>
              </div>

              <div className={`doodle-border p-6 ${getStatusColor(result.checks.ipv6.status)}`}>
                <div className="flex items-start gap-4">
                  {getStatusIcon(result.checks.ipv6.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">✅ IPv6 posture</h3>
                    <p className="text-gray-700">{result.checks.ipv6.message}</p>
                  </div>
                </div>
              </div>

              <div className={`doodle-border p-6 ${getStatusColor(result.checks.dnssec.status)}`}>
                <div className="flex items-start gap-4">
                  {getStatusIcon(result.checks.dnssec.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">⚠️ DNSSEC not validated</h3>
                    <p className="text-gray-700">{result.checks.dnssec.message}</p>
                  </div>
                </div>
              </div>

              <div className={`doodle-border p-6 ${getStatusColor(result.checks.httpsRedirect.status)}`}>
                <div className="flex items-start gap-4">
                  {getStatusIcon(result.checks.httpsRedirect.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">❌ No HTTPS redirect</h3>
                    <p className="text-gray-700">{result.checks.httpsRedirect.message}</p>
                  </div>
                </div>
              </div>

              <div className={`doodle-border p-6 ${getStatusColor(result.checks.cacheHeaders.status)}`}>
                <div className="flex items-start gap-4">
                  {getStatusIcon(result.checks.cacheHeaders.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">⚠️ Missing cache hints</h3>
                    <p className="text-gray-700">{result.checks.cacheHeaders.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 text-center">
            <div className="bg-white doodle-border p-8 inline-block">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Want to scan another site?</h3>
              <Link href="/scanner" className="doodle-btn doodle-btn--accent text-lg px-8 py-4">
                🔍 Start New Scan
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-gray-200 bg-white/50 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600">
                © {new Date().getFullYear()} DDoS Guy. Made with ☕ by{" "}
                <a href="https://callitdns.com" className="footer-link font-semibold">
                  CallitDNS
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
