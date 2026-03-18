from fastapi import APIRouter, HTTPException

from app.schemas import (
    AIExplainRequest,
    AISuggestRequest,
    AIAnalyzeRequest,
    AIResponse,
)
from app.services.ai_advisor import explain_algorithm, suggest_algorithm, analyze_complexity

router = APIRouter()


@router.post("/ai/explain", response_model=AIResponse)
def ai_explain_endpoint(payload: AIExplainRequest) -> AIResponse:
    try:
        result = explain_algorithm(payload.algorithm, payload.context or "")
        return AIResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/ai/suggest", response_model=AIResponse)
def ai_suggest_endpoint(payload: AISuggestRequest) -> AIResponse:
    try:
        result = suggest_algorithm(payload.problem)
        return AIResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/ai/analyze", response_model=AIResponse)
def ai_analyze_endpoint(payload: AIAnalyzeRequest) -> AIResponse:
    try:
        result = analyze_complexity(payload.code, payload.language or "python")
        return AIResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
