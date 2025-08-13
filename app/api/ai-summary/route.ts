import { NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

/**
 * Keep the summary short, neutral, and actionable.
 * If the AI key is missing or the request fails, we return a safe fallback.
 * Uses the AI SDK with xAI's Grok 3 model [^3].
 */
const FALLBACK_SAFE = {
  ok: "From what we can see publicly, your setup looks solid. We didn’t spot obvious red flags. Keep HTTPS and security headers in place, and review DNS periodically.",
  risky:
    "We noticed a couple of items that may increase exposure (for example, a visible origin IP or server version details). Consider placing a protective edge in front of your origin and tightening HTTP security headers. These are straightforward changes and don’t require app code changes.",
}

function sanitizeSummary(text: string) {
  let out = text || ""
  // Remove emojis
  out = out.replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}]/gu, "")
  // Tone down exclamations
  out = out.replace(/!+/g, ".")
  // Normalize whitespace
  out = out.replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim()
  // Cap length
  const maxLen = 700
  if (out.length > maxLen) out = out.slice(0, maxLen).trimEnd() + "..."
  return out
}

export async function POST(req: Request) {
  try {
    const { vulnerabilities } = (await req.json()) as { vulnerabilities: string[] }
    const fallback = (vulnerabilities?.length ?? 0) === 0 ? FALLBACK_SAFE.ok : FALLBACK_SAFE.risky

    // If there is no key, return fallback safely
    if (!process.env.XAI_API_KEY) {
      return NextResponse.json({ text: fallback })
    }

    // Use xAI (Grok 3) via the AI SDK [^3]
    const { text } = await generateText({
      model: xai("grok-3"),
      maxTokens: 220,
      temperature: 0.3,
      system: [
        "You are a neutral, concise security summarizer.",
        "Constraints:",
        "- 3–4 sentences max, then a short 'Next steps:' with 2–3 bullets.",
        "- Avoid hype, emojis, vendor pitches, pricing, and timelines.",
        "- Use calm, non‑alarmist language (e.g., 'may', 'could', 'consider').",
        "- Speak to a general audience; avoid jargon.",
      ].join("\n"),
      prompt: [
        "Summarize website scan findings for a non‑expert.",
        `Vulnerabilities: ${vulnerabilities?.join(", ") || "None"}.`,
        "Be specific but neutral. Focus on what’s observable from public signals only.",
        "Vendor‑neutral remediation. No brand names in the summary.",
      ].join("\n"),
    })

    const safe = sanitizeSummary(text?.trim() || fallback)
    return NextResponse.json({ text: safe })
  } catch {
    return NextResponse.json({ text: FALLBACK_SAFE.risky })
  }
}
