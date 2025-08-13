"use client"

import DoodleTheme from "@/components/doodle-theme"

export default function ScannerLoading() {
  return (
    <div className="min-h-dvh">
      <DoodleTheme />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="text-center mb-10">
          <div className="font-heading text-4xl text-[color:var(--ink)]">{"DDoS Guy"}</div>
          <h1 className="font-heading text-5xl md:text-7xl mt-4 leading-tight">{"Website & Game Server Scanner"}</h1>
          <p className="text-lg opacity-80 mt-2">
            {"Safe, public-signal checks to spot weak points and plan DDoS protection."}
          </p>
        </header>

        <div className="text-center p-8">
          <div className="loader mx-auto mb-4" aria-hidden="true" />
          <p className="font-heading text-2xl">{"Loading scanner..."}</p>
        </div>
      </div>

      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--accent);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  )
}
