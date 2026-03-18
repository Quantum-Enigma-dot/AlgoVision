"""AI-powered algorithm advisor using Groq LLM."""

from __future__ import annotations

import os
from typing import Optional

try:
    from groq import Groq
except ImportError:
    Groq = None  # type: ignore

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

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


def _get_client() -> Optional["Groq"]:
    if Groq is None:
        return None
    if not GROQ_API_KEY:
        return None
    return Groq(api_key=GROQ_API_KEY)


def explain_algorithm(algorithm: str, context: str = "") -> dict:
    """Generate a detailed explanation of an algorithm."""
    client = _get_client()
    if client is None:
        return {
            "response": _fallback_explain(algorithm, context),
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
            "response": completion.choices[0].message.content,
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
            "response": _fallback_suggest(problem),
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
            "response": completion.choices[0].message.content,
            "model": MODEL,
        }
    except Exception as exc:
        return {
            "response": f"AI service temporarily unavailable. Error: {str(exc)}\n\n{_fallback_suggest(problem)}",
            "model": "fallback",
        }


def analyze_complexity(code: str, language: str = "python") -> dict:
    """Analyze the time and space complexity of user code."""
    client = _get_client()
    if client is None:
        return {
            "response": _fallback_analyze(code),
            "model": "fallback",
        }

    user_message = f"""Analyze the following {language} code and determine:

1. **Algorithm Identification**: What algorithm pattern is this?
2. **Time Complexity**: Best, average, and worst case with Big-O
3. **Space Complexity**: Auxiliary space used
4. **Line-by-line Breakdown**: Which lines contribute most to complexity
5. **Optimization Suggestions**: How could this be improved?

```{language}
{code}
```"""

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.5,
            max_tokens=2048,
        )
        return {
            "response": completion.choices[0].message.content,
            "model": MODEL,
        }
    except Exception as exc:
        return {
            "response": f"AI service temporarily unavailable. Error: {str(exc)}\n\n{_fallback_analyze(code)}",
            "model": "fallback",
        }


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
