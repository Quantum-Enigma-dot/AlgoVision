import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { getAlgorithmDisplayName, getCategoryBadgeClass, normalizeCategoryLabel } from "../data/algorithms.js";

const parseMetrics = (metrics) => {
  if (!metrics) return {};
  if (typeof metrics === "string") {
    try {
      return JSON.parse(metrics);
    } catch {
      return {};
    }
  }
  return metrics;
};

const formatTimestamp = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
  return `${datePart} at ${timePart}`;
};

const normalizeArrows = (value) => String(value || "").replace(/->/g, "→").replace(/<->/g, "↔");

const Report = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("algovision-history") || "[]");
    setHistory(stored);
  }, []);

  const downloadText = () => {
    const lines = history.map(
      (entry) => {
        const metrics = parseMetrics(entry.metrics);
        return normalizeArrows(`${formatTimestamp(entry.timestamp)} | ${normalizeCategoryLabel(entry.category)} | ${getAlgorithmDisplayName(entry.algorithm)} | ${JSON.stringify(metrics)}`);
      }
    );
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "algovision-report.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "algovision-report.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteEntry = (indexToDelete) => {
    setHistory((prev) => {
      const next = prev.filter((_, idx) => idx !== indexToDelete);
      localStorage.setItem("algovision-history", JSON.stringify(next));
      return next;
    });
  };

  const clearAll = () => {
    if (!window.confirm("Clear all run history? This cannot be undone.")) {
      return;
    }
    setHistory([]);
    localStorage.setItem("algovision-history", JSON.stringify([]));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl panel p-5">
        <h2 className="text-lg font-semibold text-sky">Run History</h2>
        <p className="mt-2 text-sm text-sky/60">Stored locally in your browser.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-xl border border-red-300/35 bg-red-400/15 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-300/20" onClick={clearAll}>
            Clear All History
          </button>
          <button className="rounded-xl border border-emerald-300/35 bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/25" onClick={downloadJson}>
            Export JSON
          </button>
          <button className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-sky/90 transition hover:border-white/35" onClick={downloadText}>
            Export Text
          </button>
        </div>
      </div>

      <div className="rounded-2xl panel p-5">
        {history.length === 0 ? (
          <p className="text-sm text-sky/60">No runs yet. Execute an algorithm to populate history.</p>
        ) : (
          <div className="space-y-3">
            {history.map((entry, index) => {
              const parsedMetrics = parseMetrics(entry.metrics);
              return (
                <motion.div
                key={`${entry.timestamp}-${index}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-sky">{getAlgorithmDisplayName(entry.algorithm)}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] ${getCategoryBadgeClass(entry.category)}`}>
                        {normalizeCategoryLabel(entry.category)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-sky/50">{formatTimestamp(entry.timestamp)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteEntry(index)}
                    className="rounded-md border border-red-300/30 bg-red-400/10 p-1.5 text-red-200 transition hover:bg-red-300/20"
                    title="Delete entry"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: "Comparisons", value: parsedMetrics.comparisons ?? 0 },
                    { label: "Swaps", value: parsedMetrics.swaps ?? 0 },
                    { label: "Recursion", value: parsedMetrics.recursion_depth ?? 0 },
                    { label: "Space", value: parsedMetrics.space_estimate ?? "-" },
                    { label: "Input Size", value: parsedMetrics.input_size ?? 0 },
                    { label: "Time", value: `${parsedMetrics.execution_time_ms ?? 0} ms` }
                  ].map((pill) => (
                    <div key={`${entry.timestamp}-${pill.label}`} className="rounded-lg border border-white/15 bg-slate-900/50 px-3 py-2 text-xs text-sky/75">
                      <span className="text-sky/45">{pill.label}:</span> {pill.value}
                    </div>
                  ))}
                </div>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
