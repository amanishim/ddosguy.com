"use client"

import { useState } from "react"
import type { AttackSimulation } from "@/lib/incident-response"
import type { SafetyCheck, SimulationResult, SimulationEnvironment } from "@/lib/simulation-safety"
import { SafeSimulationEngine } from "@/lib/simulation-engine"

interface SimulationSafetyProps {
  domain: string
  simulations: AttackSimulation[]
}

export default function SimulationSafetyDashboard({ domain, simulations }: SimulationSafetyProps) {
  const [selectedSimulation, setSelectedSimulation] = useState<AttackSimulation | null>(null)
  const [environment, setEnvironment] = useState<SimulationEnvironment>({
    isProduction: false,
    hasMonitoring: true,
    hasRollbackPlan: false,
    hasEmergencyContacts: true,
    resourceLimits: {
      maxConcurrentConnections: 50,
      maxRequestRate: 25,
      maxDuration: 300,
    },
  })
  const [safetyChecks, setSafetyChecks] = useState<SafetyCheck[]>([])
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState<"setup" | "checks" | "running" | "results">("setup")

  const runSafetyChecks = async () => {
    if (!selectedSimulation) return

    setCurrentStep("checks")

    // Import the safety check function
    const { runPreFlightChecks } = await import("@/lib/simulation-safety")
    const checks = await runPreFlightChecks(domain, selectedSimulation.type, environment)
    setSafetyChecks(checks)
  }

  const runSimulation = async () => {
    if (!selectedSimulation) return

    const criticalFailures = safetyChecks.filter((c) => c.status === "fail" && c.required)
    if (criticalFailures.length > 0) {
      alert("Cannot run simulation: Critical safety checks failed")
      return
    }

    setIsRunning(true)
    setCurrentStep("running")

    try {
      const engine = new SafeSimulationEngine(domain, environment)
      const result = await engine.runSimulation(selectedSimulation)
      setSimulationResult(result)
      setCurrentStep("results")
    } catch (error: any) {
      alert(`Simulation failed: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const resetSimulation = () => {
    setSelectedSimulation(null)
    setSafetyChecks([])
    setSimulationResult(null)
    setCurrentStep("setup")
  }

  return (
    <div className="space-y-6">
      <div className="doodle-border bg-white p-6">
        <h3 className="font-heading text-2xl mb-4">🛡️ Safe Attack Simulation</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">Safety First Approach</h4>
          <p className="text-sm text-blue-800">
            Our simulation system includes comprehensive safety checks, real-time monitoring, automatic abort
            mechanisms, and strict resource limits to ensure your systems remain stable during testing.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-4 mb-6">
          {[
            { id: "setup", label: "Setup", icon: "⚙️" },
            { id: "checks", label: "Safety Checks", icon: "🔍" },
            { id: "running", label: "Running", icon: "🎯" },
            { id: "results", label: "Results", icon: "📊" },
          ].map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentStep === step.id
                    ? "bg-[color:var(--accent)] text-black"
                    : i < ["setup", "checks", "running", "results"].indexOf(currentStep)
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {step.icon}
              </div>
              <span className="ml-2 text-sm font-medium">{step.label}</span>
              {i < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Setup */}
      {currentStep === "setup" && (
        <div className="space-y-4">
          {/* Environment Configuration */}
          <div className="doodle-border bg-white p-6">
            <h4 className="font-heading text-xl mb-4">Environment Configuration</h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={environment.isProduction}
                    onChange={(e) => setEnvironment((prev) => ({ ...prev, isProduction: e.target.checked }))}
                  />
                  <span className="text-sm">Production Environment</span>
                </label>
                <p className="text-xs opacity-70 ml-6">Check if this is a production system</p>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={environment.hasMonitoring}
                    onChange={(e) => setEnvironment((prev) => ({ ...prev, hasMonitoring: e.target.checked }))}
                  />
                  <span className="text-sm">Monitoring Systems Active</span>
                </label>
                <p className="text-xs opacity-70 ml-6">Required for safe simulation</p>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={environment.hasRollbackPlan}
                    onChange={(e) => setEnvironment((prev) => ({ ...prev, hasRollbackPlan: e.target.checked }))}
                  />
                  <span className="text-sm">Rollback Plan Ready</span>
                </label>
                <p className="text-xs opacity-70 ml-6">Recommended for production</p>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={environment.hasEmergencyContacts}
                    onChange={(e) => setEnvironment((prev) => ({ ...prev, hasEmergencyContacts: e.target.checked }))}
                  />
                  <span className="text-sm">Emergency Contacts Available</span>
                </label>
                <p className="text-xs opacity-70 ml-6">For manual intervention if needed</p>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-semibold mb-3">Resource Limits</h5>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Max Connections</label>
                  <input
                    type="number"
                    className="doodle-input w-full p-2"
                    value={environment.resourceLimits.maxConcurrentConnections}
                    onChange={(e) =>
                      setEnvironment((prev) => ({
                        ...prev,
                        resourceLimits: {
                          ...prev.resourceLimits,
                          maxConcurrentConnections: Number.parseInt(e.target.value) || 50,
                        },
                      }))
                    }
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Max Request Rate (req/s)</label>
                  <input
                    type="number"
                    className="doodle-input w-full p-2"
                    value={environment.resourceLimits.maxRequestRate}
                    onChange={(e) =>
                      setEnvironment((prev) => ({
                        ...prev,
                        resourceLimits: {
                          ...prev.resourceLimits,
                          maxRequestRate: Number.parseInt(e.target.value) || 25,
                        },
                      }))
                    }
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Max Duration (seconds)</label>
                  <input
                    type="number"
                    className="doodle-input w-full p-2"
                    value={environment.resourceLimits.maxDuration}
                    onChange={(e) =>
                      setEnvironment((prev) => ({
                        ...prev,
                        resourceLimits: { ...prev.resourceLimits, maxDuration: Number.parseInt(e.target.value) || 300 },
                      }))
                    }
                    min="30"
                    max="600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Selection */}
          <div className="doodle-border bg-white p-6">
            <h4 className="font-heading text-xl mb-4">Select Simulation Type</h4>

            <div className="grid gap-4 md:grid-cols-2">
              {simulations.map((sim) => (
                <div
                  key={sim.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedSimulation?.id === sim.id
                      ? "border-[color:var(--accent)] bg-[#FFF5BF]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedSimulation(sim)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold">{sim.name}</h5>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        sim.safetyLevel === "safe"
                          ? "bg-green-100 text-green-700"
                          : sim.safetyLevel === "moderate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sim.safetyLevel.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm opacity-70 mb-3">{sim.description}</p>

                  <div className="text-xs opacity-60">Duration: {sim.estimatedDuration}</div>
                </div>
              ))}
            </div>

            {selectedSimulation && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h6 className="font-semibold text-blue-900 mb-2">Requirements for {selectedSimulation.name}:</h6>
                <ul className="text-sm text-blue-800 space-y-1">
                  {selectedSimulation.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {selectedSimulation && (
            <div className="text-center">
              <button className="doodle-btn doodle-btn--accent" onClick={runSafetyChecks}>
                Run Safety Checks
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Safety Checks */}
      {currentStep === "checks" && (
        <div className="doodle-border bg-white p-6">
          <h4 className="font-heading text-xl mb-4">Pre-Flight Safety Checks</h4>

          <div className="space-y-3">
            {safetyChecks.map((check) => (
              <div key={check.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    check.status === "pass"
                      ? "bg-green-500"
                      : check.status === "warning"
                        ? "bg-yellow-500"
                        : check.status === "fail"
                          ? "bg-red-500"
                          : "bg-gray-500"
                  }`}
                >
                  {check.status === "pass"
                    ? "✓"
                    : check.status === "warning"
                      ? "⚠"
                      : check.status === "fail"
                        ? "✗"
                        : "?"}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h5 className="font-semibold">{check.name}</h5>
                    {check.required && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Required</span>
                    )}
                  </div>
                  <p className="text-sm opacity-70 mt-1">{check.message}</p>
                  {check.details && <p className="text-xs opacity-60 mt-2 bg-gray-50 p-2 rounded">{check.details}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3 justify-center">
            <button className="doodle-btn bg-white" onClick={resetSimulation}>
              Back to Setup
            </button>
            <button
              className={`doodle-btn ${
                safetyChecks.some((c) => c.status === "fail" && c.required)
                  ? "bg-gray-100 text-gray-500"
                  : "doodle-btn--accent"
              }`}
              onClick={runSimulation}
              disabled={safetyChecks.some((c) => c.status === "fail" && c.required) || isRunning}
            >
              {isRunning ? "Running Simulation..." : "Start Simulation"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Running */}
      {currentStep === "running" && (
        <div className="doodle-border bg-white p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="loader border-blue-500" />
          </div>
          <h4 className="font-heading text-xl mb-2">Running {selectedSimulation?.name}</h4>
          <p className="opacity-70 mb-4">
            Simulation is running with real-time safety monitoring. It will automatically abort if safety thresholds are
            exceeded.
          </p>
          <div className="text-sm opacity-60">Estimated duration: {selectedSimulation?.estimatedDuration}</div>
        </div>
      )}

      {/* Step 4: Results */}
      {currentStep === "results" && simulationResult && (
        <div className="space-y-4">
          {/* Results Overview */}
          <div className="doodle-border bg-white p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-heading text-xl">Simulation Results</h4>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    simulationResult.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : simulationResult.status === "aborted"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {simulationResult.status.toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    simulationResult.riskAssessment === "safe"
                      ? "bg-green-100 text-green-700"
                      : simulationResult.riskAssessment === "concerning"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {simulationResult.riskAssessment.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{simulationResult.safetyScore}/100</div>
                <div className="text-sm opacity-70">Safety Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{simulationResult.effectivenessScore}/100</div>
                <div className="text-sm opacity-70">Effectiveness Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {simulationResult.metrics.duration
                    ? `${(simulationResult.metrics.duration / 1000).toFixed(1)}s`
                    : "N/A"}
                </div>
                <div className="text-sm opacity-70">Duration</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div>
                <h5 className="font-semibold mb-2">Performance Metrics</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Requests Sent:</span>
                    <span>{simulationResult.metrics.requestsSent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Responses Received:</span>
                    <span>{simulationResult.metrics.responsesReceived}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate:</span>
                    <span>{(simulationResult.metrics.errorRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response Time:</span>
                    <span>{simulationResult.metrics.averageResponseTime.toFixed(0)}ms</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold mb-2">Defense Activations</h5>
                {simulationResult.metrics.defenseActivations.length > 0 ? (
                  <ul className="text-sm space-y-1">
                    {simulationResult.metrics.defenseActivations.map((defense, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        {defense}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm opacity-70">No defensive responses detected</p>
                )}
              </div>
            </div>

            {/* Findings */}
            {simulationResult.findings.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold mb-2">Key Findings</h5>
                <ul className="text-sm space-y-1">
                  {simulationResult.findings.map((finding, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {simulationResult.recommendations.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold mb-2">Recommendations</h5>
                <ul className="text-sm space-y-1">
                  {simulationResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Anomalies */}
            {simulationResult.metrics.anomaliesDetected.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Anomalies Detected</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {simulationResult.metrics.anomaliesDetected.map((anomaly, i) => (
                    <li key={i}>• {anomaly}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="text-center">
            <button className="doodle-btn doodle-btn--accent" onClick={resetSimulation}>
              Run Another Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
