from __future__ import annotations

import time
from typing import Any, Dict, List

from app.schemas import AlgorithmInfo, CompareResponse, RunResponse, TheoryResponse

from app.algorithms.sorting import (
    bubble_sort,
    cocktail_sort,
    comb_sort,
    counting_sort,
    gnome_sort,
    heap_sort,
    insertion_sort,
    merge_sort,
    quick_sort,
    radix_sort,
    randomized_quick_sort,
    shell_sort,
    selection_sort,
)
from app.algorithms.graph import (
    bfs,
    bellman_ford,
    dfs,
    dijkstra,
    floyd_warshall,
    ford_fulkerson,
    graph_coloring,
    hamiltonian_cycle,
    kruskal,
    prim,
    topological_sort,
    tsp_branch_bound,
)
from app.algorithms.dp import edit_distance, knapsack, lcs, longest_common_substring, matrix_chain
from app.algorithms.string_matching import boyer_moore, huffman_coding, kmp, naive, rabin_karp, z_algorithm
from app.algorithms.data_structures import ALGORITHMS as DATA_STRUCTURE_ALGORITHMS
from app.utils.validation import validate_run_input

ALGORITHMS = {
    bubble_sort.ALGORITHM["name"]: bubble_sort.ALGORITHM,
    cocktail_sort.ALGORITHM["name"]: cocktail_sort.ALGORITHM,
    comb_sort.ALGORITHM["name"]: comb_sort.ALGORITHM,
    counting_sort.ALGORITHM["name"]: counting_sort.ALGORITHM,
    gnome_sort.ALGORITHM["name"]: gnome_sort.ALGORITHM,
    selection_sort.ALGORITHM["name"]: selection_sort.ALGORITHM,
    insertion_sort.ALGORITHM["name"]: insertion_sort.ALGORITHM,
    merge_sort.ALGORITHM["name"]: merge_sort.ALGORITHM,
    quick_sort.ALGORITHM["name"]: quick_sort.ALGORITHM,
    heap_sort.ALGORITHM["name"]: heap_sort.ALGORITHM,
    radix_sort.ALGORITHM["name"]: radix_sort.ALGORITHM,
    randomized_quick_sort.ALGORITHM["name"]: randomized_quick_sort.ALGORITHM,
    shell_sort.ALGORITHM["name"]: shell_sort.ALGORITHM,
    bfs.ALGORITHM["name"]: bfs.ALGORITHM,
    bellman_ford.ALGORITHM["name"]: bellman_ford.ALGORITHM,
    dfs.ALGORITHM["name"]: dfs.ALGORITHM,
    dijkstra.ALGORITHM["name"]: dijkstra.ALGORITHM,
    floyd_warshall.ALGORITHM["name"]: floyd_warshall.ALGORITHM,
    ford_fulkerson.ALGORITHM["name"]: ford_fulkerson.ALGORITHM,
    graph_coloring.ALGORITHM["name"]: graph_coloring.ALGORITHM,
    hamiltonian_cycle.ALGORITHM["name"]: hamiltonian_cycle.ALGORITHM,
    prim.ALGORITHM["name"]: prim.ALGORITHM,
    kruskal.ALGORITHM["name"]: kruskal.ALGORITHM,
    topological_sort.ALGORITHM["name"]: topological_sort.ALGORITHM,
    tsp_branch_bound.ALGORITHM["name"]: tsp_branch_bound.ALGORITHM,
    knapsack.ALGORITHM["name"]: knapsack.ALGORITHM,
    lcs.ALGORITHM["name"]: lcs.ALGORITHM,
    edit_distance.ALGORITHM["name"]: edit_distance.ALGORITHM,
    longest_common_substring.ALGORITHM["name"]: longest_common_substring.ALGORITHM,
    matrix_chain.ALGORITHM["name"]: matrix_chain.ALGORITHM,
    naive.ALGORITHM["name"]: naive.ALGORITHM,
    kmp.ALGORITHM["name"]: kmp.ALGORITHM,
    boyer_moore.ALGORITHM["name"]: boyer_moore.ALGORITHM,
    rabin_karp.ALGORITHM["name"]: rabin_karp.ALGORITHM,
    z_algorithm.ALGORITHM["name"]: z_algorithm.ALGORITHM,
    huffman_coding.ALGORITHM["name"]: huffman_coding.ALGORITHM,
}

ALGORITHMS.update(DATA_STRUCTURE_ALGORITHMS)


def get_algorithm_list() -> List[AlgorithmInfo]:
    return [
        AlgorithmInfo(
            name=spec["name"],
            display_name=spec["display_name"],
            category=spec["category"],
            description=spec["description"],
            code=spec["code"],
            complexity=spec["complexity"],
        )
        for spec in ALGORITHMS.values()
    ]


def run_algorithm(category: str, algorithm: str, input_data: Dict[str, Any], options: Dict[str, Any]) -> RunResponse:
    spec = ALGORITHMS.get(algorithm)
    if not spec:
        raise ValueError("Unknown algorithm")
    if spec["category"] != category:
        raise ValueError("Algorithm does not belong to the requested category")

    validate_run_input(category, algorithm, input_data)

    start = time.perf_counter()
    payload = spec["run"](input_data, options)
    end = time.perf_counter()

    metrics = payload.get("metrics", {})
    metrics["execution_time_ms"] = round((end - start) * 1000, 3)

    return RunResponse(
        algorithm=algorithm,
        result=payload.get("result"),
        steps=payload.get("steps", []),
        metrics=metrics,
        complexity=spec["complexity"],
    )


def compare_algorithms(category: str, algorithms: List[str], input_data: Dict[str, Any]) -> CompareResponse:
    if len(algorithms) != 2:
        raise ValueError("Provide exactly two algorithms for comparison")

    results = [run_algorithm(category, name, input_data, {}) for name in algorithms]

    metrics_a = results[0].metrics
    metrics_b = results[1].metrics

    time_a = metrics_a.get("execution_time_ms", 0)
    time_b = metrics_b.get("execution_time_ms", 0)

    if time_a == time_b:
        winner = "Both algorithms performed similarly on this input."
    elif time_a < time_b:
        winner = f"{algorithms[0]} executed faster for this input size."
    else:
        winner = f"{algorithms[1]} executed faster for this input size."

    summary = (
        f"{winner} Consider theoretical complexity and input characteristics when choosing in practice."
    )

    return CompareResponse(category=category, results=results, summary=summary)


def get_theory(algorithm_name: str) -> TheoryResponse:
    spec = ALGORITHMS.get(algorithm_name)
    if not spec:
        raise ValueError("Algorithm not found")

    theory = spec["theory"]
    return TheoryResponse(
        name=spec["display_name"],
        category=spec["category"],
        description=spec["description"],
        complexity=spec["complexity"],
        use_cases=theory["use_cases"],
        limitations=theory["limitations"],
        optimization_tips=theory["optimization_tips"],
    )
