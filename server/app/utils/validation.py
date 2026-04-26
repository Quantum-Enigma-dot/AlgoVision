from __future__ import annotations

from typing import Any, Dict, List


def _is_num_list(values: Any) -> bool:
    return isinstance(values, list) and all(isinstance(item, (int, float)) for item in values)


def _is_op_list(values: Any) -> bool:
    if not isinstance(values, list):
        return False
    for item in values:
        if not isinstance(item, dict):
            return False
        op = str(item.get("op", "")).strip()
        if not op:
            return False
    return True


def validate_run_input(category: str, algorithm: str, input_data: Dict[str, Any]) -> None:
    if category == "sorting":
        array = input_data.get("array")
        if not _is_num_list(array) or len(array) == 0:
            raise ValueError("Invalid input: provide a non-empty numeric array.")
        if len(array) > 120:
            raise ValueError("Invalid input: array size must be <= 120.")
        return

    if category == "graph":
        nodes = input_data.get("nodes")
        edges = input_data.get("edges")
        allow_negative_weights = algorithm == "bellman_ford"
        if not isinstance(nodes, list) or len(nodes) == 0:
            raise ValueError("Invalid input: provide graph nodes.")
        if not isinstance(edges, list) or len(edges) == 0:
            raise ValueError("Invalid input: provide graph edges.")

        node_set = {str(node) for node in nodes}
        for edge in edges:
            if not isinstance(edge, dict):
                raise ValueError("Invalid input: each edge must be an object.")
            src = str(edge.get("from", ""))
            dst = str(edge.get("to", ""))
            weight = edge.get("weight", 1)
            if src not in node_set or dst not in node_set:
                raise ValueError("Invalid input: each edge endpoint must exist in nodes.")
            if not isinstance(weight, (int, float)):
                raise ValueError("Invalid input: graph weights must be numbers.")
            if not allow_negative_weights and weight < 0:
                raise ValueError("Invalid input: graph weights must be non-negative numbers.")

        start = str(input_data.get("start", ""))
        if start and start not in node_set:
            raise ValueError("Invalid input: start node must exist in nodes.")

        sink = str(input_data.get("sink", ""))
        if sink and sink not in node_set:
            raise ValueError("Invalid input: sink node must exist in nodes.")
        return

    if category == "dp":
        if algorithm == "knapsack_01":
            weights = input_data.get("weights")
            values = input_data.get("values")
            capacity = input_data.get("capacity")
            if not _is_num_list(weights) or not _is_num_list(values):
                raise ValueError("Invalid input: weights and values must be numeric arrays.")
            if len(weights) == 0 or len(weights) != len(values):
                raise ValueError("Invalid input: weights and values must have equal non-zero length.")
            if not isinstance(capacity, int) or capacity < 0:
                raise ValueError("Invalid input: capacity must be a non-negative integer.")
            if any(value <= 0 for value in weights):
                raise ValueError("Invalid input: weights must be positive.")
            return

        if algorithm == "matrix_chain_multiplication":
            dimensions = input_data.get("dimensions")
            if not _is_num_list(dimensions):
                raise ValueError("Invalid input: dimensions must be a numeric array.")
            if len(dimensions) < 2:
                raise ValueError("Invalid input: provide at least two dimensions.")
            if any(value <= 0 for value in dimensions):
                raise ValueError("Invalid input: dimensions must be positive.")
            return

        text_a = input_data.get("text_a")
        text_b = input_data.get("text_b")
        if not isinstance(text_a, str) or not isinstance(text_b, str) or not text_a or not text_b:
            raise ValueError("Invalid input: text_a and text_b are required for this DP algorithm.")
        return

    if category == "string":
        text = input_data.get("text")
        if algorithm == "huffman_coding":
            if not isinstance(text, str) or len(text) == 0:
                raise ValueError("Invalid input: text must be a non-empty string for Huffman coding.")
            return

        pattern = input_data.get("pattern")
        if not isinstance(text, str) or not isinstance(pattern, str):
            raise ValueError("Invalid input: text and pattern must be strings.")
        if len(text) == 0 or len(pattern) == 0:
            raise ValueError("Invalid input: text and pattern cannot be empty.")
        if len(pattern) > len(text):
            raise ValueError("Invalid input: pattern length must not exceed text length.")
        return

    if category in {"stack", "queue", "linked_list", "tree"}:
        initial_values = input_data.get("initial_values", [])
        operations = input_data.get("operations", [])

        if initial_values is not None and not isinstance(initial_values, list):
            raise ValueError("Invalid input: initial_values must be a list.")
        if not _is_op_list(operations):
            raise ValueError("Invalid input: operations must be a list of operation objects with an 'op' field.")

        if category in {"stack", "queue"}:
            capacity = input_data.get("capacity", 0)
            if capacity is not None and (not isinstance(capacity, int) or capacity <= 0):
                raise ValueError("Invalid input: capacity must be a positive integer.")

        if category == "tree" and algorithm in {"b_tree", "b_plus_tree"}:
            order = input_data.get("order", 4)
            if not isinstance(order, int) or order < 3 or order > 32:
                raise ValueError("Invalid input: B-tree order must be an integer between 3 and 32.")

        return

    raise ValueError("Invalid input: unsupported category.")
