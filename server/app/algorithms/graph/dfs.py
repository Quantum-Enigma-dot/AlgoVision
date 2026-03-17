from __future__ import annotations

from typing import Any, Dict, List

from .common import parse_graph

CODE = """def dfs(graph, start):
    visited = set()
    stack = [start]
    order = []
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        order.append(node)
        for neighbor in reversed(graph[node]):
            if neighbor not in visited:
                stack.append(neighbor)
    return order
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    nodes, _edges, adj = parse_graph(input_data)
    start = str(input_data.get("start", nodes[0] if nodes else ""))

    visited = set()
    order: List[str] = []
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    stack = [start] if start else []

    while stack:
        current = stack.pop()
        if current in visited:
            continue
        visited.add(current)
        order.append(current)
        steps.append(
            {
                "type": "visit",
                "current": current,
                "visited": list(visited),
                "stack": list(stack),
            }
        )
        neighbors = [n for n, _w in adj.get(current, [])]
        for neighbor in reversed(neighbors):
            comparisons += 1
            if neighbor not in visited:
                stack.append(neighbor)
                steps.append(
                    {
                        "type": "push",
                        "current": current,
                        "edge": {"from": current, "to": neighbor},
                        "visited": list(visited),
                        "stack": list(stack),
                    }
                )

    return {
        "result": order,
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
    "name": "dfs",
    "display_name": "Depth-First Search",
    "category": "graph",
    "description": "Explores as far as possible before backtracking.",
    "code": CODE,
    "complexity": {
        "best_time": "O(V + E)",
        "average_time": "O(V + E)",
        "worst_time": "O(V + E)",
        "space": "O(V)",
        "paradigm": "Traversal",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Cycle detection", "Topological ordering"],
        "limitations": ["Stack growth on deep graphs"],
        "optimization_tips": ["Use iterative stack to avoid recursion depth"],
    },
    "run": run,
}
