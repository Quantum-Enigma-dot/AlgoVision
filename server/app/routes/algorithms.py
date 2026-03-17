from fastapi import APIRouter

from app.schemas import AlgorithmInfo
from app.services.runner import get_algorithm_list

router = APIRouter()


@router.get("/algorithms", response_model=list[AlgorithmInfo])
def list_algorithms() -> list[AlgorithmInfo]:
    return get_algorithm_list()
