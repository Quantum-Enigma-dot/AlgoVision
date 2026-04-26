from app.services.runner import run_algorithm


def test_array_stack_and_queue_runs():
    stack_res = run_algorithm(
        "stack",
        "array_stack",
        {
            "initial_values": [1, 2],
            "capacity": 3,
            "operations": [
                {"op": "push", "value": 3},
                {"op": "push", "value": 4},
                {"op": "pop"},
                {"op": "peek"},
            ],
        },
        {},
    )
    assert stack_res.algorithm == "array_stack"
    assert len(stack_res.steps) >= 4

    queue_res = run_algorithm(
        "queue",
        "circular_queue",
        {
            "initial_values": [1, 2],
            "capacity": 3,
            "operations": [
                {"op": "enqueue", "value": 3},
                {"op": "enqueue", "value": 4},
                {"op": "dequeue"},
                {"op": "front"},
            ],
        },
        {},
    )
    assert queue_res.algorithm == "circular_queue"
    assert len(queue_res.steps) >= 4


def test_linked_list_and_tree_runs():
    linked_res = run_algorithm(
        "linked_list",
        "singly_linked_list",
        {
            "initial_values": [5, 8, 13],
            "operations": [
                {"op": "insert_begin", "value": 3},
                {"op": "insert_pos", "value": 21, "position": 2},
                {"op": "delete_end"},
                {"op": "search", "value": 8},
                {"op": "traverse"},
            ],
        },
        {},
    )
    assert linked_res.algorithm == "singly_linked_list"
    assert len(linked_res.steps) >= 5

    tree_res = run_algorithm(
        "tree",
        "binary_search_tree",
        {
            "initial_values": [50, 30, 70],
            "operations": [
                {"op": "insert", "value": 60},
                {"op": "search", "value": 30},
                {"op": "traverse", "traversal": "inorder"},
                {"op": "delete", "value": 70},
            ],
        },
        {},
    )
    assert tree_res.algorithm == "binary_search_tree"
    assert len(tree_res.steps) >= 4


def test_trie_prefix_search():
    trie_res = run_algorithm(
        "tree",
        "trie",
        {
            "initial_values": ["algo", "alloy", "tree"],
            "operations": [
                {"op": "prefix_search", "prefix": "al"},
                {"op": "search", "value": "tree"},
                {"op": "delete", "value": "tree"},
            ],
        },
        {},
    )
    assert trie_res.algorithm == "trie"
    assert len(trie_res.steps) >= 3


def test_b_tree_and_b_plus_tree_runs():
    btree_res = run_algorithm(
        "tree",
        "b_tree",
        {
            "initial_values": [50, 20, 70, 10, 30, 60, 80],
            "order": 4,
            "operations": [
                {"op": "insert", "value": 40},
                {"op": "search", "value": 30},
                {"op": "delete", "value": 20},
                {"op": "traverse", "traversal": "inorder"},
            ],
        },
        {},
    )
    assert btree_res.algorithm == "b_tree"
    assert len(btree_res.steps) >= 4
    assert "keys" in (btree_res.result or {})

    bplus_res = run_algorithm(
        "tree",
        "b_plus_tree",
        {
            "initial_values": [5, 15, 25, 35, 45, 55, 65],
            "order": 4,
            "operations": [
                {"op": "insert", "value": 75},
                {"op": "search", "value": 35},
                {"op": "delete", "value": 15},
                {"op": "traverse", "traversal": "levelorder"},
            ],
        },
        {},
    )
    assert bplus_res.algorithm == "b_plus_tree"
    assert len(bplus_res.steps) >= 4
    assert "keys" in (bplus_res.result or {})
