from __future__ import annotations

from collections import deque
from typing import Any, Dict, List

from .common import parse_graph

CODE = """from collections import deque


def topological_sort(nodes, edges):
    indegree = {node: 0 for node in nodes}
    graph = {node: [] for node in nodes}

    for edge in edges:
        src = str(edge["from"])
        dst = str(edge["to"])
        graph[src].append(dst)
        indegree[dst] += 1

    q = deque([node for node in nodes if indegree[node] == 0])
    order = []

    while q:
        current = q.popleft()
        order.append(current)
        for neighbor in graph[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                q.append(neighbor)

    if len(order) != len(nodes):
        return []
    return order
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    nodes, edges, _adj = parse_graph(input_data)
    adj = {node: [] for node in nodes}
    indegree = {node: 0 for node in nodes}

    for edge in edges:
        src = str(edge.get("from"))
        dst = str(edge.get("to"))
        if src in indegree and dst in indegree:
            adj[src].append(dst)
            indegree[dst] += 1

    queue = deque([node for node in nodes if indegree[node] == 0])
    order: List[str] = []
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    while queue:
        current = queue.popleft()
        order.append(current)
        steps.append(
            {
                "type": "dequeue",
                "current": current,
                "visited": list(order),
                "queue": list(queue),
            }
        )

        for neighbor in adj.get(current, []):
            comparisons += 1
            indegree[neighbor] -= 1
            steps.append(
                {
                    "type": "edge_remove",
                    "current": current,
                    "edge": {"from": current, "to": neighbor},
                    "visited": list(order),
                    "queue": list(queue),
                    "indegree": dict(indegree),
                }
            )
            if indegree[neighbor] == 0:
                queue.append(neighbor)
                steps.append(
                    {
                        "type": "enqueue",
                        "current": current,
                        "edge": {"from": current, "to": neighbor},
                        "visited": list(order),
                        "queue": list(queue),
                    }
                )

    has_cycle = len(order) != len(nodes)

    return {
        "result": {
            "order": order,
            "has_cycle": has_cycle,
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
    "name": "topological_sort",
    "display_name": "Topological Sort",
    "category": "graph",
    "description": "Produces a linear ordering of DAG vertices using indegree and queue processing.",
    "code": CODE,
    "complexity": {
        "best_time": "O(V + E)",
        "average_time": "O(V + E)",
        "worst_time": "O(V + E)",
        "space": "O(V)",
        "paradigm": "Graph Traversal",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Task scheduling", "Dependency resolution", "Build systems"],
        "limitations": ["Works only for DAGs", "Cyclic graphs have no valid topological order"],
        "optimization_tips": ["Prefer adjacency lists for sparse graphs"],
    },
    "run": run,
}
