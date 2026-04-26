"""AI-powered algorithm visualization — paste any algorithm, get step-by-step visual data."""

from __future__ import annotations

import json
import re
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_advisor import _get_client, MODEL, SYSTEM_PROMPT

router = APIRouter()


class AlgoVisualizeRequest(BaseModel):
    code: str
    language: Optional[str] = "python"


class AlgoVisualizeResponse(BaseModel):
    algorithm_type: str  # sorting, graph, dp, string, tree, other
    algorithm_name: str
    description: str
    visualization_type: str  # sorting, graph, dp, string, generic
    input_data: dict
    steps: list
    complexity: dict
    model: str = ""


VISUALIZE_PROMPT = """You are an algorithm analysis engine. Given code, you MUST:

1. **Detect** the algorithm type from: sorting, graph, dp, string, tree, other
2. **Identify** the algorithm name (e.g., "Bubble Sort", "BFS", "Knapsack", "KMP")
3. **Generate** step-by-step visualization data in JSON format

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, no explanation outside JSON.

The JSON must have this exact structure:
{
  "algorithm_type": "sorting|graph|dp|string|tree|other",
  "algorithm_name": "Human readable name",
  "description": "One-line description",
  "visualization_type": "sorting|graph|dp|string",
  "complexity": {"best_time": "O(...)", "average_time": "O(...)", "worst_time": "O(...)", "space": "O(...)"},
  "input_data": {},
  "steps": []
}

FORMAT RULES BY TYPE:

**For sorting algorithms** (visualization_type: "sorting"):
- input_data: {"array": [64, 34, 25, 12, 22, 11, 90]}
- steps: [{"array": [64, 34, 25, 12, 22, 11, 90], "indices": [0, 1], "type": "compare"}, {"array": [34, 64, 25, ...], "indices": [0, 1], "type": "swap"}, ...]
- Generate 8-15 steps showing key comparisons and swaps

**For graph algorithms** (visualization_type: "graph"):
- input_data: {"nodes": ["A","B","C","D","E"], "edges": [{"from": "A", "to": "B", "weight": 1}, ...], "directed": false, "start": "A"}
- steps: [{"current": "A", "visited": ["A"], "edge": {"from": "A", "to": "B"}, "queue": ["B","C"]}, ...]
- Generate 6-12 steps showing traversal

**For tree algorithms** (visualization_type: "graph"):
TREES MUST USE visualization_type "graph" — they are rendered as graph nodes.
- Build the tree as a graph: each tree node becomes a graph node, each parent→child becomes an edge
- input_data: {"nodes": ["1","2","3","4","5"], "edges": [{"from": "1", "to": "2", "weight": 1}, {"from": "1", "to": "3", "weight": 1}, {"from": "2", "to": "4", "weight": 1}, {"from": "2", "to": "5", "weight": 1}], "directed": true, "start": "1"}
- steps: [{"current": "1", "visited": ["1"], "edge": null}, {"current": "2", "visited": ["1","2"], "edge": {"from": "1", "to": "2"}}, ...]
- Show the traversal order (inorder/preorder/postorder/level-order) as visit steps
- Generate 5-10 steps

**For DP algorithms** (visualization_type: "dp"):
- input_data: {"text_a": "ABCBDAB", "text_b": "BDCAB"} for LCS-like, or {"weights": [2,3,4], "values": [3,4,5], "capacity": 5} for knapsack-like
- steps: [{"table": [[0,0,...],[0,1,...]], "row": 1, "col": 1, "value": 1, "action": "match"}, ...]
- Generate 8-12 steps showing table fills

**For string matching** (visualization_type: "string"):
- input_data: {"text": "AABAACAADAABAAABAA", "pattern": "AABA"}
- steps: [{"text": "AABAACAADAABAAABAA", "pattern": "AABA", "index": 0, "text_index": 0, "pattern_index": 0, "type": "compare", "match": true}, ...]
- Generate 8-15 steps

CRITICAL: Return ONLY the JSON object. No markdown fences, no extra text."""


def _extract_json(text: str) -> dict | None:
    """Extract JSON from LLM response, handling markdown fences and extra text."""
    # Try direct parse
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # Try extracting from markdown code blocks
    patterns = [
        r'```json\s*\n?(.*?)\n?\s*```',
        r'```\s*\n?(.*?)\n?\s*```',
        r'\{.*\}',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.DOTALL)
        if match:
            try:
                candidate = match.group(1) if '```' in pattern else match.group(0)
                return json.loads(candidate.strip())
            except (json.JSONDecodeError, IndexError):
                continue
    return None


