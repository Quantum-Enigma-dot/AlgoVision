from fastapi import APIRouter, HTTPException

from app.schemas import CompareRequest, CompareResponse
from app.services.runner import compare_algorithms

router = APIRouter()


@router.post("/compare", response_model=CompareResponse)
def compare_algorithms_endpoint(payload: CompareRequest) -> CompareResponse:
    try:
        return compare_algorithms(payload.category, payload.algorithms, payload.input)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
