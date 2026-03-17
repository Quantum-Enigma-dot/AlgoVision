from __future__ import annotations

from typing import Any, Dict, List

from .common import parse_graph

CODE = """def hamiltonian_cycle(nodes, edges):
    adj = {node: set() for node in nodes}
    for edge in edges:
        u, v = edge["from"], edge["to"]
        adj[u].add(v)
        adj[v].add(u)

    path = [nodes[0]]
    used = {nodes[0]}

    def backtrack():
        if len(path) == len(nodes):
            return path[0] in adj[path[-1]]

        current = path[-1]
        for nxt in nodes:
            if nxt not in used and nxt in adj[current]:
                used.add(nxt)
                path.append(nxt)
                if backtrack():
                    return True
                path.pop()
                used.remove(nxt)
        return False

    if backtrack():
        return path + [path[0]]
    return []
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    nodes, edges, _adj = parse_graph(input_data)
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    if not nodes:
        return {
            "result": {"cycle": []},
            "steps": [],
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(V)",
                "input_size": 0,
            },
        }

    adjacency = {node: set() for node in nodes}
    for edge in edges:
        u = str(edge.get("from"))
        v = str(edge.get("to"))
        adjacency[u].add(v)
        adjacency[v].add(u)

    path = [nodes[0]]
    used = {nodes[0]}
    max_depth = 1

    def backtrack(depth: int) -> bool:
        nonlocal comparisons, max_depth
        max_depth = max(max_depth, depth)

        if len(path) == len(nodes):
            comparisons += 1
            closed = path[0] in adjacency[path[-1]]
            steps.append({"type": "close", "path": list(path), "success": closed})
            return closed

        current = path[-1]
        for nxt in nodes:
            comparisons += 1
            if nxt not in used and nxt in adjacency[current]:
                path.append(nxt)
                used.add(nxt)
                steps.append({"type": "advance", "path": list(path)})
                if backtrack(depth + 1):
                    return True
                used.remove(nxt)
                path.pop()
                steps.append({"type": "backtrack", "path": list(path)})
        return False

    found = backtrack(1)
    cycle = path + [path[0]] if found else []

    return {
        "result": {"cycle": cycle},
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": max_depth,
            "space_estimate": "O(V)",
            "input_size": len(nodes),
        },
    }


ALGORITHM = {
    "name": "hamiltonian_cycle",
    "display_name": "Hamiltonian Cycle",
    "category": "graph",
    "description": "Finds a cycle visiting each vertex exactly once if it exists.",
    "code": CODE,
    "complexity": {
        "best_time": "O(V^2)",
        "average_time": "O(V!)",
        "worst_time": "O(V!)",
        "space": "O(V)",
        "paradigm": "Backtracking",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Route planning", "Combinatorial search"],
        "limitations": ["NP-complete"],
        "optimization_tips": ["Use pruning with degree/order heuristics"],
    },
    "run": run,
}