def _fallback_response(code: str) -> dict:
    """Generate a basic fallback response when AI is unavailable."""
    lines = code.strip().split("\n")
    lower = code.lower()
    has_sort = any(kw in lower for kw in ["sort", "swap", "bubble", "merge", "quick", "heap", "insertion", "selection"])
    has_huffman = any(kw in lower for kw in ["huffman", "minheapnode", "optimal prefix"])
    has_tree = any(kw in lower for kw in ["->left", "->right", "root", "inorder", "preorder", "postorder", "bst", "binary tree", "createnode", "treenode", "struct node"])
    has_graph = any(kw in lower for kw in ["graph", "bfs", "dfs", "dijkstra", "adjacent", "neighbor", "vertex", "edge", "adj["])
    has_dp = any(kw in lower for kw in ["dp[", "dp =", "knapsack", "lcs", "memo", "tabulation", "dynamic"])
    has_string = any(kw in lower for kw in ["pattern", "kmp", "rabin", "naive_search", "lps"])

    if has_huffman:
        from app.algorithms.string_matching.huffman_coding import run as run_huffman
        res = run_huffman({"text": "ALGO VISION"}, {})
        return {
            "algorithm_type": "string", "algorithm_name": "Huffman Coding",
            "description": "Detected Huffman Coding from the pasted code. Generating optimal prefix tree.",
            "visualization_type": "string",
            "complexity": {"best_time": "O(n log k)", "average_time": "O(n log k)", "worst_time": "O(n log k)", "space": "O(k)"},
            "input_data": {"text": "ALGO VISION"},
            "steps": res["steps"],
            "model": "native",
        }
    elif has_sort:
        algo_type = "sorting"
        viz_type = "sorting"
        name = "Sorting Algorithm"
        arr = [64, 34, 25, 12, 22, 11, 90]
        return {
            "algorithm_type": algo_type, "algorithm_name": name,
            "description": "Detected a sorting algorithm from the pasted code.",
            "visualization_type": viz_type,
            "complexity": {"best_time": "O(n)", "average_time": "O(n²)", "worst_time": "O(n²)", "space": "O(1)"},
            "input_data": {"array": arr},
            "steps": [
                {"array": arr[:], "indices": [0, 1], "type": "compare"},
                {"array": [34, 64, 25, 12, 22, 11, 90], "indices": [0, 1], "type": "swap"},
                {"array": [34, 25, 64, 12, 22, 11, 90], "indices": [1, 2], "type": "swap"},
                {"array": [34, 25, 12, 64, 22, 11, 90], "indices": [2, 3], "type": "swap"},
                {"array": [34, 25, 12, 22, 64, 11, 90], "indices": [3, 4], "type": "swap"},
                {"array": [34, 25, 12, 22, 11, 64, 90], "indices": [4, 5], "type": "swap"},
                {"array": [25, 34, 12, 22, 11, 64, 90], "indices": [0, 1], "type": "swap"},
                {"array": [11, 12, 22, 25, 34, 64, 90], "indices": [], "type": "done"},
            ],
            "model": "fallback",
        }
    elif has_tree:
        return {
            "algorithm_type": "tree", "algorithm_name": "Binary Tree Traversal",
            "description": "Detected a binary tree traversal algorithm.",
            "visualization_type": "graph",
            "complexity": {"best_time": "O(n)", "average_time": "O(n)", "worst_time": "O(n)", "space": "O(h)"},
            "input_data": {
                "nodes": ["1","2","3","4","5"],
                "edges": [
                    {"from":"1","to":"2","weight":1},
                    {"from":"1","to":"3","weight":1},
                    {"from":"2","to":"4","weight":1},
                    {"from":"2","to":"5","weight":1},
                ],
                "directed": True,
                "start": "1",
            },
            "steps": [
                {"current": "1", "visited": ["1"], "edge": None},
                {"current": "2", "visited": ["1","2"], "edge": {"from":"1","to":"2"}},
                {"current": "4", "visited": ["1","2","4"], "edge": {"from":"2","to":"4"}},
                {"current": "5", "visited": ["1","2","4","5"], "edge": {"from":"2","to":"5"}},
                {"current": "3", "visited": ["1","2","4","5","3"], "edge": {"from":"1","to":"3"}},
            ],
            "model": "fallback",
        }
    elif has_graph:
        return {
            "algorithm_type": "graph", "algorithm_name": "Graph Algorithm",
            "description": "Detected a graph algorithm from the pasted code.",
            "visualization_type": "graph",
            "complexity": {"best_time": "O(V+E)", "average_time": "O(V+E)", "worst_time": "O(V+E)", "space": "O(V)"},
            "input_data": {"nodes": ["A","B","C","D","E"], "edges": [{"from":"A","to":"B","weight":1},{"from":"A","to":"C","weight":1},{"from":"B","to":"D","weight":1},{"from":"C","to":"E","weight":1},{"from":"D","to":"E","weight":1}], "directed": False, "start": "A"},
            "steps": [
                {"current": "A", "visited": ["A"], "edge": None},
                {"current": "B", "visited": ["A","B"], "edge": {"from":"A","to":"B"}},
                {"current": "C", "visited": ["A","B","C"], "edge": {"from":"A","to":"C"}},
                {"current": "D", "visited": ["A","B","C","D"], "edge": {"from":"B","to":"D"}},
                {"current": "E", "visited": ["A","B","C","D","E"], "edge": {"from":"C","to":"E"}},
            ],
            "model": "fallback",
        }
    elif has_dp:
        return {
            "algorithm_type": "dp", "algorithm_name": "DP Algorithm",
            "description": "Detected a dynamic programming algorithm from the pasted code.",
            "visualization_type": "dp",
            "complexity": {"best_time": "O(nm)", "average_time": "O(nm)", "worst_time": "O(nm)", "space": "O(nm)"},
            "input_data": {"text_a": "ABC", "text_b": "AC"},
            "steps": [
                {"table": [[0,0,0],[0,0,0],[0,0,0],[0,0,0]], "row": 1, "col": 1, "value": 1, "action": "match"},
                {"table": [[0,0,0],[0,1,1],[0,1,1],[0,1,1]], "row": 2, "col": 1, "value": 1, "action": "skip"},
                {"table": [[0,0,0],[0,1,1],[0,1,1],[0,1,2]], "row": 3, "col": 2, "value": 2, "action": "match"},
            ],
            "model": "fallback",
        }
    elif has_string:
        return {
            "algorithm_type": "string", "algorithm_name": "String Matching",
            "description": "Detected a string matching algorithm from the pasted code.",
            "visualization_type": "string",
            "complexity": {"best_time": "O(n+m)", "average_time": "O(n+m)", "worst_time": "O(nm)", "space": "O(m)"},
            "input_data": {"text": "ABCABCABD", "pattern": "ABD"},
            "steps": [
                {"text": "ABCABCABD", "pattern": "ABD", "index": 0, "text_index": 0, "pattern_index": 0, "type": "compare", "match": True},
                {"text": "ABCABCABD", "pattern": "ABD", "index": 1, "text_index": 1, "pattern_index": 1, "type": "compare", "match": True},
                {"text": "ABCABCABD", "pattern": "ABD", "index": 2, "text_index": 2, "pattern_index": 2, "type": "compare", "match": False},
                {"text": "ABCABCABD", "pattern": "ABD", "index": 6, "text_index": 6, "pattern_index": 0, "type": "compare", "match": True},
                {"text": "ABCABCABD", "pattern": "ABD", "index": 7, "text_index": 7, "pattern_index": 1, "type": "compare", "match": True},
                {"text": "ABCABCABD", "pattern": "ABD", "index": 8, "text_index": 8, "pattern_index": 2, "type": "match", "match": True},
            ],
            "model": "fallback",
        }
    else:
        return {
            "algorithm_type": "other", "algorithm_name": "Algorithm",
            "description": f"Code analysis: {len(lines)} lines detected. AI unavailable for detailed analysis.",
            "visualization_type": "generic",
            "complexity": {"best_time": "?", "average_time": "?", "worst_time": "?", "space": "?"},
            "input_data": {"description": "Algorithm code detected"},
            "steps": [{"description": "AI service unavailable. Start the Groq-powered analysis for detailed visualization.", "state": {}}],
            "model": "fallback",
        }


