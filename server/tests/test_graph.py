from app.algorithms.graph import bfs, dfs, dijkstra


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
