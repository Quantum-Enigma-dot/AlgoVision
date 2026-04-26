from app.algorithms.graph import bellman_ford, bfs, dfs, dijkstra, topological_sort


GRAPH_INPUT = {
    "nodes": ["A", "B", "C", "D"],
    "edges": [
        {"from": "A", "to": "B", "weight": 1},
        {"from": "A", "to": "C", "weight": 4},
        {"from": "B", "to": "C", "weight": 2},
        {"from": "C", "to": "D", "weight": 1},
    ],
    "directed": False,
    "start": "A",
}


def test_bfs_dfs_runs():
    bfs_order = bfs.run(GRAPH_INPUT, {})["result"]
    dfs_order = dfs.run(GRAPH_INPUT, {})["result"]
    assert bfs_order[0] == "A"
    assert dfs_order[0] == "A"
    assert set(bfs_order) == {"A", "B", "C", "D"}


def test_dijkstra_distances():
    distances = dijkstra.run(GRAPH_INPUT, {})["result"]
    assert distances["A"] == 0
    assert distances["D"] == 4


def test_bellman_ford_distances_with_negative_edge():
    graph_input = {
        "nodes": ["A", "B", "C", "D"],
        "edges": [
            {"from": "A", "to": "B", "weight": 4},
            {"from": "A", "to": "C", "weight": 5},
            {"from": "B", "to": "C", "weight": -2},
            {"from": "C", "to": "D", "weight": 3},
        ],
        "directed": True,
        "start": "A",
    }
    payload = bellman_ford.run(graph_input, {})["result"]
    assert payload["has_negative_cycle"] is False
    assert payload["distances"]["A"] == 0.0
    assert payload["distances"]["C"] == 2.0
    assert payload["distances"]["D"] == 5.0


def test_topological_sort_dag_order():
    graph_input = {
        "nodes": ["A", "B", "C", "D"],
        "edges": [
            {"from": "A", "to": "B", "weight": 1},
            {"from": "A", "to": "C", "weight": 1},
            {"from": "B", "to": "D", "weight": 1},
            {"from": "C", "to": "D", "weight": 1},
        ],
        "directed": True,
    }
    payload = topological_sort.run(graph_input, {})["result"]
    order = payload["order"]
    assert payload["has_cycle"] is False
    assert set(order) == {"A", "B", "C", "D"}
    assert order.index("A") < order.index("B")
    assert order.index("A") < order.index("C")
    assert order.index("B") < order.index("D")
    assert order.index("C") < order.index("D")


def test_topological_sort_cycle_detection():
    graph_input = {
        "nodes": ["A", "B", "C"],
        "edges": [
            {"from": "A", "to": "B", "weight": 1},
            {"from": "B", "to": "C", "weight": 1},
            {"from": "C", "to": "A", "weight": 1},
        ],
        "directed": True,
    }
    payload = topological_sort.run(graph_input, {})["result"]
    assert payload["has_cycle"] is True
