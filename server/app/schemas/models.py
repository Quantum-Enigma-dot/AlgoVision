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
