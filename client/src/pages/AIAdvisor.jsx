import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  Send,
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Wand2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import VisualizationCanvas from "../components/VisualizationCanvas.jsx";
import { aiExplain, aiSuggest, aiGenerateCode, algoVisualize } from "../services/api.js";
import {
  ALGORITHM_CATALOG,
  getAlgorithmDisplayName,
  getLanguageLabel,
  normalizeCategoryLabel,
} from "../data/algorithms.js";

const TABS = [
  { id: "explain", label: "Explain", icon: Bot, description: "Get AI-powered explanations for any algorithm in the catalog." },
  { id: "suggest", label: "Suggest", icon: Sparkles, description: "Describe a problem and get algorithm recommendations with trade-offs." },
  { id: "visualize", label: "Visualize Code", icon: Eye, description: "Paste existing code and turn it into a step-by-step visualization." },
  { id: "generate", label: "Prompt to Code", icon: Wand2, description: "Describe the algorithm you want, generate code, and visualize it immediately." },
];

const CODE_LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "javascript", label: "JavaScript" },
  { value: "go", label: "Go" },
];

const PROMPT_STARTERS = [
  "Create Dijkstra's algorithm for a weighted graph with a clear priority queue flow.",
  "Write merge sort for an integer array and keep the merge steps easy to visualize.",
  "Build KMP string matching and show the LPS preprocessing logic clearly.",
  "Generate 0/1 knapsack using dynamic programming with an explainable table update path.",
];

const getValidTab = (tabId) => (TABS.some((tab) => tab.id === tabId) ? tabId : "explain");

const normalizeVisualizerName = (name) => String(name || "")
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "_")
  .replace(/^_+|_+$/g, "");

const MarkdownBlock = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-2 text-sm leading-7 text-sky/85">
      {lines.map((line, index) => {
        if (line.startsWith("### ")) return <h3 key={index} className="mt-4 text-base font-bold text-sky">{line.slice(4)}</h3>;
        if (line.startsWith("## ")) return <h2 key={index} className="mt-5 text-lg font-bold text-sky">{line.slice(3)}</h2>;
        if (line.startsWith("# ")) return <h1 key={index} className="mt-6 text-xl font-bold text-sky">{line.slice(2)}</h1>;
        if (line.startsWith("```")) return <div key={index} className="my-1 border-l-2 border-cyan-400/40" />;
        if (line.startsWith("- ") || line.startsWith("* ")) return <p key={index} className="pl-4">• {line.slice(2)}</p>;
        if (line.match(/^\d+\. /)) return <p key={index} className="pl-4">{line}</p>;
        if (line.startsWith("**") && line.endsWith("**")) return <p key={index} className="font-semibold text-sky">{line.replace(/\*\*/g, "")}</p>;
        if (line.trim() === "") return <div key={index} className="h-2" />;
        return <p key={index}>{line.replace(/\*\*(.*?)\*\*/g, "$1")}</p>;
      })}
    </div>
  );
};

const PlaybackControls = ({ stepIndex, totalSteps, onPrev, onReset, onNext }) => (
  <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-sky">Playback Controls</p>
        <p className="text-xs text-sky/55">Move through the generated execution states.</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={stepIndex === 0}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-sky/80 transition hover:border-cyan-300/35 hover:text-cyan-100 disabled:opacity-40"
        >
          <span className="inline-flex items-center gap-1"><ChevronLeft size={14} /> Prev</span>
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={stepIndex === 0}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-sky/80 transition hover:border-cyan-300/35 hover:text-cyan-100 disabled:opacity-40"
        >
          <span className="inline-flex items-center gap-1"><RotateCcw size={14} /> Reset</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={stepIndex >= totalSteps - 1}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-sky/80 transition hover:border-cyan-300/35 hover:text-cyan-100 disabled:opacity-40"
        >
          <span className="inline-flex items-center gap-1">Next <ChevronRight size={14} /></span>
        </button>
      </div>
    </div>
  </div>
);

