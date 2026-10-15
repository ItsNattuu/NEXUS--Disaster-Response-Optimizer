
import re
import subprocess
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.simulation import simulate_disaster


app = FastAPI(
    title="NEXUS Disaster Response API",
    description="Disaster simulation and Edmonds-Karp maximum-flow analysis",
    version="2.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT = Path(__file__).resolve().parent.parent
EXECUTABLE = ROOT / "nexus.exe"


class Edge(BaseModel):
    id: int = 0
    u: int
    v: int
    capacity: int = Field(ge=0)


class Location(BaseModel):
    id: int
    name: str
    type: str = "location"
    lat: float | None = None
    lng: float | None = None


class MaxFlowRequest(BaseModel):
    source: int
    sink: int
    node_count: int
    edges: list[Edge]


class SimulationRequest(BaseModel):
    locations: list[Location]
    edges: list[Edge]
    disaster_type: str
    target_id: int | None = None
    reduction: float = Field(default=0.5, ge=0, le=1)


class CompareRequest(SimulationRequest):
    source: int
    sink: int


def validate_edges(edges, node_count):
    if node_count < 2 or node_count > 2000:
        raise HTTPException(
            status_code=400,
            detail="Node count must be between 2 and 2000.",
        )

    if len(edges) > 20000:
        raise HTTPException(
            status_code=400,
            detail="Maximum 20000 roads are supported.",
        )

    for edge in edges:
        if not (0 <= edge["u"] < node_count):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid starting node on road {edge['id']}.",
            )

        if not (0 <= edge["v"] < node_count):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid ending node on road {edge['id']}.",
            )

        if edge["u"] == edge["v"]:
            raise HTTPException(
                status_code=400,
                detail=f"Road {edge['id']} cannot connect a node to itself.",
            )

        if not (0 <= edge["capacity"] <= 500000000):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid capacity on road {edge['id']}.",
            )


def calculate_flow(source, sink, node_count, edges):
    if not EXECUTABLE.exists():
        raise HTTPException(
            status_code=500,
            detail=f"C executable not found: {EXECUTABLE}",
        )

    if not (0 <= source < node_count and 0 <= sink < node_count):
        raise HTTPException(
            status_code=400,
            detail="Invalid source or destination.",
        )

    if source == sink:
        raise HTTPException(
            status_code=400,
            detail="Source and destination must be different.",
        )

    validate_edges(edges, node_count)

    # The C program rejects zero-capacity edges.
    # Excluding them models blocked roads correctly.
    active_edges = [
        edge for edge in edges
        if int(edge["capacity"]) > 0
    ]

    # YOUR C PROGRAM EXPECTS PLAIN TEXT, NOT JSON:
    # n m source sink
    # u v capacity
    # u v capacity
    input_lines = [
        f"{node_count} {len(active_edges)} {source} {sink}"
    ]

    for edge in active_edges:
        input_lines.append(
            f"{int(edge['u'])} {int(edge['v'])} "
            f"{int(edge['capacity'])}"
        )

    input_text = "\n".join(input_lines) + "\n"

    try:
        process = subprocess.run(
            [str(EXECUTABLE)],
            input=input_text,
            capture_output=True,
            text=True,
            cwd=str(ROOT),
            timeout=15,
            check=False,
        )

    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=504,
            detail="Max-flow calculation timed out.",
        )

    except OSError as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not execute nexus.exe: {error}",
        )

    if process.returncode != 0:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "The C program failed.",
                "return_code": process.returncode,
                "stderr": process.stderr,
                "stdout": process.stdout,
            },
        )

    output = process.stdout.strip()

    # Your C program prints: Maximum flow: 13
    match = re.search(
        r"Maximum flow:\s*(\d+)",
        output,
    )

    if not match:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Could not parse maximum flow from C output.",
                "output": output,
            },
        )

    return {
        "output": output,
        "max_flow": int(match.group(1)),
        "edge_count": len(active_edges),
    }


def get_flow_value(result):
    return result["max_flow"]


