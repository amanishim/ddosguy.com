"use client"

import { useEffect, useState } from "react"

export function ScanTotalBadge() {
  const [totalScans, setTotalScans] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTotal() {
      try {
        const response = await fetch("/api/scan-total")
        if (response.ok) {
          const data = await response.json()
          setTotalScans(data.total)
        }
      } catch (error) {
        console.error("Failed to fetch scan total:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTotal()
  }, [])

  if (loading) {
    return (
      <div className="bg-green-200 border-2 border-black px-3 py-1 transform rotate-2 shadow-[2px_2px_0px_0px_#000]">
        <span className="text-sm font-bold text-black">Loading...</span>
      </div>
    )
  }

  return (
    <div className="bg-green-200 border-2 border-black px-3 py-1 transform rotate-2 shadow-[2px_2px_0px_0px_#000]">
      <span className="text-sm font-bold text-black">{totalScans.toLocaleString()} scans completed! 🎉</span>
    </div>
  )
}
