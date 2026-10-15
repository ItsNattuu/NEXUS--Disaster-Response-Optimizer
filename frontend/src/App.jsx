import { useEffect, useMemo, useState } from "react";

import {

  Activity,

  Heart,

  MapPinned,

  Plus,

  RefreshCw,

  ShieldAlert,

  Trash2,

  Zap,

} from "lucide-react";

import DisasterMap from "./DisasterMap";

import "./App.css";

import DisasterSimulation from "./DisasterSimulation";
import RescueVillage from "./RescueVillage";

const API_URL = import.meta.env.VITE_API_URL;

const INITIAL_LOCATIONS = [

  { id: 0, name: "Central Supply", type: "supply", lat: 22.5726, lng: 88.3639 },

  { id: 1, name: "City Hospital", type: "hospital", lat: 22.58, lng: 88.37 },

  { id: 2, name: "Relief Shelter", type: "shelter", lat: 22.565, lng: 88.378 },

  { id: 3, name: "Affected Zone", type: "affected", lat: 22.558, lng: 88.355 },

];

const INITIAL_EDGES = [

  { id: 0, u: 0, v: 1, capacity: 10 },

  { id: 1, u: 0, v: 2, capacity: 8 },

  { id: 2, u: 1, v: 2, capacity: 6 },

  { id: 3, u: 1, v: 3, capacity: 5 },

  { id: 4, u: 2, v: 3, capacity: 8 },

];

function parseOutput(output = "") {

  const paths = [];

  let current = null;

  for (const line of output.split(/\r?\n/)) {

    const pathMatch = line.match(/Augmenting Path\s+(\d+):\s*(.+)/);

    if (pathMatch) {

      current = {

        iteration: Number(pathMatch[1]),

        path: pathMatch[2].trim(),

        bottleneck: null,

        totalFlow: null,

      };

      paths.push(current);

      continue;

    }

    const bottleneck = line.match(/Bottleneck capacity:\s*(\d+)/);

    if (bottleneck && current) {

      current.bottleneck = Number(bottleneck[1]);

    }

    const total = line.match(/Total flow so far:\s*(\d+)/);

    if (total && current) {

      current.totalFlow = Number(total[1]);

    }

  }

  const max = output.match(/Maximum flow:\s*(\d+)/);

  return {

    paths,

    maxFlow: max ? Number(max[1]) : null,

  };

}

