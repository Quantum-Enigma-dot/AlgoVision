from __future__ import annotations

from typing import Any, Dict, List

from .common import add_step

CODE = """def heap_sort(arr):
    def heapify(n, i):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        if left < n and arr[left] > arr[largest]:
            largest = left
        if right < n and arr[right] > arr[largest]:
            largest = right
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            heapify(n, largest)

    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(i, 0)
    return arr
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    array = list(map(int, input_data.get("array", [])))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0
    max_depth = 0

    def heapify(n: int, i: int, depth: int) -> None:
        nonlocal comparisons, swaps, max_depth
        max_depth = max(max_depth, depth)
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2

        if left < n:
            comparisons += 1
            add_step(steps, array, "compare", [left, largest], {"comparisons": comparisons, "swaps": swaps})
            if array[left] > array[largest]:
                largest = left
        if right < n:
            comparisons += 1
            add_step(steps, array, "compare", [right, largest], {"comparisons": comparisons, "swaps": swaps})
            if array[right] > array[largest]:
                largest = right
        if largest != i:
            array[i], array[largest] = array[largest], array[i]
            swaps += 1
            add_step(steps, array, "swap", [i, largest], {"comparisons": comparisons, "swaps": swaps})
            heapify(n, largest, depth + 1)

    n = len(array)
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i, 1)

    for i in range(n - 1, 0, -1):
        array[i], array[0] = array[0], array[i]
        swaps += 1
        add_step(steps, array, "swap", [0, i], {"comparisons": comparisons, "swaps": swaps})
        heapify(i, 0, 1)

    return {
        "result": array,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": swaps,
            "recursion_depth": max_depth,
            "space_estimate": "O(1)",
            "input_size": n,
        },
    }


ALGORITHM = {
    "name": "heap_sort",
    "display_name": "Heap Sort",
    "category": "sorting",
    "description": "Builds a max heap and repeatedly extracts the maximum.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n log n)",
        "average_time": "O(n log n)",
        "worst_time": "O(n log n)",
        "space": "O(1)",
        "paradigm": "Selection",
        "stable": False,
    },
    "theory": {
        "use_cases": ["Memory-limited sorting", "Large inputs"],
        "limitations": ["Not stable"],
        "optimization_tips": ["Prefer when consistent $O(n log n)$ is needed"],
    },
    "run": run,
}
