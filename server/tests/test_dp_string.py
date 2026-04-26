from app.algorithms.dp import edit_distance, knapsack, lcs, longest_common_substring
from app.algorithms.string_matching import boyer_moore, huffman_coding, kmp, naive, rabin_karp, z_algorithm


def test_knapsack():
    data = {"weights": [1, 3, 4, 5], "values": [1, 4, 5, 7], "capacity": 7}
    result = knapsack.run(data, {})["result"]
    assert result == 9


def test_lcs():
    data = {"text_a": "AGGTAB", "text_b": "GXTXAYB"}
    result = lcs.run(data, {})["result"]
    assert result == 4


def test_edit_distance():
    data = {"text_a": "kitten", "text_b": "sitting"}
    result = edit_distance.run(data, {})["result"]
    assert result == 3


def test_longest_common_substring():
    data = {"text_a": "ABABC", "text_b": "BABCA"}
    result = longest_common_substring.run(data, {})["result"]
    assert result["substring"] == "BABC"
    assert result["length"] == 4


def test_string_matching():
    data = {"text": "ababcabcabababd", "pattern": "ababd"}
    assert naive.run(data, {})["result"] == [10]
    assert kmp.run(data, {})["result"] == [10]
    assert boyer_moore.run(data, {})["result"] == [10]
    assert rabin_karp.run(data, {})["result"] == [10]
    assert z_algorithm.run(data, {})["result"] == [10]


def test_huffman_coding():
    data = {"text": "beep boop beer!"}
    payload = huffman_coding.run(data, {})

    result = payload["result"]
    assert result["decoded_text"] == data["text"]
    assert set(result["codes"].keys()) == set(data["text"])
    assert result["encoded_bits"] == len(result["encoded_text"])
    assert any(step["type"] == "merge" for step in payload["steps"])
