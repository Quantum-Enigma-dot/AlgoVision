from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0

    n = len(array)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            comparisons += 1
            add_step(steps, array, "compare", [j, j + 1], {"comparisons": comparisons, "swaps": swaps})
            if array[j] > array[j + 1]:
                array[j], array[j + 1] = array[j + 1], array[j]
                swaps += 1
                swapped = True
                add_step(steps, array, "swap", [j, j + 1], {"comparisons": comparisons, "swaps": swaps})
        if not swapped:
            break

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
    "name": "bubble_sort",
    "display_name": "Bubble Sort",
    "category": "sorting",
    "description": "Repeatedly compares adjacent elements and swaps them if out of order.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n)",
        "average_time": "O(n^2)",
        "worst_time": "O(n^2)",
        "space": "O(1)",
        "paradigm": "Brute Force",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Tiny arrays", "Educational demos"],
        "limitations": ["Slow for large inputs"],
        "optimization_tips": ["Early stop when no swaps occur"],
    },
    "run": run,
}
