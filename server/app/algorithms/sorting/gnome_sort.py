from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def gnome_sort(arr):
    i = 0
    while i < len(arr):
        if i == 0 or arr[i] >= arr[i - 1]:
            i += 1
        else:
            arr[i], arr[i - 1] = arr[i - 1], arr[i]
            i -= 1
    return arr
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0

    n = len(array)
    i = 0

    while i < n:
        if i == 0:
            i += 1
            continue

        comparisons += 1
        add_step(steps, array, "compare", [i - 1, i], {"comparisons": comparisons, "swaps": swaps})
        if array[i] >= array[i - 1]:
            i += 1
            continue

        array[i], array[i - 1] = array[i - 1], array[i]
        swaps += 1
        add_step(steps, array, "swap", [i - 1, i], {"comparisons": comparisons, "swaps": swaps})
        i -= 1

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
    "name": "gnome_sort",
    "display_name": "Gnome Sort",
    "category": "sorting",
    "description": "Insertion-like sort that swaps backward until order is restored.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n)",
        "average_time": "O(n^2)",
        "worst_time": "O(n^2)",
        "space": "O(1)",
        "paradigm": "Incremental Insertion",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Educational demos", "Small arrays"],
        "limitations": ["Quadratic time on large inputs"],
        "optimization_tips": ["Prefer insertion sort if you want the same idea with fewer swaps"],
    },
    "run": run,
}
