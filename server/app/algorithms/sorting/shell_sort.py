from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def shell_sort(arr):
    n = len(arr)
    gap = n // 2

    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2

    return arr
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    writes = 0

    n = len(array)
    gap = n // 2

    while gap > 0:
        for i in range(gap, n):
            temp = array[i]
            j = i
            add_step(steps, array, "gap", [i], {"gap": gap})
            while j >= gap:
                comparisons += 1
                add_step(steps, array, "compare", [j - gap, j], {"gap": gap})
                if array[j - gap] <= temp:
                    break
                array[j] = array[j - gap]
                writes += 1
                add_step(steps, array, "shift", [j - gap, j], {"gap": gap})
                j -= gap
            array[j] = temp
            writes += 1
            add_step(steps, array, "insert", [j], {"gap": gap})
        gap //= 2

    return {
        "result": array,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": writes,
            "recursion_depth": 0,
            "space_estimate": "O(1)",
            "input_size": len(array),
        },
    }


ALGORITHM = {
    "name": "shell_sort",
    "display_name": "Shell Sort",
    "category": "sorting",
    "description": "Generalized insertion sort that compares elements at a shrinking gap.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n log n)",
        "average_time": "O(n^1.5)",
        "worst_time": "O(n^2)",
        "space": "O(1)",
        "paradigm": "Incremental Insertion",
        "stable": False,
    },
    "theory": {
        "use_cases": ["Medium arrays", "In-place sorting with better practical speed than insertion sort"],
        "limitations": ["Complexity depends on gap sequence", "Not stable"],
        "optimization_tips": ["Use Ciura gap sequence for better empirical performance"],
    },
    "run": run,
}
