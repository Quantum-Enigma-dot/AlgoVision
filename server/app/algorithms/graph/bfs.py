from __future__ import annotations

from collections import deque
from typing import Any, Dict, List

from .common import parse_graph

CODE = """from collections import deque

def bfs(graph, start):
    visited = set([start])
    q = deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                q.append(neighbor)
    return order
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    nodes, _edges, adj = parse_graph(input_data)
    start = str(input_data.get("start", nodes[0] if nodes else ""))

    visited = set()
    order: List[str] = []
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    queue = deque([start]) if start else deque()
    if start:
        visited.add(start)

    while queue:
        current = queue.popleft()
        order.append(current)
        steps.append(
            {
                "type": "visit",
                "current": current,
                "visited": list(visited),
                "queue": list(queue),
            }
        )
        for neighbor, _weight in adj.get(current, []):
            comparisons += 1
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                steps.append(
                    {
                        "type": "enqueue",
                        "current": current,
                        "edge": {"from": current, "to": neighbor},
                        "visited": list(visited),
                        "queue": list(queue),
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
    "name": "bfs",
    "display_name": "Breadth-First Search",
    "category": "graph",
    "description": "Explores neighbors level by level using a queue.",
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
        "use_cases": ["Shortest path in unweighted graphs", "Level order traversal"],
        "limitations": ["High memory for wide graphs"],
        "optimization_tips": ["Use deque for efficient queue ops"],
    },
    "run": run,
}
