from app.algorithms.dp import knapsack, lcs
from app.algorithms.string_matching import kmp, naive, rabin_karp


def test_knapsack():
    data = {"weights": [1, 3, 4, 5], "values": [1, 4, 5, 7], "capacity": 7}
    result = knapsack.run(data, {})["result"]
    assert result == 9


def test_lcs():
    data = {"text_a": "AGGTAB", "text_b": "GXTXAYB"}
    result = lcs.run(data, {})["result"]
    assert result == 4


def test_string_matching():
    data = {"text": "ababcabcabababd", "pattern": "ababd"}
    assert naive.run(data, {})["result"] == [10]
    assert kmp.run(data, {})["result"] == [10]
    assert rabin_karp.run(data, {})["result"] == [10]
