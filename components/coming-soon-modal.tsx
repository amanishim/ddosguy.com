"use client"

import type React from "react"

import { useState } from "react"
import { X, Mail, Bell } from "lucide-react"

interface ComingSoonModalProps {
  open: boolean
  onClose: () => void
  defaultDomain?: string
}

export default function ComingSoonModal({ open, onClose, defaultDomain = "" }: ComingSoonModalProps) {
  const [email, setEmail] = useState("")
  const [domain, setDomain] = useState(defaultDomain)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate submission
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 2000)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg border-3 border-[color:var(--ink)] max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[color:var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-[color:var(--ink)]" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[color:var(--ink)] mb-2">Coming Soon!</h2>
          <p className="text-[color:var(--ink)]/70 font-heading">
            Get notified when detailed security reports are available
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-heading text-xl font-bold text-green-600 mb-2">Thanks for signing up!</h3>
            <p className="text-gray-600 font-heading">We'll notify you when this feature is ready.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="notify-email"
                className="block text-sm font-medium mb-2 text-[color:var(--ink)] font-heading"
              >
                Email address
              </label>
              <input
                id="notify-email"
                type="email"
                required
                className="doodle-input w-full"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="notify-domain"
                className="block text-sm font-medium mb-2 text-[color:var(--ink)] font-heading"
              >
                Domain (optional)
              </label>
              <input
                id="notify-domain"
                type="text"
                className="doodle-input w-full"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <button type="submit" className="doodle-btn doodle-btn--accent w-full font-bold">
              Notify Me
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
