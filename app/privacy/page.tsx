"use client"

import Link from "next/link"
import { Menu, X, ArrowLeft, Shield, Eye, Lock } from 'lucide-react'
import { useState } from "react"
import DoodleTheme from "@/components/doodle-theme"
import { ScanTotalBadge } from "@/components/scan-total-badge"

export default function PrivacyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh" style={{ background: "#FEFCF3" }}>
      <DoodleTheme />

      {/* Header */}
      <header className="border-b-2 border-dashed border-[color:var(--ink)] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-[color:var(--ink)]">
              DDoS Guy
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/#how-it-works" className="nav-link">
                How it Works
              </Link>
              <Link href="/scanner" className="nav-link">
                Free Scanner
              </Link>
              <Link href="/learn" className="nav-link">
                Learn
              </Link>
              <Link href="/scanner" className="doodle-btn doodle-btn--accent">
                Scan Your Site
              </Link>
              <ScanTotalBadge />
            </nav>

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden mobile-menu-btn">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t-2 border-dashed border-[color:var(--ink)] bg-white">
              <div className="px-4 py-2 space-y-1">
                <Link href="/#how-it-works" className="mobile-link">
                  How it Works
                </Link>
                <Link href="/scanner" className="mobile-link">
                  Free Scanner
                </Link>
                <Link href="/learn" className="mobile-link">
                  Learn
                </Link>
                <Link href="/scanner" className="mobile-link">
                  Scan Your Site
                </Link>
                <div className="py-2">
                  <ScanTotalBadge />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="doodle-btn inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </nav>

        {/* Page Header */}
        <header className="mb-12">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">Legal</span>
              <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-[color:var(--ink)] mb-6">
            Privacy & <span className="doodle-underline">Methodology</span>
          </h1>
          
          <p className="text-xl text-[color:var(--ink)]/80 leading-relaxed">
            We believe in transparency. Here's exactly how our scanner works, what data we collect, 
            and how we protect your privacy while keeping your website secure.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8">
          {/* Our Scanning Methodology */}
          <section className="doodle-border p-8">
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-[color:var(--ink)]">Our Scanning Methodology</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[color:var(--ink)] mb-3">What We Check</h3>
                <ul className="text-[color:var(--ink)]/80 space-y-2">
                  <li>• <strong>DNS Records:</strong> We query public DNS servers for your domain's configuration</li>
                  <li>• <strong>HTTP Headers:</strong> We analyze response headers from your web server</li>
                  <li>• <strong>SSL/TLS Configuration:</strong> We check your certificate and encryption settings</li>
                  <li>• <strong>CDN Detection:</strong> We identify if you're using content delivery networks</li>
                  <li>• <strong>WAF Detection:</strong> We look for signs of web application firewalls</li>
                </ul>
              </div>

              <div className="bg-green-50 border-2 border-dashed border-green-300 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">Safe & Non-Invasive</h4>
                <p className="text-green-700 text-sm">
                  We only read publicly available information. We never attempt to exploit vulnerabilities, 
                  send malicious traffic, or perform any actions that could harm your website.
                </p>
              </div>
            </div>
          </section>

          {/* Data Collection */}
          <section className="doodle-border p-8">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-[color:var(--ink)]">Data Collection & Privacy</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[color:var(--ink)] mb-3">What We Collect</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-[color:var(--ink)] mb-2">Scan Data</h4>
                    <ul className="text-[color:var(--ink)]/80 text-sm space-y-1">
                      <li>• Domain name you submit</li>
                      <li>• Scan timestamp</li>
                      <li>• Public DNS records</li>
                      <li>• HTTP response headers</li>
                      <li>• SSL certificate information</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-[color:var(--ink)] mb-2">Analytics Data</h4>
                    <ul className="text-[color:var(--ink)]/80 text-sm space-y-1">
                      <li>• Anonymous usage statistics</li>
                      <li>• Scan completion rates</li>
                      <li>• Popular scan types</li>
                      <li>• General geographic regions</li>
                      <li>• Browser and device types</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[color:var(--ink)] mb-3">What We DON'T Collect</h3>
                <div className="bg-red-50 border-2 border-dashed border-red-300 rounded-lg p-4">
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Personal information (unless you voluntarily provide it)</li>
                    <li>• Login credentials or passwords</li>
                    <li>• Private server configurations</li>
                    <li>• Internal network information</li>
                    <li>• User content or database information</li>
                    <li>• Detailed IP addresses or server logs</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="doodle-border p-8">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-6">Data Retention & Security</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-[color:var(--ink)] mb-3">How Long We Keep Data</h3>
                <ul className="text-[color:var(--ink)]/80 space-y-2">
                  <li>• <strong>Scan Results:</strong> 30 days for performance caching</li>
                  <li>• <strong>Analytics:</strong> 12 months for service improvement</li>
                  <li>• <strong>Error Logs:</strong> 7 days for debugging</li>
                  <li>• <strong>Email Notifications:</strong> Until you unsubscribe</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-[color:var(--ink)] mb-3">How We Protect Data</h3>
                <ul className="text-[color:var(--ink)]/80 space-y-2">
                  <li>• All data encrypted in transit and at rest</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Limited access on a need-to-know basis</li>
                  <li>• Automatic data purging after retention periods</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third Parties */}
          <section className="doodle-border p-8">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-6">Third-Party Services</h2>
            
            <div className="space-y-4">
              <p className="text-[color:var(--ink)]/80">
                We use minimal third-party services to provide our scanner. Here's what we use and why:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">Vercel (Hosting)</h4>
                  <p className="text-blue-700 text-sm">
                    Hosts our website and scanner. They may collect basic analytics and performance data.
                  </p>
                </div>
                
                <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">CallitDNS (Partner)</h4>
                  <p className="text-blue-700 text-sm">
                    Our partner for DNS and security services. They don't receive your scan data.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="doodle-border p-8">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-6">Your Rights</h2>
            
            <div className="space-y-4">
              <p className="text-[color:var(--ink)]/80">
                You have the following rights regarding your data:
              </p>
              
              <ul className="text-[color:var(--ink)]/80 space-y-2">
                <li>• <strong>Access:</strong> Request a copy of any data we have about you</li>
                <li>• <strong>Correction:</strong> Ask us to correct any inaccurate information</li>
                <li>• <strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                <li>• <strong>Portability:</strong> Get your data in a machine-readable format</li>
                <li>• <strong>Objection:</strong> Object to processing of your data for certain purposes</li>
              </ul>
              
              <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg p-4 mt-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Contact Us:</strong> To exercise any of these rights or ask questions about our privacy practices, 
                  contact us through our partner <a href="https://callitdns.com" className="underline font-semibold">CallitDNS.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="doodle-border p-8">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-6">Policy Updates</h2>
            
            <p className="text-[color:var(--ink)]/80 mb-4">
              We may update this privacy policy from time to time. When we do, we'll:
            </p>
            
            <ul className="text-[color:var(--ink)]/80 space-y-2">
              <li>• Update the "Last updated" date at the top of this page</li>
              <li>• Notify users of significant changes via our website</li>
              <li>• Maintain previous versions for reference</li>
              <li>• Give you time to review changes before they take effect</li>
            </ul>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-12">
          <div className="doodle-border p-8 text-center">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-4">Questions About Privacy?</h2>
            <p className="text-xl text-[color:var(--ink)]/80 mb-6">
              We're committed to transparency. If you have any questions about how we handle your data, 
              don't hesitate to reach out.
            </p>
            <a href="https://callitdns.com" className="doodle-btn doodle-btn--accent text-lg font-bold px-8 py-4">
              Contact CallitDNS
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-dashed border-[color:var(--ink)] bg-white/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-[color:var(--ink)]/70">
              © {new Date().getFullYear()} DDoS Guy. Made by{" "}
              <a href="https://callitdns.com" className="footer-link font-semibold">
                CallitDNS
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
