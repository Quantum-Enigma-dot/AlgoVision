from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AlgorithmInfo(BaseModel):
    name: str
    display_name: str
    category: str
    description: str
    code: str
    complexity: Dict[str, Any]


class RunRequest(BaseModel):
    category: str
    algorithm: str
    input: Dict[str, Any]
    options: Optional[Dict[str, Any]] = Field(default_factory=dict)


class CompareRequest(BaseModel):
    category: str
    algorithms: List[str]
    input: Dict[str, Any]


class RunResponse(BaseModel):
    algorithm: str
    result: Any
    steps: List[Dict[str, Any]]
    metrics: Dict[str, Any]
    complexity: Dict[str, Any]


class CompareResponse(BaseModel):
    category: str
    results: List[RunResponse]
    summary: str


class TheoryResponse(BaseModel):
    name: str
    category: str
    description: str
    complexity: Dict[str, Any]
    use_cases: List[str]
    limitations: List[str]
    optimization_tips: List[str]


# --- AI Advisor Schemas ---

class AIExplainRequest(BaseModel):
    algorithm: str
    context: Optional[str] = ""


class AISuggestRequest(BaseModel):
    problem: str


class AIAnalyzeRequest(BaseModel):
    code: str
    language: Optional[str] = "python"


class AIResponse(BaseModel):
    response: str
    model: str = ""


# --- Benchmark Schemas ---

class BenchmarkRequest(BaseModel):
    category: str
    algorithm: str
    sizes: Optional[List[int]] = Field(default_factory=lambda: [10, 50, 100, 250, 500, 1000])


class BenchmarkDataPoint(BaseModel):
    size: int
    time_ms: float
    comparisons: int = 0
    swaps: int = 0


class BenchmarkResponse(BaseModel):
    algorithm: str
    category: str
    data_points: List[BenchmarkDataPoint]


# --- Playground Schemas ---

class PlaygroundRequest(BaseModel):
    code: str
    language: Optional[str] = "python"


class PlaygroundResponse(BaseModel):
    output: str
    error: str = ""
    execution_time_ms: float = 0
