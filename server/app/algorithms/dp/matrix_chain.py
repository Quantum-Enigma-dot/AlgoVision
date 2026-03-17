from __future__ import annotations

from typing import Any, Dict, List

CODE = """def matrix_chain_order(dimensions):
    n = len(dimensions) - 1
    dp = [[0] * n for _ in range(n)]

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float("inf")
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1]
                if cost < dp[i][j]:
                    dp[i][j] = cost
    return dp[0][n - 1]
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    dimensions = list(map(int, input_data.get("dimensions", [])))
    n = len(dimensions) - 1

    if n <= 0:
        return {
            "result": 0,
            "steps": [],
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(n^2)",
                "input_size": 0,
            },
        }

    dp: List[List[float]] = [[0.0] * n for _ in range(n)]
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float("inf")
            best_split = i
            for k in range(i, j):
                comparisons += 1
                cost = dp[i][k] + dp[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1]
                if cost < dp[i][j]:
                    dp[i][j] = cost
                    best_split = k
                steps.append(
                    {
                        "type": "cell",
                        "row": i,
                        "col": j,
                        "value": int(dp[i][j]) if dp[i][j] != float("inf") else None,
                        "split": k,
                        "best_split": best_split,
                        "table": [[0 if val == float("inf") else int(val) for val in row] for row in dp],
                    }
                )

    return {
        "result": int(dp[0][n - 1]),
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(n^2)",
            "input_size": n,
        },
    }


ALGORITHM = {
    "name": "matrix_chain_multiplication",
    "display_name": "Matrix Chain Multiplication",
    "category": "dp",
    "description": "Finds the minimum scalar multiplications needed for matrix chain product.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n^3)",
        "average_time": "O(n^3)",
        "worst_time": "O(n^3)",
        "space": "O(n^2)",
        "paradigm": "Dynamic Programming",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Compiler optimization", "Linear algebra planning"],
        "limitations": ["Cubic time for long chains"],
        "optimization_tips": ["Memoized recursion provides same asymptotic complexity"],
    },
    "run": run,
}
