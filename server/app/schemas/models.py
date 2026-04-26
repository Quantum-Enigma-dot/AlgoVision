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


class AICodeGenerationRequest(BaseModel):
    prompt: str
    language: Optional[str] = "python"


class AIResponse(BaseModel):
    response: str
    model: str = ""


class AICodeGenerationResponse(BaseModel):
    code: str
    explanation: str = ""
    detected_algorithm: str = ""
    model: str = ""


# --- Complexity Forensics Schemas ---

class ComplexityForensicsRequest(BaseModel):
    code: str
    language: Optional[str] = "python"


class ComplexityForensicsHotspot(BaseModel):
    line_number: int
    snippet: str
    signals: List[str] = Field(default_factory=list)


class ComplexityForensicsResponse(BaseModel):
    language: str
    model: str
    training_profile: str
    supported_languages: List[str] = Field(default_factory=list)
    dominant_pattern: str
    time_complexity: Dict[str, str]
    space_complexity: str
    confidence: str
    explanation: List[str] = Field(default_factory=list)
    reasoning_trace: List[str] = Field(default_factory=list)
    hotspots: List[ComplexityForensicsHotspot] = Field(default_factory=list)
    report: str


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


# --- Practice Judge Schemas ---

class PracticeTestCase(BaseModel):
    case_id: str
    input_data: str
    expected_output: str
    is_sample: bool = False


class PracticeJudgeRequest(BaseModel):
    code: str
    language: Optional[str] = "python"
    test_cases: List[PracticeTestCase]


class PracticeJudgeCaseResult(BaseModel):
    case_id: str
    is_sample: bool
    passed: bool
    runtime_ms: float = 0
    expected_output: str = ""
    actual_output: str = ""
    error: str = ""


class PracticeJudgeResponse(BaseModel):
    language: str
    all_passed: bool
    passed_count: int
    total_count: int
    compile_error: str = ""
    results: List[PracticeJudgeCaseResult] = Field(default_factory=list)
