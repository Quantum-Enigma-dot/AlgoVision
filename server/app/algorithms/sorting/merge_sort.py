from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0
    max_depth = 0

    def merge(left: int, mid: int, right: int) -> None:
        nonlocal comparisons, swaps
        temp: List[int] = []
        i, j = left, mid + 1
        while i <= mid and j <= right:
            comparisons += 1
            add_step(steps, array, "compare", [i, j], {"comparisons": comparisons, "swaps": swaps})
            if array[i] <= array[j]:
                temp.append(array[i])
                i += 1
            else:
                temp.append(array[j])
                j += 1
        while i <= mid:
            temp.append(array[i])
            i += 1
        while j <= right:
            temp.append(array[j])
            j += 1
        for idx, value in enumerate(temp):
            array[left + idx] = value
            swaps += 1
            add_step(
                steps,
                array,
                "merge",
                [left + idx],
                {"comparisons": comparisons, "swaps": swaps, "range": [left, right]},
            )

    def sort(left: int, right: int, depth: int) -> None:
        nonlocal max_depth
        max_depth = max(max_depth, depth)
        if left >= right:
            return
        mid = (left + right) // 2
        sort(left, mid, depth + 1)
        sort(mid + 1, right, depth + 1)
        merge(left, mid, right)

    if array:
        sort(0, len(array) - 1, 1)

    return {
        "result": array,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": swaps,
            "recursion_depth": max_depth,
            "space_estimate": "O(n)",
            "input_size": len(array),
        },
    }


ALGORITHM = {
    "name": "merge_sort",
    "display_name": "Merge Sort",
    "category": "sorting",
    "description": "Divides the array and merges sorted halves.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n log n)",
        "average_time": "O(n log n)",
        "worst_time": "O(n log n)",
        "space": "O(n)",
        "paradigm": "Divide and Conquer",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Stable sorting", "Large datasets"],
        "limitations": ["Extra memory usage"],
        "optimization_tips": ["Use insertion sort for tiny subarrays"],
    },
    "run": run,
}
