import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Code2, Send, Loader2 } from "lucide-react";
import { aiExplain, aiSuggest, aiAnalyze } from "../services/api.js";
import { ALGORITHM_CATALOG, getAlgorithmDisplayName, normalizeCategoryLabel } from "../data/algorithms.js";

const TABS = [
  { id: "explain", label: "Explain", icon: Bot, description: "Get AI-powered explanations of any algorithm" },
  { id: "suggest", label: "Suggest", icon: Sparkles, description: "Describe a problem and get algorithm recommendations" },
  { id: "analyze", label: "Analyze", icon: Code2, description: "Paste code to analyze its time/space complexity" },
];

const MarkdownBlock = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-2 text-sm leading-7 text-sky/85">
      {lines.map((line, i) => {
        if (line.startsWith("### ")) return <h3 key={i} className="mt-4 text-base font-bold text-sky">{line.slice(4)}</h3>;
        if (line.startsWith("## ")) return <h2 key={i} className="mt-5 text-lg font-bold text-sky">{line.slice(3)}</h2>;
        if (line.startsWith("# ")) return <h1 key={i} className="mt-6 text-xl font-bold text-sky">{line.slice(2)}</h1>;
        if (line.startsWith("```")) return <div key={i} className="my-1 border-l-2 border-cyan-400/40" />;
        if (line.startsWith("- ") || line.startsWith("* ")) return <p key={i} className="pl-4">• {line.slice(2)}</p>;
        if (line.match(/^\d+\. /)) return <p key={i} className="pl-4">{line}</p>;
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-sky">{line.replace(/\*\*/g, "")}</p>;
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return <p key={i}>{line.replace(/\*\*(.*?)\*\*/g, "$1")}</p>;
      })}
    </div>
  );
};

const AIAdvisor = () => {
  const [activeTab, setActiveTab] = useState("explain");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble_sort");
  const [explainContext, setExplainContext] = useState("");
  const [problemText, setProblemText] = useState("");
  const [codeText, setCodeText] = useState(`def mystery(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr`);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("");

  const algorithmsByCategory = useMemo(() => {
    const groups = {};
    ALGORITHM_CATALOG.forEach((algo) => {
      if (!groups[algo.category]) groups[algo.category] = [];
      groups[algo.category].push(algo);
    });
    return groups;
  }, []);

  const handleExplain = async () => {
    setLoading(true);
    setResponse("");
    try {
      const data = await aiExplain(getAlgorithmDisplayName(selectedAlgorithm), explainContext);
      setResponse(data.response);
      setModel(data.model || "");
    } catch (err) {
      setResponse("Error: " + (err?.response?.data?.detail || err.message));
    }
    setLoading(false);
  };

  const handleSuggest = async () => {
    if (!problemText.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const data = await aiSuggest(problemText);
      setResponse(data.response);
      setModel(data.model || "");
    } catch (err) {
      setResponse("Error: " + (err?.response?.data?.detail || err.message));
    }
    setLoading(false);
  };

  const handleAnalyze = async () => {
    if (!codeText.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const data = await aiAnalyze(codeText);
      setResponse(data.response);
      setModel(data.model || "");
    } catch (err) {
      setResponse("Error: " + (err?.response?.data?.detail || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl panel p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-8 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-400/30 p-3">
              <Bot size={24} className="text-violet-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sky">AI Algorithm Advisor</h1>
              <p className="text-sm text-sky/60">Powered by Groq LLM — Get instant algorithm insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResponse(""); }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "border border-violet-300/40 bg-violet-400/20 text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                  : "border border-white/10 bg-white/5 text-sky/60 hover:border-white/20 hover:text-sky/80"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Input Panel */}
        <div className="rounded-2xl panel p-5 space-y-4">
          <h2 className="text-lg font-semibold text-sky">
            {TABS.find((t) => t.id === activeTab)?.description}
          </h2>

          {activeTab === "explain" && (
            <>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Algorithm</label>
                <select
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
                  value={selectedAlgorithm}
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                >
                  {Object.entries(algorithmsByCategory).map(([category, algos]) => (
                    <optgroup key={category} label={normalizeCategoryLabel(category)}>
                      {algos.map((algo) => (
                        <option key={algo.name} value={algo.name}>{algo.display_name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Additional Context (optional)</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky placeholder-sky/30"
                  rows={3}
                  placeholder="e.g., Explain for a beginner, focus on the recursion tree..."
                  value={explainContext}
                  onChange={(e) => setExplainContext(e.target.value)}
                />
              </div>
              <button
                onClick={handleExplain}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-300/35 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(139,92,246,0.2)] disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? "Thinking..." : "Explain Algorithm"}
              </button>
            </>
          )}

          {activeTab === "suggest" && (
            <>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Problem Description</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky placeholder-sky/30"
                  rows={6}
                  placeholder="Describe your problem... e.g., I need to find the shortest path between cities in a weighted road network..."
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                />
              </div>
              <button
                onClick={handleSuggest}
                disabled={loading || !problemText.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/35 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(16,185,129,0.2)] disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {loading ? "Thinking..." : "Get Suggestions"}
              </button>
            </>
          )}

          {activeTab === "analyze" && (
            <>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Paste Your Code</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 font-mono text-sm text-sky placeholder-sky/30"
                  rows={10}
                  placeholder="def my_algorithm(arr):&#10;    ..."
                  value={codeText}
                  onChange={(e) => setCodeText(e.target.value)}
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading || !codeText.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/35 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(245,158,11,0.2)] disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Code2 size={16} />}
                {loading ? "Analyzing..." : "Analyze Complexity"}
              </button>
            </>
          )}
        </div>

        {/* Response Panel */}
        <div className="rounded-2xl panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-sky">AI Response</h2>
            {model && (
              <span className="rounded-full border border-violet-300/30 bg-violet-400/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-violet-200">
                {model}
              </span>
            )}
          </div>
          <div className="mt-4 min-h-[300px] rounded-xl border border-white/10 bg-slate-950/40 p-4 overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin" />
                  <Bot size={20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-300" />
                </div>
                <p className="text-sm text-sky/50">AI is thinking...</p>
              </div>
            ) : response ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MarkdownBlock text={response} />
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-sky/40">
                <Bot size={32} />
                <p className="text-sm">Response will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
