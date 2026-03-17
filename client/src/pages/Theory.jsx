import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import TheoryCard from "../components/TheoryCard.jsx";
import { getAlgorithmDisplayName } from "../data/algorithms.js";

const Theory = ({ algorithmsData = [] }) => {
  const [searchParams] = useSearchParams();
  const initial = searchParams.get("algorithm") || algorithmsData[0]?.name || "bubble_sort";
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(initial);
  const algorithms = algorithmsData;

  const activeAlgorithm = useMemo(
    () => algorithms.find((algo) => algo.name === selectedAlgorithm) || algorithms[0] || null,
    [algorithms, selectedAlgorithm]
  );

  const theory = activeAlgorithm
    ? {
        name: getAlgorithmDisplayName(activeAlgorithm.name),
        category: activeAlgorithm.category,
        description: activeAlgorithm.description,
        complexity: activeAlgorithm.complexity,
        use_cases: activeAlgorithm.use_cases || [],
        limitations: activeAlgorithm.limitations || [],
        optimization_tips: activeAlgorithm.optimization_tips || []
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl panel p-5">
        <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Select Algorithm</label>
        <select
          className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky"
          value={selectedAlgorithm}
          onChange={(event) => setSelectedAlgorithm(event.target.value)}
        >
          {algorithms.map((algo) => (
            <option key={algo.name} value={algo.name}>
              {algo.display_name}
            </option>
          ))}
        </select>
      </div>
      {theory ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <TheoryCard
            theory={theory}
            nMeaning={activeAlgorithm?.nMeaning}
            algorithmName={activeAlgorithm?.name}
            howItWorks={activeAlgorithm?.howItWorks}
            keyInsight={activeAlgorithm?.keyInsight}
            whenToUse={activeAlgorithm?.whenToUse}
            whenToAvoid={activeAlgorithm?.whenToAvoid}
          />
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-sky/60">Select an algorithm to see details.</div>
      )}
    </div>
  );
};

export default Theory;
