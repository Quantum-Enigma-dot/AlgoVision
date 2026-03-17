from app.algorithms.sorting import bubble_sort, heap_sort, insertion_sort, merge_sort, quick_sort, selection_sort


SORTS = [
    bubble_sort.run,
    selection_sort.run,
    insertion_sort.run,
    merge_sort.run,
    quick_sort.run,
    heap_sort.run,
]


def test_sorting_algorithms():
    data = {"array": [5, 1, 4, 2, 8]}
    expected = [1, 2, 4, 5, 8]
    for algo in SORTS:
        result = algo(data, {})["result"]
        assert result == expected
