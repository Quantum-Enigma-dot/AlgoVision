from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def cocktail_sort(arr):
    start = 0
    end = len(arr) - 1
    swapped = True

    while swapped:
        swapped = False

        for i in range(start, end):
            if arr[i] > arr[i + 1]:
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
                swapped = True

        if not swapped:
            break

        swapped = False
        end -= 1

        for i in range(end, start, -1):
            if arr[i - 1] > arr[i]:
                arr[i - 1], arr[i] = arr[i], arr[i - 1]
                swapped = True

        start += 1

    return arr
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0

    start = 0
    end = len(array) - 1
    swapped = True

    while swapped and start < end:
        swapped = False

        for i in range(start, end):
            comparisons += 1
            add_step(steps, array, "compare", [i, i + 1], {"comparisons": comparisons, "swaps": swaps})
            if array[i] > array[i + 1]:
                array[i], array[i + 1] = array[i + 1], array[i]
                swaps += 1
                swapped = True
                add_step(steps, array, "swap", [i, i + 1], {"comparisons": comparisons, "swaps": swaps})

        if not swapped:
            break

        swapped = False
        end -= 1

        for i in range(end, start, -1):
            comparisons += 1
            add_step(steps, array, "compare", [i - 1, i], {"comparisons": comparisons, "swaps": swaps})
            if array[i - 1] > array[i]:
                array[i - 1], array[i] = array[i], array[i - 1]
                swaps += 1
                swapped = True
                add_step(steps, array, "swap", [i - 1, i], {"comparisons": comparisons, "swaps": swaps})

        start += 1

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
    "name": "cocktail_sort",
    "display_name": "Cocktail Sort",
    "category": "sorting",
    "description": "Bidirectional bubble sort that passes left-to-right and right-to-left.",
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
        "use_cases": ["Educational demos", "Nearly sorted arrays"],
        "limitations": ["Quadratic time on large inputs"],
        "optimization_tips": ["Track last swap position to shrink the next pass window"],
    },
    "run": run,
}
