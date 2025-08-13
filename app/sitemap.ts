import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ddosguy.com")
  const url = (p: string) => `${base.replace(/\/+$/, "")}${p}`

  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1.0 },
    { url: url("/scanner"), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/guide/ddos-protection"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/learn"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/learn/what-is-a-ddos-attack"), changeFrequency: "yearly", priority: 0.65 },
    { url: url("/learn/waf-vs-cdn"), changeFrequency: "yearly", priority: 0.65 },
    { url: url("/learn/hide-origin-ip"), changeFrequency: "yearly", priority: 0.65 },
  ]
}
