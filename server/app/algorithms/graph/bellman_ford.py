from __future__ import annotations

from typing import Any, Dict, List, Tuple

from .common import parse_graph

CODE = """def bellman_ford(nodes, edges, start):
    dist = {node: float('inf') for node in nodes}
    parent = {node: None for node in nodes}
    dist[start] = 0

    for _ in range(len(nodes) - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
                updated = True
        if not updated:
            break

    has_negative_cycle = False
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            has_negative_cycle = True
            break

    return dist, parent, has_negative_cycle
"""


def _serialize_distances(dist: Dict[str, float]) -> Dict[str, float | None]:
    serialized: Dict[str, float | None] = {}
    for node, value in dist.items():
        if value == float("inf"):
            serialized[node] = None
        else:
            serialized[node] = round(float(value), 6)
    return serialized


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    nodes, raw_edges, _ = parse_graph(input_data)
    directed = bool(input_data.get("directed", False))
    start = str(input_data.get("start", nodes[0] if nodes else ""))

    steps: List[Dict[str, Any]] = []

    if not nodes or start not in {str(node) for node in nodes}:
        return {
            "result": {
                "distances": {},
                "parents": {},
                "has_negative_cycle": False,
            },
            "steps": steps,
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(V)",
                "input_size": len(nodes),
            },
        }

    edge_list: List[Tuple[str, str, float]] = []
    for edge in raw_edges:
        src = str(edge.get("from"))
        dst = str(edge.get("to"))
        weight = float(edge.get("weight", 1))
        edge_list.append((src, dst, weight))
        if not directed:
            edge_list.append((dst, src, weight))

    dist: Dict[str, float] = {str(node): float("inf") for node in nodes}
    parent: Dict[str, str | None] = {str(node): None for node in nodes}
    dist[start] = 0.0

    comparisons = 0

    for iteration in range(len(nodes) - 1):
        updated = False
        for src, dst, weight in edge_list:
            comparisons += 1
            if dist[src] != float("inf") and dist[src] + weight < dist[dst]:
                dist[dst] = dist[src] + weight
                parent[dst] = src
                updated = True
                steps.append(
                    {
                        "type": "relax",
                        "iteration": iteration + 1,
                        "edge": {"from": src, "to": dst, "weight": weight},
                        "current": dst,
                        "visited": [node for node, value in dist.items() if value != float("inf")],
                        "distances": _serialize_distances(dist),
                    }
                )
        steps.append(
            {
                "type": "iteration",
                "iteration": iteration + 1,
                "updated": updated,
                "visited": [node for node, value in dist.items() if value != float("inf")],
                "distances": _serialize_distances(dist),
            }
        )
        if not updated:
            break

    has_negative_cycle = False
    for src, dst, weight in edge_list:
        comparisons += 1
        if dist[src] != float("inf") and dist[src] + weight < dist[dst]:
            has_negative_cycle = True
            steps.append(
                {
                    "type": "negative_cycle",
                    "edge": {"from": src, "to": dst, "weight": weight},
                    "distances": _serialize_distances(dist),
                }
            )
            break

    return {
        "result": {
            "distances": _serialize_distances(dist),
            "parents": parent,
            "has_negative_cycle": has_negative_cycle,
        },
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(V)",
            "input_size": len(nodes),
        },
    }


ALGORITHM = {
    "name": "bellman_ford",
    "display_name": "Bellman-Ford",
    "category": "graph",
    "description": "Computes shortest paths with support for negative edge weights and cycle detection.",
    "code": CODE,
    "complexity": {
        "best_time": "O(VE)",
        "average_time": "O(VE)",
        "worst_time": "O(VE)",
        "space": "O(V)",
        "paradigm": "Dynamic Programming",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Graphs with negative weights", "Currency arbitrage detection"],
        "limitations": ["Slower than Dijkstra on non-negative graphs"],
        "optimization_tips": ["Early-stop if an iteration performs no relaxation"],
    },
    "run": run,
}
