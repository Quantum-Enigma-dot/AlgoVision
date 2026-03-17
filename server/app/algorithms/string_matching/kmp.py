from __future__ import annotations

from typing import Any, Dict, List

CODE = """def kmp_search(text, pattern):
    def build_lps(p):
        lps = [0] * len(p)
        length = 0
        i = 1
        while i < len(p):
            if p[i] == p[length]:
                length += 1
                lps[i] = length
                i += 1
            elif length:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
        return lps

    lps = build_lps(pattern)
    i = j = 0
    matches = []
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == len(pattern):
                matches.append(i - j)
                j = lps[j - 1]
        elif j:
            j = lps[j - 1]
        else:
            i += 1
    return matches
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    text = str(input_data.get("text", ""))
    pattern = str(input_data.get("pattern", ""))
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    if not pattern:
        return {
            "result": [],
            "steps": steps,
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(m)",
                "input_size": len(text),
            },
        }

    lps = [0] * len(pattern)
    length = 0
    i = 1
    while i < len(pattern):
        comparisons += 1
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            steps.append({"type": "lps", "index": i, "value": length, "lps": list(lps)})
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            lps[i] = 0
            steps.append({"type": "lps", "index": i, "value": 0, "lps": list(lps)})
            i += 1

    matches: List[int] = []
    i = 0
    j = 0
    while i < len(text):
        comparisons += 1
        steps.append(
            {
                "type": "compare",
                "text_index": i,
                "pattern_index": j,
                "text": text,
                "pattern": pattern,
                "match": text[i] == pattern[j],
            }
        )
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == len(pattern):
                matches.append(i - j)
                steps.append({"type": "match", "index": i - j, "text": text, "pattern": pattern})
                j = lps[j - 1]
        elif j:
            j = lps[j - 1]
        else:
            i += 1

    return {
        "result": matches,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(m)",
            "input_size": len(text),
        },
    }


ALGORITHM = {
    "name": "kmp",
    "display_name": "Knuth-Morris-Pratt",
    "category": "string",
    "description": "Uses a prefix table to skip redundant comparisons.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n + m)",
        "average_time": "O(n + m)",
        "worst_time": "O(n + m)",
        "space": "O(m)",
        "paradigm": "Automaton",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Large texts", "Repeated pattern searches"],
        "limitations": ["Extra preprocessing"],
        "optimization_tips": ["Reuse LPS for repeated searches"],
    },
    "run": run,
}
