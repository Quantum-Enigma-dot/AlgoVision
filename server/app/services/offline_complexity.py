"""Offline static complexity estimator for user-submitted code.

This module avoids external AI calls and infers complexity from code patterns.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

SUPPORTED_LANGUAGES = {"python", "c", "cpp", "java", "javascript", "go"}

LANGUAGE_ALIASES = {
    "py": "python",
    "js": "javascript",
    "node": "javascript",
    "c++": "cpp",
    "golang": "go",
}

PY_LOOP_RE = re.compile(r"^(for|while)\b")
C_STYLE_LOOP_RE = re.compile(r"\b(for|while)\s*\(")
LOOP_HEADER_RE = re.compile(r"\b(for|while)\b[^:;{]*[:{]?")

PY_DEF_RE = re.compile(r"^\s*def\s+([A-Za-z_]\w*)\s*\(")
JS_DEF_RE = re.compile(r"^\s*function\s+([A-Za-z_$]\w*)\s*\(")
JS_ARROW_RE = re.compile(r"^\s*(?:const|let|var)\s+([A-Za-z_$]\w*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>")
GO_DEF_RE = re.compile(r"^\s*func\s+([A-Za-z_]\w*)\s*\(")
GENERIC_DEF_RE = re.compile(
    r"^\s*(?:public\s+|private\s+|protected\s+|static\s+|final\s+|inline\s+|virtual\s+|const\s+|synchronized\s+)*"
    r"[A-Za-z_][\w<>,\[\]\s\*&:]*\s+([A-Za-z_]\w*)\s*\([^;]*\)\s*\{?\s*$"
)

STRING_RE = re.compile(r"\"([^\"\\]|\\.)*\"|'([^'\\]|\\.)*'")

SORT_PATTERNS = [
    re.compile(r"\.sort\s*\("),
    re.compile(r"\bsorted\s*\("),
    re.compile(r"\bArrays\.sort\s*\("),
    re.compile(r"\bCollections\.sort\s*\("),
    re.compile(r"\bsort\.[A-Za-z_]+\s*\("),
    re.compile(r"\bstd::sort\s*\("),
    re.compile(r"\bqsort\s*\("),
]

MATRIX_ALLOC_PATTERNS = [
    re.compile(r"vector\s*<\s*vector\s*<"),
    re.compile(r"\[[^\]]+\]\s*\[[^\]]+\]"),
    re.compile(r"\[\s*\["),
    re.compile(r"make\s*\(\s*\[\]\s*\[\]"),
]

LINEAR_ALLOC_PATTERNS = [
    re.compile(r"\bmalloc\s*\("),
    re.compile(r"\bcalloc\s*\("),
    re.compile(r"\bnew\s+[A-Za-z_][\w<>]*\s*\["),
    re.compile(r"\bnew\s+ArrayList\s*\("),
    re.compile(r"\bmake\s*\(\s*\[\]"),
    re.compile(r"\bvector\s*<"),
    re.compile(r"\blist\s*\("),
    re.compile(r"\[\s*0\s*\]\s*\*\s*[A-Za-z_\d]"),
]

COMPLEXITY_RANK = {
    "O(1)": 0,
    "O(log n)": 1,
    "O(n)": 2,
    "O(n log n)": 3,
    "O(n^2)": 4,
    "O(n^3)": 5,
    "O(2^n)": 6,
}


@dataclass
class AnalysisSignals:
    language: str
    loop_lines: list[int] = field(default_factory=list)
    log_loop_lines: list[int] = field(default_factory=list)
    max_loop_depth: int = 0
    recursion_lines: list[int] = field(default_factory=list)
    recursive_functions: list[str] = field(default_factory=list)
    divide_and_conquer: bool = False
    sort_lines: list[int] = field(default_factory=list)
    allocation_lines: list[int] = field(default_factory=list)
    matrix_allocation_lines: list[int] = field(default_factory=list)
    hotspots: dict[int, list[str]] = field(default_factory=dict)
    loop_variables: list[set[str]] = field(default_factory=list)


def normalize_language(language: str | None) -> str:
    key = (language or "python").strip().lower()
    return LANGUAGE_ALIASES.get(key, key)


def analyze_code_complexity(code: str, language: str = "python") -> dict:
    normalized_language = normalize_language(language)
    if normalized_language not in SUPPORTED_LANGUAGES:
        supported = ", ".join(sorted(SUPPORTED_LANGUAGES))
        return {
            "response": (
                f"## Offline Complexity Report\n\n"
                f"Unsupported language '{language}'. Supported languages: {supported}."
            ),
            "model": "offline-complexity-v1",
        }

    cleaned = (code or "").strip("\n")
    if not cleaned.strip():
        return {
            "response": "## Offline Complexity Report\n\nNo code provided.",
            "model": "offline-complexity-v1",
        }

    normalized_lines = _normalize_lines(cleaned, normalized_language)
    signals = AnalysisSignals(language=normalized_language)

    _detect_loops(normalized_lines, signals)
    _detect_sort_usage(normalized_lines, signals)
    _detect_allocations(normalized_lines, signals)
    _detect_recursion(normalized_lines, signals)
    _detect_logarithmic_behavior(normalized_lines, signals)

    best_time, average_time, worst_time = _infer_time_complexity(cleaned.lower(), signals)
    space_complexity = _infer_space_complexity(signals)
    pattern = _infer_pattern(signals)
    confidence = _infer_confidence(signals)

    response = _build_markdown_response(
        normalized_language,
        pattern,
        best_time,
        average_time,
        worst_time,
        space_complexity,
        signals,
        normalized_lines,
        confidence,
    )

    return {
        "response": response,
        "model": "offline-complexity-v1",
    }


def _normalize_lines(code: str, language: str) -> list[dict]:
    lines: list[dict] = []
    in_block_comment = False

    for index, raw_line in enumerate(code.splitlines(), start=1):
        line = raw_line

        if language == "python":
            line = line.split("#", 1)[0]
        else:
            line, in_block_comment = _strip_c_style_comments(line, in_block_comment)

        sanitized = _strip_string_literals(line)
        lines.append(
            {
                "line_no": index,
                "raw": raw_line,
                "sanitized": sanitized,
                "stripped": sanitized.strip(),
                "indent": _indent_level(raw_line),
            }
        )

    return lines


def _strip_c_style_comments(line: str, in_block_comment: bool) -> tuple[str, bool]:
    current = line

    if in_block_comment:
        end = current.find("*/")
        if end == -1:
            return "", True
        current = current[end + 2 :]
        in_block_comment = False

    while True:
        block_start = current.find("/*")
        line_start = current.find("//")

        if block_start != -1 and (line_start == -1 or block_start < line_start):
            block_end = current.find("*/", block_start + 2)
            if block_end == -1:
                current = current[:block_start]
                return current, True
            current = current[:block_start] + " " + current[block_end + 2 :]
            continue

        if line_start != -1:
            current = current[:line_start]
        break

    return current, in_block_comment


def _strip_string_literals(line: str) -> str:
    return STRING_RE.sub('""', line)


def _indent_level(raw_line: str) -> int:
    expanded = raw_line.replace("\t", "    ")
    return len(expanded) - len(expanded.lstrip(" "))


def _detect_loops(lines: list[dict], signals: AnalysisSignals) -> None:
    if signals.language == "python":
        _detect_python_loops(lines, signals)
    else:
        _detect_brace_loops(lines, signals)


def _detect_python_loops(lines: list[dict], signals: AnalysisSignals) -> None:
    stack: list[tuple[int, bool]] = []

    for line in lines:
        stripped = line["stripped"]
        if not stripped:
            continue

        indent = line["indent"]
        while stack and indent <= stack[-1][0]:
            stack.pop()

        active_loop_depth = sum(1 for _, is_loop in stack if is_loop)
        is_loop = bool(PY_LOOP_RE.match(stripped))

        if is_loop:
            depth = active_loop_depth + 1
            signals.max_loop_depth = max(signals.max_loop_depth, depth)
            signals.loop_lines.append(line["line_no"])
            signals.loop_variables.append(_extract_loop_variables(stripped, signals.language))
            _mark_hotspot(signals, line["line_no"], "loop iteration")

        if stripped.endswith(":"):
            stack.append((indent, is_loop))


def _detect_brace_loops(lines: list[dict], signals: AnalysisSignals) -> None:
    brace_depth = 0
    active_loop_scopes: list[int] = []

    for line in lines:
        stripped = line["stripped"]
        sanitized = line["sanitized"]

        while active_loop_scopes and brace_depth < active_loop_scopes[-1]:
            active_loop_scopes.pop()

        if stripped and C_STYLE_LOOP_RE.search(stripped):
            depth = len(active_loop_scopes) + 1
            signals.max_loop_depth = max(signals.max_loop_depth, depth)
            signals.loop_lines.append(line["line_no"])
            signals.loop_variables.append(_extract_loop_variables(stripped, signals.language))
            _mark_hotspot(signals, line["line_no"], "loop iteration")
            active_loop_scopes.append(brace_depth + 1)

        brace_depth += sanitized.count("{") - sanitized.count("}")
        if brace_depth < 0:
            brace_depth = 0

        while active_loop_scopes and brace_depth < active_loop_scopes[-1]:
            active_loop_scopes.pop()


def _detect_sort_usage(lines: list[dict], signals: AnalysisSignals) -> None:
    for line in lines:
        snippet = line["stripped"]
        if not snippet:
            continue
        if any(pattern.search(snippet) for pattern in SORT_PATTERNS):
            signals.sort_lines.append(line["line_no"])
            _mark_hotspot(signals, line["line_no"], "library sorting call")


def _detect_allocations(lines: list[dict], signals: AnalysisSignals) -> None:
    for line in lines:
        snippet = line["stripped"]
        if not snippet:
            continue

        if any(pattern.search(snippet) for pattern in MATRIX_ALLOC_PATTERNS):
            signals.matrix_allocation_lines.append(line["line_no"])
            _mark_hotspot(signals, line["line_no"], "2D/matrix allocation")
            continue

        if any(pattern.search(snippet) for pattern in LINEAR_ALLOC_PATTERNS):
            signals.allocation_lines.append(line["line_no"])
            _mark_hotspot(signals, line["line_no"], "auxiliary data allocation")


def _detect_recursion(lines: list[dict], signals: AnalysisSignals) -> None:
    definitions: dict[str, int] = {}

    for line in lines:
        stripped = line["stripped"]
        if not stripped:
            continue

        function_name = _extract_function_name(stripped, signals.language)
        if function_name:
            definitions[function_name] = line["line_no"]

    if not definitions:
        return

    for function_name, declaration_line in definitions.items():
        call_pattern = re.compile(rf"\b{re.escape(function_name)}\s*\(")
        call_lines: list[int] = []

        for line in lines:
            if line["line_no"] == declaration_line:
                continue
            if call_pattern.search(line["stripped"]):
                call_lines.append(line["line_no"])
                _mark_hotspot(signals, line["line_no"], f"recursive call to {function_name}()")

        if call_lines:
            signals.recursive_functions.append(function_name)
            signals.recursion_lines.extend(call_lines)

            if len(call_lines) >= 2:
                signals.divide_and_conquer = True

            repeated_calls_same_line = any(
                len(call_pattern.findall(line["stripped"])) >= 2 for line in lines
            )
            if repeated_calls_same_line:
                signals.divide_and_conquer = True


def _extract_function_name(stripped_line: str, language: str) -> str | None:
    if language == "python":
        match = PY_DEF_RE.match(stripped_line)
        return match.group(1) if match else None

    if language == "javascript":
        match = JS_DEF_RE.match(stripped_line) or JS_ARROW_RE.match(stripped_line)
        return match.group(1) if match else None

    if language == "go":
        match = GO_DEF_RE.match(stripped_line)
        return match.group(1) if match else None

    match = GENERIC_DEF_RE.match(stripped_line)
    if not match:
        return None

    candidate = match.group(1)
    if candidate in {"if", "for", "while", "switch", "return"}:
        return None
    return candidate


def _detect_logarithmic_behavior(lines: list[dict], signals: AnalysisSignals) -> None:
    if not signals.loop_lines:
        return

    marker_re = re.compile(r"/=\s*2|>>=|<<=|\*=\s*2|mid\s*=|low\s*<=\s*high|left\s*<=\s*right")
    line_index = {line["line_no"]: idx for idx, line in enumerate(lines)}

    for loop_line in signals.loop_lines:
        index = line_index[loop_line]
        window = lines[index : min(len(lines), index + 4)]
        window_text = "\n".join(item["stripped"].lower() for item in window)

        if marker_re.search(window_text):
            signals.log_loop_lines.append(loop_line)
            _mark_hotspot(signals, loop_line, "logarithmic progress pattern")


def _extract_loop_variables(stripped_line: str, language: str) -> set[str]:
    text = stripped_line.lower()

    # Common graph dimension hints.
    graph_tokens = {
        "v": re.compile(r"\b(v|vertices|vertex_count|num_vertices|node_count|n_nodes)\b"),
        "e": re.compile(r"\b(e|edges|edge_count|num_edges|m_edges)\b"),
    }
    for key, pattern in graph_tokens.items():
        if pattern.search(text):
            return {key}

    # Generic dimension tokens for nested-loop shape detection.
    candidates = [
        "n",
        "m",
        "k",
        "w",
        "len(a)",
        "len(b)",
    ]
    found: set[str] = set()

    if "len(" in text:
        if re.search(r"len\s*\(\s*(a|arr|array1|left|text1)\s*\)", text):
            found.add("n")
        if re.search(r"len\s*\(\s*(b|arr2|array2|right|text2|pattern)\s*\)", text):
            found.add("m")

    if re.search(r"\bn\b", text):
        found.add("n")
    if re.search(r"\bm\b", text):
        found.add("m")
    if re.search(r"\bk\b", text):
        found.add("k")
    if re.search(r"\bw\b", text):
        found.add("w")

    if not found:
        # Fallback: inspect loop header for symbolic upper bounds.
        header_match = LOOP_HEADER_RE.search(text)
        header = header_match.group(0) if header_match else text
        for token in candidates:
            raw_token = token.replace("(", "\\(").replace(")", "\\)")
            if re.search(rf"\b{raw_token}\b", header):
                if token in {"len(a)", "n"}:
                    found.add("n")
                elif token in {"len(b)", "m"}:
                    found.add("m")
                else:
                    found.add(token)

    return found


def _infer_product_term(signals: AnalysisSignals) -> str | None:
    if signals.max_loop_depth <= 1:
        return None

    if not signals.loop_variables:
        return None

    merged: list[str] = []
    for var_set in signals.loop_variables[: max(2, signals.max_loop_depth)]:
        if not var_set:
            continue
        for item in sorted(var_set):
            if item not in merged:
                merged.append(item)

    if not merged:
        return None

    if "v" in merged and "e" in merged:
        return "VE"

    if "n" in merged and "m" in merged:
        return "nm"

    if len(merged) >= 2:
        return "".join(merged[:2])

    return None


def _infer_time_complexity(code_lower: str, signals: AnalysisSignals) -> tuple[str, str, str]:
    if signals.recursive_functions:
        if "quick" in code_lower and signals.divide_and_conquer:
            return ("O(n log n)", "O(n log n)", "O(n^2)")

        if signals.divide_and_conquer:
            return ("O(n log n)", "O(n log n)", "O(n log n)")

        linear_recurrence = bool(re.search(r"n\s*[-+]\s*1|len\(.*\)\s*-\s*1", code_lower))
        if linear_recurrence:
            return ("O(n)", "O(n)", "O(n)")

        return ("O(2^n)", "O(2^n)", "O(2^n)")

    if signals.sort_lines and signals.max_loop_depth <= 1:
        return ("O(n log n)", "O(n log n)", "O(n log n)")

    product_term = _infer_product_term(signals)

    if signals.max_loop_depth >= 3:
        return ("O(n^3)", "O(n^3)", "O(n^3)")

    if signals.max_loop_depth == 2:
        if product_term:
            if signals.log_loop_lines:
                return (f"O({product_term} log n)", f"O({product_term} log n)", f"O({product_term} log n)")
            return (f"O({product_term})", f"O({product_term})", f"O({product_term})")
        if signals.log_loop_lines:
            return ("O(n log n)", "O(n log n)", "O(n log n)")
        return ("O(n^2)", "O(n^2)", "O(n^2)")

    if signals.max_loop_depth == 1:
        if signals.log_loop_lines:
            return ("O(log n)", "O(log n)", "O(log n)")
        return ("O(n)", "O(n)", "O(n)")

    return ("O(1)", "O(1)", "O(1)")


def _infer_space_complexity(signals: AnalysisSignals) -> str:
    estimate = "O(1)"

    if signals.matrix_allocation_lines:
        estimate = "O(n^2)"
    elif signals.allocation_lines:
        estimate = "O(n)"

    if signals.recursive_functions:
        recursion_stack = "O(log n)" if signals.divide_and_conquer else "O(n)"
        estimate = _max_complexity(estimate, recursion_stack)

    return estimate


def _max_complexity(left: str, right: str) -> str:
    left_rank = COMPLEXITY_RANK.get(left, 0)
    right_rank = COMPLEXITY_RANK.get(right, 0)
    return left if left_rank >= right_rank else right


def _infer_pattern(signals: AnalysisSignals) -> str:
    if signals.sort_lines:
        return "Sorting-oriented implementation"
    if signals.recursive_functions and signals.divide_and_conquer:
        return "Divide-and-conquer recursion"
    if signals.recursive_functions:
        return "Recursive/backtracking style"
    if signals.max_loop_depth >= 2:
        product_term = _infer_product_term(signals)
        if product_term:
            return f"Nested-iteration over multiple dimensions ({product_term})"
        return "Nested-iteration dynamic programming style"
    if signals.max_loop_depth == 1 and signals.log_loop_lines:
        return "Binary-search/logarithmic loop style"
    if signals.max_loop_depth == 1:
        return "Linear scan/iterative processing"
    return "Direct computation / constant-work routine"


def _infer_confidence(signals: AnalysisSignals) -> str:
    if signals.max_loop_depth >= 2 or signals.divide_and_conquer or signals.sort_lines:
        return "high"
    if signals.max_loop_depth == 1 or signals.recursive_functions:
        return "medium"
    return "low"


def _build_markdown_response(
    language: str,
    pattern: str,
    best_time: str,
    average_time: str,
    worst_time: str,
    space_complexity: str,
    signals: AnalysisSignals,
    lines: list[dict],
    confidence: str,
) -> str:
    language_label = language.upper() if language != "cpp" else "C++"

    reasons = []
    if signals.max_loop_depth:
        reasons.append(f"Detected loop nesting depth: **{signals.max_loop_depth}**")
    if signals.log_loop_lines:
        reasons.append(
            "Detected logarithmic progress markers on loop lines: "
            + ", ".join(str(line_no) for line_no in sorted(set(signals.log_loop_lines)))
        )
    if signals.recursive_functions:
        recursive_list = ", ".join(sorted(set(signals.recursive_functions)))
        reasons.append(f"Detected recursive function(s): **{recursive_list}**")
    if signals.sort_lines:
        reasons.append(
            "Detected library sorting calls on line(s): "
            + ", ".join(str(line_no) for line_no in sorted(set(signals.sort_lines)))
        )
    if signals.matrix_allocation_lines:
        reasons.append(
            "Detected matrix/2D allocation on line(s): "
            + ", ".join(str(line_no) for line_no in sorted(set(signals.matrix_allocation_lines)))
        )
    elif signals.allocation_lines:
        reasons.append(
            "Detected auxiliary allocations on line(s): "
            + ", ".join(str(line_no) for line_no in sorted(set(signals.allocation_lines)))
        )

    if not reasons:
        reasons.append("No clear loops, recursion, or large auxiliary allocations were detected.")

    hot_lines = _format_hot_lines(signals, lines)

    return "\n".join(
        [
            "## Offline Complexity Report",
            "",
            f"Language: **{language_label}**",
            f"Model: **offline-complexity-v1**",
            "",
            "### Estimated Pattern",
            f"- {pattern}",
            "",
            "### Estimated Time Complexity",
            f"- Best case: **{best_time}**",
            f"- Average case: **{average_time}**",
            f"- Worst case: **{worst_time}**",
            "",
            "### Estimated Space Complexity",
            f"- Auxiliary space: **{space_complexity}**",
            "",
            "### Why This Estimate",
            *[f"- {item}" for item in reasons],
            "",
            "### Hot Lines Driving Complexity",
            *hot_lines,
            "",
            "### Confidence",
            f"- **{confidence.upper()}** (static heuristic analysis)",
            "",
            "### Note",
            "- This is an offline static estimate. Dynamic behavior and input distribution can change real runtime.",
        ]
    )


def _format_hot_lines(signals: AnalysisSignals, lines: list[dict]) -> list[str]:
    if not signals.hotspots:
        return ["- No dominant hotspot lines were identified."]

    line_lookup = {line["line_no"]: line["raw"].strip() for line in lines}
    ordered = sorted(signals.hotspots.items(), key=lambda item: item[0])[:8]

    output = []
    for line_no, reasons in ordered:
        snippet = line_lookup.get(line_no, "").strip()
        if len(snippet) > 110:
            snippet = snippet[:107] + "..."
        joined_reasons = ", ".join(sorted(set(reasons)))
        output.append(f"- Line {line_no}: `{snippet}` -> {joined_reasons}")

    return output


def _mark_hotspot(signals: AnalysisSignals, line_no: int, reason: str) -> None:
    signals.hotspots.setdefault(line_no, []).append(reason)