const VisualizationSummary = ({ result }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">Detected Algorithm</p>
      <p className="mt-1 text-sm font-semibold text-cyan-100">{result.algorithm_name || "Unknown"}</p>
    </div>
    <div className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">Type</p>
      <p className="mt-1 text-sm font-semibold capitalize text-cyan-100">{result.algorithm_type || "Unknown"}</p>
    </div>
    <div className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">Worst Time</p>
      <p className="mt-1 text-sm font-semibold text-cyan-100">{result.complexity?.worst_time || "Unknown"}</p>
    </div>
    <div className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">Space</p>
      <p className="mt-1 text-sm font-semibold text-cyan-100">{result.complexity?.space || "Unknown"}</p>
    </div>
  </div>
);

const AIAdvisor = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => getValidTab(searchParams.get("tab")));
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble_sort");
  const [explainContext, setExplainContext] = useState("");
  const [problemText, setProblemText] = useState("");
  const [visualizeLanguage, setVisualizeLanguage] = useState("python");
  const [visualizeCode, setVisualizeCode] = useState(`def mystery(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr`);
  const [generationLanguage, setGenerationLanguage] = useState("python");
  const [promptText, setPromptText] = useState("Create merge sort for an integer array and make the merge steps easy to visualize.");
  const [advisorResponse, setAdvisorResponse] = useState("");
  const [advisorError, setAdvisorError] = useState("");
  const [advisorModel, setAdvisorModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [visualizationResult, setVisualizationResult] = useState(null);
  const [visualizationError, setVisualizationError] = useState("");
  const [visualizationStepIndex, setVisualizationStepIndex] = useState(0);
  const [generationResult, setGenerationResult] = useState(null);
  const [generationError, setGenerationError] = useState("");
  const [generatedVisualizationResult, setGeneratedVisualizationResult] = useState(null);
  const [generatedVisualizationError, setGeneratedVisualizationError] = useState("");
  const [generatedVisualizationStepIndex, setGeneratedVisualizationStepIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const nextTab = getValidTab(searchParams.get("tab"));
    setActiveTab((currentTab) => (currentTab === nextTab ? currentTab : nextTab));
  }, [searchParams]);

  useEffect(() => {
    if (!copiedCode) return undefined;
    const timeoutId = window.setTimeout(() => setCopiedCode(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copiedCode]);

  const algorithmsByCategory = useMemo(() => {
    const groups = {};
    ALGORITHM_CATALOG.forEach((algorithm) => {
      if (!groups[algorithm.category]) {
        groups[algorithm.category] = [];
      }
      groups[algorithm.category].push(algorithm);
    });
    return groups;
  }, []);

  const currentTab = TABS.find((tab) => tab.id === activeTab);
  const visualizationCategory = visualizationResult?.visualization_type === "generic"
    ? visualizationResult?.algorithm_type
    : visualizationResult?.visualization_type;
  const visualizationAlgorithm = normalizeVisualizerName(visualizationResult?.algorithm_name);
  const generatedVisualizationCategory = generatedVisualizationResult?.visualization_type === "generic"
    ? generatedVisualizationResult?.algorithm_type
    : generatedVisualizationResult?.visualization_type;
  const generatedVisualizationAlgorithm = normalizeVisualizerName(generatedVisualizationResult?.algorithm_name);

  const switchTab = (nextTab) => {
    const nextParams = nextTab === "explain" ? {} : { tab: nextTab };
    setActiveTab(nextTab);
    setAdvisorError("");
    setGenerationError("");
    setVisualizationError("");
    setGeneratedVisualizationError("");
    setSearchParams(nextParams, { replace: true });
  };

  const handleExplain = async () => {
    setLoading(true);
    setAdvisorResponse("");
    setAdvisorError("");
    setAdvisorModel("");
    try {
      const data = await aiExplain(getAlgorithmDisplayName(selectedAlgorithm), explainContext);
      setAdvisorResponse(data.response || "");
      setAdvisorModel(data.model || "");
    } catch (error) {
      setAdvisorError(error?.response?.data?.detail || error.message || "Explanation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggest = async () => {
    if (!problemText.trim()) return;
    setLoading(true);
    setAdvisorResponse("");
    setAdvisorError("");
    setAdvisorModel("");
    try {
      const data = await aiSuggest(problemText);
      setAdvisorResponse(data.response || "");
      setAdvisorModel(data.model || "");
    } catch (error) {
      setAdvisorError(error?.response?.data?.detail || error.message || "Suggestion failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVisualize = async () => {
    if (!visualizeCode.trim()) return;
    setLoading(true);
    setVisualizationError("");
    setVisualizationResult(null);
    setVisualizationStepIndex(0);
    try {
      const data = await algoVisualize(visualizeCode, visualizeLanguage);
      setVisualizationResult(data);
    } catch (error) {
      setVisualizationError(error?.response?.data?.detail || error.message || "Visualization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAndVisualize = async () => {
    if (!promptText.trim()) return;
    setLoading(true);
    setGenerationError("");
    setGenerationResult(null);
    setGeneratedVisualizationResult(null);
    setGeneratedVisualizationError("");
    setGeneratedVisualizationStepIndex(0);

    try {
      const generated = await aiGenerateCode(promptText, generationLanguage);
      setGenerationResult(generated);

      try {
        const visualization = await algoVisualize(generated.code, generationLanguage);
        setGeneratedVisualizationResult(visualization);
      } catch (visualizationIssue) {
        setGeneratedVisualizationError(
          visualizationIssue?.response?.data?.detail || visualizationIssue.message || "Code generation succeeded, but visualization failed."
        );
      }
    } catch (error) {
      setGenerationError(error?.response?.data?.detail || error.message || "Code generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const copyGeneratedCode = async () => {
    if (!generationResult?.code || !navigator?.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(generationResult.code);
      setCopiedCode(true);
    } catch {
      setCopiedCode(false);
    }
  };

  const activeModel = activeTab === "visualize"
    ? visualizationResult?.model || ""
    : activeTab === "generate"
    ? generationResult?.model || ""
    : advisorModel;

  const panelTitle = activeTab === "visualize"
    ? "Visualization Result"
    : activeTab === "generate"
    ? "Generated Code & Visualization"
    : "AI Response";

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl panel p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-8 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-400/30 p-3">
              <Bot size={24} className="text-violet-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sky">AI Advisor</h1>
              <p className="text-sm text-sky/60">Explanations, recommendations, pasted-code visualization, and prompt-to-code generation.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-300/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            <p className="font-semibold">Complexity analysis moved to Complexity Forensics.</p>
            <Link
              to="/complexity-forensics"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-50 transition hover:text-white"
            >
              Open Complexity Forensics <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
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

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl panel p-5 space-y-4">
          <h2 className="text-lg font-semibold text-sky">{currentTab?.description}</h2>

          {activeTab === "explain" && (
            <>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Algorithm</label>
                <select
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
                  value={selectedAlgorithm}
                  onChange={(event) => setSelectedAlgorithm(event.target.value)}
                >
                  {Object.entries(algorithmsByCategory).map(([category, algorithms]) => (
                    <optgroup key={category} label={normalizeCategoryLabel(category)}>
                      {algorithms.map((algorithm) => (
                        <option key={algorithm.name} value={algorithm.name}>{algorithm.display_name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Additional Context</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky placeholder-sky/30"
                  rows={4}
                  placeholder="Focus on intuition, recursion tree, trade-offs, interview explanation, or real-world examples..."
                  value={explainContext}
                  onChange={(event) => setExplainContext(event.target.value)}
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
                  rows={8}
                  placeholder="Describe the problem, input constraints, and what matters most: speed, memory, exactness, or simplicity."
                  value={problemText}
                  onChange={(event) => setProblemText(event.target.value)}
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

          {activeTab === "visualize" && (
            <>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Code Language</label>
                <select
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
                  value={visualizeLanguage}
                  onChange={(event) => setVisualizeLanguage(event.target.value)}
                >
                  {CODE_LANGUAGES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <p className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
                Paste code from any supported language to detect the algorithm family and render its state transitions step by step.
              </p>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Paste Code to Visualize</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 font-mono text-sm text-sky placeholder-sky/30"
                  rows={12}
                  placeholder="def my_algorithm(arr):&#10;    ..."
                  value={visualizeCode}
                  onChange={(event) => setVisualizeCode(event.target.value)}
                />
              </div>

              <button
                onClick={handleVisualize}
                disabled={loading || !visualizeCode.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/35 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)] disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                {loading ? "Building visualization..." : "Visualize Pasted Code"}
              </button>

              {visualizationResult?.steps?.length > 0 && (
                <PlaybackControls
                  stepIndex={visualizationStepIndex}
                  totalSteps={visualizationResult.steps.length}
                  onPrev={() => setVisualizationStepIndex((current) => Math.max(current - 1, 0))}
                  onReset={() => setVisualizationStepIndex(0)}
                  onNext={() => setVisualizationStepIndex((current) => Math.min(current + 1, visualizationResult.steps.length - 1))}
                />
              )}
            </>
          )}

          {activeTab === "generate" && (
            <>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Target Language</label>
                <select
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
                  value={generationLanguage}
                  onChange={(event) => setGenerationLanguage(event.target.value)}
                >
                  {CODE_LANGUAGES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <p className="rounded-xl border border-violet-300/25 bg-violet-400/10 px-3 py-2 text-xs text-violet-100">
                Describe the algorithm, constraints, or teaching goal. The advisor will generate code first, then push that code through the visualizer automatically.
              </p>

              <div className="flex flex-wrap gap-2">
                {PROMPT_STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => setPromptText(starter)}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-sky/70 transition hover:border-violet-300/35 hover:text-violet-100"
                  >
                    {starter}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Prompt</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky placeholder-sky/30"
                  rows={9}
                  placeholder="Example: Build BFS for an adjacency list, keep the queue explicit, and make the traversal steps easy to visualize for a beginner."
                  value={promptText}
                  onChange={(event) => setPromptText(event.target.value)}
                />
              </div>

              <button
                onClick={handleGenerateAndVisualize}
                disabled={loading || !promptText.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-300/35 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(139,92,246,0.2)] disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                {loading ? "Generating and visualizing..." : "Generate Code and Visualize"}
              </button>

              {generatedVisualizationResult?.steps?.length > 0 && (
                <PlaybackControls
                  stepIndex={generatedVisualizationStepIndex}
                  totalSteps={generatedVisualizationResult.steps.length}
                  onPrev={() => setGeneratedVisualizationStepIndex((current) => Math.max(current - 1, 0))}
                  onReset={() => setGeneratedVisualizationStepIndex(0)}
                  onNext={() => setGeneratedVisualizationStepIndex((current) => Math.min(current + 1, generatedVisualizationResult.steps.length - 1))}
                />
              )}
            </>
          )}
        </div>

        <div className="rounded-2xl panel p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-sky">{panelTitle}</h2>
            {activeModel && (
              <span className="rounded-full border border-violet-300/30 bg-violet-400/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-violet-200">
                {activeModel}
              </span>
            )}
          </div>

          <div className="mt-4 max-h-[760px] min-h-[320px] overflow-y-auto rounded-xl border border-white/10 bg-slate-950/40 p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="relative">
                  <div className="h-12 w-12 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />
                  <Bot size={20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-300" />
                </div>
                <p className="text-sm text-sky/50">
                  {activeTab === "generate"
                    ? "Generating code and building the visualization..."
                    : activeTab === "visualize"
                    ? "Building visualization..."
                    : "AI is thinking..."}
                </p>
              </div>
            ) : activeTab === "visualize" ? (
              visualizationError ? (
                <div className="rounded-xl border border-rose-300/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {visualizationError}
                </div>
              ) : visualizationResult ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <VisualizationSummary result={visualizationResult} />

                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-sky/80">
                    {visualizationResult.description || "Visualization generated from the pasted code."}
                  </div>

                  {visualizationCategory === "generic" ? (
                    <div className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-6 text-sm text-sky/65">
                      The pasted code was classified as a generic algorithm, so there is no structured canvas to render. You can still use the detected summary above.
                    </div>
                  ) : (
                    <VisualizationCanvas
                      category={visualizationCategory}
                      algorithm={visualizationAlgorithm}
                      steps={visualizationResult.steps || []}
                      stepIndex={visualizationStepIndex}
                      input={visualizationResult.input_data || {}}
                      status="completed"
                      minimalView
                      emptyStateMessage="Paste code and generate a visualization to inspect the detected execution states."
                    />
                  )}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-sky/40">
                  <Eye size={32} />
                  <p className="text-sm">Visualization output will appear here</p>
                </div>
              )
            ) : activeTab === "generate" ? (
              generationError ? (
                <div className="rounded-xl border border-rose-300/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {generationError}
                </div>
              ) : generationResult ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-violet-300/25 bg-violet-400/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-violet-100/80">Requested Language</p>
                      <p className="mt-1 text-sm font-semibold text-violet-100">{getLanguageLabel(generationLanguage)}</p>
                    </div>
                    <div className="rounded-xl border border-violet-300/25 bg-violet-400/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-violet-100/80">Detected Algorithm</p>
                      <p className="mt-1 text-sm font-semibold text-violet-100">{generationResult.detected_algorithm || generatedVisualizationResult?.algorithm_name || "Custom Algorithm"}</p>
                    </div>
                    <div className="rounded-xl border border-violet-300/25 bg-violet-400/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-violet-100/80">Generated Lines</p>
                      <p className="mt-1 text-sm font-semibold text-violet-100">{generationResult.code.split("\n").length}</p>
                    </div>
                    <div className="rounded-xl border border-violet-300/25 bg-violet-400/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-violet-100/80">Visualizer Engine</p>
                      <p className="mt-1 text-sm font-semibold text-violet-100">{generatedVisualizationResult?.model || "Pending"}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-sky/80">
                    {generationResult.explanation || "Generated from your prompt."}
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-sky">Generated Code</h3>
                      <button
                        type="button"
                        onClick={copyGeneratedCode}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-sky/75 transition hover:border-violet-300/35 hover:text-violet-100"
                      >
                        {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                        {copiedCode ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <pre className="mt-3 overflow-auto rounded-lg border border-white/10 bg-slate-950/70 p-3 text-xs text-sky/80">
                      {generationResult.code}
                    </pre>
                  </div>

                  {generatedVisualizationError && (
                    <div className="rounded-xl border border-amber-300/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                      {generatedVisualizationError}
                    </div>
                  )}

                  {generatedVisualizationResult && (
                    <>
                      <VisualizationSummary result={generatedVisualizationResult} />
                      {generatedVisualizationCategory === "generic" ? (
                        <div className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-6 text-sm text-sky/65">
                          The generated code was treated as a generic algorithm, so the visualizer does not have a specialized canvas for it yet.
                        </div>
                      ) : (
                        <VisualizationCanvas
                          category={generatedVisualizationCategory}
                          algorithm={generatedVisualizationAlgorithm}
                          steps={generatedVisualizationResult.steps || []}
                          stepIndex={generatedVisualizationStepIndex}
                          input={generatedVisualizationResult.input_data || {}}
                          status="completed"
                          minimalView
                          emptyStateMessage="Generate code from a prompt to inspect the resulting execution states."
                        />
                      )}
                    </>
                  )}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-sky/40">
                  <Wand2 size={32} />
                  <p className="text-sm">Prompt-driven code generation will appear here</p>
                </div>
              )
            ) : advisorError ? (
              <div className="rounded-xl border border-rose-300/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {advisorError}
              </div>
            ) : advisorResponse ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <MarkdownBlock text={advisorResponse} />
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
