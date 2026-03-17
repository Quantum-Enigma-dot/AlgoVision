import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import AlgorithmSelector from "../components/AlgorithmSelector.jsx";
import InputPanel from "../components/InputPanel.jsx";
import ControlPanel from "../components/ControlPanel.jsx";
import MetricsPanel from "../components/MetricsPanel.jsx";
import VisualizationCanvas from "../components/VisualizationCanvas.jsx";
import { runAlgorithm } from "../services/api.js";
import { buildPayloadAndValidate } from "../utils/validators.js";
import {
  attachStepDescriptions,
  formatCategoryOptions,
  getAlgorithmDisplayName,
  getLanguageLabel,
  getLanguages,
  LANGUAGE_TAB_WIDTHS,
  normalizeCategoryLabel
} from "../data/algorithms.js";
import {
  generateRandomDpInput,
  generateRandomGraphInput,
  generateRandomSortingInput,
  generateRandomStringInput
} from "../utils/randomGenerators.js";
import { graphPresets, sortingPresets, dpPresets, stringPresets } from "../data/presets.js";

const Analyzer = ({ algorithmsData = [] }) => {
  const DEFAULT_LEFT_PANE_WIDTH = 320;
  const DEFAULT_VISUAL_RATIO = 0.62;
  const DEFAULT_VIZ_ZOOM = 1;

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "sorting";
  const initialAlgorithm = searchParams.get("algorithm") || "bubble_sort";

  const [algorithms] = useState(algorithmsData);
  const [selectedCategory, setSelectedCategory] = useState("sorting");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble_sort");
  const [inputData, setInputData] = useState({});
  const [steps, setSteps] = useState([]);
  const [metrics, setMetrics] = useState({
    comparisons: 0,
    swaps: 0,
    execution_time_ms: 0,
    recursion_depth: 0,
    space_estimate: "O(1)",
    input_size: 0
  });
  const [complexity, setComplexity] = useState(null);
  const [status, setStatus] = useState("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [speed, setSpeed] = useState(600);
  const [codeLanguage, setCodeLanguage] = useState(() => localStorage.getItem("algovision-code-language") || "python");
  const [howItWorksOpen, setHowItWorksOpen] = useState(() => window.innerWidth >= 768);
  const [inputError, setInputError] = useState("");
  const [leftPaneWidth, setLeftPaneWidth] = useState(DEFAULT_LEFT_PANE_WIDTH);
  const [visualPaneRatio, setVisualPaneRatio] = useState(DEFAULT_VISUAL_RATIO);
  const [vizZoom, setVizZoom] = useState(DEFAULT_VIZ_ZOOM);
  const intervalRef = useRef(null);

  const logContainerRef = useRef(null);
  const logItemRefs = useRef([]);

  const categories = useMemo(() => {
    const unique = new Set(algorithms.map((algo) => algo.category));
    const values = unique.size ? Array.from(unique) : ["sorting", "graph", "dp", "string"];
    return formatCategoryOptions(values);
  }, [algorithms]);

  const filteredAlgorithms = useMemo(() => {
    return algorithms.filter((algo) => algo.category === selectedCategory);
  }, [algorithms, selectedCategory]);

  useEffect(() => {
    const existingCategory = categories.find((item) => item.value === initialCategory)?.value;
    setSelectedCategory(existingCategory || "sorting");
  }, [categories, initialCategory]);

  useEffect(() => {
    if (filteredAlgorithms.length) {
      const initialInCategory = filteredAlgorithms.find((algo) => algo.name === initialAlgorithm)?.name;
      setSelectedAlgorithm(initialInCategory || filteredAlgorithms[0].name);
    }
  }, [filteredAlgorithms, initialAlgorithm]);

  useEffect(() => {
    const active = algorithms.find((algo) => algo.name === selectedAlgorithm);
    if (active) {
      setComplexity(active.complexity);
    }
  }, [algorithms, selectedAlgorithm]);

  useEffect(() => {
    localStorage.setItem("algovision-code-language", codeLanguage);
  }, [codeLanguage]);

  useEffect(() => {
    setMetrics({
      comparisons: 0,
      swaps: 0,
      execution_time_ms: 0,
      recursion_depth: 0,
      space_estimate: "O(1)",
      input_size: 0
    });
    setSteps([]);
    setStepIndex(0);
    setStatus("idle");
    setVizZoom(DEFAULT_VIZ_ZOOM);
    setHowItWorksOpen(window.innerWidth >= 768);
  }, [selectedCategory, selectedAlgorithm]);

  useEffect(() => {
    if (selectedCategory === "sorting") {
      setInputData({ arrayText: sortingPresets[0].array.join(","), arraySize: 10 });
    }
    if (selectedCategory === "graph") {
      const preset = graphPresets[0];
      setInputData({
        nodesText: preset.nodes.join(","),
        edgesText: preset.edges.map((e) => `${e.from},${e.to},${e.weight}`).join("\n"),
        directed: preset.directed,
        weighted: true,
        startNode: preset.start,
        sinkNode: preset.sink
      });
    }
    if (selectedCategory === "dp") {
      setInputData({
        weightsText: dpPresets.knapsack.weights.join(","),
        valuesText: dpPresets.knapsack.values.join(","),
        capacity: dpPresets.knapsack.capacity,
        dimensionsText: dpPresets.matrixChain.dimensions.join(","),
        textA: dpPresets.lcs.textA,
        textB: dpPresets.lcs.textB
      });
    }
    if (selectedCategory === "string") {
      setInputData({ text: stringPresets.text, pattern: stringPresets.pattern });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (status !== "playing") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          clearInterval(intervalRef.current);
          setStatus("completed");
          return prev;
        }
        return next;
      });
    }, speed);
    return () => clearInterval(intervalRef.current);
  }, [status, steps.length, speed]);

  const handleRun = async () => {
    setStatus("running");
    setInputError("");
    try {
      const payload = buildPayloadAndValidate(selectedCategory, selectedAlgorithm, inputData);
      const response = await runAlgorithm({
        category: selectedCategory,
        algorithm: selectedAlgorithm,
        input: payload,
        options: { track_steps: true }
      });
      const describedSteps = attachStepDescriptions(selectedCategory, selectedAlgorithm, response.steps || []);
      setSteps(describedSteps);
      setMetrics(response.metrics || {
        comparisons: 0,
        swaps: 0,
        execution_time_ms: 0,
        recursion_depth: 0,
        space_estimate: "O(1)",
        input_size: 0
      });
      setComplexity(response.complexity || null);
      setStepIndex(0);
      setStatus("playing");
      const history = JSON.parse(localStorage.getItem("algovision-history") || "[]");
      history.unshift({
        timestamp: new Date().toISOString(),
        algorithm: selectedAlgorithm,
        category: selectedCategory,
        metrics: response.metrics
      });
      localStorage.setItem("algovision-history", JSON.stringify(history.slice(0, 10)));
    } catch (error) {
      const message = error?.response?.data?.detail || error?.message || "Invalid input.";
      setInputError(message);
      setStatus("error");
    }
  };

  const handlePause = () => setStatus("paused");
  const handleResume = () => setStatus("playing");
  const handleReset = () => {
    setStatus("idle");
    setStepIndex(0);
  };
  const handleStepForward = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const handleStepBackward = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const handleRandomInput = () => {
    if (selectedCategory === "sorting") {
      setInputData((prev) => ({ ...prev, ...generateRandomSortingInput(prev.arraySize || 10) }));
      return;
    }
    if (selectedCategory === "graph") {
      setInputData(generateRandomGraphInput());
      return;
    }
    if (selectedCategory === "dp") {
      setInputData((prev) => ({ ...prev, ...generateRandomDpInput(selectedAlgorithm) }));
      return;
    }
    if (selectedCategory === "string") {
      setInputData((prev) => ({ ...prev, ...generateRandomStringInput() }));
    }
  };

  const currentPayload = (() => {
    try {
      return buildPayloadAndValidate(selectedCategory, selectedAlgorithm, inputData);
    } catch {
      return {};
    }
  })();

  const activeAlgorithm = algorithms.find((algo) => algo.name === selectedAlgorithm);
  const activeCode = activeAlgorithm?.codeByLanguage?.[codeLanguage] || activeAlgorithm?.code || "";
  const languages = getLanguages();
  const displayZoomPercent = Math.round(vizZoom * 100);

  const startLeftPaneResize = (event) => {
    const startX = event.clientX;
    const startWidth = leftPaneWidth;

    const onMouseMove = (moveEvent) => {
      const next = Math.min(500, Math.max(280, startWidth + (moveEvent.clientX - startX)));
      setLeftPaneWidth(next);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const startMiddlePaneResize = (event) => {
    const container = event.currentTarget.parentElement;
    if (!container) return;
    const bounds = container.getBoundingClientRect();

    const onMouseMove = (moveEvent) => {
      const ratio = (moveEvent.clientX - bounds.left) / bounds.width;
      setVisualPaneRatio(Math.min(0.78, Math.max(0.38, ratio)));
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const resetLayout = () => {
    setLeftPaneWidth(DEFAULT_LEFT_PANE_WIDTH);
    setVisualPaneRatio(DEFAULT_VISUAL_RATIO);
    setVizZoom(DEFAULT_VIZ_ZOOM);
  };

  useEffect(() => {
    const active = logItemRefs.current[stepIndex];
    if (active) {
      active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [stepIndex]);

  const showZoomControls = selectedCategory !== "dp";

  return (
    <div className="flex gap-4">
      <aside className="space-y-6" style={{ width: leftPaneWidth }}>
        <div className="rounded-2xl panel p-5">
          <AlgorithmSelector
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            algorithms={filteredAlgorithms}
            selectedAlgorithm={selectedAlgorithm}
            setSelectedAlgorithm={setSelectedAlgorithm}
          />
          {activeAlgorithm && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <button
                type="button"
                onClick={() => setHowItWorksOpen((prev) => !prev)}
                className="flex w-full items-center justify-between text-left text-sm font-medium text-sky/90"
              >
                <span>How It Works</span>
                <span className="text-sky/60">{howItWorksOpen ? "▲" : "▼"}</span>
              </button>
              {howItWorksOpen && (
                <p className="mt-3 text-xs leading-6 text-sky/75">{activeAlgorithm.howItWorks}</p>
              )}
            </div>
          )}
        </div>
        <div className="rounded-2xl panel p-5">
          <InputPanel
            category={selectedCategory}
            algorithm={selectedAlgorithm}
            inputData={inputData}
            setInputData={setInputData}
            onRandomInput={handleRandomInput}
          />
          {inputError && (
            <p className="mt-3 rounded-lg border border-red-300/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              {inputError}
            </p>
          )}
        </div>
        <div className="rounded-2xl panel p-5">
          <MetricsPanel metrics={metrics} complexity={complexity} nMeaning={activeAlgorithm?.nMeaning} />
        </div>
      </aside>

      <div
        className="hidden w-2 cursor-col-resize rounded bg-white/5 transition hover:bg-emerald-300/30 lg:block"
        onMouseDown={startLeftPaneResize}
      />

      <section className="flex-1 space-y-6">
        <div className="rounded-2xl panel p-5">
          <h2 className="text-lg font-semibold text-sky">Execution Controls</h2>
          <div className="mt-4">
            <ControlPanel
              status={status}
              onRun={handleRun}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              speed={speed}
              setSpeed={setSpeed}
            />
          </div>
        </div>

        <div className="flex gap-4 overflow-x-hidden">
          <div className="rounded-2xl panel p-5 overflow-x-hidden" style={{ width: `${visualPaneRatio * 100}%` }}>
            <div className="space-y-3 overflow-x-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 overflow-x-hidden">
                <h2 className="text-lg font-semibold text-sky">Visualization</h2>
                <div className="flex w-full flex-wrap gap-2 text-xs sm:w-auto">
                  {showZoomControls && (
                    <>
                      <button
                        onClick={() => setVizZoom((prev) => Math.max(0.8, Number((prev - 0.1).toFixed(1))))}
                        className="rounded border border-white/20 px-3 py-1.5 transition hover:border-white/35"
                      >
                        Zoom -
                      </button>
                      <span className="rounded border border-white/15 bg-white/5 px-3 py-1.5 text-center text-sky/70">
                        {displayZoomPercent}%
                      </span>
                      <button
                        onClick={() => setVizZoom((prev) => Math.min(1.8, Number((prev + 0.1).toFixed(1))))}
                        className="rounded border border-white/20 px-3 py-1.5 transition hover:border-white/35"
                      >
                        Zoom +
                      </button>
                    </>
                  )}
                  <button
                    onClick={resetLayout}
                    className="rounded border border-emerald-300/40 bg-emerald-400/10 px-3 py-1.5 text-emerald-100 transition hover:bg-emerald-300/15"
                  >
                    Reset Layout
                  </button>
                </div>
              </div>

              <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-sky/60">
                <span className="rounded-full bg-white/5 px-3 py-1">Top actions: zoom and layout</span>
                <span className="rounded-full bg-white/5 px-3 py-1">Algorithm-specific controls below</span>
              </div>
            </div>
            <div className="mt-4 overflow-x-hidden">
              <VisualizationCanvas
                category={selectedCategory}
                algorithm={selectedAlgorithm}
                steps={steps}
                stepIndex={stepIndex}
                input={currentPayload}
                zoom={vizZoom}
                status={status}
              />
            </div>

            {steps.length > 0 && (
              <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <h3 className="font-semibold text-sky">Execution Log</h3>
                  <span className="text-sky/60">Step {stepIndex + 1} / {steps.length}</span>
                </div>
                <ul ref={logContainerRef} className="max-h-[220px] space-y-2 overflow-y-auto pr-2 text-xs text-sky/75">
                  {steps.map((item, idx) => (
                    <li
                      key={`log-${idx}`}
                      ref={(node) => {
                        logItemRefs.current[idx] = node;
                      }}
                      className={`rounded-md border-l-2 px-3 py-2 ${
                        idx === stepIndex
                          ? "border-teal-300 bg-teal-400/10 font-semibold text-teal-100"
                          : "border-transparent bg-white/5"
                      }`}
                    >
                      • {item.description || `Step ${idx + 1}: Updated state.`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div
            className="hidden w-2 cursor-col-resize rounded bg-white/5 transition hover:bg-emerald-300/30 lg:block"
            onMouseDown={startMiddlePaneResize}
          />

          <div className="rounded-2xl panel p-5" style={{ width: `${(1 - visualPaneRatio) * 100}%` }}>
            <h2 className="text-lg font-semibold text-sky">Algorithm Code</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {languages.map((language) => {
                const active = codeLanguage === language;
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => setCodeLanguage(language)}
                    className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                      active
                        ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                        : "border-white/15 bg-white/5 text-sky/70 hover:border-white/30"
                    }`}
                    style={{ minWidth: LANGUAGE_TAB_WIDTHS[language] }}
                  >
                    {getLanguageLabel(language)}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 h-80 min-h-80 overflow-y-auto overflow-x-auto rounded-xl border border-white/10 bg-[#1E1E1E]">
              <SyntaxHighlighter
                language={codeLanguage === "cpp" ? "cpp" : codeLanguage}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  minHeight: "20rem",
                  overflowX: "auto",
                  whiteSpace: "pre",
                  wordBreak: "keep-all",
                  fontSize: "12px",
                  background: "transparent"
                }}
                wrapLongLines={false}
                showLineNumbers
              >
                {activeCode}
              </SyntaxHighlighter>
            </div>
            {activeAlgorithm && (
              <p className="mt-3 text-xs text-sky/50">
                {activeAlgorithm.description} Category: {normalizeCategoryLabel(activeAlgorithm.category)}.
              </p>
            )}
            {activeAlgorithm && (
              <Link
                to={`/theory?algorithm=${activeAlgorithm.name}`}
                className="mt-2 inline-flex text-xs text-cyan-200 transition hover:text-cyan-100"
              >
                Open deep theory for {getAlgorithmDisplayName(activeAlgorithm.name)}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analyzer;
