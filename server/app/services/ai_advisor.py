"""AI-powered algorithm advisor using Groq LLM."""

from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Any, Optional

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None  # type: ignore

try:
    from groq import Groq
except ImportError:
    Groq = None  # type: ignore

from app.services.offline_complexity import (
    SUPPORTED_LANGUAGES,
    analyze_code_complexity,
    normalize_language,
)

if load_dotenv is not None:
    # Load .env from common project locations without requiring shell exports.
    current = Path(__file__).resolve()
    candidate_envs = [
        current.parents[2] / ".env",  # server/.env
        current.parents[3] / ".env",  # project-root .env
    ]
    for env_path in candidate_envs:
        if env_path.exists():
            # Prioritize the first found file and override stale process env values.
            load_dotenv(dotenv_path=env_path, override=True)
            break

MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are AlgoVision AI — an expert algorithm tutor and advisor embedded in an interactive algorithm visualization platform. Your role is to help students and developers deeply understand algorithms.

Key guidelines:
- Be educational, clear, and concise
- Use examples and analogies when helpful
- Reference time/space complexity with Big-O notation
- When suggesting algorithms, explain WHY each is suitable
- Format responses using Markdown with headers, bullet points, and code blocks
- For code analysis, identify the algorithm pattern and explain complexity step by step
- Always be encouraging and supportive of learning

Available algorithm categories in AlgoVision:
- Sorting: Bubble, Selection, Insertion, Merge, Quick, Heap, Radix, Randomized Quick
- Graph: BFS, DFS, Dijkstra, Floyd-Warshall, Ford-Fulkerson, Graph Coloring, Hamiltonian Cycle, Prim, Kruskal, TSP Branch & Bound
- Dynamic Programming: 0/1 Knapsack, LCS, Matrix Chain Multiplication
- String Matching: Naive, KMP, Rabin-Karp"""


def _get_client() -> Optional[Any]:
    if Groq is None:
        return None
    api_key = _get_api_key()
    if not api_key:
        return None
    return Groq(api_key=api_key)


def _get_api_key() -> str:
    # Read at call time so env changes are picked up without module reloads.
    return os.environ.get("GROQ_API_KEY", "").strip().strip('"').strip("'")


def _unavailable_reason() -> str:
    if Groq is None:
        return "Groq SDK is not installed"
    if not _get_api_key():
        return "GROQ_API_KEY is not configured"
    return "AI provider unavailable"


def _message_content(completion: object) -> str:
    try:
        content = completion.choices[0].message.content
    except Exception:
        content = None
    if isinstance(content, str) and content.strip():
        return content
    return "AI returned an empty response. Please try again."


def _extract_json_object(text: str) -> dict | None:
    if not isinstance(text, str) or not text.strip():
        return None

    try:
        parsed = json.loads(text)
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        pass

    patterns = [
        r"```json\s*(\{.*?\})\s*```",
        r"```\s*(\{.*?\})\s*```",
        r"(\{[\s\S]*\})",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.DOTALL)
        if not match:
            continue
        try:
            parsed = json.loads(match.group(1).strip())
            return parsed if isinstance(parsed, dict) else None
        except json.JSONDecodeError:
            continue
    return None


def explain_algorithm(algorithm: str, context: str = "") -> dict:
    """Generate a detailed explanation of an algorithm."""
    client = _get_client()
    if client is None:
        return {
            "response": f"AI service unavailable ({_unavailable_reason()}).\n\n{_fallback_explain(algorithm, context)}",
            "model": "fallback",
        }

    user_message = f"Explain the **{algorithm}** algorithm in detail."
    if context:
        user_message += f"\n\nAdditional context: {context}"
    user_message += "\n\nInclude: how it works step-by-step, time/space complexity analysis, real-world use cases, and when to choose it over alternatives."

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.7,
            max_tokens=2048,
        )
        return {
            "response": _message_content(completion),
            "model": MODEL,
        }
    except Exception as exc:
        return {
            "response": f"AI service temporarily unavailable. Error: {str(exc)}\n\n{_fallback_explain(algorithm, context)}",
            "model": "fallback",
        }


def suggest_algorithm(problem: str) -> dict:
    """Suggest the best algorithms for a given problem description."""
    client = _get_client()
    if client is None:
        return {
            "response": f"AI service unavailable ({_unavailable_reason()}).\n\n{_fallback_suggest(problem)}",
            "model": "fallback",
        }

    user_message = f"""A student has the following problem:

\"{problem}\"

