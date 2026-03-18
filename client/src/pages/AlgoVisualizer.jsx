import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Loader2, Play, Pause, SkipBack, SkipForward,
  ChevronLeft, ChevronRight, Sparkles, Zap, Copy,
  Cpu, Clock, HardDrive, Code2, Braces, RotateCcw,
  CheckCircle2, AlertTriangle,
} from "lucide-react";
import { algoVisualize } from "../services/api.js";
import VisualizationCanvas from "../components/VisualizationCanvas.jsx";

/* ──────────────────────── Animated particle background ──────────────────────── */
const ParticleField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 200,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.4 + 0.1,
    }));
    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

/* ──────────────────────── Code templates (C only) ──────────────────────── */
const TEMPLATES = [
  {
    label: "Bubble Sort",
    icon: "🔄",
    lang: "c",
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
}`,
  },
  {
    label: "BFS Graph",
    icon: "🌐",
    lang: "c",
    code: `#include <stdio.h>
#include <stdlib.h>

#define MAX 100
int adj[MAX][MAX], visited[MAX], queue[MAX];
int front = 0, rear = 0, n;

void bfs(int start) {
    visited[start] = 1;
    queue[rear++] = start;
    while (front < rear) {
        int node = queue[front++];
        printf("%d ", node);
        for (int i = 0; i < n; i++) {
            if (adj[node][i] && !visited[i]) {
                visited[i] = 1;
                queue[rear++] = i;
            }
        }
    }
}`,
  },
  {
    label: "LCS (DP)",
    icon: "📊",
    lang: "c",
    code: `#include <stdio.h>
#include <string.h>

int lcs(char *a, char *b) {
    int n = strlen(a), m = strlen(b);
    int dp[n + 1][m + 1];
    for (int i = 0; i <= n; i++)
        for (int j = 0; j <= m; j++) {
            if (i == 0 || j == 0)
                dp[i][j] = 0;
            else if (a[i-1] == b[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = dp[i-1][j] > dp[i][j-1]
                         ? dp[i-1][j] : dp[i][j-1];
        }
    return dp[n][m];
}`,
  },
  {
    label: "KMP String",
    icon: "🔍",
    lang: "c",
    code: `#include <stdio.h>
#include <string.h>

void computeLPS(char *pat, int m, int *lps) {
    int len = 0; lps[0] = 0;
    int i = 1;
    while (i < m) {
        if (pat[i] == pat[len]) {
            lps[i++] = ++len;
        } else if (len) {
            len = lps[len - 1];
        } else {
            lps[i++] = 0;
        }
    }
}

void kmp(char *txt, char *pat) {
    int n = strlen(txt), m = strlen(pat);
    int lps[m];
    computeLPS(pat, m, lps);
    int i = 0, j = 0;
    while (i < n) {
        if (txt[i] == pat[j]) { i++; j++; }
        if (j == m) {
            printf("Found at %d\\n", i - j);
            j = lps[j - 1];
        } else if (i < n && txt[i] != pat[j]) {
            j ? (j = lps[j - 1]) : i++;
        }
    }
}`,
  },
  {
    label: "Binary Search",
    icon: "⚡",
    lang: "c",
    code: `#include <stdio.h>

int binary_search(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}`,
  },
  {
    label: "DFS Graph",
    icon: "🌳",
    lang: "c",
    code: `#include <stdio.h>

#define MAX 100
int adj[MAX][MAX], visited[MAX], n;

void dfs(int node) {
    visited[node] = 1;
    printf("%d ", node);
    for (int i = 0; i < n; i++) {
        if (adj[node][i] && !visited[i])
            dfs(i);
    }
}`,
  },
];

const LANGUAGES = [
  { id: "c", label: "C", accent: "from-blue-500 to-indigo-500", text: "text-blue-300", border: "border-blue-300/40", bg: "bg-blue-400/15" },
];

const TYPE_CONFIG = {
  sorting: { label: "Sorting", color: "from-emerald-400 to-green-400", bg: "bg-emerald-400/15", border: "border-emerald-300/40", icon: "📊" },
  graph: { label: "Graph", color: "from-amber-400 to-orange-400", bg: "bg-amber-400/15", border: "border-amber-300/40", icon: "🌐" },
  dp: { label: "Dynamic Programming", color: "from-blue-400 to-indigo-400", bg: "bg-blue-400/15", border: "border-blue-300/40", icon: "📐" },
  string: { label: "String Matching", color: "from-pink-400 to-rose-400", bg: "bg-pink-400/15", border: "border-pink-300/40", icon: "🔤" },
  tree: { label: "Tree", color: "from-violet-400 to-purple-400", bg: "bg-violet-400/15", border: "border-violet-300/40", icon: "🌳" },
  generic: { label: "Algorithm", color: "from-cyan-400 to-sky-400", bg: "bg-cyan-400/15", border: "border-cyan-300/40", icon: "⚙️" },
  other: { label: "Algorithm", color: "from-slate-400 to-zinc-400", bg: "bg-slate-400/15", border: "border-slate-300/40", icon: "🧮" },
};

/* ──────────────────────── Main Component ──────────────────────── */
const AlgoVisualizer = () => {
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [language, setLanguage] = useState("c");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Playback state
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const intervalRef = useRef(null);

  const steps = result?.steps || [];
  const totalSteps = steps.length;

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && totalSteps > 0) {
      intervalRef.current = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, totalSteps]);

  const handleVisualize = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setStepIndex(0);
    setIsPlaying(false);
    try {
      const data = await algoVisualize(code, language);
      setResult(data);
      if (data.steps?.length > 1) {
        setTimeout(() => setIsPlaying(true), 500);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Visualization failed");
    }
    setLoading(false);
  };

  const handleCopy = useCallback(() => navigator.clipboard.writeText(code), [code]);

  const handleReset = () => {
    setResult(null);
    setStepIndex(0);
    setIsPlaying(false);
    setError("");
  };

  const typeCfg = TYPE_CONFIG[result?.visualization_type] || TYPE_CONFIG.generic;

  return (
    <div className="space-y-6">

      {/* ─── Hero Header ─── */}
      <div className="relative overflow-hidden rounded-2xl panel p-8">
        <ParticleField />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-15" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute right-0 -top-12 h-56 w-56 rounded-full bg-cyan-400/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-16 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-pink-500/10 blur-[80px]" />

        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-violet-500/40 to-cyan-400/40 blur-lg" />
              <div className="relative rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-400/30 p-4 backdrop-blur-sm border border-white/10">
                <Eye size={28} className="text-violet-200" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="gradient-text-animated">Algorithm Visualizer</span>
              </h1>
              <p className="mt-1 text-sm text-sky/50">
                Paste any algorithm — AI detects the type and generates step-by-step visualization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-violet-300/30 bg-violet-400/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200">
              <Sparkles size={12} className="animate-pulse" /> AI-Powered
            </span>
          </div>
        </div>
      </div>

      {/* Language is fixed to C */}

      {/* ─── Template Chips ─── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky/40">Quick Load</span>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.label}
              onClick={() => { setCode(t.code); setLanguage(t.lang); handleReset(); }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-sky/60 transition-all duration-300 hover:border-violet-300/30 hover:text-violet-200 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:bg-violet-400/[0.06]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-base">{t.icon}</span>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">

        {/* ═══ LEFT PANEL — Code Input ═══ */}
        <div className="space-y-4">
          <div className="rounded-2xl panel overflow-hidden">
            {/* Editor header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/70" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                </div>
                <span className="text-xs font-medium text-sky/50">algorithm.c</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sky/50 transition hover:border-white/20 hover:text-sky/80" title="Copy code">
                  <Copy size={13} />
                </button>
                <button onClick={() => { setCode(""); handleReset(); }} className="rounded-lg border border-red-300/15 bg-red-400/5 px-2.5 py-1.5 text-red-300/50 transition hover:border-red-300/30 hover:text-red-200" title="Clear">
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            {/* Code textarea */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full min-h-[360px] resize-none border-0 bg-[#0a0e1a] px-5 py-4 font-mono text-[13px] leading-7 text-blue-200/90 placeholder-sky/20 focus:outline-none"
                placeholder={"// Paste any C algorithm here...\n// The AI will detect its type and generate a visualization\n\nvoid your_algorithm(int data[], int n) {\n    ...\n}"}
                spellCheck={false}
              />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0e1a] to-transparent" />
            </div>

            {/* Analyze button */}
            <div className="border-t border-white/10 p-4">
              <button
                onClick={handleVisualize}
                disabled={loading || !code.trim()}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600/90 to-cyan-500/90 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {loading ? (
                  <>
                    <div className="relative">
                      <Loader2 size={18} className="animate-spin" />
                      <div className="absolute inset-0 animate-ping rounded-full border border-white/30" />
                    </div>
                    <span>AI is analyzing your algorithm...</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Visualize Algorithm</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ─── Detection Result Card ─── */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="rounded-2xl panel overflow-hidden"
              >
                {/* Detection header */}
                <div className={`bg-gradient-to-r ${typeCfg.color} p-[1px]`}>
                  <div className="rounded-t-2xl bg-ink/90 backdrop-blur-xl px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{typeCfg.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-sky">{result.algorithm_name}</h3>
                          <p className="text-xs text-sky/50">{typeCfg.label} Algorithm Detected</p>
                        </div>
                      </div>
                      {result.model && result.model !== "fallback" && (
                        <span className="rounded-full border border-violet-300/25 bg-violet-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-300">
                          {result.model}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  {/* Description */}
                  <p className="text-sm leading-relaxed text-sky/70">{result.description}</p>

                  {/* Complexity badges */}
                  {result.complexity && (
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Best", value: result.complexity.best_time, icon: Zap, color: "text-emerald-300 border-emerald-300/20 bg-emerald-400/5" },
                        { label: "Average", value: result.complexity.average_time, icon: Clock, color: "text-amber-300 border-amber-300/20 bg-amber-400/5" },
                        { label: "Worst", value: result.complexity.worst_time, icon: AlertTriangle, color: "text-red-300 border-red-300/20 bg-red-400/5" },
                        { label: "Space", value: result.complexity.space, icon: HardDrive, color: "text-blue-300 border-blue-300/20 bg-blue-400/5" },
                      ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 ${color}`}>
                          <Icon size={14} className="shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider opacity-60">{label}</p>
                            <p className="truncate text-xs font-bold">{value || "?"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-red-300/25 bg-red-400/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-red-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-200">Analysis Failed</p>
                    <p className="mt-1 text-xs text-red-200/60">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ RIGHT PANEL — Visualization ═══ */}
        <div className="space-y-4">
          <div className="rounded-2xl panel overflow-hidden min-h-[500px]">
            {/* Visualization header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className={`rounded-lg p-1.5 ${result ? typeCfg.bg : "bg-white/5"} ${result ? typeCfg.border : "border-white/10"} border`}>
                  <Cpu size={14} className={result ? "" : "text-sky/40"} />
                </div>
                <span className="text-sm font-semibold text-sky">
                  {result ? "Live Visualization" : "Visualization Preview"}
                </span>
                {totalSteps > 0 && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-sky/50">
                    Step {stepIndex + 1} / {totalSteps}
                  </span>
                )}
              </div>
              {result && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-medium text-emerald-300">Ready</span>
                </div>
              )}
            </div>

            {/* Canvas */}
            <div className="p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-6 py-20">
                  <div className="relative">
                    <div className="absolute inset-[-8px] animate-spin rounded-full border-2 border-transparent border-t-violet-400 border-r-cyan-400" />
                    <div className="absolute inset-[-16px] animate-spin rounded-full border-2 border-transparent border-b-pink-400/40" style={{ animationDirection: "reverse", animationDuration: "3s" }} />
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 backdrop-blur-sm">
                      <Eye size={24} className="text-violet-300 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-sky/70">AI is analyzing your algorithm</p>
                    <p className="mt-1 text-xs text-sky/40">Detecting patterns and generating visualization data...</p>
                  </div>
                </div>
              ) : result && totalSteps > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <VisualizationCanvas
                    category={
                      ["sorting","graph","dp","string"].includes(result.visualization_type)
                        ? result.visualization_type
                        : "graph"
                    }
                    algorithm={result.algorithm_name}
                    steps={result.steps}
                    stepIndex={stepIndex}
                    input={result.input_data || {}}
                    zoom={1}
                    status={stepIndex >= totalSteps - 1 ? "completed" : "running"}
                  />
                </motion.div>
              ) : result && totalSteps === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                  <Braces size={36} className="text-sky/30" />
                  <div className="text-center">
                    <p className="text-sm text-sky/60">Analysis complete but no visualization steps generated.</p>
                    <p className="mt-1 text-xs text-sky/40">Try a more standard algorithm implementation.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-6 py-20">
                  <div className="relative">
                    <div className="absolute inset-[-4px] rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-400/10 blur-xl" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                      <Code2 size={32} className="text-sky/25" />
                    </div>
                  </div>
                  <div className="max-w-xs text-center">
                    <p className="text-sm font-medium text-sky/50">Paste an algorithm and click Visualize</p>
                    <p className="mt-1.5 text-xs leading-5 text-sky/30">
                      Supports sorting, graph traversal, dynamic programming, string matching, and more
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Playback Controls ─── */}
          <AnimatePresence>
            {result && totalSteps > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl panel p-4"
              >
                <div className="flex flex-col gap-4">
                  {/* Progress bar */}
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${typeCfg.color}`}
                      initial={false}
                      animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                  </div>

                  {/* Control buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { setStepIndex(0); setIsPlaying(false); }} disabled={stepIndex === 0} className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-sky/60 transition hover:border-white/20 hover:text-sky disabled:opacity-30" title="First step">
                        <SkipBack size={14} />
                      </button>
                      <button onClick={() => { setStepIndex(Math.max(0, stepIndex - 1)); setIsPlaying(false); }} disabled={stepIndex === 0} className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-sky/60 transition hover:border-white/20 hover:text-sky disabled:opacity-30" title="Previous">
                        <ChevronLeft size={14} />
                      </button>

                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`group relative mx-2 flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${
                          isPlaying
                            ? "border-amber-300/40 bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-200 shadow-lg shadow-amber-500/10"
                            : "border-violet-300/40 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-200 shadow-lg shadow-violet-500/10"
                        } hover:-translate-y-0.5 hover:shadow-xl`}
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                      </button>

                      <button onClick={() => { setStepIndex(Math.min(totalSteps - 1, stepIndex + 1)); setIsPlaying(false); }} disabled={stepIndex >= totalSteps - 1} className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-sky/60 transition hover:border-white/20 hover:text-sky disabled:opacity-30" title="Next">
                        <ChevronRight size={14} />
                      </button>
                      <button onClick={() => { setStepIndex(totalSteps - 1); setIsPlaying(false); }} disabled={stepIndex >= totalSteps - 1} className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-sky/60 transition hover:border-white/20 hover:text-sky disabled:opacity-30" title="Last step">
                        <SkipForward size={14} />
                      </button>
                    </div>

                    {/* Speed control */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-sky/40">Speed</span>
                      <div className="flex gap-1">
                        {[
                          { label: "0.5×", ms: 1200 },
                          { label: "1×", ms: 600 },
                          { label: "2×", ms: 300 },
                          { label: "4×", ms: 150 },
                        ].map(({ label, ms }) => (
                          <button
                            key={ms}
                            onClick={() => setSpeed(ms)}
                            className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                              speed === ms
                                ? "border border-violet-300/40 bg-violet-400/15 text-violet-200"
                                : "border border-white/10 bg-white/5 text-sky/50 hover:text-sky/80"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Step Info Card ─── */}
          <AnimatePresence>
            {result && totalSteps > 0 && steps[stepIndex] && (
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center gap-2 text-xs text-sky/50">
                  <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${typeCfg.color}`} />
                  <span className="font-medium">Step {stepIndex + 1}</span>
                  {steps[stepIndex]?.type && (
                    <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-sky/40">
                      {steps[stepIndex].type}
                    </span>
                  )}
                  {steps[stepIndex]?.description && (
                    <span className="text-sky/40">{steps[stepIndex].description}</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AlgoVisualizer;
