import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "DDoS Guy · Keep Your Site Online",
  description:
    "Free DDoS protection scanner and honest security advice. Check your website for vulnerabilities and get clear, vendor-neutral recommendations to stay online.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DDoS Guy · Keep Your Site Online",
    description:
      "Free DDoS protection scanner and honest security advice. Check your website for vulnerabilities and get clear recommendations.",
    url: "/",
    images: [{ url: "/og.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DDoS Guy · Keep Your Site Online",
    description: "Free DDoS protection scanner and honest security advice.",
    images: ["/og.png"],
  },
}

export default function Page() {
  return <ClientPage />
}
