
from copy import deepcopy


DISASTER_TYPES = {
    "flood": "Urban flooding",
    "blocked_road": "Blocked road",
    "bridge_damage": "Bridge damage",
    "hospital_overload": "Hospital overload",
    "supply_shortage": "Supply shortage",
}


def simulate_disaster(locations, edges, disaster_type, target_id=None, reduction=0.5):
    """
    Create a modified copy of a network for disaster simulation.

    Original locations and edges are never modified.

    locations: list of location dictionaries
    edges: list of road dictionaries containing id, u, v, capacity
    disaster_type: one of DISASTER_TYPES
    target_id: road ID or location ID, depending on scenario
    reduction: fraction of capacity to remove, from 0 to 1
    """

    if disaster_type not in DISASTER_TYPES:
        raise ValueError("Unknown disaster type.")

    if not 0 <= reduction <= 1:
        raise ValueError("Reduction must be between 0 and 1.")

    simulated_locations = deepcopy(locations)
    simulated_edges = deepcopy(edges)

    affected_edges = []

    if disaster_type == "flood":
        if target_id is None:
            raise ValueError("Choose a location affected by flooding.")

        for edge in simulated_edges:
            if edge["u"] == target_id or edge["v"] == target_id:
                old_capacity = edge["capacity"]
                edge["capacity"] = int(old_capacity * (1 - reduction))

                affected_edges.append({
                    "edge_id": edge["id"],
                    "old_capacity": old_capacity,
                    "new_capacity": edge["capacity"],
                })

    elif disaster_type == "blocked_road":
        edge = _find_edge(simulated_edges, target_id)
        old_capacity = edge["capacity"]
        edge["capacity"] = 0

        affected_edges.append({
            "edge_id": edge["id"],
            "old_capacity": old_capacity,
            "new_capacity": 0,
        })

    elif disaster_type == "bridge_damage":
        edge = _find_edge(simulated_edges, target_id)
        old_capacity = edge["capacity"]

        # Bridge damage reduces capacity by at least 70%.
        edge["capacity"] = int(old_capacity * 0.3)

        affected_edges.append({
            "edge_id": edge["id"],
            "old_capacity": old_capacity,
            "new_capacity": edge["capacity"],
        })

    elif disaster_type == "hospital_overload":
        location = _find_location(simulated_locations, target_id)

        if location.get("type") != "hospital":
            raise ValueError("Choose a location whose type is hospital.")

        for edge in simulated_edges:
            if edge["v"] == target_id:
                old_capacity = edge["capacity"]
                edge["capacity"] = int(old_capacity * (1 - reduction))

                affected_edges.append({
                    "edge_id": edge["id"],
                    "old_capacity": old_capacity,
                    "new_capacity": edge["capacity"],
                })

    elif disaster_type == "supply_shortage":
        _find_location(simulated_locations, target_id)

        for edge in simulated_edges:
            if edge["u"] == target_id:
                old_capacity = edge["capacity"]
                edge["capacity"] = int(old_capacity * (1 - reduction))

                affected_edges.append({
                    "edge_id": edge["id"],
                    "old_capacity": old_capacity,
                    "new_capacity": edge["capacity"],
                })

    return {
        "disaster_type": disaster_type,
        "disaster_name": DISASTER_TYPES[disaster_type],
        "locations": simulated_locations,
        "edges": simulated_edges,
        "affected_edges": affected_edges,
    }


def _find_edge(edges, edge_id):
    for edge in edges:
        if edge["id"] == edge_id:
            return edge

    raise ValueError("The selected road does not exist.")


def _find_location(locations, location_id):
    for location in locations:
        if location["id"] == location_id:
            return location

    raise ValueError("The selected location does not exist.")
