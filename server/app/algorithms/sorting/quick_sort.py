from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def quick_sort(arr):
    def partition(low, high):
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1

    def sort(low, high):
        if low < high:
            pi = partition(low, high)
            sort(low, pi - 1)
            sort(pi + 1, high)

    sort(0, len(arr) - 1)
    return arr
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0
    max_depth = 0

    def partition(low: int, high: int) -> int:
        nonlocal comparisons, swaps
        pivot = array[high]
        add_step(steps, array, "pivot", [high], {"pivot": pivot})
        i = low - 1
        for j in range(low, high):
            comparisons += 1
            add_step(steps, array, "compare", [j, high], {"comparisons": comparisons, "swaps": swaps})
            if array[j] <= pivot:
                i += 1
                array[i], array[j] = array[j], array[i]
                swaps += 1
                add_step(steps, array, "swap", [i, j], {"comparisons": comparisons, "swaps": swaps})
        array[i + 1], array[high] = array[high], array[i + 1]
        swaps += 1
        add_step(steps, array, "partition", [i + 1], {"comparisons": comparisons, "swaps": swaps})
        return i + 1

    def sort(low: int, high: int, depth: int) -> None:
        nonlocal max_depth
        max_depth = max(max_depth, depth)
        if low < high:
            pi = partition(low, high)
            sort(low, pi - 1, depth + 1)
            sort(pi + 1, high, depth + 1)

    if array:
        sort(0, len(array) - 1, 1)

    return {
        "result": array,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": swaps,
            "recursion_depth": max_depth,
            "space_estimate": "O(log n)",
            "input_size": len(array),
        },
    }


ALGORITHM = {
    "name": "quick_sort",
    "display_name": "Quick Sort",
    "category": "sorting",
    "description": "Partitions around a pivot and recursively sorts subarrays.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n log n)",
        "average_time": "O(n log n)",
        "worst_time": "O(n^2)",
        "space": "O(log n)",
        "paradigm": "Divide and Conquer",
        "stable": False,
    },
    "theory": {
        "use_cases": ["In-memory sorting", "Large arrays"],
        "limitations": ["Worst-case quadratic time"],
        "optimization_tips": ["Randomize pivot to avoid bad cases"],
    },
    "run": run,
}
