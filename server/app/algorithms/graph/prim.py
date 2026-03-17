from __future__ import annotations

import heapq
from typing import Any, Dict, List, Tuple

from .common import parse_graph

CODE = """import heapq

def prim(graph, start):
    visited = set([start])
    edges = [(w, start, v) for v, w in graph[start]]
    heapq.heapify(edges)
    mst = []
    while edges:
        weight, u, v = heapq.heappop(edges)
        if v in visited:
            continue
        visited.add(v)
        mst.append((u, v, weight))
        for to, w in graph[v]:
            if to not in visited:
                heapq.heappush(edges, (w, v, to))
    return mst
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    nodes, _edges, adj = parse_graph(input_data)
    start = str(input_data.get("start", nodes[0] if nodes else ""))

    steps: List[Dict[str, Any]] = []
    comparisons = 0

    if not start:
        return {
            "result": [],
            "steps": steps,
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(E)",
                "input_size": len(nodes),
            },
        }

    visited = {start}
    pq: List[Tuple[float, str, str]] = []
    for neighbor, weight in adj.get(start, []):
        heapq.heappush(pq, (weight, start, neighbor))

    mst_edges: List[Dict[str, Any]] = []

    while pq and len(visited) < len(nodes):
        weight, u, v = heapq.heappop(pq)
        comparisons += 1
        if v in visited:
            continue
        visited.add(v)
        edge = {"from": u, "to": v, "weight": weight}
        mst_edges.append(edge)
        steps.append(
            {
                "type": "select",
                "edge": edge,
                "visited": list(visited),
                "queue": list(pq),
            }
        )
        for neighbor, w in adj.get(v, []):
            if neighbor not in visited:
                heapq.heappush(pq, (w, v, neighbor))

    return {
        "result": mst_edges,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(E)",
            "input_size": len(nodes),
        },
    }


ALGORITHM = {
    "name": "prim",
    "display_name": "Prim",
    "category": "graph",
    "description": "Builds a minimum spanning tree by growing a visited set.",
    "code": CODE,
    "complexity": {
        "best_time": "O(E log V)",
        "average_time": "O(E log V)",
        "worst_time": "O(E log V)",
        "space": "O(E)",
        "paradigm": "Greedy",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Network design", "Minimum wiring"],
        "limitations": ["Requires connected graph"],
        "optimization_tips": ["Use binary heap for priority queue"],
    },
    "run": run,
}
