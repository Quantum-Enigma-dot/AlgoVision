from fastapi import APIRouter, HTTPException

from app.schemas import RunRequest, RunResponse
from app.services.runner import run_algorithm

router = APIRouter()


@router.post("/run", response_model=RunResponse)
def run_algorithm_endpoint(payload: RunRequest) -> RunResponse:
    try:
        return run_algorithm(payload.category, payload.algorithm, payload.input, payload.options)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
