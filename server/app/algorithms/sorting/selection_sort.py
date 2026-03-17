from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0

    n = len(array)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            add_step(steps, array, "compare", [min_idx, j], {"comparisons": comparisons, "swaps": swaps})
            if array[j] < array[min_idx]:
                min_idx = j
                add_step(steps, array, "select", [min_idx], {"comparisons": comparisons, "swaps": swaps})
        if min_idx != i:
            array[i], array[min_idx] = array[min_idx], array[i]
            swaps += 1
            add_step(steps, array, "swap", [i, min_idx], {"comparisons": comparisons, "swaps": swaps})

    return {
        "result": array,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": swaps,
            "recursion_depth": 0,
            "space_estimate": "O(1)",
            "input_size": n,
        },
    }


ALGORITHM = {
    "name": "selection_sort",
    "display_name": "Selection Sort",
    "category": "sorting",
    "description": "Selects the minimum element and swaps it into place iteratively.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n^2)",
        "average_time": "O(n^2)",
        "worst_time": "O(n^2)",
        "space": "O(1)",
        "paradigm": "Greedy",
        "stable": False,
    },
    "theory": {
        "use_cases": ["Small arrays", "Memory-constrained scenarios"],
        "limitations": ["High comparison cost"],
        "optimization_tips": ["Useful when swaps are expensive"],
    },
    "run": run,
}
