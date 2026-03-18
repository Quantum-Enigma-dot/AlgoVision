import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2, Terminal, Copy, Trash2, BookOpen } from "lucide-react";
import { runPlayground } from "../services/api.js";

const TEMPLATES = {
  python: [
    {
      name: "Bubble Sort",
      code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

data = [64, 34, 25, 12, 22, 11, 90]
print("Original:", data)
print("Sorted:", bubble_sort(data))`
    },
    {
      name: "Binary Search",
      code: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    steps = 0
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid, steps
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1, steps

arr = list(range(1, 101))
idx, steps = binary_search(arr, 73)
print(f"Found 73 at index {idx} in {steps} steps")`
    },
    {
      name: "Fibonacci (DP)",
      code: `def fibonacci(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

for i in range(15):
    print(f"F({i}) = {fibonacci(i)}")`
    },
    {
      name: "Graph BFS",
      code: `from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}
print("BFS order:", bfs(graph, 'A'))`
    },
  ],
  c: [
    {
      name: "Bubble Sort",
      code: `#include <stdio.h>

void bubble_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Original: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    bubble_sort(arr, n);

    printf("Sorted:   ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    return 0;
}`
    },
    {
      name: "Binary Search",
      code: `#include <stdio.h>

int binary_search(int arr[], int n, int target, int *steps) {
    int low = 0, high = n - 1;
    *steps = 0;
    while (low <= high) {
        (*steps)++;
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    int arr[100];
    for (int i = 0; i < 100; i++) arr[i] = i + 1;

    int steps;
    int idx = binary_search(arr, 100, 73, &steps);
    printf("Found 73 at index %d in %d steps\\n", idx, steps);

    return 0;
}`
    },
    {
      name: "Fibonacci (DP)",
      code: `#include <stdio.h>

long long fibonacci(int n) {
    if (n <= 1) return n;
    long long dp[100] = {0};
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}

int main() {
    for (int i = 0; i < 20; i++) {
        printf("F(%d) = %lld\\n", i, fibonacci(i));
    }
    return 0;
}`
    },
    {
      name: "Linked List",
      code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

Node* create_node(int data) {
    Node* node = (Node*)malloc(sizeof(Node));
    node->data = data;
    node->next = NULL;
    return node;
}

void push(Node** head, int data) {
    Node* node = create_node(data);
    node->next = *head;
    *head = node;
}

void print_list(Node* head) {
    Node* current = head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}

void reverse(Node** head) {
    Node *prev = NULL, *current = *head, *next = NULL;
    while (current != NULL) {
        next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    *head = prev;
}

int main() {
    Node* head = NULL;
    for (int i = 1; i <= 6; i++) push(&head, i * 10);

    printf("Original: ");
    print_list(head);

    reverse(&head);
    printf("Reversed: ");
    print_list(head);

    return 0;
}`
    },
  ],
};

const LANGUAGES = [
  { id: "python", label: "Python", color: "text-emerald-300 border-emerald-300/40 bg-emerald-400/15" },
  { id: "c", label: "C", color: "text-blue-300 border-blue-300/40 bg-blue-400/15" },
];

const Playground = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(TEMPLATES.python[0].code);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [execTime, setExecTime] = useState(null);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(TEMPLATES[lang][0].code);
    setOutput("");
    setError("");
    setExecTime(null);
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setOutput("");
    setError("");
    setExecTime(null);
    try {
      const data = await runPlayground(code, language);
      setOutput(data.output || "");
      setError(data.error || "");
      setExecTime(data.execution_time_ms);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Execution failed");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const activeTemplates = TEMPLATES[language] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl panel p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 top-8 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-pink-500/30 to-amber-400/30 p-3">
            <Terminal size={24} className="text-pink-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sky">Algorithm Playground</h1>
            <p className="text-sm text-sky/60">Write, edit, and run algorithms instantly — Python & C supported</p>
          </div>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-sky/40">Language:</span>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => handleLanguageChange(lang.id)}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              language === lang.id
                ? lang.color
                : "border-white/10 bg-white/5 text-sky/50 hover:border-white/20 hover:text-sky/70"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Templates */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1 text-xs text-sky/50">
          <BookOpen size={12} /> Templates:
        </span>
        {activeTemplates.map((t) => (
          <button
            key={t.name}
            onClick={() => { setCode(t.code); setOutput(""); setError(""); }}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-sky/70 transition hover:border-white/25 hover:text-sky"
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="rounded-2xl panel p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-sky">
              Code Editor
              <span className={`ml-2 text-xs font-normal ${language === "c" ? "text-blue-300" : "text-emerald-300"}`}>
                ({language === "c" ? "C" : "Python"})
              </span>
            </h2>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-sky/70 hover:text-sky" title="Copy code">
                <Copy size={14} />
              </button>
              <button onClick={() => { setCode(""); setOutput(""); setError(""); }} className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-300/15" title="Clear">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <textarea
            className={`w-full rounded-xl border border-white/15 bg-[#0d1117] p-4 font-mono text-sm leading-6 placeholder-sky/30 focus:outline-none ${
              language === "c"
                ? "text-blue-200 focus:border-blue-400/40"
                : "text-emerald-200 focus:border-emerald-400/40"
            }`}
            rows={18}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={language === "c" ? "// Write your C code here...\n#include <stdio.h>\n\nint main() {\n    ...\n}" : "# Write your Python code here..."}
            spellCheck={false}
          />
          <button
            onClick={handleRun}
            disabled={loading || !code.trim()}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-50 ${
              language === "c"
                ? "border-blue-300/35 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-100"
                : "border-emerald-300/35 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-100"
            }`}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {loading ? (language === "c" ? "Compiling & Running..." : "Running...") : `Run ${language === "c" ? "C" : "Python"} Code`}
          </button>
        </div>

        {/* Output */}
        <div className="rounded-2xl panel p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-sky">Output</h2>
            {execTime !== null && (
              <span className={`rounded-full border px-3 py-1 text-[11px] ${
                language === "c"
                  ? "border-blue-300/30 bg-blue-400/15 text-blue-200"
                  : "border-emerald-300/30 bg-emerald-400/15 text-emerald-200"
              }`}>
                {execTime.toFixed(1)} ms
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-slate-950/40 py-24">
              <Loader2 size={28} className={`animate-spin ${language === "c" ? "text-blue-400" : "text-emerald-400"}`} />
              <p className="text-sm text-sky/50">{language === "c" ? "Compiling & executing..." : "Executing..."}</p>
            </div>
          ) : (
            <>
              <div className="min-h-[300px] rounded-xl border border-white/10 bg-[#0d1117] p-4 font-mono text-sm leading-6 overflow-auto max-h-[460px]">
                {output ? (
                  <motion.pre
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`whitespace-pre-wrap ${language === "c" ? "text-blue-300" : "text-emerald-300"}`}
                  >
                    {output}
                  </motion.pre>
                ) : (
                  <p className="text-sky/30">Output will appear here after running your code...</p>
                )}
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-300/30 bg-red-400/10 p-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-200/80">
                    {language === "c" ? "Compilation / Runtime Error" : "Error"}
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap font-mono text-sm text-red-200">{error}</pre>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;
