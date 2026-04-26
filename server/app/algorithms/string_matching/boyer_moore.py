from __future__ import annotations

from typing import Any, Dict, List

CODE = """def boyer_moore(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0 or m > n:
        return []

    last = {ch: idx for idx, ch in enumerate(pattern)}
    matches = []
    shift = 0

    while shift <= n - m:
        j = m - 1
        while j >= 0 and pattern[j] == text[shift + j]:
            j -= 1

        if j < 0:
            matches.append(shift)
            shift += m - last.get(text[shift + m], -1) if shift + m < n else 1
        else:
            bad_char = text[shift + j]
            shift += max(1, j - last.get(bad_char, -1))

    return matches
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    text = str(input_data.get("text", ""))
    pattern = str(input_data.get("pattern", ""))
    n = len(text)
    m = len(pattern)

    steps: List[Dict[str, Any]] = []
    comparisons = 0

    if m == 0 or m > n:
        return {
            "result": [],
            "steps": steps,
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(alphabet)",
                "input_size": n,
            },
        }

    last = {ch: idx for idx, ch in enumerate(pattern)}
    matches: List[int] = []
    shift = 0

    while shift <= n - m:
        j = m - 1
        while j >= 0:
            comparisons += 1
            match = pattern[j] == text[shift + j]
            steps.append(
                {
                    "type": "compare",
                    "text": text,
                    "pattern": pattern,
                    "index": shift,
                    "text_index": shift + j,
                    "pattern_index": j,
                    "match": match,
                }
            )
            if not match:
                break
            j -= 1

        if j < 0:
            matches.append(shift)
            steps.append(
                {
                    "type": "match",
                    "index": shift,
                    "text": text,
                    "pattern": pattern,
                }
            )
            shift += m - last.get(text[shift + m], -1) if shift + m < n else 1
        else:
            bad_char = text[shift + j]
            jump = max(1, j - last.get(bad_char, -1))
            steps.append(
                {
                    "type": "shift",
                    "index": shift,
                    "text": text,
                    "pattern": pattern,
                    "text_index": shift + j,
                    "pattern_index": j,
                    "jump": jump,
                    "bad_char": bad_char,
                }
            )
            shift += jump

    return {
        "result": matches,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(alphabet)",
            "input_size": n,
        },
    }


ALGORITHM = {
    "name": "boyer_moore",
    "display_name": "Boyer-Moore",
    "category": "string",
    "description": "Efficient pattern matching using right-to-left scans and bad-character shifts.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n / m)",
        "average_time": "O(n)",
        "worst_time": "O(nm)",
        "space": "O(alphabet)",
        "paradigm": "String Processing",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Large text search", "Search engines", "Compiler token matching"],
        "limitations": ["Worst-case can degrade on some patterns"],
        "optimization_tips": ["Add good-suffix heuristic for stronger skipping"],
    },
    "run": run,
}
