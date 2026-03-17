from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0

    for i in range(1, len(array)):
        key = array[i]
        j = i - 1
        add_step(steps, array, "select", [i], {"comparisons": comparisons, "swaps": swaps})
        while j >= 0:
            comparisons += 1
            add_step(steps, array, "compare", [j, j + 1], {"comparisons": comparisons, "swaps": swaps})
            if array[j] > key:
                array[j + 1] = array[j]
                swaps += 1
                add_step(steps, array, "shift", [j, j + 1], {"comparisons": comparisons, "swaps": swaps})
                j -= 1
            else:
                break
        array[j + 1] = key
        add_step(steps, array, "insert", [j + 1], {"comparisons": comparisons, "swaps": swaps})

    return {
        "result": array,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": swaps,
            "recursion_depth": 0,
            "space_estimate": "O(1)",
            "input_size": len(array),
        },
    }


ALGORITHM = {
    "name": "insertion_sort",
    "display_name": "Insertion Sort",
    "category": "sorting",
    "description": "Builds a sorted prefix by inserting each element into position.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n)",
        "average_time": "O(n^2)",
        "worst_time": "O(n^2)",
        "space": "O(1)",
        "paradigm": "Incremental",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Nearly sorted arrays", "Small inputs"],
        "limitations": ["Slow for large random inputs"],
        "optimization_tips": ["Use as a base case in hybrid sorts"],
    },
    "run": run,
}
