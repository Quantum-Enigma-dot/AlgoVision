import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import AlgorithmSelector from "../components/AlgorithmSelector.jsx";
import InputPanel from "../components/InputPanel.jsx";
import ComparisonChart from "../components/ComparisonChart.jsx";
import { compareAlgorithms } from "../services/api.js";
import { buildPayloadAndValidate } from "../utils/validators.js";
import {
  generateRandomDpInput,
  generateRandomGraphInput,
  generateRandomSortingInput,
  generateRandomStringInput
} from "../utils/randomGenerators.js";
import { graphPresets, sortingPresets, dpPresets, stringPresets } from "../data/presets.js";
import { formatCategoryOptions, getAlgorithmDisplayName } from "../data/algorithms.js";

const normalizeArrows = (value) => String(value || "").replace(/->/g, "→").replace(/<->/g, "↔");

const Compare = ({ algorithmsData = [] }) => {
  const [algorithms] = useState(algorithmsData);
  const [selectedCategory, setSelectedCategory] = useState("sorting");
  const [leftAlgorithm, setLeftAlgorithm] = useState("");
  const [rightAlgorithm, setRightAlgorithm] = useState("");
  const [inputData, setInputData] = useState({});
  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState("");
  const [inputError, setInputError] = useState("");

  const categories = useMemo(() => {
    const unique = new Set(algorithms.map((algo) => algo.category));
    const values = unique.size ? Array.from(unique) : ["sorting", "graph", "dp", "string"];
    return formatCategoryOptions(values);
  }, [algorithms]);

  const filteredAlgorithms = useMemo(() => {
    return algorithms.filter((algo) => algo.category === selectedCategory);
  }, [algorithms, selectedCategory]);

  useEffect(() => {
    if (filteredAlgorithms.length >= 2) {
      setLeftAlgorithm(filteredAlgorithms[0].name);
      setRightAlgorithm(filteredAlgorithms[1].name);
    }
  }, [filteredAlgorithms]);

  useEffect(() => {
    if (selectedCategory === "sorting") {
      setInputData({ arrayText: sortingPresets[1].array.join(","), arraySize: 10 });
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

  const resolveDpInputType = (algorithm) => {
    if (algorithm === "knapsack_01") return "knapsack";
    if (algorithm === "matrix_chain_multiplication") return "matrix_chain";
    return "lcs";
  };

  const leftDpType = resolveDpInputType(leftAlgorithm);
  const rightDpType = resolveDpInputType(rightAlgorithm);
  const sharedDpAlgorithm = leftDpType === rightDpType ? leftAlgorithm : "";

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
      setInputData((prev) => ({ ...prev, ...generateRandomDpInput(leftAlgorithm) }));
      return;
    }
    if (selectedCategory === "string") {
      setInputData((prev) => ({ ...prev, ...generateRandomStringInput() }));
    }
  };

  const handleCompare = async () => {
    setInputError("");
    if (!leftAlgorithm || !rightAlgorithm || leftAlgorithm === rightAlgorithm) {
      return;
    }
    if (
      selectedCategory === "dp" &&
      leftDpType !== rightDpType
    ) {
      setResults(null);
      setSummary("Select two DP algorithms that share the same input type.");
      return;
    }
    try {
      const payload = buildPayloadAndValidate(selectedCategory, sharedDpAlgorithm, inputData);
      const response = await compareAlgorithms({
        category: selectedCategory,
        algorithms: [leftAlgorithm, rightAlgorithm],
        input: payload
      });
      setResults(response.results);
      setSummary(normalizeArrows(response.summary).replace(leftAlgorithm, getAlgorithmDisplayName(leftAlgorithm)).replace(rightAlgorithm, getAlgorithmDisplayName(rightAlgorithm)));
    } catch (error) {
      setResults(null);
      const message = error?.response?.data?.detail || error?.message || "Invalid input.";
      setInputError(message);
      setSummary("Unable to compare. Check your inputs.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-2xl panel p-5">
            <AlgorithmSelector
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              algorithms={filteredAlgorithms}
              selectedAlgorithm={leftAlgorithm}
              setSelectedAlgorithm={setLeftAlgorithm}
            />
          </div>
          <div className="rounded-2xl panel p-5">
            <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Second Algorithm</label>
            <select
              className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
              value={rightAlgorithm}
              onChange={(event) => setRightAlgorithm(event.target.value)}
            >
              {filteredAlgorithms.map((algo) => (
                <option key={algo.name} value={algo.name}>
                  {algo.display_name}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl panel p-5">
            <InputPanel
              category={selectedCategory}
              algorithm={leftAlgorithm}
              inputData={inputData}
              setInputData={setInputData}
              onRandomInput={handleRandomInput}
            />
            {inputError && (
              <p className="mt-3 rounded-lg border border-red-300/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                {inputError}
              </p>
            )}
            <button
              onClick={handleCompare}
              className="mt-4 w-full rounded-xl border border-emerald-300/35 bg-emerald-400/20 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-300/25"
            >
              Compare
            </button>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl panel p-5">
            <h2 className="text-lg font-semibold text-sky">Performance Snapshot</h2>
            <div className="mt-4">
              {results ? <ComparisonChart results={results} /> : <p className="text-sm text-sky/50">Run a comparison to see charts.</p>}
            </div>
          </div>
          <div className="rounded-2xl panel p-5">
            <h2 className="text-lg font-semibold text-sky">Summary</h2>
            <p className="mt-3 text-sm text-sky/70">{summary || "Awaiting comparison data."}</p>
          </div>
          {results && (
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((result, index) => {
                const isWinner = result.metrics.execution_time_ms === Math.min(...results.map((r) => r.metrics.execution_time_ms ?? Infinity));
                return (
                <motion.div
                  key={result.algorithm}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: index * 0.05 }}
                  className={`rounded-2xl border p-5 ${isWinner ? "border-emerald-300/45 bg-emerald-400/10 shadow-glow" : "border-white/10 bg-white/5"}`}
                  style={{ minWidth: "160px" }}
                >
                  <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-5 text-sky" title={getAlgorithmDisplayName(result.algorithm)}>{getAlgorithmDisplayName(result.algorithm)}</h3>
                    {isWinner && <span className="rounded-full border border-emerald-300/40 bg-emerald-400/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-100">Winner</span>}
                  </div>
                  <p className="mt-3 text-sm text-sky/70">Time: {result.metrics.execution_time_ms} ms</p>
                  <p className="text-sm text-sky/70">Comparisons: {result.metrics.comparisons}</p>
                  <p className="text-sm text-sky/70">Swaps: {result.metrics.swaps}</p>
                </motion.div>
              );})}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Compare;
