from __future__ import annotations

import heapq
from collections import Counter
from dataclasses import dataclass
from typing import Any, Dict, List, Optional


@dataclass
class HuffmanNode:
    id: str
    frequency: int
    char: Optional[str] = None
    left: Optional["HuffmanNode"] = None
    right: Optional["HuffmanNode"] = None


def _to_label(char: Optional[str], frequency: int) -> str:
    if char is None:
        return f"*:{frequency}"
    visible = char if char != " " else "space"
    return f"{visible}:{frequency}"


def _serialize_node(node: HuffmanNode) -> Dict[str, Any]:
    return {
        "id": node.id,
        "frequency": node.frequency,
        "char": node.char,
        "is_leaf": node.char is not None,
        "label": _to_label(node.char, node.frequency),
        "left": _serialize_node(node.left) if node.left else None,
        "right": _serialize_node(node.right) if node.right else None,
    }


def _collect_codes(node: HuffmanNode, prefix: str, out: Dict[str, str]) -> None:
    if node.char is not None:
        out[node.char] = prefix or "0"
        return
    if node.left:
        _collect_codes(node.left, prefix + "0", out)
    if node.right:
        _collect_codes(node.right, prefix + "1", out)


CODE = """import heapq
from collections import Counter


def huffman_encode(text):
    freq = Counter(text)
    heap = [[count, [char, ""]] for char, count in freq.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        for pair in lo[1:]:
            pair[1] = "0" + pair[1]
        for pair in hi[1:]:
            pair[1] = "1" + pair[1]
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])

    codes = dict(heap[0][1:]) if heap else {}
    encoded = "".join(codes[ch] for ch in text)
    return encoded, codes
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    text = str(input_data.get("text", ""))
    steps: List[Dict[str, Any]] = []

    if not text:
        return {
            "result": {
                "codes": {},
                "encoded_text": "",
                "decoded_text": "",
                "original_bits": 0,
                "encoded_bits": 0,
                "compression_ratio": 0,
                "tree": None,
            },
            "steps": steps,
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(k)",
                "input_size": 0,
            },
        }

    frequency_map = Counter(text)
    frequencies = [
        {"char": char, "frequency": freq}
        for char, freq in sorted(frequency_map.items(), key=lambda item: (item[1], item[0]))
    ]

    for entry in frequencies:
        steps.append(
            {
                "type": "frequency",
                "char": entry["char"],
                "frequency": entry["frequency"],
                "frequencies": frequencies,
            }
        )

    heap: List[tuple[int, int, HuffmanNode]] = []
    order = 0
    for char, freq in sorted(frequency_map.items(), key=lambda item: (item[1], item[0])):
        node = HuffmanNode(id=f"leaf-{ord(char)}-{order}", frequency=freq, char=char)
        heapq.heappush(heap, (freq, order, node))
        order += 1

    initial_queue = []
    for freq, _, node in sorted(heap, key=lambda item: (item[0], item[1])):
        initial_queue.append(
            {
                "id": node.id,
                "frequency": freq,
                "is_leaf": node.char is not None,
                "char": node.char,
                "label": _to_label(node.char, freq),
            }
        )

    steps.append(
        {
            "type": "sort",
            "frequencies": frequencies,
            "queue": initial_queue,
        }
    )

    total_merges = max(0, len(frequencies) - 1)
    merge_no = 0

    while len(heap) > 1:
        left_freq, _, left_node = heapq.heappop(heap)
        right_freq, _, right_node = heapq.heappop(heap)

        parent = HuffmanNode(
            id=f"merge-{order}",
            frequency=left_freq + right_freq,
            left=left_node,
            right=right_node,
        )
        heapq.heappush(heap, (parent.frequency, order, parent))
        order += 1

        queue_snapshot = []
        for freq, _, node in sorted(heap, key=lambda item: (item[0], item[1])):
            queue_snapshot.append(
                {
                    "id": node.id,
                    "frequency": freq,
                    "is_leaf": node.char is not None,
                    "char": node.char,
                    "label": _to_label(node.char, freq),
                }
            )

        merge_no += 1

        steps.append(
            {
                "type": "merge",
                "merge_no": merge_no,
                "total_merges": total_merges,
                "left": {
                    "id": left_node.id,
                    "frequency": left_freq,
                    "char": left_node.char,
                    "is_leaf": left_node.char is not None,
                    "label": _to_label(left_node.char, left_freq),
                },
                "right": {
                    "id": right_node.id,
                    "frequency": right_freq,
                    "char": right_node.char,
                    "is_leaf": right_node.char is not None,
                    "label": _to_label(right_node.char, right_freq),
                },
                "parent": {
                    "id": parent.id,
                    "frequency": parent.frequency,
                    "is_leaf": False,
                    "label": _to_label(None, parent.frequency),
                },
                "queue": queue_snapshot,
                "frequencies": frequencies,
                "tree": _serialize_node(parent),
            }
        )

    root = heap[0][2]
    codes: Dict[str, str] = {}
    _collect_codes(root, "", codes)

    running_codes: Dict[str, str] = {}
    sorted_chars = sorted(codes.keys())
    for index, char in enumerate(sorted_chars, start=1):
        running_codes[char] = codes[char]
        steps.append(
            {
                "type": "code",
                "code_no": index,
                "total_codes": len(sorted_chars),
                "char": char,
                "code": codes[char],
                "codes": dict(sorted(running_codes.items(), key=lambda item: item[0])),
                "frequencies": frequencies,
            }
        )

    encoded_text = "".join(codes[char] for char in text)
    original_bits = len(text) * 8
    encoded_bits = len(encoded_text)
    compression_ratio = round(encoded_bits / original_bits, 4) if original_bits else 0
    savings_bits = max(0, original_bits - encoded_bits)

    table_rows = []
    for item in frequencies:
        char = item["char"]
        freq = item["frequency"]
        code = codes.get(char, "")
        table_rows.append(
            {
                "char": char,
                "frequency": freq,
                "code": code,
                "code_length": len(code),
                "weighted_bits": freq * len(code),
                "ascii_bits": freq * 8,
            }
        )

    tree_payload = _serialize_node(root)
    steps.append(
        {
            "type": "complete",
            "codes": dict(sorted(codes.items(), key=lambda item: item[0])),
            "encoded_text": encoded_text,
            "encoded_bits": encoded_bits,
            "original_bits": original_bits,
            "compression_ratio": compression_ratio,
            "savings_bits": savings_bits,
            "table_rows": table_rows,
            "tree": tree_payload,
            "frequencies": frequencies,
        }
    )

    return {
        "result": {
            "codes": dict(sorted(codes.items(), key=lambda item: item[0])),
            "encoded_text": encoded_text,
            "decoded_text": text,
            "original_bits": original_bits,
            "encoded_bits": encoded_bits,
            "compression_ratio": compression_ratio,
            "savings_bits": savings_bits,
            "table_rows": table_rows,
            "tree": tree_payload,
        },
        "steps": steps,
        "metrics": {
            "comparisons": 0,
            "swaps": max(0, len(frequencies) - 1),
            "recursion_depth": max((len(code) for code in codes.values()), default=0),
            "space_estimate": "O(k)",
            "input_size": len(text),
        },
    }


ALGORITHM = {
    "name": "huffman_coding",
    "display_name": "Huffman Coding",
    "category": "string",
    "description": "Builds an optimal prefix code tree based on character frequencies.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n log k)",
        "average_time": "O(n log k)",
        "worst_time": "O(n log k)",
        "space": "O(k)",
        "paradigm": "Greedy + Heap",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Lossless compression", "Prefix-code generation"],
        "limitations": ["Needs frequency model before encoding"],
        "optimization_tips": ["Reuse the same codebook for repeated text domains"],
    },
    "run": run,
}
