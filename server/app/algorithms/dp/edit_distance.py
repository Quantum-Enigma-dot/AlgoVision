from __future__ import annotations

from typing import Any, Dict, List

CODE = """def edit_distance(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost,
            )

    return dp[n][m]
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    a = str(input_data.get("text_a", ""))
    b = str(input_data.get("text_b", ""))

    n = len(a)
    m = len(b)
    dp: List[List[int]] = [[0] * (m + 1) for _ in range(n + 1)]
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    for i in range(n + 1):
        dp[i][0] = i
        steps.append(
            {
                "type": "cell",
                "row": i,
                "col": 0,
                "value": dp[i][0],
                "action": "init",
                "table": [row[:] for row in dp],
            }
        )

    for j in range(m + 1):
        dp[0][j] = j
        steps.append(
            {
                "type": "cell",
                "row": 0,
                "col": j,
                "value": dp[0][j],
                "action": "init",
                "table": [row[:] for row in dp],
            }
        )

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            comparisons += 1
            cost = 0 if a[i - 1] == b[j - 1] else 1

            delete_cost = dp[i - 1][j] + 1
            insert_cost = dp[i][j - 1] + 1
            replace_cost = dp[i - 1][j - 1] + cost
            best = min(delete_cost, insert_cost, replace_cost)
            dp[i][j] = best

            if cost == 0 and best == replace_cost:
                action = "match"
            elif best == replace_cost:
                action = "replace"
            elif best == insert_cost:
                action = "insert"
            else:
                action = "delete"

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
    "name": "edit_distance",
    "display_name": "Edit Distance",
    "category": "dp",
    "description": "Computes the minimum number of insertions, deletions, and replacements between two strings.",
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
        "use_cases": ["Spell checking", "Approximate string matching"],
        "limitations": ["Quadratic memory and time"],
        "optimization_tips": ["Use rolling rows to reduce memory to O(min(n,m))"],
    },
    "run": run,
}
