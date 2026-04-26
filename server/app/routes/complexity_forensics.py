from fastapi import APIRouter, HTTPException

from app.schemas import ComplexityForensicsRequest, ComplexityForensicsResponse
from app.services.complexity_forensics import analyze_complexity_forensics

router = APIRouter()


@router.post("/complexity-forensics/analyze", response_model=ComplexityForensicsResponse)
def complexity_forensics_analyze_endpoint(
    payload: ComplexityForensicsRequest,
) -> ComplexityForensicsResponse:
    try:
        result = analyze_complexity_forensics(payload.code, payload.language or "python")
        return ComplexityForensicsResponse(**result)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
