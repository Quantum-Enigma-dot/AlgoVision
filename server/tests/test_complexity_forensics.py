from app.services.complexity_forensics import analyze_complexity_forensics


def test_forensics_detects_quadratic_python_loop():
    code = """
def bubble_like(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
"""
    result = analyze_complexity_forensics(code, "python")

    assert result["time_complexity"]["worst"] == "O(n^2)"
    assert result["space_complexity"] in {"O(1)", "O(n)"}
    assert result["model"] == "complexity-forensics-offline-v1"
    assert result["confidence"] in {"MEDIUM", "HIGH"}


def test_forensics_detects_logarithmic_loop_c():
    code = """
int binary_steps(int n) {
    int count = 0;
    while (n > 1) {
        n /= 2;
        count++;
    }
    return count;
}
"""
    result = analyze_complexity_forensics(code, "c")

    assert result["time_complexity"]["worst"] == "O(log n)"
    assert result["space_complexity"] == "O(1)"
    assert len(result["reasoning_trace"]) >= 2


def test_forensics_detects_nm_nested_loops_python():
    code = """
def lcs_like(a, b):
    n = len(a)
    m = len(b)
    total = 0
    for i in range(n):
        for j in range(m):
            total += 1
    return total
"""
    result = analyze_complexity_forensics(code, "python")
    assert result["time_complexity"]["worst"] == "O(nm)"


def test_forensics_detects_ve_style_nested_loops_c():
    code = """
int relax_all(int V, int E, int edges[][3]) {
    int updates = 0;
    for (int i = 0; i < V; ++i) {
        for (int j = 0; j < E; ++j) {
            updates += edges[j][2];
        }
    }
    return updates;
}
"""
    result = analyze_complexity_forensics(code, "c")
    assert result["time_complexity"]["worst"] == "O(VE)"
