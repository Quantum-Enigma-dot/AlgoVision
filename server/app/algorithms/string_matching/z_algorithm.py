from __future__ import annotations

from typing import Any, Dict, List

CODE = """def z_search(text, pattern):
    if not pattern:
        return []

    combined = pattern + "$" + text
    z = [0] * len(combined)
    left = right = 0

    for i in range(1, len(combined)):
        if i <= right:
            z[i] = min(right - i + 1, z[i - left])
        while i + z[i] < len(combined) and combined[z[i]] == combined[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > right:
            left, right = i, i + z[i] - 1

    m = len(pattern)
    return [i - m - 1 for i in range(m + 1, len(combined)) if z[i] >= m]
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    text = str(input_data.get("text", ""))
    pattern = str(input_data.get("pattern", ""))
    steps: List[Dict[str, Any]] = []

    if not pattern:
        return {
            "result": [],
            "steps": steps,
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(n + m)",
                "input_size": len(text),
            },
        }

    combined = pattern + "$" + text
    z = [0] * len(combined)
    left = 0
    right = 0
    comparisons = 0

    m = len(pattern)

    for i in range(1, len(combined)):
        if i <= right:
            z[i] = min(right - i + 1, z[i - left])

        while i + z[i] < len(combined):
            comparisons += 1
            match = combined[z[i]] == combined[i + z[i]]
            text_index = i + z[i] - m - 1
            if 0 <= text_index < len(text):
                steps.append(
                    {
                        "type": "compare",
                        "text": text,
                        "pattern": pattern,
                        "text_index": text_index,
                        "pattern_index": min(z[i], max(m - 1, 0)),
                        "match": match,
                    }
                )
            if not match:
                break
            z[i] += 1

        if i + z[i] - 1 > right:
            left = i
            right = i + z[i] - 1

    matches: List[int] = []
    for i in range(m + 1, len(combined)):
        if z[i] >= m:
            start = i - m - 1
            matches.append(start)
            steps.append({"type": "match", "index": start, "text": text, "pattern": pattern})

    return {
        "result": matches,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(n + m)",
            "input_size": len(text),
        },
    }


ALGORITHM = {
    "name": "z_algorithm",
    "display_name": "Z Algorithm",
    "category": "string",
    "description": "Finds pattern occurrences using the Z-array over pattern + separator + text.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n + m)",
        "average_time": "O(n + m)",
        "worst_time": "O(n + m)",
        "space": "O(n + m)",
        "paradigm": "String Processing",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Exact string matching", "Prefix-based text analytics"],
        "limitations": ["Requires linear auxiliary array"],
        "optimization_tips": ["Reuse Z-box bounds to avoid redundant comparisons"],
    },
    "run": run,
}
