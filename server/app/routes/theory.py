from fastapi import APIRouter, HTTPException

from app.schemas import TheoryResponse
from app.services.runner import get_theory

router = APIRouter()


@router.get("/theory/{algorithm_name}", response_model=TheoryResponse)
def get_theory_endpoint(algorithm_name: str) -> TheoryResponse:
    try:
        return get_theory(algorithm_name)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
