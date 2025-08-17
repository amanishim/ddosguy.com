"use client"

import { useState } from "react"
import Link from "next/link"
import { Kalam } from "next/font/google"
import { Menu, X, Shield, Zap, Eye, Users, ChevronDown, ChevronUp } from "lucide-react"
import DoodleTheme from "@/components/doodle-theme"
import { ScanTotalBadge } from "@/components/scan-total-badge"

const kalam = Kalam({ subsets: ["latin"], weight: ["400", "700"] })

export default function ClientPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "What is a DDoS attack?",
      answer:
        "A Distributed Denial of Service (DDoS) attack is when multiple compromised systems flood your website with traffic, making it unavailable to legitimate users. Think of it like a traffic jam blocking access to your store.",
    },
    {
      question: "How does the scanner work?",
      answer:
        "Our scanner safely checks your website's public DNS records and HTTP headers to identify potential vulnerabilities. We never perform actual attacks - just read publicly available information to assess your protection level.",
    },
    {
      question: "Is the scan safe for my website?",
      answer:
        "Our scanner only reads public information like DNS records and response headers. We never send malicious traffic or attempt to overload your server. It's completely safe and non-invasive.",
    },
    {
      question: "What should I do if my site is vulnerable?",
      answer:
        "If vulnerabilities are found, consider using a Web Application Firewall (WAF), Content Delivery Network (CDN), or DDoS protection service. Our partner CallitDNS offers AI-powered DNS protection that can help secure your domain.",
    },
    {
      question: "How often should I scan my website?",
      answer:
        "We recommend scanning whenever you make infrastructure changes, add new services, or at least monthly. Regular scans help ensure your protection measures are working correctly.",
    },
    {
      question: "Do you store my scan results?",
      answer:
        "We temporarily cache scan results to improve performance, but we don't permanently store sensitive information about your infrastructure. Check our privacy policy for full details.",
    },
  ]

  return (
    <div className={`${kalam.className} min-h-screen bg-[color:var(--cream)]`}>
      <DoodleTheme />

      {/* Header */}
      <header className="border-b-2 border-dashed border-[color:var(--ink)] bg-[color:var(--cream)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-[color:var(--ink)] mr-3" />
              <span className="font-heading text-2xl font-bold text-[color:var(--ink)]">DDoS Guy</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="nav-link">
                How it Works
              </a>
              <Link href="/scanner" className="nav-link">
                Free Scanner
              </Link>
              <Link href="/learn" className="nav-link">
                Learn
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
                <a href="#how-it-works" className="mobile-link">
                  How it Works
                </a>
                <Link href="/scanner" className="mobile-link">
                  Free Scanner
                </Link>
                <Link href="/learn" className="mobile-link">
                  Learn
                </Link>
                <div className="py-2">
                  <ScanTotalBadge />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-[color:var(--ink)] leading-tight">
            Is Your Website
            <br />
            <span className="relative inline-block">
              DDoS Ready?
              <svg
                className="absolute -bottom-4 left-0 w-full h-8 text-[color:var(--accent)]"
                viewBox="0 0 400 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 15C50 5, 100 18, 150 12C200 6, 250 16, 300 10C350 4, 380 12, 395 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>
          <p className="text-2xl mb-12 text-[color:var(--ink)]/80 max-w-2xl mx-auto leading-relaxed">
            Free security scanner for websites and game servers. Safe, simple, and always free basic scanning.
          </p>
          <Link href="/scanner" className="doodle-btn doodle-btn--accent text-2xl font-bold px-12 py-6 inline-block">
            <Shield className="inline mr-3 h-6 w-6" />
            Start Free Scan
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-[color:var(--ink)]">How it Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="doodle-border p-8 bg-white mb-6">
                <div className="w-16 h-16 bg-[color:var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <Zap className="h-12 w-12 text-[color:var(--ink)] mx-auto" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[color:var(--ink)]">Enter Your Domain</h3>
              <p className="text-lg text-[color:var(--ink)]/70 leading-relaxed">
                Simply type in your website or game server domain. No signup required, completely free.
              </p>
            </div>
            <div className="text-center">
              <div className="doodle-border p-8 bg-white mb-6">
                <div className="w-16 h-16 bg-[color:var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <Eye className="h-12 w-12 text-[color:var(--ink)] mx-auto" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[color:var(--ink)]">Safe Security Scan</h3>
              <p className="text-lg text-[color:var(--ink)]/70 leading-relaxed">
                We safely check your DNS records and headers. No harmful testing, just public information analysis.
              </p>
            </div>
            <div className="text-center">
              <div className="doodle-border p-8 bg-white mb-6">
                <div className="w-16 h-16 bg-[color:var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <Users className="h-12 w-12 text-[color:var(--ink)] mx-auto" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[color:var(--ink)]">Get Your Report</h3>
              <p className="text-lg text-[color:var(--ink)]/70 leading-relaxed">
                Receive a detailed security report with recommendations to improve your DDoS protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About the Guy */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="doodle-border p-12 bg-white">
            <h2 className="text-5xl font-bold text-center mb-8 text-[color:var(--ink)]">About the Guy</h2>
            <div className="prose prose-lg max-w-none text-[color:var(--ink)]/80 leading-relaxed space-y-6">
              <p className="text-xl">
                Hey there! I'm the DDoS Guy, and I've been in the trenches fighting distributed denial-of-service
                attacks for years. I've seen small blogs get knocked offline by script kiddies and watched enterprise
                sites crumble under sophisticated botnets.
              </p>
              <p className="text-xl">
                The problem? Most people don't know they're vulnerable until it's too late. That's why I built this free
                scanner - to give everyone, from indie developers to small businesses, a fighting chance against DDoS
                attacks.
              </p>
              <p className="text-xl">
                This tool performs safe, non-invasive checks on your website's public information to identify potential
                weak spots. No harmful testing, no overloading your server - just smart analysis of what's already
                visible to the world.
              </p>
              <p className="text-xl font-semibold text-[color:var(--ink)]">
                Because everyone deserves to sleep soundly knowing their website can weather the storm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-[color:var(--ink)]">Common Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="doodle-border bg-white">
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-xl font-semibold text-[color:var(--ink)] pr-4">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-6 w-6 text-[color:var(--ink)] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-[color:var(--ink)] flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-lg text-[color:var(--ink)]/70 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[color:var(--accent)]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 text-[color:var(--ink)]">Ready to Check Your Security?</h2>
          <p className="text-2xl mb-12 text-[color:var(--ink)]/80 leading-relaxed">
            Get your free DDoS vulnerability report in under 30 seconds.
          </p>
          <Link href="/scanner" className="doodle-btn doodle-btn--accent text-2xl font-bold px-12 py-6 inline-block">
            <Shield className="inline mr-3 h-6 w-6" />
            Scan My Website
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-dashed border-[color:var(--ink)] bg-white/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-[color:var(--ink)] mr-3" />
                <span className="font-heading text-2xl font-bold text-[color:var(--ink)]">DDoS Guy</span>
              </div>
              <p className="text-[color:var(--ink)]/70 mb-4 leading-relaxed">
                Free security scanner for websites and game servers. Safe, simple, and always free basic scanning.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[color:var(--ink)]">Tools</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/scanner" className="footer-link">
                    Free Scanner
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="footer-link">
                    Learn DDoS
                  </Link>
                </li>
                <li>
                  <a href="https://callitdns.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                    CallitDNS Protection ↗
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[color:var(--ink)]">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#how-it-works" className="footer-link">
                    How it Works
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="footer-link">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a href="mailto:contact@ddosguy.com" className="footer-link">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-dashed border-[color:var(--ink)] mt-8 pt-8 text-center">
            <p className="text-[color:var(--ink)]/70">© {new Date().getFullYear()} DDoS Guy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
