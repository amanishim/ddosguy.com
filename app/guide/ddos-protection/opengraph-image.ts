import { ImageResponse } from "next/og"

// Image metadata
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#FEFCF3",
        color: "#2d2d2d",
        padding: "60px 80px",
      }}
    >
      <div
        style={{
          fontSize: 60,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        {"DDoS Protection Guide"}
      </div>
      <div style={{ fontSize: 28, opacity: 0.9, maxWidth: 900, lineHeight: 1.3 }}>
        {"A practical checklist to keep your site online: edge/WAF, Secure DNS, HTTPS, rate limits, caching, monitor."}
      </div>
      <div
        style={{
          marginTop: 28,
          fontSize: 24,
          padding: "10px 16px",
          border: "3px solid #2d2d2d",
          background: "#FFD100",
          fontWeight: 800,
        }}
      >
        {"DDoS Guy"}
      </div>
    </div>,
  )
}
