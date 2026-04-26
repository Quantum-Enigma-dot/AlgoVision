"""Standalone offline Complexity Forensics engine.

This module is intentionally separate from AI advisor features. It performs
fully local static analysis for complexity estimation.
"""

from __future__ import annotations

from typing import Any, Dict, List

from app.services import offline_complexity

MODEL_NAME = "complexity-forensics-offline-v1"
TRAINING_PROFILE = (
    "feature-weighted static model trained offline on curated "
    "algorithmic complexity patterns"
)
SUPPORTED_LANGUAGES = ("c", "python", "cpp", "java", "go")


def analyze_complexity_forensics(code: str, language: str = "python") -> Dict[str, Any]:
    normalized_language = offline_complexity.normalize_language(language)

    if normalized_language not in SUPPORTED_LANGUAGES:
        supported = ", ".join(_language_label(item) for item in SUPPORTED_LANGUAGES)
        raise ValueError(
            f"Unsupported language '{language}'. Supported languages: {supported}."
        )

    cleaned = (code or "").strip("\n")
    if not cleaned.strip():
        return _empty_result(normalized_language)

    normalized_lines = offline_complexity._normalize_lines(cleaned, normalized_language)
    signals = offline_complexity.AnalysisSignals(language=normalized_language)

    offline_complexity._detect_loops(normalized_lines, signals)
    offline_complexity._detect_sort_usage(normalized_lines, signals)
    offline_complexity._detect_allocations(normalized_lines, signals)
    offline_complexity._detect_recursion(normalized_lines, signals)
    offline_complexity._detect_logarithmic_behavior(normalized_lines, signals)

    best_time, avg_time, worst_time = offline_complexity._infer_time_complexity(cleaned.lower(), signals)
    space_complexity = offline_complexity._infer_space_complexity(signals)
    dominant_pattern = offline_complexity._infer_pattern(signals)
    confidence = offline_complexity._infer_confidence(signals).upper()

    reasoning_trace = _build_reasoning_trace(signals, normalized_lines)
    explanation = _build_explanation(
        signals=signals,
        dominant_pattern=dominant_pattern,
        best_time=best_time,
        avg_time=avg_time,
        worst_time=worst_time,
        space_complexity=space_complexity,
    )
    hotspots = _build_hotspots(signals, normalized_lines)
    report = _build_report(
        normalized_language=normalized_language,
        dominant_pattern=dominant_pattern,
        best_time=best_time,
        avg_time=avg_time,
        worst_time=worst_time,
        space_complexity=space_complexity,
        confidence=confidence,
        explanation=explanation,
        reasoning_trace=reasoning_trace,
        hotspots=hotspots,
    )

    return {
        "language": normalized_language,
        "model": MODEL_NAME,
        "training_profile": TRAINING_PROFILE,
        "supported_languages": [_language_label(item) for item in SUPPORTED_LANGUAGES],
        "dominant_pattern": dominant_pattern,
        "time_complexity": {
            "best": best_time,
            "average": avg_time,
            "worst": worst_time,
        },
        "space_complexity": space_complexity,
        "confidence": confidence,
        "explanation": explanation,
        "reasoning_trace": reasoning_trace,
        "hotspots": hotspots,
        "report": report,
    }


def _empty_result(language: str) -> Dict[str, Any]:
    return {
        "language": language,
        "model": MODEL_NAME,
        "training_profile": TRAINING_PROFILE,
        "supported_languages": [_language_label(item) for item in SUPPORTED_LANGUAGES],
        "dominant_pattern": "No analyzable logic",
        "time_complexity": {
            "best": "Unknown",
            "average": "Unknown",
            "worst": "Unknown",
        },
        "space_complexity": "Unknown",
        "confidence": "LOW",
        "explanation": [
            "No code content was provided, so complexity cannot be estimated.",
            "Paste a complete function or method body for reliable analysis.",
        ],
        "reasoning_trace": ["Input validation failed: empty code string."],
        "hotspots": [],
        "report": (
            "## Complexity Forensics Report\n\n"
            "No code was provided. Paste code in C, Python, C++, Java, or Go."
        ),
    }


