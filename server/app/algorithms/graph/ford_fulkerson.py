from __future__ import annotations

from collections import deque
from typing import Any, Dict, List

from .common import parse_graph

CODE = """from collections import deque

def ford_fulkerson(nodes, edges, source, sink):
    capacity = {u: {} for u in nodes}
    for edge in edges:
        u, v, w = edge["from"], edge["to"], edge.get("weight", 1)
        capacity[u][v] = capacity[u].get(v, 0) + w
        capacity[v].setdefault(u, 0)

    flow = 0
    while True:
        parent = {source: None}
        q = deque([source])
        while q and sink not in parent:
            u = q.popleft()
            for v, cap in capacity[u].items():
                if cap > 0 and v not in parent:
                    parent[v] = u
                    q.append(v)

        if sink not in parent:
            break

        bottleneck = float("inf")
        v = sink
        while v != source:
            u = parent[v]
            bottleneck = min(bottleneck, capacity[u][v])
            v = u

        v = sink
        while v != source:
            u = parent[v]
            capacity[u][v] -= bottleneck
            capacity[v][u] += bottleneck
            v = u

        flow += bottleneck

    return flow
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    nodes, edges, _adj = parse_graph(input_data)
    source = str(input_data.get("start", nodes[0] if nodes else ""))
    sink = str(input_data.get("sink", nodes[-1] if nodes else ""))

    capacity: Dict[str, Dict[str, float]] = {node: {} for node in nodes}
    for edge in edges:
        u = str(edge.get("from"))
        v = str(edge.get("to"))
        w = float(edge.get("weight", 1))
        capacity[u][v] = capacity[u].get(v, 0.0) + w
        capacity[v].setdefault(u, 0.0)

    max_flow = 0.0
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    while source and sink:
        parent: Dict[str, str | None] = {source: None}
        q = deque([source])

        while q and sink not in parent:
            u = q.popleft()
            for v, cap in capacity[u].items():
                comparisons += 1
                if cap > 0 and v not in parent:
                    parent[v] = u
                    q.append(v)

        if sink not in parent:
            break

        bottleneck = float("inf")
        path_nodes = [sink]
        v = sink
        while v != source:
            u = parent[v]
            if u is None:
                break
            bottleneck = min(bottleneck, capacity[u][v])
            v = u
            path_nodes.append(v)
        path_nodes.reverse()

        v = sink
        while v != source:
            u = parent[v]
            if u is None:
                break
            capacity[u][v] -= bottleneck
            capacity[v][u] += bottleneck
            v = u

        max_flow += bottleneck
        steps.append(
            {
                "type": "augment",
                "path": path_nodes,
                "bottleneck": bottleneck,
                "flow": max_flow,
            }
        )

    return {
        "result": {"max_flow": max_flow, "source": source, "sink": sink},
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(V^2)",
            "input_size": len(nodes),
        },
    }


ALGORITHM = {
    "name": "ford_fulkerson",
    "display_name": "Ford-Fulkerson (Edmonds-Karp)",
    "category": "graph",
    "description": "Computes maximum flow by repeatedly augmenting residual paths.",
    "code": CODE,
    "complexity": {
        "best_time": "O(VE^2)",
        "average_time": "O(VE^2)",
        "worst_time": "O(VE^2)",
        "space": "O(V^2)",
        "paradigm": "Greedy / Network Flow",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Network routing", "Bipartite matching", "Resource allocation"],
        "limitations": ["Performance degrades on dense graphs"],
        "optimization_tips": ["Use BFS (Edmonds-Karp) for predictable convergence"],
    },
    "run": run,
}