function NetworkGraph({

  locations,

  edges,

  source,

  sink,

  onSelectNode,

  selectionMode,

  result,

}) {

  const positions = useMemo(() => {

    const count = Math.max(locations.length, 2);

    return Object.fromEntries(

      locations.map((node, index) => {

        const angle = (2 * Math.PI * index) / count - Math.PI / 2;

        return [

          node.id,

          {

            x: 250 + 185 * Math.cos(angle),

            y: 175 + 125 * Math.sin(angle),

          },

        ];

      })

    );

  }, [locations]);

  const activePairs = useMemo(() => {

    const pairs = new Set();

    (result?.paths || []).forEach((item) => {

      const ids = (item.path.match(/\d+/g) || []).map(Number);

      for (let i = 0; i < ids.length - 1; i++) {

        pairs.add(`${ids[i]}-${ids[i + 1]}`);

      }

    });

    return pairs;

  }, [result]);

  return (

    <div className="graph-wrap">

      <div className="section-top">

        <div>

          <span className="eyebrow">LIVE NETWORK MODEL</span>

          <h2>Your rescue network</h2>

        </div>

        <span className="live-pill">● LIVE</span>

      </div>

      <div className="graph-modes">

        <button

          type="button"

          className={selectionMode === "source" ? "mode active" : "mode"}

          onClick={() => onSelectNode(null, "source")}

        >

          <Heart size={14} /> Pick source

        </button>

        <button

          type="button"

          className={selectionMode === "sink" ? "mode active" : "mode"}

          onClick={() => onSelectNode(null, "sink")}

        >

          <ShieldAlert size={14} /> Pick destination

        </button>

        <span className="muted">Choose a mode, then click a node.</span>

      </div>

      <svg

        className="network-svg"

        viewBox="0 0 500 350"

        role="img"

        aria-label="Editable disaster response network"

      >

        <defs>

          <marker

            id="nexus-arrow"

            markerWidth="7"

            markerHeight="7"

            refX="5"

            refY="3"

            orient="auto"

          >

            <path d="M0,0 L6,3 L0,6 z" fill="#b58ba9" />

          </marker>

          <marker

            id="nexus-arrow-active"

            markerWidth="7"

            markerHeight="7"

            refX="5"

            refY="3"

            orient="auto"

          >

            <path d="M0,0 L6,3 L0,6 z" fill="#52b99c" />

          </marker>

        </defs>

        {edges.map((edge) => {

          const a = positions[edge.u];

          const b = positions[edge.v];

          if (!a || !b) return null;

          const dx = b.x - a.x;

          const dy = b.y - a.y;

          const length = Math.hypot(dx, dy) || 1;

          const sx = a.x + (dx / length) * 22;

          const sy = a.y + (dy / length) * 22;

          const ex = b.x - (dx / length) * 25;

          const ey = b.y - (dy / length) * 25;

          const active = activePairs.has(`${edge.u}-${edge.v}`);

          const mx = (sx + ex) / 2;

          const my = (sy + ey) / 2;

          return (

            <g key={edge.id}>

              <line

                x1={sx}

                y1={sy}

                x2={ex}

                y2={ey}

                stroke={active ? "#52b99c" : "#b58ba9"}

                strokeWidth={active ? 3 : 1.5}

                opacity={active ? 1 : 0.72}

                markerEnd={

                  active

                    ? "url(#nexus-arrow-active)"

                    : "url(#nexus-arrow)"

                }

              />

              <rect

                x={mx - 14}

                y={my - 9}

                width="28"

                height="18"

                rx="5"

                fill={active ? "#d7f8ed" : "#fff7fc"}

                stroke={active ? "#52b99c" : "#d9b6ce"}

              />

              <text

                x={mx}

                y={my + 4}

                textAnchor="middle"

                fontSize="10"

                fill="#653e5c"

              >

                {edge.capacity}

              </text>

            </g>

          );

        })}

        {locations.map((node) => {

          const position = positions[node.id];

          if (!position) return null;

          const isSource = node.id === source;

          const isSink = node.id === sink;

          return (

            <g

              key={node.id}

              role="button"

              tabIndex="0"

              className="graph-node"

              aria-label={`Select node ${node.id} as ${selectionMode}`}

              onClick={() => onSelectNode(node.id, selectionMode)}

              onKeyDown={(event) => {

                if (event.key === "Enter" || event.key === " ") {

                  event.preventDefault();

                  onSelectNode(node.id, selectionMode);

                }

              }}

            >

              <circle

                cx={position.x}

                cy={position.y}

                r={isSource || isSink ? 23 : 19}

                fill={

                  isSource

                    ? "#d6f7eb"

                    : isSink

                      ? "#ffe0e9"

                      : "#fff8fd"

                }

                stroke={

                  isSource

                    ? "#52b99c"

                    : isSink

                      ? "#e68aa8"

                      : "#b58ba9"

                }

                strokeWidth="2"

              />

              <text

                x={position.x}

                y={position.y + 4}

                textAnchor="middle"

                fontSize="12"

                fontWeight="800"

                fill="#643d5b"

              >

                {node.id}

              </text>

              {(isSource || isSink) && (

                <text

                  x={position.x}

                  y={position.y + 35}

                  textAnchor="middle"

                  fontSize="8"

                  fontWeight="800"

                  fill={isSource ? "#27876c" : "#c15d7e"}

                >

                  {isSource ? "SOURCE" : "DESTINATION"}

                </text>

              )}

            </g>

          );

        })}

      </svg>

      <div className="legend">

        <span><i className="dot source-dot" /> Source</span>

        <span><i className="dot sink-dot" /> Destination</span>

        <span><i className="dot route-dot" /> Augmenting path</span>

      </div>

    </div>

  );

}