@router.post("/algo-visualize", response_model=AlgoVisualizeResponse)
def algo_visualize_endpoint(payload: AlgoVisualizeRequest) -> AlgoVisualizeResponse:
    code = payload.code.strip()
    if not code:
        raise HTTPException(status_code=400, detail="No code provided.")

    lower = code.lower()
    has_huffman = any(kw in lower for kw in ["huffman", "minheapnode", "optimal prefix"])
    if has_huffman:
        data = _fallback_response(code)
        return AlgoVisualizeResponse(**data)

    client = _get_client()
    if client is None:
        data = _fallback_response(code)
        return AlgoVisualizeResponse(**data)

    user_message = f"Analyze this {payload.language or 'python'} algorithm and generate visualization data:\n\n```{payload.language or 'python'}\n{code}\n```"

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": f"{SYSTEM_PROMPT}\n\n{VISUALIZE_PROMPT}"},
                {"role": "user", "content": user_message},
            ],
            temperature=0.2,
            max_tokens=4000,
        )

        raw = completion.choices[0].message.content
        parsed = _extract_json(raw)

        if parsed is None:
            data = _fallback_response(code)
            data["description"] = "AI response could not be parsed. Using fallback analysis."
            data["model"] = MODEL
            return AlgoVisualizeResponse(**data)

        # Validate required fields
        required = ["algorithm_type", "algorithm_name", "visualization_type", "steps"]
        for field in required:
            if field not in parsed:
                parsed[field] = _fallback_response(code).get(field, "")

        if "input_data" not in parsed:
            parsed["input_data"] = {}
        if "complexity" not in parsed:
            parsed["complexity"] = {"best_time": "?", "average_time": "?", "worst_time": "?", "space": "?"}
        if "description" not in parsed:
            parsed["description"] = f"Detected: {parsed.get('algorithm_name', 'algorithm')}"

        # Normalize: tree and generic → graph (our frontend can render graphs)
        if parsed["visualization_type"] in ("tree", "generic", "other"):
            parsed["visualization_type"] = "graph"

        parsed["model"] = MODEL
        return AlgoVisualizeResponse(**parsed)

    except Exception as exc:
        data = _fallback_response(code)
        data["description"] = f"AI Error: {str(exc)[:100]}. Using fallback."
        data["model"] = "error"
        return AlgoVisualizeResponse(**data)
