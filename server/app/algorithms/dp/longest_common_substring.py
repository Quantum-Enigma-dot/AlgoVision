from __future__ import annotations

from typing import Any, Dict, List

CODE = """def longest_common_substring(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    best_len = 0
    best_end = 0

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                if dp[i][j] > best_len:
                    best_len = dp[i][j]
                    best_end = i
            else:
                dp[i][j] = 0

    return a[best_end - best_len : best_end]
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    a = str(input_data.get("text_a", ""))
    b = str(input_data.get("text_b", ""))

    n = len(a)
    m = len(b)
    dp: List[List[int]] = [[0] * (m + 1) for _ in range(n + 1)]
    steps: List[Dict[str, Any]] = []

    best_len = 0
    best_end = 0
    comparisons = 0

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            comparisons += 1
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                action = "match"
                if dp[i][j] > best_len:
                    best_len = dp[i][j]
                    best_end = i
            else:
                dp[i][j] = 0
                action = "reset"

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

    substring = a[best_end - best_len : best_end]

    return {
        "result": {
            "substring": substring,
            "length": best_len,
        },
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
    "name": "longest_common_substring",
    "display_name": "Longest Common Substring",
    "category": "dp",
    "description": "Finds the longest contiguous substring shared by two strings using DP.",
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
        "use_cases": ["Plagiarism detection", "String similarity windows"],
        "limitations": ["Quadratic memory/time on long strings"],
        "optimization_tips": ["Use rolling rows for lower memory when only length is required"],
    },
    "run": run,
}
