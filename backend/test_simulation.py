
from backend.simulation import simulate_disaster


locations = [
    {"id": 0, "name": "Supply Center", "type": "supply"},
    {"id": 1, "name": "Hospital", "type": "hospital"},
    {"id": 2, "name": "Shelter", "type": "shelter"},
]

edges = [
    {"id": 0, "u": 0, "v": 1, "capacity": 10},
    {"id": 1, "u": 1, "v": 2, "capacity": 8},
]

result = simulate_disaster(
    locations,
    edges,
    disaster_type="blocked_road",
    target_id=0,
)

print("Original capacities:", [e["capacity"] for e in edges])
print("Simulated capacities:", [e["capacity"] for e in result["edges"]])
print("Affected roads:", result["affected_edges"])

assert [e["capacity"] for e in edges] == [10, 8]
assert [e["capacity"] for e in result["edges"]] == [0, 8]

print("TEST PASSED")
