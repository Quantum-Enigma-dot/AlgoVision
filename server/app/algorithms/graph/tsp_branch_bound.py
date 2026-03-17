from __future__ import annotations

import heapq
from typing import Any, Dict, List, Tuple

from .common import parse_graph

CODE = """import heapq

def tsp_branch_bound(nodes, edges):
    idx = {node: i for i, node in enumerate(nodes)}
    n = len(nodes)
    matrix = [[float("inf")] * n for _ in range(n)]
    for i in range(n):
        matrix[i][i] = 0

    for edge in edges:
        u, v, w = edge["from"], edge["to"], edge.get("weight", 1)
        i, j = idx[u], idx[v]
        matrix[i][j] = min(matrix[i][j], w)
        matrix[j][i] = min(matrix[j][i], w)

    start = 0
    best_cost = float("inf")
    best_path = []
    pq = [(0, start, [start], {start})]

    while pq:
        cost, current, path, visited = heapq.heappop(pq)
        if cost >= best_cost:
            continue
        if len(path) == n and matrix[current][start] < float("inf"):
            total = cost + matrix[current][start]
            if total < best_cost:
                best_cost = total
                best_path = path + [start]
            continue

        for nxt in range(n):
            if nxt not in visited and matrix[current][nxt] < float("inf"):
                heapq.heappush(pq, (cost + matrix[current][nxt], nxt, path + [nxt], visited | {nxt}))

    return best_cost, best_path
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    nodes, edges, _adj = parse_graph(input_data)
    n = len(nodes)

    if n == 0:
        return {
            "result": {"cost": 0, "path": []},
            "steps": [],
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(V^2)",
                "input_size": 0,
            },
        }

    index = {node: i for i, node in enumerate(nodes)}
    matrix = [[float("inf")] * n for _ in range(n)]
    for i in range(n):
        matrix[i][i] = 0.0

    for edge in edges:
        u = str(edge.get("from"))
        v = str(edge.get("to"))
        w = float(edge.get("weight", 1))
        i, j = index[u], index[v]
        matrix[i][j] = min(matrix[i][j], w)
        matrix[j][i] = min(matrix[j][i], w)

    start = 0
    best_cost = float("inf")
    best_path: List[int] = []
    pq: List[Tuple[float, int, List[int], set[int]]] = [(0.0, start, [start], {start})]
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    while pq:
        cost, current, path, visited = heapq.heappop(pq)
        comparisons += 1
        if cost >= best_cost:
            continue

        steps.append({"type": "expand", "cost": cost, "path": [nodes[i] for i in path]})

        if len(path) == n and matrix[current][start] < float("inf"):
            total = cost + matrix[current][start]
            if total < best_cost:
                best_cost = total
                best_path = path + [start]
                steps.append({"type": "best", "cost": best_cost, "path": [nodes[i] for i in best_path]})
            continue

        for nxt in range(n):
            if nxt not in visited and matrix[current][nxt] < float("inf"):
                heapq.heappush(pq, (cost + matrix[current][nxt], nxt, path + [nxt], visited | {nxt}))

    return {
        "result": {
            "cost": (best_cost if best_cost != float("inf") else None),
            "path": [nodes[i] for i in best_path],
        },
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": n,
            "space_estimate": "O(V^2)",
            "input_size": n,
        },
    }


ALGORITHM = {
    "name": "tsp_branch_bound",
    "display_name": "TSP (Branch and Bound)",
    "category": "graph",
    "description": "Finds a short Hamiltonian tour using branch-and-bound style pruning.",
    "code": CODE,
    "complexity": {
        "best_time": "O(V^2)",
        "average_time": "O(V^2 2^V)",
        "worst_time": "O(V!)",
        "space": "O(V^2)",
        "paradigm": "Branch and Bound",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Logistics routing", "Circuit board drilling"],
        "limitations": ["NP-hard; scales poorly"],
        "optimization_tips": ["Use strong lower bounds for better pruning"],
    },
    "run": run,
}
