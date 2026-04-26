import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Play, Loader2, Download } from "lucide-react";
import { runBenchmark } from "../services/api.js";
import { ALGORITHM_CATALOG, formatCategoryOptions, getAlgorithmDisplayName, normalizeCategoryLabel } from "../data/algorithms.js";
import ComplexityTable from "../components/ComplexityTable.jsx";

const DEFAULT_SIZES = [10, 50, 100, 250, 500, 1000];

const Benchmark = ({ algorithmsData = [] }) => {
  const algorithms = algorithmsData.length ? algorithmsData : ALGORITHM_CATALOG;

  const [selectedCategory, setSelectedCategory] = useState("sorting");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble_sort");
  const [secondAlgorithm, setSecondAlgorithm] = useState("");
  const [sizes, setSizes] = useState(DEFAULT_SIZES.join(", "));
  const [results, setResults] = useState(null);
  const [results2, setResults2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("area");

  const categories = useMemo(() => {
    const unique = new Set(algorithms.map((a) => a.category));
    return formatCategoryOptions(Array.from(unique));
  }, [algorithms]);

  const filteredAlgorithms = useMemo(
    () => algorithms.filter((a) => a.category === selectedCategory),
    [algorithms, selectedCategory]
  );

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const first = algorithms.find((a) => a.category === cat);
    if (first) setSelectedAlgorithm(first.name);
    setSecondAlgorithm("");
    setResults(null);
    setResults2(null);
  };

  const parsedSizes = useMemo(() => {
    return sizes
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0)
      .sort((a, b) => a - b);
  }, [sizes]);

  const handleRun = async () => {
    if (!parsedSizes.length) return;
    setLoading(true);
    setResults(null);
    setResults2(null);
    try {
      const data = await runBenchmark(selectedCategory, selectedAlgorithm, parsedSizes);
      setResults(data);

      if (secondAlgorithm && secondAlgorithm !== selectedAlgorithm) {
        const data2 = await runBenchmark(selectedCategory, secondAlgorithm, parsedSizes);
        setResults2(data2);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const chartData = useMemo(() => {
    if (!results) return [];
    return results.data_points.map((dp, idx) => ({
      size: dp.size,
      time_ms: dp.time_ms >= 0 ? dp.time_ms : 0,
      comparisons: dp.comparisons,
      swaps: dp.swaps,
      ...(results2?.data_points?.[idx] ? {
        time_ms_2: results2.data_points[idx].time_ms >= 0 ? results2.data_points[idx].time_ms : 0,
        comparisons_2: results2.data_points[idx].comparisons,
        swaps_2: results2.data_points[idx].swaps,
      } : {}),
    }));
  }, [results, results2]);

  const downloadResults = () => {
    if (!results) return;
    const data = { primary: results, secondary: results2 || null };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `benchmark-${selectedAlgorithm}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const algo1Name = getAlgorithmDisplayName(selectedAlgorithm);
  const algo2Name = secondAlgorithm ? getAlgorithmDisplayName(secondAlgorithm) : "";
  const algo1 = useMemo(
    () => algorithms.find((a) => a.name === selectedAlgorithm) || null,
    [algorithms, selectedAlgorithm]
  );
  const algo2 = useMemo(
    () => algorithms.find((a) => a.name === secondAlgorithm) || null,
    [algorithms, secondAlgorithm]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl panel p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 top-8 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-emerald-400/30 to-blue-500/30 p-3">
            <TrendingUp size={24} className="text-emerald-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sky">Scalability Benchmarker</h1>
            <p className="text-sm text-sky/60">Test how algorithms scale across input sizes</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Controls */}
        <aside className="space-y-4">
          <div className="rounded-2xl panel p-5 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Category</label>
              <select
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Primary Algorithm</label>
              <select
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
              >
                {filteredAlgorithms.map((a) => (
                  <option key={a.name} value={a.name}>{a.display_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Compare With (optional)</label>
              <select
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
                value={secondAlgorithm}
                onChange={(e) => setSecondAlgorithm(e.target.value)}
              >
                <option value="">None</option>
                {filteredAlgorithms.filter((a) => a.name !== selectedAlgorithm).map((a) => (
                  <option key={a.name} value={a.name}>{a.display_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Input Sizes</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="10, 50, 100, 250, 500, 1000"
              />
              <p className="mt-1 text-[11px] text-sky/40">{parsedSizes.length} sizes parsed</p>
            </div>
            <button
              onClick={handleRun}
              disabled={loading || !parsedSizes.length}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/35 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              {loading ? "Benchmarking..." : "Run Benchmark"}
            </button>
          </div>

          {(algo1?.complexity || algo2?.complexity) && (
            <div className="rounded-2xl panel p-5 space-y-3">
              <h3 className="text-sm font-semibold text-sky">Complexity Snapshot</h3>
              {algo1?.complexity && (
                <ComplexityTable
                  complexity={algo1.complexity}
                  nMeaning={algo1.nMeaning}
                  compact
                  title={algo1Name}
                />
              )}
              {algo2?.complexity && (
                <ComplexityTable
                  complexity={algo2.complexity}
                  nMeaning={algo2.nMeaning}
                  compact
                  title={algo2Name}
                />
              )}
            </div>
          )}

          {results && (
            <div className="rounded-2xl panel p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-sky">Options</h3>
                <button onClick={downloadResults} className="flex items-center gap-1 text-xs text-cyan-200 hover:text-cyan-100">
                  <Download size={12} /> Export
                </button>
              </div>
              <select
                className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-sky"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="area">Area Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          )}
        </aside>

        {/* Results */}
        <section className="space-y-6">
          {results ? (
            <>
              {/* Time Chart */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl panel p-5"
              >
                <h2 className="text-lg font-semibold text-sky">Execution Time (ms)</h2>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "area" ? (
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="size" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)", borderRadius: "12px", color: "#e6f1ff" }} />
                        <Legend />
                        <Area type="monotone" dataKey="time_ms" name={algo1Name} stroke="#10b981" fill="url(#grad1)" strokeWidth={2} />
                        {results2 && <Area type="monotone" dataKey="time_ms_2" name={algo2Name} stroke="#f59e0b" fill="url(#grad2)" strokeWidth={2} />}
                      </AreaChart>
                    ) : (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="size" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)", borderRadius: "12px", color: "#e6f1ff" }} />
                        <Legend />
                        <Line type="monotone" dataKey="time_ms" name={algo1Name} stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
                        {results2 && <Line type="monotone" dataKey="time_ms_2" name={algo2Name} stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} />}
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Comparisons Chart */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl panel p-5"
              >
                <h2 className="text-lg font-semibold text-sky">Comparisons</h2>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gradComp1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradComp2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a21caf" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#a21caf" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="size" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)", borderRadius: "12px", color: "#e6f1ff" }} />
                      <Legend />
                      <Area type="monotone" dataKey="comparisons" name={algo1Name} stroke="#2563eb" fill="url(#gradComp1)" strokeWidth={2} />
                      {results2 && <Area type="monotone" dataKey="comparisons_2" name={algo2Name} stroke="#a21caf" fill="url(#gradComp2)" strokeWidth={2} />}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Data Table */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl panel p-5"
              >
                <h2 className="text-lg font-semibold text-sky">Raw Data</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.15em] text-sky/50">
                        <th className="px-3 py-2">Size</th>
                        <th className="px-3 py-2">{algo1Name} Time</th>
                        <th className="px-3 py-2">{algo1Name} Comps</th>
                        {results2 && <th className="px-3 py-2">{algo2Name} Time</th>}
                        {results2 && <th className="px-3 py-2">{algo2Name} Comps</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((row, i) => (
                        <tr key={i} className="border-b border-white/5 text-sky/75 hover:bg-white/5">
                          <td className="px-3 py-2 font-semibold">{row.size}</td>
                          <td className="px-3 py-2">{row.time_ms.toFixed(3)} ms</td>
                          <td className="px-3 py-2">{row.comparisons.toLocaleString()}</td>
                          {results2 && <td className="px-3 py-2">{(row.time_ms_2 || 0).toFixed(3)} ms</td>}
                          {results2 && <td className="px-3 py-2">{(row.comparisons_2 || 0).toLocaleString()}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl panel p-16 text-sky/40">
              <TrendingUp size={48} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">Run a benchmark to see performance curves</p>
              <p className="mt-2 text-sm">Select an algorithm, set input sizes, and click Run</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Benchmark;
