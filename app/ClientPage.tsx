"use client"

import type React from "react"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Caveat, Inter } from "next/font/google"
import { useState } from "react"
import ScanTotalBadge from "@/components/scan-total-badge"

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function ClientPage() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`${inter.variable} ${caveat.variable} min-h-dvh text-[color:var(--ink)]`}
      style={
        {
          // Theme variables
          ["--paper" as any]: "#FEFCF3",
          ["--ink" as any]: "#2d2d2d",
          ["--accent" as any]: "#FFD100",
        } as React.CSSProperties
      }
    >
      <div className="bg-[color:var(--paper)]">
        <header className="sticky top-0 z-50 w-full border-b border-[color:var(--ink)]/10 bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="#top" className="font-heading text-3xl font-bold tracking-tight">
              DDoS Guy
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-6 md:flex">
              <Link href="#how" className="nav-link">
                {"How it Works"}
              </Link>
              <Link href="/scanner" className="nav-link">
                {"Free Scanner"}
              </Link>
              <Link href="/learn" className="nav-link">
                {"Learn"}
              </Link>
              <Link href="/scanner" className="doodle-btn doodle-btn--accent">
                {"Scan Your Site"}
              </Link>
              <div className="hidden md:block">
                <ScanTotalBadge />
              </div>
            </nav>

            {/* Mobile menu button */}
            <button
              aria-label="Open menu"
              className="md:hidden inline-flex items-center justify-center rounded-md border-2 border-[color:var(--ink)] p-2 hover:bg-black/5 transition"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile dropdown */}
          {open && (
            <div className="md:hidden px-4 pb-4">
              <div className="doodle-border bg-[color:var(--paper)]">
                <div className="flex flex-col divide-y divide-[color:var(--ink)]/10">
                  <Link href="#how" className="mobile-link" onClick={() => setOpen(false)}>
                    {"How it Works"}
                  </Link>
                  <Link href="/scanner" className="mobile-link" onClick={() => setOpen(false)}>
                    {"Free Scanner"}
                  </Link>
                  <Link href="/learn" className="mobile-link" onClick={() => setOpen(false)}>
                    {"Learn"}
                  </Link>
                  <div className="p-3">
                    <Link
                      href="/scanner"
                      className="doodle-btn doodle-btn--accent w-full text-center"
                      onClick={() => setOpen(false)}
                    >
                      {"Scan Your Site"}
                    </Link>
                  </div>
                  <div className="p-3 flex justify-end">
                    <ScanTotalBadge size="sm" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        <main id="top">
          {/* Hero */}
          <section className="relative">
            <div className="mx-auto max-w-5xl px-4 py-20 text-center">
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
                {"Keeping Your Stuff "}
                <span className="doodle-underline">{"Online"}</span>
                {"."}
              </h1>
              <p className="mt-6 mx-auto max-w-3xl text-lg leading-relaxed">
                {
                  "Don't let bad traffic ruin your day. We help you understand your risks and find the right protection. Simple, honest security advice."
                }
              </p>
              <div className="mt-10 flex items-center justify-center">
                <Link href="/scanner" className="doodle-btn doodle-btn--accent text-lg px-6 py-3">
                  {"Scan Your Site For Free"}
                </Link>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how" className="py-16">
            <div className="mx-auto max-w-6xl px-4">
              <div className="text-center">
                <h2 className="font-heading text-4xl font-semibold">{"So, How's It Work?"}</h2>
                <p className="mt-2 text-base">{"It's pretty simple, really."}</p>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <article className="doodle-border group">
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold">{"1. Scan Your Site"}</h3>
                    <p className="mt-3 text-base leading-relaxed">
                      {"Use our free tool to check your website for common weak spots that attackers love to target."}
                    </p>
                  </div>
                </article>

                <article className="doodle-border group">
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold">{"2. Understand Your Risk"}</h3>
                    <p className="mt-3 text-base leading-relaxed">
                      {
                        "Our AI explains the results in plain English. No confusing jargon, just a clear picture of your security."
                      }
                    </p>
                  </div>
                </article>

                <article id="recommendations" className="doodle-border group">
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold">{"3. Get Honest Advice"}</h3>
                    <p className="mt-3 text-base leading-relaxed">
                      {
                        "We give you honest, unbiased recommendations for the best tools, from DDoS protection to secure DNS like callitdns.com, to fix your specific problems."
                      }
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* About the Guy */}
          <section id="about" className="py-16">
            <div className="mx-auto max-w-4xl px-4">
              <div className="doodle-border">
                <div className="p-6 sm:p-8 text-center">
                  <h2 className="font-heading text-4xl font-semibold">{"About the Guy."}</h2>
                  <p className="mt-4 text-lg leading-relaxed">
                    {
                      "Hey, I'm the DDoS Guy. I'm just a tech enthusiast who got tired of seeing cool projects, small businesses, and gaming servers get knocked offline by unfair attacks. Security can feel super complicated, so I created this site to give simple, honest advice that anyone can understand. No corporate jargon, no hard sales pitches—just real solutions that work."
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="py-16">
            <div className="mx-auto max-w-6xl px-4">
              <div className="text-center">
                <h2 className="font-heading text-4xl font-semibold">{"Common Questions."}</h2>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <article className="doodle-border">
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold">{"How does the scanner work?"}</h3>
                    <p className="mt-3 leading-relaxed">
                      {
                        'Our scanner is 100% safe. It acts like a search engine, checking only publicly available information. We look at your site\'s DNS records and the "headers" your server sends out. We never try to log in, hack, or attack your site.'
                      }
                    </p>
                  </div>
                </article>

                <article className="doodle-border">
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold">{"Why should I trust your advice?"}</h3>
                    <p className="mt-3 leading-relaxed">
                      {
                        "Because our goal is to help you, not just sell you something. We recommend different tools for different problems, and we even recommend great free solutions when they're a good fit. Our success depends on your success."
                      }
                    </p>
                  </div>
                </article>

                <article className="doodle-border">
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold">{"Do I really need protection?"}</h3>
                    <p className="mt-3 leading-relaxed">
                      {
                        "It's like insurance. You hope you never need it, but if an attack happens, you'll be very glad you have it. Being proactive is always cheaper and less stressful than trying to fix a website that's already offline."
                      }
                    </p>
                  </div>
                </article>

                <article className="doodle-border">
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold">{"Will these services slow my site down?"}</h3>
                    <p className="mt-3 leading-relaxed">
                      {
                        "Nope! In fact, most of the services we recommend (like Cloudflare and Sucuri) use a Content Delivery Network (CDN) that will actually make your website load faster for visitors all around the world."
                      }
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* Scanner anchor (CTA target) */}
          <section id="scanner" className="pb-20">
            <div className="mx-auto max-w-4xl px-4">
              <div className="doodle-border">
                <div className="p-6 sm:p-8 flex flex-col items-center text-center">
                  <h3 className="font-heading text-3xl font-bold">{"Ready to check your site?"}</h3>
                  <p className="mt-2 text-base">
                    {"Kick off a quick, safe scan to see public clues attackers might use—then get clear next steps."}
                  </p>
                  <Link href="/scanner" className="mt-6 doodle-btn doodle-btn--accent">
                    {"Start Free Scan"}
                  </Link>
                  <p className="mt-3 text-xs opacity-70">
                    {"No login required • Doesn’t touch your servers • Reads public data only"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t-2 border-dashed border-[color:var(--ink)] py-8">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm">
            {"DDoS Guy © 2025 - Built to keep you online."}
          </div>
        </footer>
      </div>

      <style jsx global>{`
       :root {
         --paper: #FEFCF3;
         --ink: #2d2d2d;
         --accent: #FFD100;
       }
       .font-heading {
         font-family: var(--font-caveat), ui-rounded, "Comic Sans MS", system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
       }
       html, body {
         background: var(--paper);
         color: var(--ink);
       }
       .nav-link {
         position: relative;
         font-weight: 600;
       }
       .nav-link:hover {
         text-decoration: underline;
         text-underline-offset: 4px;
       }
       .mobile-link {
         display: block;
         padding: 12px;
         font-weight: 600;
       }

       /* Doodle Border */
       .doodle-border {
         border: 2px solid var(--ink);
         border-radius: 15px 5px 20px 10px / 10px 20px 5px 15px;
         background: var(--paper);
         transition: transform 120ms ease, box-shadow 120ms ease;
       }
       .doodle-border:hover {
         transform: translate(-2px, -2px);
         box-shadow: 5px 5px 0px var(--accent);
       }

       /* Doodle Button */
       .doodle-btn {
         display: inline-flex;
         align-items: center;
         justify-content: center;
         gap: 0.5rem;
         padding: 0.625rem 1rem; /* default size; can override */
         border: 2px solid var(--ink);
         border-radius: 15px 5px 20px 10px / 10px 20px 5px 15px;
         background: white;
         color: var(--ink);
         font-weight: 800;
         text-decoration: none;
         box-shadow: 3px 3px 0px var(--ink);
         transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
       }
       .doodle-btn:hover {
         transform: translate(2px, 2px);
         box-shadow: 0 0 0 transparent;
       }
       .doodle-btn:focus-visible {
         outline: 3px solid var(--ink);
         outline-offset: 2px;
       }
       .doodle-btn--accent {
         background: var(--accent);
       }

       /* Doodle Underline */
       .doodle-underline {
         position: relative;
         display: inline-block;
         padding: 0 0.15em;
       }
       .doodle-underline::after {
         content: "";
         position: absolute;
         left: 0;
         right: 0;
         bottom: 0.08em;
         height: 0.45em;
         background: var(--accent);
         border-radius: 8px;
         transform: rotate(-1.2deg);
         z-index: -1;
         box-shadow: 0 1px 0 rgba(0,0,0,0.05);
       }
     `}</style>
    </div>
  )
}
