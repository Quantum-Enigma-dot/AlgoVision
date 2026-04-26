from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def counting_sort(arr):
    if not arr:
        return []

    lo = min(arr)
    hi = max(arr)
    offset = -lo if lo < 0 else 0
    counts = [0] * (hi + offset + 1)

    for value in arr:
        counts[value + offset] += 1

    for i in range(1, len(counts)):
        counts[i] += counts[i - 1]

    out = [0] * len(arr)
    for i in range(len(arr) - 1, -1, -1):
        value = arr[i]
        idx = value + offset
        counts[idx] -= 1
        out[counts[idx]] = value

    return out
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []

    if not array:
        return {
            "result": [],
            "steps": [],
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(1)",
                "input_size": 0,
            },
        }

    lo = min(array)
    hi = max(array)
    offset = -lo if lo < 0 else 0
    counts = [0] * (hi + offset + 1)

    comparisons = 0
    writes = 0

    for index, value in enumerate(array):
        bucket = value + offset
        counts[bucket] += 1
        steps.append(
            {
                "type": "count",
                "array": list(array),
                "indices": [index],
                "value": value,
                "bucket": bucket,
                "counts": list(counts),
            }
        )

    for idx in range(1, len(counts)):
        counts[idx] += counts[idx - 1]
        steps.append(
            {
                "type": "prefix",
                "array": list(array),
                "indices": [],
                "bucket": idx,
                "counts": list(counts),
            }
        )

    out = [0] * len(array)
    for source_index in range(len(array) - 1, -1, -1):
        value = array[source_index]
        bucket = value + offset
        counts[bucket] -= 1
        destination_index = counts[bucket]
        out[destination_index] = value
        writes += 1
        steps.append(
            {
                "type": "place",
                "array": list(out),
                "indices": [destination_index],
                "value": value,
                "source_index": source_index,
                "bucket": bucket,
            }
        )

    for index, value in enumerate(out):
        comparisons += 1
        array[index] = value
        add_step(steps, array, "write", [index], {"comparisons": comparisons, "swaps": writes})

    return {
        "result": array,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": writes,
            "recursion_depth": 0,
            "space_estimate": "O(n + k)",
            "input_size": len(array),
        },
    }


ALGORITHM = {
    "name": "counting_sort",
    "display_name": "Counting Sort",
    "category": "sorting",
    "description": "Sorts integers by counting each value frequency and rebuilding output stably.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n + k)",
        "average_time": "O(n + k)",
        "worst_time": "O(n + k)",
        "space": "O(n + k)",
        "paradigm": "Non-comparison",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Bounded integer keys", "Frequency-heavy datasets"],
        "limitations": ["Needs known value range", "Extra memory for counts"],
        "optimization_tips": ["Use offset to support negative values"],
    },
    "run": run,
}
