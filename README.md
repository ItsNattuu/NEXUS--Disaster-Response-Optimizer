# NEXUS — Disaster Response Optimizer

NEXUS is a disaster-response network simulation project built around the **Edmonds–Karp maximum-flow algorithm**, implemented in C.

The idea is simple: during a disaster, getting supplies to the right place is not just about how many resources are available. The condition and capacity of the routes connecting supply points to affected areas matter too.

NEXUS models this problem as a flow network and calculates how much resource flow can be delivered from a source to a destination. It also identifies bottlenecks in the network, helping illustrate how a blocked or limited route can affect emergency distribution.

## What it does

- **Maximum flow calculation:** Finds the maximum possible flow through a network using Edmonds–Karp.
- **Bottleneck analysis:** Shows where limited-capacity routes restrict the overall flow.
- **Minimum cut identification:** Identifies critical edges whose capacities limit the maximum flow.
- **Network simulation:** Allows roads and their capacities to be represented as a graph.
- **Interactive interface:** Provides a visual way to explore the network and test different configurations.

The project connects a graph algorithm with a practical problem: understanding how a transportation network behaves when resources need to reach people during an emergency.

## The algorithm

NEXUS uses the Edmonds–Karp algorithm, which is an implementation of the Ford–Fulkerson method that uses **Breadth-First Search (BFS)** to find augmenting paths.

For each path found, the algorithm:

1. Finds the minimum residual capacity along the path.
2. Adds that amount to the total flow.
3. Updates the residual capacities, including reverse edges.
4. Repeats until no more augmenting paths can be found.

The final result is the maximum flow from the selected source to the destination.

### Time complexity

For a graph with \(V\) vertices and \(E\) edges, Edmonds–Karp runs in:

\[
O(VE^2)
\]

This makes it useful for learning and experimenting with maximum-flow problems on small and medium-sized networks.

## Tech stack

- **C** — implementation of the Edmonds–Karp algorithm
- **Python / FastAPI** — backend API
- **React** — frontend interface
- **JavaScript and CSS** — interactive UI and styling
- **GitHub** — version control and project hosting

## Project structure

```text
NEXUS/
├── main.c
├── backend/
│   └── app.py
└── frontend/
    ├── src/
    ├── package.json
    └── package-lock.json
```

Additional files may be present depending on the current version of the project.

## Running locally

### 1. Compile the C program

Make sure GCC is installed, then run this from the project root:

```bash
gcc main.c -o nexus -std=c11 -Wall -Wextra -lm
```

On Windows, you can use `nexus.exe` as the output executable name instead.

### 2. Set up the backend

Create and activate a Python virtual environment, then install the backend dependencies:

```bash
python -m venv .venv
```

On Windows:

```bash
.venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Start the API from the project root:

```bash
python -m uvicorn backend.app:app --reload --port 8000
```

The API should then be available at `http://127.0.0.1:8000`.

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

> These instructions assume the repository contains the files shown above and that `requirements.txt` is located in the project root. The backend executable path and API URL must match your local configuration.

## Why this project?

I built NEXUS to explore how a fundamental graph algorithm can be applied to a real-world problem.

Edmonds–Karp is more than a way to calculate a number. Its residual graph helps explain why some networks can deliver more resources than others, and why a single constrained route can limit the entire system.

This project combines algorithm implementation, backend integration, and frontend visualization in one application.

## Future improvements

- Simulate road closures and other disruptions.
- Compare network flow before and after a disruption.
- Improve the visualization of bottlenecks and minimum cuts.
- Test larger networks with different capacity configurations.
- Explore how the model could support emergency logistics planning.

## Limitations

NEXUS is an educational simulation, not a live emergency-management system. Its results depend on the network structure and capacities supplied to it. Real disaster-response decisions also require live road conditions, travel times, resource availability, and other operational data.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
