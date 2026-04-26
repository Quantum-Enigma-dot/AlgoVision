import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Code2, Copy, Loader2, Sparkles, Trash2 } from "lucide-react";
import { analyzeComplexityForensics } from "../services/api.js";
import {
  ANALYZER_ALGORITHM_CATALOG,
  getAnalyzerAlgorithmByName,
  getLanguageLabel,
  normalizeCategoryLabel,
} from "../data/algorithms.js";

const LANGUAGE_OPTIONS = [
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
];

const STARTER_SNIPPETS = {
  python: `def pair_scan(arr):
    n = len(arr)
    best = 0
    for i in range(n):
        for j in range(i + 1, n):
            best = max(best, arr[j] - arr[i])
    return best`,
  c: `int binary_steps(int n) {
    int steps = 0;
    while (n > 1) {
        n /= 2;
        steps++;
    }
    return steps;
}`,
  cpp: `int sumAll(const std::vector<int>& a) {
    int total = 0;
    for (int i = 0; i < (int)a.size(); ++i) {
        total += a[i];
    }
    return total;
}`,
  java: `public static int maxSubArray(int[] arr) {
    int best = Integer.MIN_VALUE;
    int current = 0;
    for (int x : arr) {
        current = Math.max(x, current + x);
        best = Math.max(best, current);
    }
    return best;
}`,
  go: `func countPairs(n int) int {
    count := 0
    for i := 0; i < n; i++ {
        for j := i + 1; j < n; j++ {
            count++
        }
    }
    return count
}`,
};

const confidenceTone = (confidence) => {
  const value = String(confidence || "").toUpperCase();
  if (value === "HIGH") {
    return "border-emerald-300/35 bg-emerald-400/15 text-emerald-100";
  }
  if (value === "MEDIUM") {
    return "border-amber-300/35 bg-amber-400/15 text-amber-100";
  }
  return "border-rose-300/35 bg-rose-400/15 text-rose-100";
};

