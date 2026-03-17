from __future__ import annotations

from typing import Any, Dict, List

from .common import parse_graph

CODE = """def graph_coloring(nodes, edges, max_colors=3):
    adj = {node: set() for node in nodes}
    for edge in edges:
        u, v = edge["from"], edge["to"]
        adj[u].add(v)
        adj[v].add(u)

    colors = {node: 0 for node in nodes}

    def is_safe(node, color):
        return all(colors[neighbor] != color for neighbor in adj[node])

    def backtrack(index):
        if index == len(nodes):
            return True
        node = nodes[index]
        for color in range(1, max_colors + 1):
            if is_safe(node, color):
                colors[node] = color
                if backtrack(index + 1):
                    return True
                colors[node] = 0
        return False

    possible = backtrack(0)
    return possible, colors
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    nodes, edges, _adj = parse_graph(input_data)
    max_colors = int(input_data.get("max_colors", 3))

    adjacency = {node: set() for node in nodes}
    for edge in edges:
        u = str(edge.get("from"))
        v = str(edge.get("to"))
        adjacency[u].add(v)
        adjacency[v].add(u)

    assignment: Dict[str, int] = {node: 0 for node in nodes}
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    def is_safe(node: str, color: int) -> bool:
        nonlocal comparisons
        for neighbor in adjacency[node]:
            comparisons += 1
            if assignment[neighbor] == color:
                return False
        return True

    def backtrack(index: int, depth: int) -> bool:
        if index == len(nodes):
            return True

        node = nodes[index]
        for color in range(1, max_colors + 1):
            steps.append({"type": "try", "node": node, "color": color, "assignment": dict(assignment)})
            if is_safe(node, color):
                assignment[node] = color
                steps.append({"type": "assign", "node": node, "color": color, "assignment": dict(assignment)})
                if backtrack(index + 1, depth + 1):
                    return True
                assignment[node] = 0
                steps.append({"type": "backtrack", "node": node, "assignment": dict(assignment)})
        return False

    possible = backtrack(0, 1)

    return {
        "result": {"possible": possible, "assignment": assignment, "max_colors": max_colors},
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": len(nodes),
            "space_estimate": "O(V)",
            "input_size": len(nodes),
        },
    }


ALGORITHM = {
    "name": "graph_coloring",
    "display_name": "Graph Coloring",
    "category": "graph",
    "description": "Assigns colors to nodes so adjacent nodes have different colors.",
    "code": CODE,
    "complexity": {
        "best_time": "O(V)",
        "average_time": "O(m^V)",
        "worst_time": "O(m^V)",
        "space": "O(V)",
        "paradigm": "Backtracking",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Scheduling", "Register allocation", "Map coloring"],
        "limitations": ["NP-hard in general"],
        "optimization_tips": ["Use node ordering heuristics for pruning"],
    },
    "run": run,
}
