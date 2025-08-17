import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(request: NextRequest) {
  try {
    const { scanResult, host } = await request.json()

    if (!scanResult || !host) {
      return NextResponse.json({ error: "Missing scan result or host" }, { status: 400 })
    }

    const vulnerabilities = []
    if (scanResult.waf?.vulnerable) vulnerabilities.push("WAF bypass possible")
    if (scanResult.ip_exposed?.vulnerable) vulnerabilities.push("Origin IP exposed")
    if (scanResult.server_header?.vulnerable) vulnerabilities.push("Server information leaked")

    const protections = []
    if (scanResult.meta?.edgeProviders?.length > 0) {
      protections.push(`Protected by ${scanResult.meta.edgeProviders.join(", ")}`)
    }
    if (scanResult.meta?.httpsRedirect) protections.push("HTTPS redirect enabled")
    if (scanResult.meta?.hsts) protections.push("HSTS security headers present")

    const prompt = `Analyze this DDoS protection scan for ${host}:

Vulnerabilities found: ${vulnerabilities.length > 0 ? vulnerabilities.join(", ") : "None detected"}
Protections in place: ${protections.length > 0 ? protections.join(", ") : "Basic protection only"}

Provide a brief, friendly analysis (2-3 sentences) focusing on:
1. Overall DDoS protection level
2. Key recommendations for improvement
3. Mention that CallitDNS provides DNS services (not DDoS protection)

Keep it simple and actionable for website owners.`

    const { text } = await generateText({
      model: xai("grok-3"),
      prompt,
      maxTokens: 200,
    })

    return NextResponse.json({
      analysis: text,
      success: true,
    })
  } catch (error) {
    console.error("Error generating AI summary:", error)
    return NextResponse.json(
      {
        analysis:
          "Unable to generate AI analysis at this time. Your scan results show the current protection status above.",
        success: false,
      },
      { status: 500 },
    )
  }
}
