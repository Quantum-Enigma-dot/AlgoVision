from __future__ import annotations

import heapq
from typing import Any, Dict, List, Tuple

from .common import parse_graph

CODE = """import heapq

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        cur_dist, node = heapq.heappop(pq)
        if cur_dist > dist[node]:
            continue
        for neighbor, weight in graph[node]:
            new_dist = cur_dist + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    return dist
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
    nodes, _edges, adj = parse_graph(input_data)
    start = str(input_data.get("start", nodes[0] if nodes else ""))

    dist: Dict[str, float] = {node: float("inf") for node in nodes}
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    if not start:
        return {
            "result": _serialize_distances(dist),
            "steps": steps,
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(V)",
                "input_size": len(nodes),
            },
        }

    dist[start] = 0
    pq: List[Tuple[float, str]] = [(0, start)]

    while pq:
        current_dist, node = heapq.heappop(pq)
        if current_dist > dist[node]:
            continue
        steps.append(
            {
                "type": "extract",
                "current": node,
                "distances": _serialize_distances(dist),
                "queue": list(pq),
            }
        )
        for neighbor, weight in adj.get(node, []):
            comparisons += 1
            new_dist = current_dist + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
                steps.append(
                    {
                        "type": "relax",
                        "edge": {"from": node, "to": neighbor},
                        "distances": _serialize_distances(dist),
                        "queue": list(pq),
                    }
                )

    return {
        "result": _serialize_distances(dist),
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
    "name": "dijkstra",
    "display_name": "Dijkstra",
    "category": "graph",
    "description": "Finds shortest paths in graphs with non-negative weights.",
    "code": CODE,
    "complexity": {
        "best_time": "O((V + E) log V)",
        "average_time": "O((V + E) log V)",
        "worst_time": "O((V + E) log V)",
        "space": "O(V)",
        "paradigm": "Greedy",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Routing", "Navigation systems"],
        "limitations": ["Cannot handle negative weights"],
        "optimization_tips": ["Use a priority queue for efficiency"],
    },
    "run": run,
}