const ComplexityForensics = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(STARTER_SNIPPETS.python);
  const [selectedAnalyzerAlgorithm, setSelectedAnalyzerAlgorithm] = useState("");
  const [lastInjectedCode, setLastInjectedCode] = useState(STARTER_SNIPPETS.python);
  const [inputSource, setInputSource] = useState("Sample: Python");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportCopied, setReportCopied] = useState(false);

  const analyzerAlgorithmsByCategory = useMemo(() => {
    const groups = {};
    ANALYZER_ALGORITHM_CATALOG.forEach((algorithm) => {
      if (!groups[algorithm.category]) {
        groups[algorithm.category] = [];
      }
      groups[algorithm.category].push(algorithm);
    });
    return groups;
  }, []);

  const codeStats = useMemo(() => {
    const lines = code ? code.split(/\r?\n/).length : 0;
    const nonEmptyLines = code ? code.split(/\r?\n/).filter((line) => line.trim()).length : 0;
    const characters = code.length;
    return { lines, nonEmptyLines, characters };
  }, [code]);

  const summaryLine = result
    ? `Worst-case time looks like ${result.time_complexity?.worst || "Unknown"} with ${result.space_complexity || "Unknown"} auxiliary space, mainly driven by ${result.dominant_pattern || "the detected dominant pattern"}.`
    : "";

  useEffect(() => {
    if (!reportCopied) return undefined;
    const timeoutId = window.setTimeout(() => setReportCopied(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [reportCopied]);

  const injectCode = (nextCode, nextSource) => {
    setCode(nextCode);
    setLastInjectedCode(nextCode);
    if (nextSource) {
      setInputSource(nextSource);
    }
  };

  const handleLanguageChange = (nextLanguage) => {
    const selectedAlgorithm = selectedAnalyzerAlgorithm ? getAnalyzerAlgorithmByName(selectedAnalyzerAlgorithm) : null;
    const nextSnippet = selectedAlgorithm?.codeByLanguage?.[nextLanguage] || STARTER_SNIPPETS[nextLanguage] || "";

    setLanguage(nextLanguage);

    if (code === lastInjectedCode) {
      const nextSource = selectedAlgorithm
        ? `Analyzer import: ${selectedAlgorithm.display_name} (${getLanguageLabel(nextLanguage)})`
        : `Sample: ${getLanguageLabel(nextLanguage)}`;
      injectCode(nextSnippet, nextSource);
    }
  };

  const handleLoadSample = () => {
    const sample = STARTER_SNIPPETS[language] || "";
    setSelectedAnalyzerAlgorithm("");
    injectCode(sample, `Sample: ${getLanguageLabel(language)}`);
    setErrorMessage("");
  };

  const handleImportAnalyzerAlgorithm = () => {
    if (!selectedAnalyzerAlgorithm) {
      setErrorMessage("Select an analyzer algorithm to import its code.");
      return;
    }

    const selectedAlgorithm = getAnalyzerAlgorithmByName(selectedAnalyzerAlgorithm);
    const importedCode = selectedAlgorithm?.codeByLanguage?.[language];

    if (!importedCode) {
      setErrorMessage("No code snippet is available for that algorithm in the selected language.");
      return;
    }

    injectCode(importedCode, `Analyzer import: ${selectedAlgorithm.display_name} (${getLanguageLabel(language)})`);
    setErrorMessage("");
  };

  const handleClearEditor = () => {
    setCode("");
    setLastInjectedCode("");
    setInputSource("Manual input");
    setErrorMessage("");
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setErrorMessage("Please paste code to analyze.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setResult(null);

    try {
      const response = await analyzeComplexityForensics(code, language);
      setResult(response);
    } catch (error) {
      setErrorMessage(error?.response?.data?.detail || error.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = async () => {
    if (!result?.report || !navigator?.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(result.report);
      setReportCopied(true);
    } catch {
      setReportCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl panel p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" />
        <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-8 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-amber-400/15 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-amber-100">
              <Sparkles size={12} /> Offline Engine
            </p>
            <h1 className="text-2xl font-bold text-sky">Complexity Forensics</h1>
            <p className="max-w-3xl text-sm leading-7 text-sky/65">
              Paste code, import directly from Analyzer, or start from a sample. The offline engine estimates time and space complexity, explains the reasoning path, and points to the lines that shaped the verdict.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-100">
            No external AI API calls
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <section className="rounded-2xl panel p-5 space-y-4">
          <h2 className="text-lg font-semibold text-sky">Input</h2>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Language</label>
            <select
              value={language}
              onChange={(event) => handleLanguageChange(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
            >
              {LANGUAGE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-sky/55">Lines</p>
              <p className="mt-1 text-lg font-semibold text-sky">{codeStats.lines}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-sky/55">Non-empty</p>
              <p className="mt-1 text-lg font-semibold text-sky">{codeStats.nonEmptyLines}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-sky/55">Characters</p>
              <p className="mt-1 text-lg font-semibold text-sky">{codeStats.characters}</p>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">Import From Analyzer</label>
                <p className="mt-1 text-xs text-cyan-100/70">
                  Pick any algorithm already available in Analyzer and load its {LANGUAGE_OPTIONS.find((item) => item.value === language)?.label || language} implementation into the editor.
                </p>
              </div>
              <button
                type="button"
                onClick={handleImportAnalyzerAlgorithm}
                disabled={!selectedAnalyzerAlgorithm}
                className="rounded-lg border border-cyan-300/30 bg-cyan-400/15 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200 disabled:opacity-40"
              >
                Import selected code
              </button>
            </div>

            <select
              value={selectedAnalyzerAlgorithm}
              onChange={(event) => setSelectedAnalyzerAlgorithm(event.target.value)}
              className="mt-3 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
            >
              <option value="">Choose an analyzer algorithm...</option>
              {Object.entries(analyzerAlgorithmsByCategory).map(([category, algorithms]) => (
                <optgroup key={category} label={normalizeCategoryLabel(category)}>
                  {algorithms.map((algorithm) => (
                    <option key={algorithm.name} value={algorithm.name}>{algorithm.display_name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-sky/75">
            <p className="font-semibold text-sky">Best results</p>
            <p className="mt-2">Include the full function body, keep helper functions in the same snippet, and prefer real loop bounds over placeholders.</p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Code</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="rounded-lg border border-white/20 px-2 py-1 text-[11px] text-sky/70 transition hover:border-amber-300/35 hover:text-amber-200"
                >
                  Load sample
                </button>
                <button
                  type="button"
                  onClick={handleClearEditor}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-2 py-1 text-[11px] text-sky/70 transition hover:border-rose-300/35 hover:text-rose-200"
                >
                  <Trash2 size={12} /> Clear
                </button>
              </div>
            </div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-sky/70">
                Source: {inputSource}
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-sky/70">
                Language: {getLanguageLabel(language)}
              </span>
            </div>
            <textarea
              rows={16}
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setInputSource("Manual edits");
              }}
              placeholder="Paste code here..."
              className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 font-mono text-sm text-sky placeholder-sky/30"
            />
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/35 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(245,158,11,0.2)] disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Code2 size={16} />}
            {loading ? "Analyzing..." : "Run Complexity Forensics"}
          </button>

          {errorMessage && (
            <p className="rounded-xl border border-rose-300/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {errorMessage}
            </p>
          )}
        </section>

        <section className="rounded-2xl panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-sky">Forensics Report</h2>
            <div className="flex items-center gap-2">
              {result?.model && (
              <span className="rounded-full border border-amber-300/35 bg-amber-400/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-amber-100">
                {result.model}
              </span>
              )}
              {result?.report && (
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-sky/75 transition hover:border-cyan-300/35 hover:text-cyan-100"
                >
                  {reportCopied ? <Check size={14} /> : <Copy size={14} />}
                  {reportCopied ? "Copied" : "Copy report"}
                </button>
              )}
            </div>
          </div>

          {!result && !loading && (
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-5 text-sm text-sky/50">
              Run analysis to see the complexity verdict, the dominant pattern, hotspot lines, and the full reasoning trace.
            </div>
          )}

          {loading && (
            <div className="mt-4 flex min-h-[250px] flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-5">
              <Loader2 size={28} className="animate-spin text-amber-200" />
              <p className="text-sm text-sky/60">Running offline complexity forensics...</p>
            </div>
          )}

          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-4 space-y-4"
            >
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-sky/80">
                {summaryLine}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">Best Time</p>
                  <p className="mt-1 text-lg font-semibold text-cyan-100">{result.time_complexity?.best || "Unknown"}</p>
                </div>
                <div className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">Average Time</p>
                  <p className="mt-1 text-lg font-semibold text-cyan-100">{result.time_complexity?.average || "Unknown"}</p>
                </div>
                <div className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">Worst Time</p>
                  <p className="mt-1 text-lg font-semibold text-cyan-100">{result.time_complexity?.worst || "Unknown"}</p>
                </div>
                <div className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">Auxiliary Space</p>
                  <p className="mt-1 text-lg font-semibold text-cyan-100">{result.space_complexity || "Unknown"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-sky/80">
                  Pattern: {result.dominant_pattern || "Unknown"}
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs ${confidenceTone(result.confidence)}`}>
                  Confidence: {result.confidence || "LOW"}
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-sky/80">
                  Hotspots: {Array.isArray(result.hotspots) ? result.hotspots.length : 0}
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-sky/80">
                  Training profile: {result.training_profile || "offline"}
                </span>
              </div>

              {Array.isArray(result.supported_languages) && result.supported_languages.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                  <h3 className="text-sm font-semibold text-sky">Supported languages</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.supported_languages.map((item) => (
                      <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-sky/75">
                        {getLanguageLabel(item)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <h3 className="text-sm font-semibold text-sky">How the model derived this</h3>
                <ul className="mt-2 space-y-2 text-sm text-sky/75">
                  {(result.explanation || []).map((line) => (
                    <li key={line}>- {line}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <h3 className="text-sm font-semibold text-sky">Reasoning trace</h3>
                <ul className="mt-2 space-y-2 text-sm text-sky/75">
                  {(result.reasoning_trace || []).map((line) => (
                    <li key={line}>- {line}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <h3 className="text-sm font-semibold text-sky">Hotspot lines</h3>
                {Array.isArray(result.hotspots) && result.hotspots.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {result.hotspots.map((item) => (
                      <div key={`${item.line_number}:${item.snippet}`} className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <p className="text-xs text-amber-100">Line {item.line_number}</p>
                        <p className="mt-1 font-mono text-xs text-sky/70">{item.snippet || "(no snippet)"}</p>
                        <p className="mt-1 text-xs text-sky/60">Signals: {(item.signals || []).join(", ") || "none"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-sky/60">No dominant hotspot lines identified.</p>
                )}
              </div>

              <details className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-sky">Full report (raw markdown)</summary>
                <pre className="mt-3 overflow-auto rounded-lg border border-white/10 bg-slate-950/60 p-3 text-xs text-sky/70">
                  {result.report || "No report generated."}
                </pre>
              </details>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ComplexityForensics;
