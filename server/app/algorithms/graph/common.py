from __future__ import annotations

from typing import Any, Dict, List, Tuple


def parse_graph(input_data: Dict[str, Any]) -> Tuple[List[str], List[Dict[str, Any]], Dict[str, List[Tuple[str, float]]]]:
    nodes = [str(node) for node in input_data.get("nodes", [])]
    edges = input_data.get("edges", [])
    directed = bool(input_data.get("directed", False))

    if not nodes:
        node_set = set()
        for edge in edges:
            node_set.add(str(edge.get("from")))
            node_set.add(str(edge.get("to")))
        nodes = sorted(node_set)

    adj: Dict[str, List[Tuple[str, float]]] = {node: [] for node in nodes}
    for edge in edges:
        src = str(edge.get("from"))
        dst = str(edge.get("to"))
        weight = float(edge.get("weight", 1))
        adj[src].append((dst, weight))
        if not directed:
            adj[dst].append((src, weight))

    return nodes, edges, adj