Suggest the most suitable algorithms to solve this problem. For each suggestion:
1. Name the algorithm and its category
2. Explain why it fits this problem
3. State the expected time and space complexity
4. Mention any trade-offs or alternatives
5. If available in AlgoVision, mention they can visualize it there"""

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.7,
            max_tokens=2048,
        )
        return {
            "response": _message_content(completion),
            "model": MODEL,
        }
    except Exception as exc:
        return {
            "response": f"AI service temporarily unavailable. Error: {str(exc)}\n\n{_fallback_suggest(problem)}",
            "model": "fallback",
        }


def generate_code_from_prompt(prompt: str, language: str = "python") -> dict:
    """Generate algorithmic code from a natural-language prompt."""
    normalized_language = normalize_language(language)
    if normalized_language not in SUPPORTED_LANGUAGES:
      normalized_language = "python"

    clean_prompt = (prompt or "").strip()
    if not clean_prompt:
        return _fallback_generate_code(clean_prompt, normalized_language, "Prompt was empty")

    client = _get_client()
    if client is None:
        return _fallback_generate_code(clean_prompt, normalized_language, _unavailable_reason())

    language_label = "C++" if normalized_language == "cpp" else normalized_language.title()
    user_message = (
        f"A user wants algorithmic {language_label} code for this request:\n"
        f'"{clean_prompt}"\n\n'
        "Return ONLY valid JSON with these exact keys:\n"
        '{"code": "full source code string", "explanation": "2-4 sentence explanation", "detected_algorithm": "short algorithm name"}\n\n'
        "Rules:\n"
        "- The code field must contain only raw source code, not markdown fences.\n"
        "- Prefer a complete runnable function or small class, not pseudo-code.\n"
        "- Choose a classic algorithmic approach when the prompt implies one.\n"
        "- If the prompt is ambiguous, make a reasonable assumption and say so in the explanation.\n"
        "- Keep comments minimal and use descriptive variable names.\n"
        "- Make the generated code suitable for step-by-step visualization when possible."
    )

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT + "\n\nWhen generating code, be precise and return strict JSON only."},
                {"role": "user", "content": user_message},
            ],
            temperature=0.35,
            max_tokens=2200,
        )
        payload = _extract_json_object(_message_content(completion)) or {}
        code = str(payload.get("code", "")).strip()
        explanation = str(payload.get("explanation", "")).strip()
        detected_algorithm = str(payload.get("detected_algorithm", "")).strip()
        if not code:
            raise ValueError("AI did not return a code block")
        return {
            "code": code,
            "explanation": explanation or "Generated from your prompt using the AI code generator.",
            "detected_algorithm": detected_algorithm,
            "model": MODEL,
        }
    except Exception as exc:
        return _fallback_generate_code(clean_prompt, normalized_language, str(exc))


def analyze_complexity(code: str, language: str = "python") -> dict:
    """Analyze code complexity using the offline static estimator."""
    return analyze_code_complexity(code, language)


def analyze_complexity_tutor(code: str, language: str = "python") -> dict:
    """Analyze complexity with AI tutoring explanation and offline fallback."""
    normalized_language = normalize_language(language)
    offline_report = analyze_code_complexity(code, normalized_language)

    if normalized_language not in SUPPORTED_LANGUAGES:
        return offline_report

    client = _get_client()
    if client is None:
        return {
            "response": (
                "## AI Complexity Tutor Report\n\n"
                f"AI tutor is unavailable ({_unavailable_reason()}). "
                "Using the offline analyzer instead.\n\n"
                f"{offline_report['response']}"
            ),
            "model": offline_report.get("model", "offline-complexity-v1"),
        }

    code_snippet = _truncate_code_for_prompt(code)
    language_label = "C++" if normalized_language == "cpp" else normalized_language

    user_message = (
        f"You are reviewing a {language_label} solution."
        " Estimate asymptotic time and auxiliary space complexity, then explain exactly why.\n\n"
        "Use the static hints below as signals, but verify with your own reasoning.\n\n"
        "### Code\n"
        f"```{normalized_language}\n{code_snippet}\n```\n\n"
        "### Static Hints\n"
        f"{offline_report['response']}\n\n"
        "Return markdown with these exact sections:\n"
        "## AI Complexity Tutor Report\n"
        "### Final Estimates\n"
        "- Best time: ...\n"
        "- Average time: ...\n"
        "- Worst time: ...\n"
        "- Auxiliary space: ...\n"
        "### Reasoning Path\n"
        "- Explain dominant loops/recursion and why they dominate.\n"
        "- Mention relevant code snippets or structures that drive complexity.\n"
        "### Language-Specific Notes\n"
        "- Mention any behavior specific to this language.\n"
        "### Assumptions\n"
        "- State input assumptions or uncertainty explicitly.\n"
        "### Improvement Ideas\n"
        "- Give 2-3 practical ways to reduce complexity if possible."
    )

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        SYSTEM_PROMPT
                        + "\n\n"
                        + "For code complexity tutoring: be precise, mention dominant terms, and avoid vague answers."
                    ),
                },
                {"role": "user", "content": user_message},
            ],
            temperature=0.2,
            max_tokens=2200,
        )
        return {
            "response": _message_content(completion),
            "model": MODEL,
        }
    except Exception as exc:
        return {
            "response": (
                "## AI Complexity Tutor Report\n\n"
                f"AI tutor is temporarily unavailable. Error: {str(exc)}\n\n"
                "Falling back to offline static analysis below.\n\n"
                f"{offline_report['response']}"
            ),
            "model": offline_report.get("model", "offline-complexity-v1"),
        }


def _truncate_code_for_prompt(code: str, max_chars: int = 8000) -> str:
    snippet = (code or "").strip()
    if len(snippet) <= max_chars:
        return snippet
    return snippet[:max_chars] + "\n\n// ... truncated for analysis ..."


def _fallback_explain(algorithm: str, context: str) -> str:
    return (
        f"## {algorithm.replace('_', ' ').title()}\n\n"
        "The AI advisor service is currently unavailable. "
        "Please check the Theory page for detailed information about this algorithm, "
        "or try again later when the Groq API is accessible.\n\n"
        "**Tip:** You can explore this algorithm visually in the Analyzer page!"
    )


def _fallback_suggest(problem: str) -> str:
    return (
        "## Algorithm Suggestions\n\n"
        "The AI advisor service is currently unavailable. "
        "Here are some general tips:\n\n"
        "- **Searching/Traversal problems** → Try BFS or DFS\n"
        "- **Shortest path problems** → Try Dijkstra or Floyd-Warshall\n"
        "- **Sorting problems** → Try Merge Sort or Quick Sort\n"
        "- **Optimization problems** → Try Dynamic Programming (Knapsack)\n"
        "- **Pattern matching** → Try KMP or Rabin-Karp\n\n"
        "Visit the Theory page for detailed algorithm comparisons!"
    )


def _fallback_analyze(code: str) -> str:
    lines = code.strip().split("\n")
    return (
        "## Code Analysis\n\n"
        "The AI advisor service is currently unavailable for detailed analysis.\n\n"
        f"**Code Statistics:**\n"
        f"- Lines of code: {len(lines)}\n"
        f"- Contains loops: {'Yes' if any(kw in code for kw in ['for ', 'while ']) else 'No'}\n"
        f"- Contains recursion: {'Possible' if code.count('def ') > 0 and any(name in code for name in [code.split('def ')[1].split('(')[0]] if 'def ' in code) else 'No'}\n\n"
        "**Tip:** Try the Analyzer page to run algorithms with step-by-step visualization!"
    )


def _fallback_generate_code(prompt: str, language: str, reason: str) -> dict:
    clean_prompt = prompt or "custom algorithm"
    language_label = "C++" if language == "cpp" else language.title()
    return {
        "code": _build_generic_code_template(language, clean_prompt),
        "explanation": (
            f"AI code generation is unavailable ({reason}). "
            f"A {language_label} starter implementation was generated instead. "
            "Refine it or try again once the AI provider is available."
        ),
        "detected_algorithm": "Custom Algorithm",
        "model": "fallback",
    }


def _build_generic_code_template(language: str, prompt: str) -> str:
    summary = prompt.strip() or "custom algorithm"
    if language == "javascript":
        return (
            "function solve(input) {\n"
            f"  // Goal: {summary}\n"
            "  const result = [];\n"
            "  for (let index = 0; index < input.length; index += 1) {\n"
            "    result.push(input[index]);\n"
            "  }\n"
            "  return result;\n"
            "}\n"
        )
    if language == "c":
        return (
            "#include <stddef.h>\n\n"
            "void solve(const int *input, size_t length, int *output) {\n"
            f"    /* Goal: {summary} */\n"
            "    for (size_t index = 0; index < length; ++index) {\n"
            "        output[index] = input[index];\n"
            "    }\n"
            "}\n"
        )
    if language == "cpp":
        return (
            "#include <vector>\n\n"
            "std::vector<int> solve(const std::vector<int>& input) {\n"
            f"    // Goal: {summary}\n"
            "    std::vector<int> result;\n"
            "    result.reserve(input.size());\n"
            "    for (int value : input) {\n"
            "        result.push_back(value);\n"
            "    }\n"
            "    return result;\n"
            "}\n"
        )
    if language == "java":
        return (
            "import java.util.ArrayList;\n"
            "import java.util.List;\n\n"
            "public class Solution {\n"
            "    public static List<Integer> solve(List<Integer> input) {\n"
            f"        // Goal: {summary}\n"
            "        List<Integer> result = new ArrayList<>();\n"
            "        for (int value : input) {\n"
            "            result.add(value);\n"
            "        }\n"
            "        return result;\n"
            "    }\n"
            "}\n"
        )
    if language == "go":
        return (
            "package main\n\n"
            "func solve(input []int) []int {\n"
            f"    // Goal: {summary}\n"
            "    result := make([]int, 0, len(input))\n"
            "    for _, value := range input {\n"
            "        result = append(result, value)\n"
            "    }\n"
            "    return result\n"
            "}\n"
        )
    return (
        "def solve(input_data):\n"
        f"    \"\"\"Goal: {summary}\"\"\"\n"
        "    result = []\n"
        "    for value in input_data:\n"
        "        result.append(value)\n"
        "    return result\n"
    )
