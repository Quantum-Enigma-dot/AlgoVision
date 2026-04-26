import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2, Terminal, Copy, Trash2, BookOpen } from "lucide-react";
import { runPlayground } from "../services/api.js";

const TEMPLATES = {
  python: {
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

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,
  },
  c: {
    name: "Bubble Sort",
    code: `#include <stdio.h>

void bubble_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    bubble_sort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
  },
  cpp: {
    name: "Quick Sort",
    code: `#include <bits/stdc++.h>
using namespace std;

int partition(vector<int>& a, int low, int high) {
    int pivot = a[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (a[j] < pivot) {
            i++;
            swap(a[i], a[j]);
        }
    }
    swap(a[i + 1], a[high]);
    return i + 1;
}

void quick_sort(vector<int>& a, int low, int high) {
    if (low >= high) return;
    int p = partition(a, low, high);
    quick_sort(a, low, p - 1);
    quick_sort(a, p + 1, high);
}

int main() {
    vector<int> a = {9, 4, 6, 2, 7, 1, 8, 5, 3};
    quick_sort(a, 0, (int)a.size() - 1);
    for (int x : a) cout << x << " ";
    cout << "\\n";
    return 0;
}`,
  },
  java: {
    name: "Binary Search",
    code: `public class Main {
    static int binarySearch(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = new int[100];
        for (int i = 0; i < arr.length; i++) arr[i] = i + 1;
        System.out.println(binarySearch(arr, 73));
    }
}`,
  },
  javascript: {
    name: "Merge Sort",
    code: `function merge(left, right) {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  return out.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}

console.log(mergeSort([9, 1, 4, 7, 3, 8, 2, 6, 5]));`,
  },
  go: {
    name: "Binary Search",
    code: `package main

import "fmt"

func binarySearch(arr []int, target int) int {
    low := 0
    high := len(arr) - 1
    for low <= high {
        mid := low + (high-low)/2
        if arr[mid] == target {
            return mid
        }
        if arr[mid] < target {
            low = mid + 1
        } else {
            high = mid - 1
        }
    }
    return -1
}

func main() {
    arr := make([]int, 100)
    for i := 0; i < 100; i++ {
        arr[i] = i + 1
    }
    fmt.Println(binarySearch(arr, 73))
}`,
  },
};

const LANGUAGES = [
  { id: "python", label: "Python", accent: "text-emerald-300" },
  { id: "c", label: "C", accent: "text-blue-300" },
  { id: "cpp", label: "C++", accent: "text-cyan-300" },
  { id: "java", label: "Java", accent: "text-orange-300" },
  { id: "javascript", label: "JavaScript", accent: "text-yellow-300" },
  { id: "go", label: "Go", accent: "text-indigo-300" },
];

const COMPILED_LANGUAGES = new Set(["c", "cpp", "java", "go"]);

const Playground = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(TEMPLATES.python.code);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [execTime, setExecTime] = useState(null);

  const activeLanguage = useMemo(
    () => LANGUAGES.find((item) => item.id === language) || LANGUAGES[0],
    [language]
  );

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    setCode(TEMPLATES[nextLanguage].code);
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

  return (
    <div className="space-y-6">
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
            <p className="text-sm text-sky/60">Run Python, C, C++, Java, JavaScript, and Go snippets instantly</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-sky/40">Language:</span>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => handleLanguageChange(lang.id)}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              language === lang.id
                ? "border-white/30 bg-white/15 text-sky"
                : "border-white/10 bg-white/5 text-sky/50 hover:border-white/20 hover:text-sky/70"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-sky/65">
        <BookOpen size={14} />
        <span>Template: {TEMPLATES[language].name}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl panel space-y-3 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-sky">
              Code Editor
              <span className={`ml-2 text-xs font-normal ${activeLanguage.accent}`}>({activeLanguage.label})</span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard?.writeText(code)}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-sky/70 hover:text-sky"
                title="Copy code"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={() => {
                  setCode("");
                  setOutput("");
                  setError("");
                }}
                className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-300/15"
                title="Clear"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <textarea
            className="w-full rounded-xl border border-white/15 bg-[#0d1117] p-4 font-mono text-sm leading-6 text-sky/90 placeholder-sky/30 focus:border-white/30 focus:outline-none"
            rows={18}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
          />

          <button
            onClick={handleRun}
            disabled={loading || !code.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-300/35 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-3 text-sm font-semibold text-sky-100 transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {loading
              ? COMPILED_LANGUAGES.has(language)
                ? "Compiling & Running..."
                : "Running..."
              : `Run ${activeLanguage.label} Code`}
          </button>
        </div>

        <div className="rounded-2xl panel space-y-3 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-sky">Output</h2>
            {execTime !== null && (
              <span className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-[11px] text-sky-200">
                {execTime.toFixed(1)} ms
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-slate-950/40 py-24">
              <Loader2 size={28} className="animate-spin text-sky-300" />
              <p className="text-sm text-sky/50">
                {COMPILED_LANGUAGES.has(language) ? "Compiling & executing..." : "Executing..."}
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-[460px] min-h-[300px] overflow-auto rounded-xl border border-white/10 bg-[#0d1117] p-4 font-mono text-sm leading-6">
                {output ? (
                  <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap text-emerald-300">
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
                    {COMPILED_LANGUAGES.has(language) ? "Compilation / Runtime Error" : "Error"}
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