def _build_reasoning_trace(
    signals: offline_complexity.AnalysisSignals,
    normalized_lines: List[Dict[str, Any]],
) -> List[str]:
    trace: List[str] = []

    line_count = len(normalized_lines)
    non_empty_count = sum(1 for item in normalized_lines if item.get("stripped"))
    trace.append(
        f"Parsed {line_count} total line(s), with {non_empty_count} non-empty analyzable line(s)."
    )

    trace.append(
        f"Detected {len(signals.loop_lines)} loop statement(s); max loop nesting depth is {signals.max_loop_depth}."
    )

    if signals.log_loop_lines:
        lines = ", ".join(str(item) for item in sorted(set(signals.log_loop_lines)))
        trace.append(
            f"Detected logarithmic progression markers around loop line(s): {lines}."
        )

    if signals.recursive_functions:
        functions = ", ".join(sorted(set(signals.recursive_functions)))
        trace.append(f"Detected recursive function call pattern in: {functions}.")
        if signals.divide_and_conquer:
            trace.append("Multiple recursive branches indicate divide-and-conquer behavior.")

    if signals.sort_lines:
        lines = ", ".join(str(item) for item in sorted(set(signals.sort_lines)))
        trace.append(f"Detected library sorting usage on line(s): {lines}.")

    if signals.matrix_allocation_lines:
        lines = ", ".join(str(item) for item in sorted(set(signals.matrix_allocation_lines)))
        trace.append(f"Detected matrix/2D memory allocation on line(s): {lines}.")
    elif signals.allocation_lines:
        lines = ", ".join(str(item) for item in sorted(set(signals.allocation_lines)))
        trace.append(f"Detected auxiliary linear memory allocation on line(s): {lines}.")

    if len(trace) == 2:
        trace.append("No dominant loops/recursion/allocation signals were found.")

    return trace


def _build_explanation(
    signals: offline_complexity.AnalysisSignals,
    dominant_pattern: str,
    best_time: str,
    avg_time: str,
    worst_time: str,
    space_complexity: str,
) -> List[str]:
    explanation: List[str] = [
        f"Dominant pattern recognized: {dominant_pattern}.",
        (
            "Time estimate was derived from loop depth, recursion behavior, logarithmic loop markers, "
            "and sort-call detection."
        ),
        (
            f"Final time estimate: best {best_time}, average {avg_time}, worst {worst_time}."
        ),
        f"Auxiliary space estimate: {space_complexity}.",
    ]

    if signals.max_loop_depth >= 2:
        explanation.append(
            "Nested loops raise the dominant term (typically quadratic or higher) unless logarithmic shrink is present."
        )
    elif signals.max_loop_depth == 1:
        explanation.append(
            "Single-loop structure indicates linear work unless loop progress is logarithmic."
        )

    if signals.recursive_functions:
        if signals.divide_and_conquer:
            explanation.append(
                "Multiple recursive branches suggest divide-and-conquer recurrence behavior."
            )
        else:
            explanation.append(
                "Single-branch recursion contributes stack growth and can add linear recursive cost."
            )

    if signals.log_loop_lines:
        explanation.append(
            "Bit-shifts, halving, or binary-search style bounds indicate logarithmic progress in at least one loop."
        )

    return explanation


def _build_hotspots(
    signals: offline_complexity.AnalysisSignals,
    normalized_lines: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    if not signals.hotspots:
        return []

    line_lookup = {
        item["line_no"]: str(item.get("raw", "")).strip()
        for item in normalized_lines
    }

    hotspots: List[Dict[str, Any]] = []
    for line_no, reasons in sorted(signals.hotspots.items(), key=lambda pair: pair[0])[:10]:
        snippet = line_lookup.get(line_no, "")
        if len(snippet) > 120:
            snippet = snippet[:117] + "..."
        hotspots.append(
            {
                "line_number": line_no,
                "snippet": snippet,
                "signals": sorted(set(reasons)),
            }
        )
    return hotspots


def _build_report(
    normalized_language: str,
    dominant_pattern: str,
    best_time: str,
    avg_time: str,
    worst_time: str,
    space_complexity: str,
    confidence: str,
    explanation: List[str],
    reasoning_trace: List[str],
    hotspots: List[Dict[str, Any]],
) -> str:
    language_label = _language_label(normalized_language)
    hotspot_lines = [
        f"- Line {item['line_number']}: `{item['snippet']}` -> {', '.join(item['signals'])}"
        for item in hotspots
    ]

    if not hotspot_lines:
        hotspot_lines = ["- No dominant hotspot lines detected."]

    return "\n".join(
        [
            "## Complexity Forensics Report",
            "",
            f"Language: **{language_label}**",
            f"Model: **{MODEL_NAME}**",
            "",
            "### Final Complexity",
            f"- Best time: **{best_time}**",
            f"- Average time: **{avg_time}**",
            f"- Worst time: **{worst_time}**",
            f"- Auxiliary space: **{space_complexity}**",
            "",
            "### Dominant Pattern",
            f"- {dominant_pattern}",
            "",
            "### Why This Estimate",
            *[f"- {item}" for item in explanation],
            "",
            "### Forensics Trace",
            *[f"- {item}" for item in reasoning_trace],
            "",
            "### Complexity Hotspots",
            *hotspot_lines,
            "",
            "### Confidence",
            f"- **{confidence}**",
            "",
            "### Note",
            "- This report is produced fully offline using static feature analysis only.",
        ]
    )


def _language_label(language: str) -> str:
    labels = {
        "c": "C",
        "python": "Python",
        "cpp": "C++",
        "java": "Java",
        "go": "Go",
    }
    return labels.get(language, language)
