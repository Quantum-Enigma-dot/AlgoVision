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
    selection_sort,
    shell_sort,
)


SORTS = [
    bubble_sort.run,
    cocktail_sort.run,
    comb_sort.run,
    counting_sort.run,
    gnome_sort.run,
    selection_sort.run,
    insertion_sort.run,
    merge_sort.run,
    quick_sort.run,
    heap_sort.run,
    shell_sort.run,
]


def test_sorting_algorithms():
    data = {"array": [5, 1, 4, 2, 8]}
    expected = [1, 2, 4, 5, 8]
    for algo in SORTS:
        result = algo(data, {})["result"]
        assert result == expected
