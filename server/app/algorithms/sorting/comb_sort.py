from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def comb_sort(arr):
    gap = len(arr)
    shrink = 1.3
    swapped = True

    while gap > 1 or swapped:
        gap = int(gap / shrink)
        if gap < 1:
            gap = 1

        swapped = False
        for i in range(0, len(arr) - gap):
            j = i + gap
            if arr[i] > arr[j]:
                arr[i], arr[j] = arr[j], arr[i]
                swapped = True

    return arr
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0

    n = len(array)
    gap = n
    shrink = 1.3
    swapped = True

    while gap > 1 or swapped:
        gap = int(gap / shrink)
        if gap < 1:
            gap = 1

        swapped = False

        for i in range(0, n - gap):
            j = i + gap
            comparisons += 1
            add_step(
                steps,
                array,
                "compare",
                [i, j],
                {"gap": gap, "comparisons": comparisons, "swaps": swaps},
            )
            if array[i] > array[j]:
                array[i], array[j] = array[j], array[i]
                swaps += 1
                swapped = True
                add_step(
                    steps,
                    array,
                    "swap",
                    [i, j],
                    {"gap": gap, "comparisons": comparisons, "swaps": swaps},
                )

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
    "name": "comb_sort",
    "display_name": "Comb Sort",
    "category": "sorting",
    "description": "Improves bubble sort by comparing elements at a shrinking gap.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n log n)",
        "average_time": "O(n^2)",
        "worst_time": "O(n^2)",
        "space": "O(1)",
        "paradigm": "Brute Force",
        "stable": False,
    },
    "theory": {
        "use_cases": ["Fast simple improvement over bubble sort", "Educational demos"],
        "limitations": ["Still quadratic worst-case", "Not stable"],
        "optimization_tips": ["Use a shrink factor around 1.3; avoid gaps 9 and 10 by using 11"],
    },
    "run": run,
}