function CityIllustration() {

  return (

    <div className="hero-art storybook-art" aria-label="A whimsical pastel rescue village">

      <div className="storybook-sun"><span>✦</span></div>

      <div className="storybook-cloud cloud-one" />

      <div className="storybook-cloud cloud-two" />

      <div className="storybook-cloud cloud-three" />

      <div className="storybook-sparkles" aria-hidden="true">

        <span>✧</span>

        <span>♡</span>

        <span>✦</span>

        <span>✿</span>

        <span>✧</span>

      </div>

      <div className="storybook-hill hill-back" />

      <div className="storybook-hill hill-front" />

      <div className="storybook-flower-garden garden-left" aria-hidden="true">

        <span>🌷</span><span>🌼</span><span>🌸</span><span>🌷</span>

      </div>

      <div className="storybook-flower-garden garden-right" aria-hidden="true">

        <span>🌼</span><span>🌸</span><span>🌷</span>

      </div>

      <div className="storybook-cottage cottage-pink">

        <div className="cottage-roof" />

        <div className="cottage-window">♡</div>

        <div className="cottage-door" />

        <div className="cottage-flower">✿</div>

      </div>

      <div className="storybook-cottage cottage-peach">

        <div className="cottage-roof" />

        <div className="cottage-window">♡</div>

        <div className="cottage-door" />

        <div className="cottage-flower">✿</div>

      </div>

      <div className="storybook-cottage cottage-lilac">

        <div className="cottage-roof" />

        <div className="cottage-window">♡</div>

        <div className="cottage-door" />

        <div className="cottage-flower">✿</div>

      </div>

      <div className="storybook-hospital">

        <div className="hospital-roof">♡</div>

        <div className="hospital-cross">✚</div>

        <div className="hospital-window" />

        <div className="hospital-window second-window" />

        <div className="hospital-door" />

        <div className="hospital-sign">little care clinic</div>

      </div>

      <div className="storybook-road">

        <div className="storybook-road-line" />

      </div>

      <div className="storybook-pond">

        <span>♡</span>

        <i>✧</i>

      </div>

      <div className="storybook-van">

        <span className="van-heart">♥</span>

        <span className="van-cross">✚</span>

        <span className="van-wheel wheel-left" />

        <span className="van-wheel wheel-right" />

      </div>

      <div className="storybook-caption">

        <span>♡</span> a little village full of hope <span>♡</span>

      </div>

      <div className="storybook-bottom-note">

        made with love, delivered with care

      </div>

    </div>

  );

}

