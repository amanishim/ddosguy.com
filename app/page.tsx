import Link from "next/link"
import { ScanTotalBadge } from "@/components/scan-total-badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fef7ed]">
      {/* Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center transform rotate-3">
              <span className="text-2xl font-bold text-black">🛡️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">DDoS Guy</h1>
              <p className="text-sm text-gray-600">A CallitDNS Company</p>
            </div>
          </div>
          <ScanTotalBadge />
        </div>
      </header>

      {/* Hero Section - What is DDoS */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-black mb-6 transform -rotate-1">What is DDoS? 🤔</h1>
          <div className="bg-white border-4 border-black p-8 transform rotate-1 shadow-[8px_8px_0px_0px_#000] mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">DDoS Meaning Explained Simply</h2>
            <p className="text-lg text-gray-700 mb-4">
              <strong>DDoS</strong> stands for <strong>"Distributed Denial of Service"</strong> - it's a cyber attack
              where hackers use multiple computers to flood your website with fake traffic, making it crash or become
              unavailable to real visitors.
            </p>
            <p className="text-lg text-gray-700">
              Think of it like a traffic jam blocking a highway - except it's intentional and designed to shut down your
              website! 🚗💥
            </p>
          </div>

          <Link
            href="/scanner"
            className="inline-block bg-red-400 hover:bg-red-500 text-black font-bold py-4 px-8 border-4 border-black transform hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_#000] text-xl"
          >
            🔍 Scan Your Website for DDoS Protection
          </Link>
        </div>
      </section>

      {/* What is DDoS Attack Section */}
      <section className="py-16 px-4 bg-blue-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-black transform rotate-1">
            Understanding DDoS Attacks 📚
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border-4 border-black p-6 transform -rotate-1 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-2xl font-bold mb-4 text-black">🎯 What is a DDoS Attack?</h3>
              <p className="text-gray-700">
                A DDoS attack is when cybercriminals use thousands of infected computers (called a "botnet") to send
                massive amounts of traffic to your website all at once, overwhelming your server and making it crash.
              </p>
            </div>
            <div className="bg-white border-4 border-black p-6 transform rotate-1 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-2xl font-bold mb-4 text-black">⚡ How DDoS Works</h3>
              <p className="text-gray-700">
                Hackers control infected devices worldwide and command them to visit your website simultaneously. Your
                server can't handle millions of requests at once, so it becomes unavailable to legitimate users.
              </p>
            </div>
            <div className="bg-white border-4 border-black p-6 transform -rotate-1 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-2xl font-bold mb-4 text-black">🛡️ DDoS Protection</h3>
              <p className="text-gray-700">
                DDoS protection filters out malicious traffic before it reaches your server. Services like Cloudflare,
                AWS Shield, and other CDNs act as shields between attackers and your website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DDoS vs DOS Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-black transform -rotate-1">
            DDoS vs DOS: What's the Difference? 🤷‍♂️
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-yellow-200 border-4 border-black p-6 transform rotate-1 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-2xl font-bold mb-4 text-black">DOS Attack</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Uses ONE computer</li>
                <li>• Easier to block</li>
                <li>• Less powerful</li>
                <li>• Older attack method</li>
              </ul>
            </div>
            <div className="bg-red-200 border-4 border-black p-6 transform -rotate-1 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-2xl font-bold mb-4 text-black">DDoS Attack</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Uses THOUSANDS of computers</li>
                <li>• Much harder to block</li>
                <li>• Extremely powerful</li>
                <li>• Modern attack method</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Common Questions FAQ */}
      <section className="py-16 px-4 bg-green-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-black transform rotate-1">
            Common DDoS Questions 🙋‍♀️
          </h2>
          <div className="space-y-6">
            <div className="bg-white border-4 border-black p-6 transform -rotate-1 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-xl font-bold mb-3 text-black">Q: What does DDoS stand for?</h3>
              <p className="text-gray-700">
                A: DDoS stands for "Distributed Denial of Service" - it's a type of cyber attack that makes websites
                unavailable.
              </p>
            </div>
            <div className="bg-white border-4 border-black p-6 transform rotate-1 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-xl font-bold mb-3 text-black">Q: How can I protect my website from DDoS attacks?</h3>
              <p className="text-gray-700">
                A: Use DDoS protection services like Cloudflare, AWS Shield, or other CDN providers. They filter
                malicious traffic before it reaches your server.
              </p>
            </div>
            <div className="bg-white border-4 border-black p-6 transform -rotate-1 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-xl font-bold mb-3 text-black">Q: Are DDoS attacks illegal?</h3>
              <p className="text-gray-700">
                A: Yes! DDoS attacks are illegal in most countries and can result in serious criminal charges and prison
                time.
              </p>
            </div>
            <div className="bg-white border-4 border-black p-6 transform rotate-1 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-xl font-bold mb-3 text-black">Q: How do I know if I'm under a DDoS attack?</h3>
              <p className="text-gray-700">
                A: Signs include: website running extremely slow, server crashes, unusual traffic spikes, and legitimate
                users unable to access your site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white border-4 border-black p-8 transform -rotate-1 shadow-[8px_8px_0px_0px_#000]">
            <h2 className="text-3xl font-bold mb-4 text-black">Ready to Check Your DDoS Protection? 🔍</h2>
            <p className="text-lg text-gray-700 mb-6">
              Use our free DDoS scanner to analyze your website's protection against DDoS attacks. Get instant results
              and expert recommendations!
            </p>
            <Link
              href="/scanner"
              className="inline-block bg-blue-400 hover:bg-blue-500 text-black font-bold py-4 px-8 border-4 border-black transform hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_#000] text-xl"
            >
              🚀 Start Free DDoS Scan
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-lg font-bold text-black">🛡️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">DDoS Guy</h3>
              <p className="text-sm text-gray-300">A CallitDNS Company</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4">
            Learn about DDoS attacks, DDoS meaning, and protect your website with our free DDoS protection scanner.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-300 hover:text-white">
              Privacy
            </Link>
            <a
              href="https://callitdns.com"
              className="text-gray-300 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              CallitDNS
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
