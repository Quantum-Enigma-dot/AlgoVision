from __future__ import annotations

from typing import Any, Dict, List

CODE = """def naive_search(text, pattern):
    matches = []
    for i in range(len(text) - len(pattern) + 1):
        if text[i:i+len(pattern)] == pattern:
            matches.append(i)
    return matches
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    text = str(input_data.get("text", ""))
    pattern = str(input_data.get("pattern", ""))
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    matches: List[int] = []

    if not pattern:
        return {
            "result": matches,
            "steps": steps,
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(1)",
                "input_size": len(text),
            },
        }

    for i in range(len(text) - len(pattern) + 1):
        matched = True
        for j in range(len(pattern)):
            comparisons += 1
            step = {
                "type": "compare",
                "index": i,
                "pattern_index": j,
                "text": text,
                "pattern": pattern,
                "match": text[i + j] == pattern[j],
            }
            steps.append(step)
            if text[i + j] != pattern[j]:
                matched = False
                break
        if matched:
            matches.append(i)
            steps.append(
                {
                    "type": "match",
                    "index": i,
                    "text": text,
                    "pattern": pattern,
                }
            )

    return {
        "result": matches,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(1)",
            "input_size": len(text),
        },
    }


ALGORITHM = {
    "name": "naive",
    "display_name": "Naive Pattern Matching",
    "category": "string",
    "description": "Checks each alignment of pattern against the text.",
    "code": CODE,
    "complexity": {
        "best_time": "O(nm)",
        "average_time": "O(nm)",
        "worst_time": "O(nm)",
        "space": "O(1)",
        "paradigm": "Brute Force",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Small inputs", "Baseline comparisons"],
        "limitations": ["Slow for long texts"],
        "optimization_tips": ["Use KMP for larger patterns"],
    },
    "run": run,
}
