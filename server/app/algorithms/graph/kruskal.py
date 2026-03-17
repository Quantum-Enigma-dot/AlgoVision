from __future__ import annotations

from typing import Any, Dict, List, Tuple

from .common import parse_graph

CODE = """def kruskal(nodes, edges):
    parent = {n: n for n in nodes}
    rank = {n: 0 for n in nodes}

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return False
        if rank[ra] < rank[rb]:
            parent[ra] = rb
        elif rank[ra] > rank[rb]:
            parent[rb] = ra
        else:
            parent[rb] = ra
            rank[ra] += 1
        return True

    mst = []
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        if union(u, v):
            mst.append((u, v, w))
    return mst
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    nodes, edges, _adj = parse_graph(input_data)

    parent = {n: n for n in nodes}
    rank = {n: 0 for n in nodes}
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    def find(x: str) -> str:
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(a: str, b: str) -> bool:
        ra, rb = find(a), find(b)
        if ra == rb:
            return False
        if rank[ra] < rank[rb]:
            parent[ra] = rb
        elif rank[ra] > rank[rb]:
            parent[rb] = ra
        else:
            parent[rb] = ra
            rank[ra] += 1
        return True

    sorted_edges: List[Tuple[str, str, float]] = []
    for edge in edges:
        sorted_edges.append((str(edge.get("from")), str(edge.get("to")), float(edge.get("weight", 1))))
    sorted_edges.sort(key=lambda e: e[2])

    mst: List[Dict[str, Any]] = []
    for u, v, w in sorted_edges:
        comparisons += 1
        if union(u, v):
            edge = {"from": u, "to": v, "weight": w}
            mst.append(edge)
            steps.append({"type": "select", "edge": edge, "sets": dict(parent)})
        else:
            steps.append({"type": "skip", "edge": {"from": u, "to": v, "weight": w}, "sets": dict(parent)})

    return {
        "result": mst,
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
    "name": "kruskal",
    "display_name": "Kruskal",
    "category": "graph",
    "description": "Builds a minimum spanning tree by adding edges in sorted order.",
    "code": CODE,
    "complexity": {
        "best_time": "O(E log E)",
        "average_time": "O(E log E)",
        "worst_time": "O(E log E)",
        "space": "O(E)",
        "paradigm": "Greedy",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Minimum spanning tree", "Clustering"],
        "limitations": ["Requires sorting edges"],
        "optimization_tips": ["Use union-find with path compression"],
    },
    "run": run,
}
