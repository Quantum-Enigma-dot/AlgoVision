"""Scalability benchmark endpoint — runs an algorithm at multiple input sizes."""

from __future__ import annotations

import random
import time
from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas import BenchmarkRequest, BenchmarkDataPoint, BenchmarkResponse
from app.services.runner import ALGORITHMS

router = APIRouter()


def _generate_sorting_input(size: int) -> dict:
    return {"array": [random.randint(1, 10000) for _ in range(size)]}


def _generate_graph_input(size: int) -> dict:
    nodes = [str(i) for i in range(size)]
    edges = []
    for i in range(size - 1):
        edges.append({"from": str(i), "to": str(i + 1), "weight": random.randint(1, 20)})
    extra = min(size, size * 2)
    for _ in range(extra):
        a = str(random.randint(0, size - 1))
        b = str(random.randint(0, size - 1))
        if a != b:
            edges.append({"from": a, "to": b, "weight": random.randint(1, 20)})
    return {"nodes": nodes, "edges": edges, "directed": False, "start": "0"}


def _generate_string_input(size: int) -> dict:
    text = "".join(random.choices("abcdefghij", k=size))
    pat_len = max(3, size // 10)
    pattern = text[:pat_len] if len(text) >= pat_len else "abc"
    return {"text": text, "pattern": pattern}


def _generate_dp_input(algorithm: str, size: int) -> dict:
    if algorithm == "knapsack_01":
        n = min(size, 100)
        return {
            "weights": [random.randint(1, 20) for _ in range(n)],
            "values": [random.randint(1, 50) for _ in range(n)],
            "capacity": n * 5,
        }
    if algorithm == "lcs":
        chars = "ABCDEFGHIJ"
        return {
            "text_a": "".join(random.choices(chars, k=min(size, 200))),
            "text_b": "".join(random.choices(chars, k=min(size, 200))),
        }
    if algorithm == "edit_distance":
        chars = "abcdefghijklmnopqrstuvwxyz"
        length = min(size, 180)
        return {
            "text_a": "".join(random.choices(chars, k=length)),
            "text_b": "".join(random.choices(chars, k=length)),
        }
    if algorithm == "longest_common_substring":
        chars = "abcdefghijklmnopqrstuvwxyz"
        length = min(size, 180)
        return {
            "text_a": "".join(random.choices(chars, k=length)),
            "text_b": "".join(random.choices(chars, k=length)),
        }
    if algorithm == "matrix_chain_multiplication":
        n = min(size, 30)
        return {"dimensions": [random.randint(5, 50) for _ in range(n + 1)]}
    return {}


CATEGORY_GENERATORS = {
    "sorting": _generate_sorting_input,
    "string": _generate_string_input,
}


@router.post("/benchmark", response_model=BenchmarkResponse)
def benchmark_endpoint(payload: BenchmarkRequest) -> BenchmarkResponse:
    spec = ALGORITHMS.get(payload.algorithm)
    if not spec:
        raise HTTPException(status_code=400, detail="Unknown algorithm")
    if spec["category"] != payload.category:
        raise HTTPException(status_code=400, detail="Algorithm/category mismatch")

    sizes = sorted(payload.sizes or [10, 50, 100, 250, 500, 1000])
    data_points: List[BenchmarkDataPoint] = []

    for size in sizes:
        if payload.category == "dp":
            input_data = _generate_dp_input(payload.algorithm, size)
        elif payload.category == "graph":
            capped = min(size, 80)
            input_data = _generate_graph_input(capped)
        elif payload.category in CATEGORY_GENERATORS:
            input_data = CATEGORY_GENERATORS[payload.category](size)
        else:
            input_data = _generate_sorting_input(size)

        try:
            start = time.perf_counter()
            result = spec["run"](input_data, {})
            elapsed = (time.perf_counter() - start) * 1000

            metrics = result.get("metrics", {})
            data_points.append(
                BenchmarkDataPoint(
                    size=size,
                    time_ms=round(elapsed, 3),
                    comparisons=metrics.get("comparisons", 0),
                    swaps=metrics.get("swaps", 0),
                )
            )
        except Exception:
            data_points.append(
                BenchmarkDataPoint(size=size, time_ms=-1, comparisons=0, swaps=0)
            )

    return BenchmarkResponse(
        algorithm=payload.algorithm,
        category=payload.category,
        data_points=data_points,
    )