def map_edges_to_indices(edges, index_by_id):
    mapped = []

    for edge in edges:
        if edge["u"] not in index_by_id or edge["v"] not in index_by_id:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid location reference on road {edge['id']}.",
            )

        mapped.append({
            **edge,
            "u": index_by_id[edge["u"]],
            "v": index_by_id[edge["v"]],
        })

    return mapped


@app.get("/")
def home():
    return {
        "name": "NEXUS Disaster Response API",
        "status": "running",
        "version": "2.2.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "executable_exists": EXECUTABLE.exists(),
    }


@app.post("/max-flow")
def max_flow(request: MaxFlowRequest):
    edges = [edge.model_dump() for edge in request.edges]

    result = calculate_flow(
        request.source,
        request.sink,
        request.node_count,
        edges,
    )

    # Compatible with the existing React App.jsx:
    # it reads output, max_flow, and edge_count.
    return {
        "success": True,
        **result,
    }


@app.post("/simulate-disaster")
def simulate(request: SimulationRequest):
    locations = [location.model_dump() for location in request.locations]
    edges = [edge.model_dump() for edge in request.edges]

    try:
        result = simulate_disaster(
            locations=locations,
            edges=edges,
            disaster_type=request.disaster_type,
            target_id=request.target_id,
            reduction=request.reduction,
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    return {
        "success": True,
        "simulation": result,
    }


@app.post("/simulate-and-calculate")
def simulate_and_calculate(request: CompareRequest):
    locations = [location.model_dump() for location in request.locations]
    original_edges = [edge.model_dump() for edge in request.edges]

    if len(locations) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least two locations are required.",
        )

    if len({location["id"] for location in locations}) != len(locations):
        raise HTTPException(
            status_code=400,
            detail="Location IDs must be unique.",
        )

    # Map real location IDs to consecutive C node indices.
    ordered_locations = sorted(locations, key=lambda location: location["id"])
    index_by_id = {
        location["id"]: index
        for index, location in enumerate(ordered_locations)
    }

    if request.source not in index_by_id or request.sink not in index_by_id:
        raise HTTPException(
            status_code=400,
            detail="Source or destination does not exist.",
        )

    if request.source == request.sink:
        raise HTTPException(
            status_code=400,
            detail="Source and destination must be different.",
        )

    if len({edge["id"] for edge in original_edges}) != len(original_edges):
        raise HTTPException(
            status_code=400,
            detail="Road IDs must be unique.",
        )

    try:
        simulation = simulate_disaster(
            locations=locations,
            edges=original_edges,
            disaster_type=request.disaster_type,
            target_id=request.target_id,
            reduction=request.reduction,
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    # Convert location IDs to the consecutive indices expected by C.
    before_edges = map_edges_to_indices(
        original_edges,
        index_by_id,
    )

    after_edges = map_edges_to_indices(
        simulation["edges"],
        index_by_id,
    )

    source_index = index_by_id[request.source]
    sink_index = index_by_id[request.sink]
    node_count = len(ordered_locations)

    before_result = calculate_flow(
        source_index,
        sink_index,
        node_count,
        before_edges,
    )

    after_result = calculate_flow(
        source_index,
        sink_index,
        node_count,
        after_edges,
    )

    before_flow = get_flow_value(before_result)
    after_flow = get_flow_value(after_result)

    lost_flow = before_flow - after_flow

    reduction_percent = (
        lost_flow / before_flow * 100
        if before_flow > 0
        else 0
    )

    return {
        "success": True,
        "disaster": {
            "type": simulation["disaster_type"],
            "name": simulation["disaster_name"],
        },
        "comparison": {
            "before_max_flow": before_flow,
            "after_max_flow": after_flow,
            "flow_lost": lost_flow,
            "reduction_percent": round(reduction_percent, 2),
        },
        "affected_edges": simulation["affected_edges"],
        "before_result": before_result,
        "after_result": after_result,
        "simulated_network": {
            "locations": simulation["locations"],
            "edges": simulation["edges"],
        },
    }
