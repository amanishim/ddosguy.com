"use client"

import Link from "next/link"
import { Menu, X, ArrowRight, Shield, Globe, BookOpen } from 'lucide-react'
import { useState } from "react"
import DoodleTheme from "@/components/doodle-theme"
import { ScanTotalBadge } from "@/components/scan-total-badge"

export default function LearnPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const articles = [
    {
      title: "What is a DDoS Attack?",
      description: "Learn the basics of Distributed Denial of Service attacks, how they work, and why they're dangerous.",
      href: "/learn/what-is-a-ddos-attack",
      icon: Shield,
      difficulty: "Beginner",
      readTime: "5 min read",
    },
    {
      title: "WAF vs CDN: What's the Difference?",
      description: "Understand the key differences between Web Application Firewalls and Content Delivery Networks.",
      href: "/learn/waf-vs-cdn",
      icon: Globe,
      difficulty: "Intermediate",
      readTime: "7 min read",
    },
    {
      title: "How to Hide Your Origin IP",
      description: "Step-by-step guide to protecting your server's real IP address from attackers.",
      href: "/learn/hide-origin-ip",
      icon: BookOpen,
      difficulty: "Advanced",
      readTime: "10 min read",
    },
  ]

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
              <Link href="/learn" className="nav-link font-bold">
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
                <Link href="/learn" className="mobile-link font-bold">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-[color:var(--ink)] mb-6">
            <span className="doodle-underline">Learn DDoS Protection</span>
          </h1>
          <p className="text-xl text-[color:var(--ink)]/80 max-w-3xl mx-auto mb-8">
            Everything you need to know about DDoS attacks, protection methods, and keeping your website secure. 
            From beginner basics to advanced techniques.
          </p>
          <Link href="/scanner" className="doodle-btn doodle-btn--accent text-lg font-bold px-8 py-4">
            Test Your Knowledge
          </Link>
        </section>

        {/* Articles Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-8 text-center">
            Security Guides & Tutorials
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Link key={index} href={article.href} className="group">
                <div className="doodle-border p-6 h-full group-hover:bg-yellow-50 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <article.icon className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-yellow-600 uppercase tracking-wide">
                        {article.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[color:var(--ink)] mb-3 group-hover:text-yellow-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-[color:var(--ink)]/80 mb-4 flex-grow">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center text-yellow-600 font-medium">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="mb-16">
          <div className="doodle-border p-8">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-6 text-center">
              Quick Security Tips
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border-2 border-dashed border-green-300 rounded-lg p-4">
                <h3 className="font-bold text-green-800 mb-2">✓ Do This</h3>
                <ul className="text-green-700 space-y-1 text-sm">
                  <li>• Use a reputable CDN service</li>
                  <li>• Enable rate limiting on your server</li>
                  <li>• Keep your software updated</li>
                  <li>• Monitor your traffic patterns</li>
                  <li>• Have an incident response plan</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border-2 border-dashed border-red-300 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-2">✗ Avoid This</h3>
                <ul className="text-red-700 space-y-1 text-sm">
                  <li>• Exposing your origin server IP</li>
                  <li>• Ignoring unusual traffic spikes</li>
                  <li>• Using default security settings</li>
                  <li>• Forgetting to backup regularly</li>
                  <li>• Relying on a single protection method</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="doodle-border p-12">
            <h2 className="text-4xl font-bold text-[color:var(--ink)] mb-6">
              Ready to Test Your Site?
            </h2>
            <p className="text-xl text-[color:var(--ink)]/80 mb-8 max-w-2xl mx-auto">
              Now that you know the basics, see how your website measures up with our free security scanner.
            </p>
            <Link href="/scanner" className="doodle-btn doodle-btn--accent text-xl font-bold px-8 py-4">
              Scan Your Website
            </Link>
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
