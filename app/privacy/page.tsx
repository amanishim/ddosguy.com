export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-5xl mb-4">{"Privacy & Methodology"}</h1>
      <div className="doodle-border bg-white p-6">
        <p className="mb-3">
          {"We only read public information: DNS records and standard HTTP response headers. We do not log in, run exploits, or send high volumes of traffic."}
        </p>
        <p className="mb-3">
          {"Scans are cached briefly to make results snappy and reduce resolver load. We track anonymous counts to understand usage—no personal info."}
        </p>
        <p className="mb-3">
          {"If you prefer not to be included in caching, contact us and we can exclude your domain from short-term storage."}
        </p>
        <p className="opacity-70 text-sm">
          {"This preview stores data in memory only and resets frequently. In production we recommend a short-lived database (e.g. Neon) and rate limiting (e.g. Upstash)."}
        </p>
      </div>
    </main>
  )
}