export default function App() {

  const [locations, setLocations] = useState(INITIAL_LOCATIONS);

  const [edges, setEdges] = useState(INITIAL_EDGES);

  const [source, setSource] = useState(0);

  const [sink, setSink] = useState(3);

  const [selectionMode, setSelectionMode] = useState("source");

  const [newU, setNewU] = useState("0");

  const [newV, setNewV] = useState("1");

  const [newCapacity, setNewCapacity] = useState("5");

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [apiOnline, setApiOnline] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  const parsed = useMemo(

    () =>

      result

        ? parseOutput(result.output)

        : { paths: [], maxFlow: null },

    [result]

  );

  useEffect(() => {

    let cancelled = false;

    fetch(`${API_URL}/health`)

      .then((response) => {

        if (!response.ok) throw new Error("Backend unavailable");

        return response.json();

      })

      .then((data) => {

        if (!cancelled) setApiOnline(Boolean(data.executable_exists));

      })

      .catch(() => {

        if (!cancelled) setApiOnline(false);

      });

    return () => {

      cancelled = true;

    };

  }, []);

  function invalidate() {

    setResult(null);

    setError("");

  }

  function selectNode(id, mode = selectionMode) {

    if (id === null) {

      setSelectionMode(mode);

      return;

    }

    if (mode === "source") {

      if (id === sink) {

        setError("Source and destination must be different.");

        return;

      }

      setSource(id);

    } else {

      if (id === source) {

        setError("Source and destination must be different.");

        return;

      }

      setSink(id);

    }

    setSelectionMode(mode);

    invalidate();

  }

  function changeNodeCount(value) {

    const count = Number(value);

    if (!Number.isInteger(count) || count < 2 || count > 20) {

      setError("Choose between 2 and 20 locations.");

      return;

    }

    setLocations((old) => {

      const next = old.filter((node) => node.id < count);

      for (let id = 0; id < count; id++) {

        if (!next.some((node) => node.id === id)) {

          next.push({

            id,

            name: `Response Point ${id}`,

            type: "shelter",

            lat: 22.5726 + (id % 5) * 0.003,

            lng: 88.3639 + (id % 7) * 0.003,

          });

        }

      }

      return next.sort((a, b) => a.id - b.id);

    });

    setEdges((old) =>

      old

        .filter((edge) => edge.u < count && edge.v < count)

        .map((edge, id) => ({ ...edge, id }))

    );

    const nextSource = Math.min(source, count - 1);

    const nextSink = Math.min(sink, count - 1);

    setSource(nextSource);

    setSink(nextSink === nextSource ? (nextSource === 0 ? 1 : 0) : nextSink);

    setNewU("0");

    setNewV(String(Math.min(1, count - 1)));

    invalidate();

  }

  function addEdge(event) {

    event.preventDefault();

    const u = Number(newU);

    const v = Number(newV);

    const capacity = Number(newCapacity);

    if (u === v) {

      setError("Choose two different locations.");

      return;

    }

    if (

      !locations.some((node) => node.id === u) ||

      !locations.some((node) => node.id === v)

    ) {

      setError("Both endpoints must exist.");

      return;

    }

    if (

      !Number.isInteger(capacity) ||

      capacity < 1 ||

      capacity > 500000000

    ) {

      setError("Capacity must be a whole number from 1 to 500,000,000.");

      return;

    }

    setEdges((old) => [

      ...old,

      {

        id: old.reduce((max, edge) => Math.max(max, edge.id), -1) + 1,

        u,

        v,

        capacity,

      },

    ]);

    invalidate();

  }

  function updateEdge(id, field, value) {

    const number = Number(value);

    setEdges((old) =>

      old.map((edge) =>

        edge.id === id ? { ...edge, [field]: number } : edge

      )

    );

    invalidate();

  }

  async function calculateFlow(event) {

    event?.preventDefault?.();

    setError("");

    setResult(null);

    if (locations.length < 2) {

      setError("Add at least two locations.");

      return;

    }

    if (source === sink) {

      setError("Source and destination must be different.");

      return;

    }

    if (!edges.length) {

      setError("Add at least one road connection.");

      return;

    }

    const invalidEdge = edges.some(

      (edge) =>

        !Number.isInteger(edge.capacity) ||

        edge.capacity < 1 ||

        edge.capacity > 500000000 ||

        !locations.some((node) => node.id === edge.u) ||

        !locations.some((node) => node.id === edge.v)

    );

    if (invalidEdge) {

      setError("Fix invalid road capacities or endpoints first.");

      return;

    }

    const ordered = [...locations].sort((a, b) => a.id - b.id);

    const index = new Map(ordered.map((node, i) => [node.id, i]));

    setLoading(true);

    try {

      const response = await fetch(`${API_URL}/max-flow`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          source: index.get(source),

          sink: index.get(sink),

          node_count: ordered.length,

          edges: edges.map((edge) => ({

            u: index.get(edge.u),

            v: index.get(edge.v),

            capacity: edge.capacity,

          })),

        }),

      });

      const data = await response.json();

      if (!response.ok) {

        throw new Error(

          typeof data.detail === "string"

            ? data.detail

            : JSON.stringify(data.detail || data)

        );

      }

      setResult({

        ...data,

        sourceName: locations.find((node) => node.id === source)?.name,

        sinkName: locations.find((node) => node.id === sink)?.name,

        nodeMapping: ordered.map((node, i) => ({

          node: i,

          locationId: node.id,

          name: node.name,

        })),

      });

    } catch (err) {

      setError(

        `${err.message || "Could not calculate flow"}. Confirm the NEXUS backend is running on port 8000.`

      );

    } finally {

      setLoading(false);

    }

  }

  function resetAll() {

    setLocations(INITIAL_LOCATIONS);

    setEdges(INITIAL_EDGES);

    setSource(0);

    setSink(3);

    setSelectionMode("source");

    setResult(null);

    setError("");

    setNewU("0");

    setNewV("1");

    setNewCapacity("5");

  }

  return (

    <main className="app-shell">

      <header className="topbar">

        <div className="brand-mark">N<span>✦</span></div>

        <div className="brand-copy">

          <strong>NEXUS</strong>

          <small>DISASTERFLOW · RESPONSE PLANNER</small>

        </div>

        <div className={`status-pill ${apiOnline ? "online" : "offline"}`}>

          <span />

          {apiOnline ? "Algorithm online" : "Backend offline"}

        </div>

      </header>

      <section className="hero">

        <div className="hero-copy">

          <span className="eyebrow">A LITTLE HOPE, A LOT OF FLOW ♡</span>

          <h1>

            Every road can

            <br />

            <em>carry hope.</em>

          </h1>

          <p>

            Design a disaster-response network, connect emergency locations,

            and use Edmonds–Karp to find the maximum amount of aid that can

            reach safety.

          </p>

          <button

            className="primary-button"

            onClick={calculateFlow}

            disabled={loading}

          >

            <Zap size={16} />

            {loading ? "Calculating…" : "Calculate rescue flow"}

          </button>

        </div>

        <CityIllustration />

      </section>

      <section className="metrics-grid">

        <article className="metric-card">

          <span className="metric-icon pink"><MapPinned size={18} /></span>

          <div>

            <small>LOCATIONS</small>

            <strong>{locations.length}</strong>

          </div>

        </article>

        <article className="metric-card">

          <span className="metric-icon lilac"><Activity size={18} /></span>

          <div>

            <small>ROAD CONNECTIONS</small>

            <strong>{edges.length}</strong>

          </div>

        </article>

        <article className="metric-card">

          <span className="metric-icon mint"><Zap size={18} /></span>

          <div>

            <small>MAXIMUM FLOW</small>

            <strong>{parsed.maxFlow ?? "—"}</strong>

          </div>

        </article>

        <article className="metric-card">

          <span className="metric-icon peach"><Heart size={18} /></span>

          <div>

            <small>ALGORITHM</small>

            <strong className="algorithm-label">Edmonds–Karp</strong>

          </div>

        </article>

      </section>

      <section className="workspace-grid">

        <div className="panel graph-panel">

          <NetworkGraph

            locations={locations}

            edges={edges}

            source={source}

            sink={sink}

            selectionMode={selectionMode}

            onSelectNode={selectNode}

            result={parsed}

          />

          <div className="panel-divider" />

          <div className="editor-heading">

            <div>

              <span className="eyebrow">NETWORK SETTINGS</span>

              <h3>Shape your network</h3>

            </div>

            <button

              className="icon-button"

              onClick={resetAll}

              title="Reset network"

              type="button"

            >

              <RefreshCw size={16} />

            </button>

          </div>

          <label className="field-label">

            Number of locations <span>{locations.length} nodes</span>

          </label>

          <input

            className="range-input"

            type="range"

            min="2"

            max="20"

            value={locations.length}

            onChange={(event) => changeNodeCount(event.target.value)}

          />

          <div className="range-labels">

            <span>2 locations</span>

            <span>20 locations</span>

          </div>

          <div className="select-grid">

            <label className="field-label">

              Source location

              <select

                value={source}

                onChange={(event) =>

                  selectNode(Number(event.target.value), "source")

                }

              >

                {locations.map((node) => (

                  <option key={node.id} value={node.id}>

                    {node.id} · {node.name}

                  </option>

                ))}

              </select>

            </label>

            <label className="field-label">

              Destination

              <select

                value={sink}

                onChange={(event) =>

                  selectNode(Number(event.target.value), "sink")

                }

              >

                {locations.map((node) => (

                  <option key={node.id} value={node.id}>

                    {node.id} · {node.name}

                  </option>

                ))}

              </select>

            </label>

          </div>

          <form className="add-road-form" onSubmit={addEdge}>

            <h4><Plus size={15} /> Add a directed road</h4>

            <div className="road-form-grid">

              <label>

                From

                <select

                  value={newU}

                  onChange={(event) => setNewU(event.target.value)}

                >

                  {locations.map((node) => (

                    <option key={node.id} value={node.id}>

                      {node.id} · {node.name}

                    </option>

                  ))}

                </select>

              </label>

              <label>

                To

                <select

                  value={newV}

                  onChange={(event) => setNewV(event.target.value)}

                >

                  {locations.map((node) => (

                    <option key={node.id} value={node.id}>

                      {node.id} · {node.name}

                    </option>

                  ))}

                </select>

              </label>

              <label>

                Capacity

                <input

                  type="number"

                  min="1"

                  max="500000000"

                  value={newCapacity}

                  onChange={(event) => setNewCapacity(event.target.value)}

                  required

                />

              </label>

              <button className="small-primary" type="submit">

                <Plus size={14} /> Add

              </button>

            </div>

            <p className="helper-text">

              Roads are directed. Add a second road if aid must travel in both directions.

            </p>

          </form>

          <div className="roads-list-heading">

            <h4>Road connections</h4>

            <span>{edges.length} roads</span>

          </div>

          <div className="roads-list">

            {edges.map((edge) => (

              <div className="road-row" key={edge.id}>

                <div className="road-route">

                  <b>{edge.u}</b>

                  <span>→</span>

                  <b>{edge.v}</b>

                </div>

                <div className="road-capacity">

                  <input

                    aria-label={`Capacity of road ${edge.u} to ${edge.v}`}

                    type="number"

                    min="1"

                    max="500000000"

                    value={edge.capacity}

                    onChange={(event) =>

                      updateEdge(

                        edge.id,

                        "capacity",

                        event.target.value === "" ? 0 : Number(event.target.value)

                      )

                    }

                  />

                  <small>units</small>

                </div>

                <button

                  className="delete-button"

                  title="Delete road"

                  type="button"

                  onClick={() => {

                    setEdges((old) => old.filter((item) => item.id !== edge.id));

                    invalidate();

                  }}

                >

                  <Trash2 size={15} />

                </button>

              </div>

            ))}

            {edges.length === 0 && (

              <p className="empty-note">

                No roads yet. Add a road to connect your locations.

              </p>

            )}

          </div>

        </div>

        <div className="right-column">

          <section className="panel map-panel">

            <div className="section-top">

              <div>

                <span className="eyebrow">YOUR RESCUE WORLD ♡</span>

                <h2>Map your city</h2>

              </div>

              <span className="soft-badge">KOLKATA</span>

            </div>

            <p className="section-description">

              Place a location on the map. Locations and roads here are shared

              with the graph and flow calculation.

            </p>

            <DisasterMap

              locations={locations}

              setLocations={setLocations}

              edges={edges}

              setEdges={setEdges}

              source={source}

              sink={sink}

              setSource={setSource}

              setSink={setSink}

              onChange={invalidate}

            />

          </section>

          <section className="panel results-panel">

            <div className="section-top">

              <div>

                <span className="eyebrow">ALGORITHM TRACE</span>

                <h2>Flow results</h2>

              </div>

              <span className="result-icon"><Activity size={17} /></span>

            </div>

            {!result && !loading && (

              <div className="results-empty">

                <div className="empty-heart">♡</div>

                <strong>Your rescue story starts here.</strong>

                <p>

                  Run the calculation to see augmenting paths, bottleneck

                  capacities, and the maximum flow.

                </p>

              </div>

            )}

            {loading && (

              <div className="results-empty">

                <div className="spinner">✦</div>

                <strong>Finding the best flow…</strong>

                <p>Edmonds–Karp is searching the residual network.</p>

              </div>

            )}

            {result && (

              <div className="result-summary">

                <small>MAXIMUM FLOW</small>

                <div className="flow-number">

                  {parsed.maxFlow ?? result.max_flow ?? "—"}

                  <span> units</span>

                </div>

                <p>{result.sourceName} → {result.sinkName}</p>

                <div className="result-stats">

                  <span>{parsed.paths.length} augmenting paths</span>

                  <span>{result.edge_count ?? edges.length} directed roads</span>

                </div>

              </div>

            )}

            {parsed.paths.length > 0 && (

              <div className="trace-list">

                {parsed.paths.map((path) => (

                  <article className="trace-item" key={path.iteration}>

                    <div className="trace-head">

                      <span>PATH {path.iteration}</span>

                      <b>+{path.bottleneck ?? "?"} units</b>

                    </div>

                    <div className="trace-path">{path.path}</div>

                    <div className="trace-foot">

                      Total flow so far <strong>{path.totalFlow ?? "—"}</strong>

                    </div>

                  </article>

                ))}

              </div>

            )}

            {result && (

              <details className="raw-output">

                <summary>View complete C algorithm output</summary>

                <pre>{result.output}</pre>

              </details>

            )}

          </section>

        </div>

      </section>

      <section className="simulation-full-width">
        <DisasterSimulation
          locations={locations}
          edges={edges}
          source={source}
          sink={sink}
          onSimulationComplete={setSimulationResult}
        />
      </section>

      {error && (

        <div className="error-toast" role="alert">

          <strong>Oops!</strong> {error}

          <button type="button" onClick={() => setError("")}>×</button>

        </div>

      )}

      <footer>

        Made with care for safer cities <span>♡</span>

        <small>NEXUS · MAX-FLOW DISASTER RESPONSE</small>

      </footer>

    </main>

  );

}


