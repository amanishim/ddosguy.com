type Step = { label: string; status: "idle" | "active" | "done" }

export function ProgressSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-6" aria-label="Scan progress">
      {steps.map((s, i) => {
        const isActive = s.status === "active"
        const isDone = s.status === "done"
        return (
          <li key={i} className={`doodle-border p-3 text-center ${isActive ? "bg-[#FFF5BF]" : "bg-white"} ${isDone ? "opacity-90" : ""}`}>
            <span className="font-heading text-xl block">{s.label}</span>
            <span className="text-sm">{isDone ? "Done" : isActive ? "Working..." : "Pending"}</span>
          </li>
        )
      })}
    </ol>
  )
}
