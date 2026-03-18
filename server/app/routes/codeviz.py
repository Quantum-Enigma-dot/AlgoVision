"""AI-powered code visualization endpoints — Code Flow, Code Stats, Code Review."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.services.ai_advisor import _get_client, MODEL, SYSTEM_PROMPT

router = APIRouter()


class CodeVizRequest(BaseModel):
    code: str
    language: Optional[str] = "python"
    action: str  # "flow", "stats", "review", "optimize"


class CodeVizResponse(BaseModel):
    result: str
    model: str = ""


FLOW_PROMPT = """Analyze the following code and generate a CODE FLOW GRAPH description in a structured format.

For each node in the flow, output a line in this exact format:
NODE|<id>|<type>|<label>|<details>

Where type is one of: START, END, FUNCTION, CONDITION, LOOP, IO, PROCESS, RETURN, ERROR
After all nodes, output edges:
EDGE|<from_id>|<to_id>|<label>

Example:
NODE|1|START|Program Start|Entry point
NODE|2|FUNCTION|def sort(arr)|Sorting function definition
NODE|3|LOOP|for i in range(n)|Iterates n times
NODE|4|CONDITION|if arr[j] > arr[j+1]|Compare adjacent elements
NODE|5|PROCESS|swap arr[j], arr[j+1]|Swap elements
NODE|6|RETURN|return arr|Return sorted array
NODE|7|END|Program End|Exit point
EDGE|1|2|calls
EDGE|2|3|enters loop
EDGE|3|4|checks
EDGE|4|5|true
EDGE|4|3|false (next iteration)
EDGE|5|3|continue loop
EDGE|3|6|loop complete
EDGE|6|7|exits

Be thorough — include ALL functions, loops, conditions, I/O operations, and error handling. Make labels concise but descriptive."""

STATS_PROMPT = """Analyze the following code and provide statistics in this EXACT format (each on a new line):

LINES: <number>
FUNCTIONS: <number>
CLASSES: <number>
COMPLEXITY: <Big-O notation like O(n), O(n^2), O(log n), etc.>
RISK_SCORE: <number 0-100, where 0 is no risk and 100 is very risky>
QUALITY_SCORE: <number 0-100, where 100 is excellent code>
ISSUES: <comma-separated list of issues found>
PATTERNS: <comma-separated list of design patterns or algorithm patterns detected>
SUGGESTIONS: <comma-separated list of improvement suggestions>

Be accurate with the complexity analysis. Risk score should consider: security vulnerabilities, potential bugs, error handling, input validation. Quality score should consider: readability, maintainability, efficiency, best practices."""

REVIEW_PROMPT = """Perform a comprehensive code review of the following code. Provide:

## Code Quality Assessment
Rate the overall quality and explain why.

## Issues Found
List each issue with:
- **Severity** (Critical/High/Medium/Low)
- **Line** (approximate line number)
- **Issue** description
- **Fix** recommendation

## Security Analysis
Check for SQL injection, XSS, buffer overflow, improper input validation, hardcoded credentials, etc.

## Performance Analysis
- Current time complexity
- Current space complexity
- Bottlenecks identified
- Optimization opportunities

## Best Practices
What follows best practices and what doesn't.

## Improved Version
Provide an optimized/fixed version of the code with comments explaining changes."""

OPTIMIZE_PROMPT = """Analyze the following code and provide an OPTIMIZED version.

Show:
1. The original code with line-by-line comments about what can be improved
2. The optimized version with explanations of each change
3. A comparison of complexities (before vs after)
4. Specific improvements made (categorized: Performance, Readability, Security, Best Practices)

Format the output clearly with markdown headers and code blocks."""


@router.post("/codeviz", response_model=CodeVizResponse)
def codeviz_endpoint(payload: CodeVizRequest) -> CodeVizResponse:
    action = payload.action.lower().strip()

    prompts = {
        "flow": FLOW_PROMPT,
        "stats": STATS_PROMPT,
        "review": REVIEW_PROMPT,
        "optimize": OPTIMIZE_PROMPT,
    }

    system_prompt = prompts.get(action)
    if not system_prompt:
        raise HTTPException(status_code=400, detail=f"Unknown action: {action}. Use: flow, stats, review, optimize")

    user_message = f"```{payload.language}\n{payload.code}\n```"

    client = _get_client()
    if client is None:
        return CodeVizResponse(
            result="AI service unavailable. Please check your Groq API key configuration.",
            model="fallback",
        )

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": f"{SYSTEM_PROMPT}\n\n{system_prompt}"},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3 if action in ("flow", "stats") else 0.5,
            max_tokens=3000,
        )
        return CodeVizResponse(
            result=completion.choices[0].message.content,
            model=MODEL,
        )
    except Exception as exc:
        return CodeVizResponse(
            result=f"Error: {str(exc)}",
            model="error",
        )
