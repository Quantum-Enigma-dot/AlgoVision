from __future__ import annotations

from typing import Any, Dict, List

CODE = """def lcs(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    a = str(input_data.get("text_a", ""))
    b = str(input_data.get("text_b", ""))

    n, m = len(a), len(b)
    dp: List[List[int]] = [[0] * (m + 1) for _ in range(n + 1)]
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            comparisons += 1
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                action = "match"
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                action = "skip"
            steps.append(
                {
                    "type": "cell",
                    "row": i,
                    "col": j,
                    "value": dp[i][j],
                    "action": action,
                    "table": [row[:] for row in dp],
                }
            )

    return {
        "result": dp[n][m],
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(nm)",
            "input_size": n + m,
        },
    }


ALGORITHM = {
    "name": "lcs",
    "display_name": "Longest Common Subsequence",
    "category": "dp",
    "description": "Finds the longest subsequence common to two strings.",
    "code": CODE,
    "complexity": {
        "best_time": "O(nm)",
        "average_time": "O(nm)",
        "worst_time": "O(nm)",
        "space": "O(nm)",
        "paradigm": "Dynamic Programming",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Diff tools", "DNA sequence analysis"],
        "limitations": ["Quadratic memory cost"],
        "optimization_tips": ["Use rolling arrays for space savings"],
    },
    "run": run,
}
