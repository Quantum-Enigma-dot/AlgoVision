from __future__ import annotations

import random
from typing import Any, Dict, List

from .common import add_step

CODE = """import random

def randomized_quick_sort(arr):
    def partition(low, high):
        pivot_index = random.randint(low, high)
        arr[pivot_index], arr[high] = arr[high], arr[pivot_index]
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
            p = partition(low, high)
            sort(low, p - 1)
            sort(p + 1, high)

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
        pivot_index = random.randint(low, high)
        if pivot_index != high:
            array[pivot_index], array[high] = array[high], array[pivot_index]
            swaps += 1
            add_step(steps, array, "swap", [pivot_index, high], {"comparisons": comparisons, "swaps": swaps})

        pivot = array[high]
        add_step(steps, array, "pivot", [high], {"pivot": pivot, "comparisons": comparisons, "swaps": swaps})

        i = low - 1
        for j in range(low, high):
            comparisons += 1
            add_step(steps, array, "compare", [j, high], {"comparisons": comparisons, "swaps": swaps})
            if array[j] <= pivot:
                i += 1
                if i != j:
                    array[i], array[j] = array[j], array[i]
                    swaps += 1
                    add_step(steps, array, "swap", [i, j], {"comparisons": comparisons, "swaps": swaps})

        if i + 1 != high:
            array[i + 1], array[high] = array[high], array[i + 1]
            swaps += 1
        add_step(steps, array, "partition", [i + 1], {"comparisons": comparisons, "swaps": swaps})
        return i + 1

    def sort(low: int, high: int, depth: int) -> None:
        nonlocal max_depth
        max_depth = max(max_depth, depth)
        if low < high:
            pivot_idx = partition(low, high)
            sort(low, pivot_idx - 1, depth + 1)
            sort(pivot_idx + 1, high, depth + 1)

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
    "name": "randomized_quick_sort",
    "display_name": "Randomized Quick Sort",
    "category": "sorting",
    "description": "Quick sort with random pivot selection to reduce worst-case likelihood.",
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
        "use_cases": ["General purpose in-memory sorting", "Robust against adversarial orderings"],
        "limitations": ["Still has O(n^2) worst case", "Not stable"],
        "optimization_tips": ["Use 3-way partitioning for many duplicates"],
    },
    "run": run,
}
