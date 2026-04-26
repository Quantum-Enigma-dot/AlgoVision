from __future__ import annotations

from typing import Any, Dict, List

from .common import parse_graph

CODE = """def floyd_warshall(nodes, edges):
    n = len(nodes)
    idx = {node: i for i, node in enumerate(nodes)}
    dist = [[float("inf")] * n for _ in range(n)]

    for i in range(n):
        dist[i][i] = 0

    for edge in edges:
        u, v, w = edge["from"], edge["to"], edge.get("weight", 1)
        i, j = idx[u], idx[v]
        dist[i][j] = min(dist[i][j], w)

    for k in range(n):
        for i in range(n):
            for j in range(n):
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])

    return dist
"""


def _serialize_table(table: List[List[float]]) -> List[List[float | None]]:
    return [[(None if value == float("inf") else round(float(value), 6)) for value in row] for row in table]


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    nodes, edges, _adj = parse_graph(input_data)
    n = len(nodes)
    index = {node: i for i, node in enumerate(nodes)}

    dist: List[List[float]] = [[float("inf")] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0.0

    for edge in edges:
        u = str(edge.get("from"))
        v = str(edge.get("to"))
        w = float(edge.get("weight", 1))
        if u in index and v in index:
            i, j = index[u], index[v]
            dist[i][j] = min(dist[i][j], w)
            if not input_data.get("directed", False):
                dist[j][i] = min(dist[j][i], w)

    steps: List[Dict[str, Any]] = []
    comparisons = 0

    for k in range(n):
        for i in range(n):
            for j in range(n):
                comparisons += 1
                through_k = dist[i][k] + dist[k][j]
                if through_k < dist[i][j]:
                    dist[i][j] = through_k
                    steps.append(
                        {
                            "type": "relax",
                            "via": nodes[k],
                            "row": i,
                            "col": j,
                            "value": dist[i][j],
                            "table": _serialize_table(dist),
                        }
                    )

    result = {
        nodes[i]: {
            nodes[j]: (dist[i][j] if dist[i][j] != float("inf") else None)
            for j in range(n)
        }
        for i in range(n)
    }

    return {
        "result": result,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(V^2)",
            "input_size": n,
        },
    }


ALGORITHM = {
    "name": "floyd_warshall",
    "display_name": "Floyd-Warshall",
    "category": "graph",
    "description": "Computes all-pairs shortest paths using dynamic programming.",
    "code": CODE,
    "complexity": {
        "best_time": "O(V^3)",
        "average_time": "O(V^3)",
        "worst_time": "O(V^3)",
        "space": "O(V^2)",
        "paradigm": "Dynamic Programming",
        "stable": True,
    },
    "theory": {
        "use_cases": ["All-pairs routing", "Dense weighted graphs"],
        "limitations": ["Expensive for large V"],
        "optimization_tips": ["Prefer Dijkstra per source on sparse graphs"],
    },
    "run": run,
}
