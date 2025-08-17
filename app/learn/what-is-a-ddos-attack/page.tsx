"use client"

import Link from "next/link"
import { Menu, X, ArrowLeft, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { useState } from "react"
import DoodleTheme from "@/components/doodle-theme"
import { ScanTotalBadge } from "@/components/scan-total-badge"

export default function WhatIsDDoSPage() {
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
          <Link href="/learn" className="doodle-btn inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learn
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <span className="text-sm font-bold text-red-600 uppercase tracking-wide">Beginner Guide</span>
              <div className="text-sm text-gray-500">5 min read • Updated {new Date().toLocaleDateString()}</div>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-[color:var(--ink)] mb-6">
            What is a <span className="doodle-underline">DDoS Attack</span>?
          </h1>
          
          <p className="text-xl text-[color:var(--ink)]/80 leading-relaxed">
            A DDoS (Distributed Denial of Service) attack is like having thousands of people try to enter a store at the same time, 
            blocking the entrance so real customers can't get in. Let's break down exactly how these attacks work and why they're so dangerous.
          </p>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="doodle-border p-8 mb-8">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-4">The Simple Explanation</h2>
            <p className="text-[color:var(--ink)]/80 mb-4">
              Imagine your website is a restaurant with one door. Normally, customers come in one at a time or in small groups. 
              But what if someone organized thousands of people to all try to enter at once? The door would be blocked, 
              and real customers couldn't get in.
            </p>
            <p className="text-[color:var(--ink)]/80">
              That's exactly what a DDoS attack does to your website. Attackers use many computers (sometimes millions) 
              to send so much fake traffic to your site that it can't handle real visitors anymore.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="doodle-border p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-xl font-bold text-[color:var(--ink)]">How DDoS Attacks Work</h3>
              </div>
              <ol className="text-[color:var(--ink)]/80 space-y-2">
                <li><strong>1. Building a Botnet:</strong> Attackers infect thousands of computers with malware</li>
                <li><strong>2. Coordinated Attack:</strong> All infected computers target your website at once</li>
                <li><strong>3. Server Overload:</strong> Your server can't handle the massive traffic</li>
                <li><strong>4. Service Disruption:</strong> Real users can't access your website</li>
              </ol>
            </div>

            <div className="doodle-border p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-[color:var(--ink)]">Types of DDoS Attacks</h3>
              </div>
              <ul className="text-[color:var(--ink)]/80 space-y-2">
                <li><strong>Volume Attacks:</strong> Flood your bandwidth with junk traffic</li>
                <li><strong>Protocol Attacks:</strong> Exploit weaknesses in network protocols</li>
                <li><strong>Application Attacks:</strong> Target specific web applications or services</li>
                <li><strong>Reflection Attacks:</strong> Use other servers to amplify the attack</li>
              </ul>
            </div>
          </div>

          <div className="doodle-border p-8 mb-8">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-4">Why DDoS Attacks Happen</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">$</span>
                </div>
                <h4 className="font-bold text-[color:var(--ink)] mb-2">Financial Gain</h4>
                <p className="text-sm text-[color:var(--ink)]/80">Extortion, ransom demands, or competitive advantage</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">⚡</span>
                </div>
                <h4 className="font-bold text-[color:var(--ink)] mb-2">Revenge</h4>
                <p className="text-sm text-[color:var(--ink)]/80">Disgruntled customers, employees, or competitors</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">🎯</span>
                </div>
                <h4 className="font-bold text-[color:var(--ink)] mb-2">Activism</h4>
                <p className="text-sm text-[color:var(--ink)]/80">Political protests or ideological disagreements</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-[color:var(--ink)] mb-4">Real-World Impact</h3>
            <p className="text-[color:var(--ink)]/80 mb-4">
              DDoS attacks can cost businesses thousands of dollars per hour in lost revenue, damaged reputation, 
              and recovery costs. Some famous attacks have taken down major websites for hours or even days.
            </p>
            <ul className="text-[color:var(--ink)]/80 space-y-1">
              <li>• E-commerce sites lose sales during downtime</li>
              <li>• Gaming servers frustrate players and lose users</li>
              <li>• News websites miss breaking story traffic</li>
              <li>• SaaS platforms breach service level agreements</li>
            </ul>
          </div>

          <div className="doodle-border p-8 mb-8">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-4">How to Protect Yourself</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[color:var(--ink)] mb-3">Basic Protection</h4>
                <ul className="text-[color:var(--ink)]/80 space-y-2">
                  <li>• Use a Content Delivery Network (CDN)</li>
                  <li>• Enable rate limiting on your server</li>
                  <li>• Configure your firewall properly</li>
                  <li>• Monitor traffic patterns regularly</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-[color:var(--ink)] mb-3">Advanced Protection</h4>
                <ul className="text-[color:var(--ink)]/80 space-y-2">
                  <li>• Deploy a Web Application Firewall (WAF)</li>
                  <li>• Use DDoS protection services</li>
                  <li>• Hide your origin server IP address</li>
                  <li>• Implement geographic filtering</li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        {/* Next Steps */}
        <section className="mt-12">
          <div className="doodle-border p-8 text-center">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-4">Test Your Website Now</h2>
            <p className="text-xl text-[color:var(--ink)]/80 mb-6">
              Now that you understand DDoS attacks, see how protected your website is with our free scanner.
            </p>
            <Link href="/scanner" className="doodle-btn doodle-btn--accent text-lg font-bold px-8 py-4">
              Scan Your Website
            </Link>
          </div>
        </section>

        {/* Related Articles */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-[color:var(--ink)] mb-6">Continue Learning</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/learn/waf-vs-cdn" className="doodle-border p-6 group hover:bg-yellow-50 transition-colors">
              <h3 className="font-bold text-[color:var(--ink)] mb-2 group-hover:text-yellow-600">WAF vs CDN: What's the Difference?</h3>
              <p className="text-[color:var(--ink)]/80 text-sm">Learn about the two main types of DDoS protection and when to use each one.</p>
            </Link>
            
            <Link href="/learn/hide-origin-ip" className="doodle-border p-6 group hover:bg-yellow-50 transition-colors">
              <h3 className="font-bold text-[color:var(--ink)] mb-2 group-hover:text-yellow-600">How to Hide Your Origin IP</h3>
              <p className="text-[color:var(--ink)]/80 text-sm">Advanced techniques to protect your server from direct attacks.</p>
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
