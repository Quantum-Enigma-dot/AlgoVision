from __future__ import annotations

from typing import Any, Dict, List

CODE = """def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][capacity]
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    weights = list(map(int, input_data.get("weights", [])))
    values = list(map(int, input_data.get("values", [])))
    capacity = int(input_data.get("capacity", 0))

    n = len(weights)
    dp: List[List[int]] = [[0] * (capacity + 1) for _ in range(n + 1)]
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            comparisons += 1
            if weights[i - 1] <= w:
                take = values[i - 1] + dp[i - 1][w - weights[i - 1]]
                skip = dp[i - 1][w]
                dp[i][w] = max(skip, take)
                choice = "take" if take >= skip else "skip"
            else:
                dp[i][w] = dp[i - 1][w]
                choice = "skip"
            steps.append(
                {
                    "type": "cell",
                    "row": i,
                    "col": w,
                    "value": dp[i][w],
                    "choice": choice,
                    "table": [row[:] for row in dp],
                }
            )

    return {
        "result": dp[n][capacity],
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(nW)",
            "input_size": n,
        },
    }


ALGORITHM = {
    "name": "knapsack_01",
    "display_name": "0/1 Knapsack",
    "category": "dp",
    "description": "Chooses items to maximize value without exceeding capacity.",
    "code": CODE,
    "complexity": {
        "best_time": "O(nW)",
        "average_time": "O(nW)",
        "worst_time": "O(nW)",
        "space": "O(nW)",
        "paradigm": "Dynamic Programming",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Resource allocation", "Budget planning"],
        "limitations": ["Large capacity increases runtime"],
        "optimization_tips": ["Use 1D DP to reduce space"],
    },
    "run": run,
}
