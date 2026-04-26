"""Local code visualization endpoints — Code Flow, Code Stats, Code Review."""

from __future__ import annotations

import re

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class CodeVizRequest(BaseModel):
    code: str
    language: Optional[str] = "python"
    action: str  # "flow", "stats", "review", "optimize"


class CodeVizResponse(BaseModel):
    result: str
    model: str = ""


def _non_empty_lines(code: str) -> list[str]:
    return [line for line in code.splitlines() if line.strip()]


def _estimate_complexity(code: str) -> str:
    loops = len(re.findall(r"\b(for|while)\b", code))
    recursion = len(re.findall(r"\b(def|function|void|int|float|double|char)\s+([A-Za-z_]\w*)\s*\(", code))
    if loops >= 2:
        return "O(n^2)"
    if loops == 1:
        return "O(n)"
    if recursion >= 1 and "binary" in code.lower():
        return "O(log n)"
    return "O(1) to O(n)"


def _collect_issues(code: str) -> list[str]:
    issues: list[str] = []
    lowered = code.lower()
    if "eval(" in lowered or "exec(" in lowered:
        issues.append("Unsafe dynamic execution detected (eval/exec)")
    if "password" in lowered or "api_key" in lowered or "secret" in lowered:
        issues.append("Potential hardcoded credential detected")
    if "try:" not in lowered and "except" not in lowered and "catch" not in lowered:
        issues.append("No explicit error handling detected")
    if len(_non_empty_lines(code)) > 100:
        issues.append("Large function/file may reduce readability")
    return issues


def _build_flow(code: str) -> str:
    lines = _non_empty_lines(code)
    nodes = ["NODE|1|START|Program Start|Entry point"]
    edges = []
    node_id = 2
    prev_id = 1

    for raw in lines:
        line = raw.strip()
        lower = line.lower()
        node_type = "PROCESS"
        details = "Statement"

        if re.search(r"\b(def|function|void|int|float|double|char)\b", line) and "(" in line and ")" in line:
            node_type = "FUNCTION"
            details = "Function definition"
        elif re.search(r"\bif\b|\belse if\b|\belif\b|\bswitch\b", lower):
            node_type = "CONDITION"
            details = "Branching condition"
        elif re.search(r"\bfor\b|\bwhile\b", lower):
            node_type = "LOOP"
            details = "Iteration"
        elif re.search(r"\bprint\b|\bscanf\b|\bprintf\b|\binput\b", lower):
            node_type = "IO"
            details = "Input/Output"
        elif re.search(r"\breturn\b", lower):
            node_type = "RETURN"
            details = "Return value"

        label = line[:60].replace("|", "/")
        nodes.append(f"NODE|{node_id}|{node_type}|{label}|{details}")
        edges.append(f"EDGE|{prev_id}|{node_id}|next")
        prev_id = node_id
        node_id += 1

    nodes.append(f"NODE|{node_id}|END|Program End|Exit point")
    edges.append(f"EDGE|{prev_id}|{node_id}|end")

    return "\n".join(nodes + edges)


def _build_stats(code: str) -> str:
    lines = _non_empty_lines(code)
    functions = len(re.findall(r"\bdef\s+\w+\s*\(|\b[A-Za-z_]\w*\s+\*?\w+\s*\([^;]*\)\s*\{", code))
    classes = len(re.findall(r"\bclass\s+\w+", code))
    issues = _collect_issues(code)
    complexity = _estimate_complexity(code)

    risk_score = min(100, 20 + len(issues) * 20)
    quality_score = max(0, 85 - len(issues) * 12)

    patterns: list[str] = []
    lowered = code.lower()
    if "dp" in lowered or "memo" in lowered or "tabulation" in lowered:
        patterns.append("Dynamic Programming")
    if "queue" in lowered or "stack" in lowered:
        patterns.append("Queue/Stack")
    if "graph" in lowered or "adj" in lowered:
        patterns.append("Graph Traversal")
    if "sort" in lowered:
        patterns.append("Sorting")

    suggestions = [
        "Add input validation",
        "Handle edge cases",
        "Add comments for critical logic",
        "Add tests for boundary conditions",
    ]

    return "\n".join(
        [
            f"LINES: {len(lines)}",
            f"FUNCTIONS: {functions}",
            f"CLASSES: {classes}",
            f"COMPLEXITY: {complexity}",
            f"RISK_SCORE: {risk_score}",
            f"QUALITY_SCORE: {quality_score}",
            f"ISSUES: {', '.join(issues) if issues else 'No major issues detected'}",
            f"PATTERNS: {', '.join(patterns) if patterns else 'General imperative style'}",
            f"SUGGESTIONS: {', '.join(suggestions)}",
        ]
    )


def _build_review(code: str) -> str:
    issues = _collect_issues(code)
    complexity = _estimate_complexity(code)
    issues_block = "\n".join(
        [f"- Severity: Medium | Line: approx | Issue: {issue} | Fix: Refactor and validate inputs" for issue in issues]
    ) or "- No major issues detected"

    return (
        "## Code Quality Assessment\n"
        "Readable overall, but improvements are possible for robustness and maintainability.\n\n"
        "## Issues Found\n"
        f"{issues_block}\n\n"
        "## Security Analysis\n"
        "Checked for dynamic execution, hardcoded secrets, and missing validation patterns.\n\n"
        "## Performance Analysis\n"
        f"- Estimated time complexity: {complexity}\n"
        "- Space complexity: depends on data structures used\n"
        "- Bottlenecks: repeated loops and branch-heavy logic\n"
        "- Opportunities: reduce nested loops, memoize repeated work\n\n"
        "## Best Practices\n"
        "Add targeted comments, clear naming, and boundary checks.\n\n"
        "## Improved Version\n"
        "Use smaller functions, explicit validation, and tests for edge cases."
    )


def _build_optimize(code: str, language: str) -> str:
    return (
        "## Optimization Plan\n"
        "1. Validate input early and fail fast\n"
        "2. Extract repeated logic into helper functions\n"
        "3. Replace nested loops where possible\n"
        "4. Add tests for edge and stress cases\n\n"
        f"## Original ({language})\n"
        f"```{language}\n{code}\n```\n\n"
        "## Improved (Template)\n"
        f"```{language}\n"
        "# Refactor suggestion:\n"
        "# - add input guards\n"
        "# - split into focused helper functions\n"
        "# - preserve original behavior with tests\n"
        "```\n\n"
        "## Complexity Comparison\n"
        "- Before: inferred from current structure\n"
        "- After: potentially reduced with algorithmic/data-structure improvements"
    )


@router.post("/codeviz", response_model=CodeVizResponse)
def codeviz_endpoint(payload: CodeVizRequest) -> CodeVizResponse:
    action = payload.action.lower().strip()
    code = payload.code or ""
    if not code.strip():
        raise HTTPException(status_code=400, detail="No code provided.")

    if action not in {"flow", "stats", "review", "optimize"}:
        raise HTTPException(status_code=400, detail=f"Unknown action: {action}. Use: flow, stats, review, optimize")

    language = (payload.language or "python").lower().strip()
    if action == "flow":
        result = _build_flow(code)
    elif action == "stats":
        result = _build_stats(code)
    elif action == "review":
        result = _build_review(code)
    else:
        result = _build_optimize(code, language)

    return CodeVizResponse(result=result, model="local")
