"use client"

import { useState } from "react"
import type { IncidentPlaybook, AttackSimulation } from "@/lib/incident-response"
import {
  INCIDENT_PLAYBOOKS,
  DEFAULT_EMERGENCY_CONTACTS,
  ATTACK_SIMULATIONS,
  generateMitigationSuggestions,
} from "@/lib/incident-response"

interface IncidentResponseProps {
  domain: string
  currentProtections: string[]
}

export default function IncidentResponseDashboard({ domain, currentProtections }: IncidentResponseProps) {
  const [activeTab, setActiveTab] = useState<"playbooks" | "contacts" | "simulation" | "mitigation">("playbooks")
  const [selectedPlaybook, setSelectedPlaybook] = useState<IncidentPlaybook | null>(null)
  const [simulationRunning, setSimulationRunning] = useState<string | null>(null)
  const [activeIncident, setActiveIncident] = useState<{
    type: string
    severity: string
    startTime: Date
  } | null>(null)

  const runSimulation = async (simulation: AttackSimulation) => {
    setSimulationRunning(simulation.id)

    // Simulate attack test
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setSimulationRunning(null)
    alert(`${simulation.name} completed successfully! Your defenses held up well.`)
  }

  const startIncidentResponse = (type: string, severity: string) => {
    setActiveIncident({
      type,
      severity,
      startTime: new Date(),
    })
    setActiveTab("mitigation")
  }

  const mitigationSuggestions = activeIncident
    ? generateMitigationSuggestions(activeIncident.type, activeIncident.severity, currentProtections)
    : []

  return (
    <div className="space-y-6">
      {/* Emergency Alert Banner */}
      {activeIncident && (
        <div className="doodle-border bg-red-50 border-red-200 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <h3 className="font-heading text-xl text-red-800">Active Incident</h3>
              <p className="text-red-700">
                {activeIncident.type} attack detected at {activeIncident.startTime.toLocaleTimeString()}
              </p>
            </div>
            <button className="doodle-btn bg-red-100 text-red-800 ml-auto" onClick={() => setActiveIncident(null)}>
              Resolve
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="doodle-border bg-white p-1 flex">
        {[
          { id: "playbooks", label: "📋 Playbooks", desc: "Step-by-step response guides" },
          { id: "contacts", label: "📞 Emergency Contacts", desc: "Quick access to providers" },
          { id: "simulation", label: "🎯 Attack Simulation", desc: "Test your defenses safely" },
          { id: "mitigation", label: "🛡️ Live Mitigation", desc: "Real-time attack response" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 p-3 text-left ${
              activeTab === tab.id ? "bg-[color:var(--accent)]" : "bg-transparent hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <div className="font-semibold">{tab.label}</div>
            <div className="text-xs opacity-70">{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* Playbooks Tab */}
      {activeTab === "playbooks" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-2xl">Incident Response Playbooks</h3>
            <button
              className="doodle-btn bg-red-100 text-red-800"
              onClick={() => startIncidentResponse("l7_http", "high")}
            >
              🚨 Report Active Attack
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {INCIDENT_PLAYBOOKS.map((playbook) => (
              <div key={playbook.id} className="doodle-border bg-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-heading text-lg">{playbook.title}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      playbook.severity === "critical"
                        ? "bg-red-100 text-red-700"
                        : playbook.severity === "high"
                          ? "bg-orange-100 text-orange-700"
                          : playbook.severity === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {playbook.severity.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm opacity-70 mb-3">Estimated time: {playbook.estimatedTime}</p>

                <div className="space-y-2 mb-4">
                  {playbook.steps.slice(0, 2).map((step) => (
                    <div key={step.id} className="text-sm">
                      <span className="font-semibold">{step.title}:</span> {step.description}
                    </div>
                  ))}
                  {playbook.steps.length > 2 && (
                    <div className="text-sm opacity-70">+{playbook.steps.length - 2} more steps...</div>
                  )}
                </div>

                <button className="doodle-btn bg-white w-full" onClick={() => setSelectedPlaybook(playbook)}>
                  View Full Playbook
                </button>
              </div>
            ))}
          </div>

          {/* Playbook Modal */}
          {selectedPlaybook && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
              <div className="doodle-border bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-heading text-2xl">{selectedPlaybook.title}</h3>
                  <button className="doodle-btn bg-white px-3 py-1" onClick={() => setSelectedPlaybook(null)}>
                    Close
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedPlaybook.steps.map((step, index) => (
                    <div key={step.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                            step.priority === "immediate"
                              ? "bg-red-500"
                              : step.priority === "urgent"
                                ? "bg-orange-500"
                                : "bg-blue-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{step.title}</h4>
                          <p className="text-sm opacity-70 mt-1">{step.description}</p>
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <strong>Action:</strong> {step.action}
                          </div>
                          <div className="mt-2 text-xs opacity-60">
                            Estimated time: {step.timeEstimate} • Priority: {step.priority}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Emergency Contacts Tab */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          <h3 className="font-heading text-2xl">Emergency Contacts</h3>

          <div className="grid gap-4 md:grid-cols-2">
            {DEFAULT_EMERGENCY_CONTACTS.map((contact) => (
              <div key={contact.id} className="doodle-border bg-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-heading text-lg">{contact.name}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      contact.available24x7 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {contact.available24x7 ? "24/7" : "Business Hours"}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Type:</strong> {contact.type}
                  </div>
                  <div>
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${contact.phone}`} className="underline">
                      {contact.phone}
                    </a>
                  </div>
                  <div>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${contact.email}`} className="underline">
                      {contact.email}
                    </a>
                  </div>
                  {contact.website && (
                    <div>
                      <strong>Website:</strong>{" "}
                      <a href={contact.website} target="_blank" rel="noopener noreferrer" className="underline">
                        Support Portal
                      </a>
                    </div>
                  )}
                  {contact.notes && <div className="text-xs opacity-70 mt-2">{contact.notes}</div>}
                </div>

                <div className="flex gap-2 mt-4">
                  <a
                    href={`tel:${contact.phone}`}
                    className="doodle-btn bg-green-100 text-green-800 flex-1 text-center"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="doodle-btn bg-blue-100 text-blue-800 flex-1 text-center"
                  >
                    ✉️ Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attack Simulation Tab */}
      {activeTab === "simulation" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-2xl">Attack Simulation</h3>
            <div className="text-sm opacity-70">Safe testing of your defenses</div>
          </div>

          <div className="doodle-border bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900 mb-2">⚠️ Safety Notice</h4>
            <p className="text-sm text-blue-800">
              These simulations are designed to be safe and non-disruptive. They test your defenses without causing
              actual downtime. Always coordinate with your team before running simulations.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {ATTACK_SIMULATIONS.map((simulation) => (
              <div key={simulation.id} className="doodle-border bg-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-heading text-lg">{simulation.name}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      simulation.safetyLevel === "safe"
                        ? "bg-green-100 text-green-700"
                        : simulation.safetyLevel === "moderate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {simulation.safetyLevel.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm opacity-70 mb-3">{simulation.description}</p>

                <div className="text-sm mb-3">
                  <strong>Duration:</strong> {simulation.estimatedDuration}
                </div>

                <div className="mb-4">
                  <strong className="text-sm">Requirements:</strong>
                  <ul className="text-sm mt-1 space-y-1">
                    {simulation.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`doodle-btn w-full ${
                    simulationRunning === simulation.id ? "bg-gray-100 text-gray-600" : "doodle-btn--accent"
                  }`}
                  onClick={() => runSimulation(simulation)}
                  disabled={simulationRunning === simulation.id}
                >
                  {simulationRunning === simulation.id ? "Running..." : "Start Simulation"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Mitigation Tab */}
      {activeTab === "mitigation" && (
        <div className="space-y-4">
          <h3 className="font-heading text-2xl">Live Mitigation Suggestions</h3>

          {!activeIncident ? (
            <div className="doodle-border bg-white p-6 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h4 className="font-heading text-xl mb-2">No Active Incidents</h4>
              <p className="opacity-70 mb-4">
                When an attack is detected, this section will provide real-time mitigation suggestions.
              </p>
              <button
                className="doodle-btn bg-red-100 text-red-800"
                onClick={() => startIncidentResponse("l7_http", "high")}
              >
                Simulate Active Attack
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="doodle-border bg-red-50 p-4">
                <h4 className="font-heading text-xl text-red-800 mb-2">
                  Active {activeIncident.type.replace("_", " ").toUpperCase()} Attack
                </h4>
                <p className="text-red-700">
                  Attack started at {activeIncident.startTime.toLocaleTimeString()} • Duration:{" "}
                  {Math.floor((Date.now() - activeIncident.startTime.getTime()) / 1000)} seconds
                </p>
              </div>

              <div className="space-y-3">
                {mitigationSuggestions.map((suggestion, index) => (
                  <div key={suggestion.id} className="doodle-border bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          suggestion.urgency === "immediate"
                            ? "bg-red-500"
                            : suggestion.urgency === "urgent"
                              ? "bg-orange-500"
                              : "bg-blue-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{suggestion.title}</h4>
                          <div className="flex gap-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                suggestion.effectiveness === "high"
                                  ? "bg-green-100 text-green-700"
                                  : suggestion.effectiveness === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {suggestion.effectiveness} effectiveness
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                              {suggestion.estimatedTime}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm opacity-70 mb-3">{suggestion.description}</p>

                        <div className="bg-gray-50 rounded p-3">
                          <strong className="text-sm">Steps:</strong>
                          <ol className="text-sm mt-2 space-y-1">
                            {suggestion.steps.map((step, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="font-semibold">{i + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
