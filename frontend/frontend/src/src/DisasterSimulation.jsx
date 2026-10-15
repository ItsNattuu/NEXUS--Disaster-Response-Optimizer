import { useState } from "react";
import { AlertTriangle, Zap } from "lucide-react";
import "./DisasterSimulation.css";

const SCENARIOS = [
  { value: "flood", label: "Urban Flooding", target: "location" },
  { value: "blocked_road", label: "Blocked Road", target: "edge" },
  { value: "bridge_damage", label: "Bridge Damage", target: "edge" },
  { value: "hospital_overload", label: "Hospital Overload", target: "hospital" },
  { value: "supply_shortage", label: "Supply Shortage", target: "supply" },
];

export default function DisasterSimulation({ locations = [], edges = [], source, sink, onSimulationComplete }) {
  const [scenario, setScenario] = useState("blocked_road");
  const [targetId, setTargetId] = useState("");
  const [reduction, setReduction] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const selected = SCENARIOS.find((item) => item.value === scenario);
  const targets = selected?.target === "edge"
    ? edges.map((edge) => ({ id: edge.id, label: `Road ${edge.id}: ${locations.find((x) => x.id === edge.u)?.name ?? edge.u} → ${locations.find((x) => x.id === edge.v)?.name ?? edge.v} (${edge.capacity})` }))
    : locations.filter((loc) => selected?.target === "hospital" ? loc.type === "hospital" : selected?.target === "supply" ? loc.type === "supply" : true).map((loc) => ({ id: loc.id, label: `${loc.name} (${loc.type})` }));

  async function runSimulation() {
    setError(""); setResult(null); onSimulationComplete?.(null);
    if (targetId === "") { setError("Choose a location or road first."); return; }
    if (source === sink) { setError("Source and destination must differ."); return; }
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/simulate-and-calculate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disaster_type: scenario,
          locations,
          edges: edges.map((edge, i) => ({
            ...edge,
            id: edge.id ?? i,
          })),
          target_id: Number(targetId),
          source: Number(source),
          sink: Number(sink),
        }),
      })
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail ?? data));
      setResult(data); onSimulationComplete?.(data);
    } catch (e) { setError(`${e.message}. Check that the backend is running on port 8000.`); }
    finally { setLoading(false); }
  }

  return <section className="disaster-simulation">
    <div className="simulation-heading"><AlertTriangle size={22} /><div><h2>Disaster Impact Simulator</h2><p>Compare rescue capacity before and after a hypothetical disaster.</p></div></div>
    <div className="simulation-form">
      <label>Disaster scenario<select value={scenario} onChange={(e) => { setScenario(e.target.value); setTargetId(""); setResult(null); onSimulationComplete?.(null); }}>
        {SCENARIOS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select></label>
      <label>{selected?.target === "edge" ? "Select road" : "Select location"}<select value={targetId} onChange={(e) => setTargetId(e.target.value)}><option value="">Choose target</option>{targets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      {!["blocked_road", "bridge_damage"].includes(scenario) && <label>Capacity reduction: {reduction}%<input type="range" min="10" max="100" step="10" value={reduction} onChange={(e) => setReduction(Number(e.target.value))} /></label>}
      <button type="button" onClick={runSimulation} disabled={loading || !targets.length}><Zap size={16} />{loading ? "Calculating…" : "Simulate Disaster"}</button>
    </div>
    {error && <p className="simulation-error" role="alert">{error}</p>}
    {result?.comparison && <div className="simulation-results"><h3>{result.disaster?.name}</h3><div className="simulation-metrics">
      <div><span>Before disaster</span><strong>{result.comparison.before_max_flow}</strong></div>
      <div><span>After disaster</span><strong>{result.comparison.after_max_flow}</strong></div>
      <div><span>Flow lost</span><strong>{result.comparison.flow_lost}</strong><small>{result.comparison.reduction_percent}% reduction</small></div>
    </div><p className="simulation-note">Affected roads are highlighted on the map. This is a hypothetical simulation, not a live disaster prediction.</p><button type="button" onClick={() => { setResult(null); onSimulationComplete?.(null); }}>Reset simulation display</button></div>}
  </section>;
}
