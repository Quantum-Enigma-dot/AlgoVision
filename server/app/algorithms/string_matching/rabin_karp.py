from __future__ import annotations

from typing import Any, Dict, List

CODE = """def rabin_karp(text, pattern):
    base = 256
    mod = 101
    m = len(pattern)
    n = len(text)
    if m > n:
        return []
    h = pow(base, m - 1, mod)
    p_hash = 0
    t_hash = 0
    for i in range(m):
        p_hash = (base * p_hash + ord(pattern[i])) % mod
        t_hash = (base * t_hash + ord(text[i])) % mod
    matches = []
    for i in range(n - m + 1):
        if p_hash == t_hash and text[i:i+m] == pattern:
            matches.append(i)
        if i < n - m:
            t_hash = (base * (t_hash - ord(text[i]) * h) + ord(text[i + m])) % mod
            if t_hash < 0:
                t_hash += mod
    return matches
"""


def run(input_data: Dict[str, Any], _options: Dict[str, Any]) -> Dict[str, Any]:
    text = str(input_data.get("text", ""))
    pattern = str(input_data.get("pattern", ""))
    steps: List[Dict[str, Any]] = []
    comparisons = 0

    base = 256
    mod = 101
    m = len(pattern)
    n = len(text)

    if m == 0 or m > n:
        return {
            "result": [],
            "steps": steps,
            "metrics": {
                "comparisons": 0,
                "swaps": 0,
                "recursion_depth": 0,
                "space_estimate": "O(1)",
                "input_size": n,
            },
        }

    h = pow(base, m - 1, mod)
    p_hash = 0
    t_hash = 0
    for i in range(m):
        p_hash = (base * p_hash + ord(pattern[i])) % mod
        t_hash = (base * t_hash + ord(text[i])) % mod

    matches: List[int] = []
    for i in range(n - m + 1):
        comparisons += 1
        match = False
        if p_hash == t_hash:
            if text[i : i + m] == pattern:
                matches.append(i)
                match = True
        steps.append(
            {
                "type": "hash",
                "index": i,
                "pattern_hash": p_hash,
                "text_hash": t_hash,
                "match": match,
                "text": text,
                "pattern": pattern,
            }
        )
        if i < n - m:
            t_hash = (base * (t_hash - ord(text[i]) * h) + ord(text[i + m])) % mod
            if t_hash < 0:
                t_hash += mod

    return {
        "result": matches,
        "steps": steps,
        "metrics": {
            "comparisons": comparisons,
            "swaps": 0,
            "recursion_depth": 0,
            "space_estimate": "O(1)",
            "input_size": n,
        },
    }


ALGORITHM = {
    "name": "rabin_karp",
    "display_name": "Rabin-Karp",
    "category": "string",
    "description": "Uses rolling hashes to find pattern matches.",
    "code": CODE,
    "complexity": {
        "best_time": "O(n + m)",
        "average_time": "O(n + m)",
        "worst_time": "O(nm)",
        "space": "O(1)",
        "paradigm": "Hashing",
        "stable": True,
    },
    "theory": {
        "use_cases": ["Multiple pattern search", "Plagiarism detection"],
        "limitations": ["Hash collisions possible"],
        "optimization_tips": ["Use larger mod or double hashing"],
    },
    "run": run,
}
