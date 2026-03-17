from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def radix_sort(arr):
    if not arr:
        return arr

    max_value = max(arr)
    exp = 1

    while max_value // exp > 0:
        buckets = [0] * 10
        output = [0] * len(arr)

        for value in arr:
            digit = (value // exp) % 10
            buckets[digit] += 1

        for i in range(1, 10):
            buckets[i] += buckets[i - 1]

        for i in range(len(arr) - 1, -1, -1):
            digit = (arr[i] // exp) % 10
            output[buckets[digit] - 1] = arr[i]
            buckets[digit] -= 1

        arr[:] = output
        exp *= 10

    return arr
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0

    if not array:
        return {
            "result": [],
            "steps": [],
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(n + k)",
                "input_size": 0,
            },
        }

    max_value = max(array)
    exp = 1

    while max_value // exp > 0:
        count = [0] * 10
        output = [0] * len(array)

        for index, value in enumerate(array):
            digit = (value // exp) % 10
            count[digit] += 1
            comparisons += 1
            add_step(
                steps,
                array,
                "count",
                [index],
                {
                    "comparisons": comparisons,
                    "swaps": swaps,
                    "digit": digit,
                    "exp": exp,
                    "phase": "counting",
                },
            )

        for i in range(1, 10):
            count[i] += count[i - 1]

        for i in range(len(array) - 1, -1, -1):
            digit = (array[i] // exp) % 10
            position = count[digit] - 1
            output[position] = array[i]
            count[digit] -= 1
            swaps += 1

        array[:] = output
        add_step(
            steps,
            array,
            "pass",
            [],
            {
                "comparisons": comparisons,
                "swaps": swaps,
                "exp": exp,
                "phase": "distribution",
            },
        )
        exp *= 10

    return {
        "result": array,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": swaps,
            "recursion_depth": 0,
            "space_estimate": "O(n + k)",
            "input_size": len(array),
        },
    }


ALGORITHM = {
    "name": "radix_sort",
    "display_name": "Radix Sort",
    "category": "sorting",
    "description": "Sorts non-negative integers digit-by-digit using stable counting passes.",
    "code": CODE,
    "complexity": {
        "best_time": "O(d(n + k))",
        "average_time": "O(d(n + k))",
        "worst_time": "O(d(n + k))",
        "space": "O(n + k)",
        "paradigm": "Distribution / Non-comparison",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Large integer keys", "Fixed-length IDs"],
        "limitations": ["Requires digit extraction", "Best for non-negative integers"],
        "optimization_tips": ["Use LSD radix with stable counting sort"],
    },
    "run": run,
}
