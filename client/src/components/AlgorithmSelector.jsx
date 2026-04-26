import { normalizeCategoryLabel } from "../data/algorithms.js";
import { useTheme } from "../hooks/useTheme.js";

const AlgorithmSelector = ({ categories, selectedCategory, setSelectedCategory, algorithms, selectedAlgorithm, setSelectedAlgorithm }) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const categoryClass = {
    sorting: isLightTheme ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "bg-accent-sorting/20 text-accent-sorting border-accent-sorting/30",
    graph: isLightTheme ? "border-amber-200 bg-amber-50 text-amber-700" : "bg-accent-graph/20 text-accent-graph border-accent-graph/30",
    dp: isLightTheme ? "border-blue-200 bg-blue-50 text-blue-700" : "bg-accent-dp/20 text-accent-dp border-accent-dp/30",
    string: isLightTheme ? "border-pink-200 bg-pink-50 text-pink-700" : "bg-accent-string/20 text-accent-string border-accent-string/30",
    stack: isLightTheme ? "border-orange-200 bg-orange-50 text-orange-700" : "bg-orange-400/20 text-orange-200 border-orange-300/30",
    queue: isLightTheme ? "border-cyan-200 bg-cyan-50 text-cyan-700" : "bg-cyan-400/20 text-cyan-200 border-cyan-300/30",
    linked_list: isLightTheme ? "border-purple-200 bg-purple-50 text-purple-700" : "bg-purple-400/20 text-purple-200 border-purple-300/30",
    tree: isLightTheme ? "border-lime-200 bg-lime-50 text-lime-700" : "bg-lime-400/20 text-lime-200 border-lime-300/30"
  };
  const countChipClass = isLightTheme
    ? "rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-600 shadow-sm"
    : "rounded-full border border-white/15 bg-white/5 px-2 py-1";
  const labelClass = isLightTheme ? "text-slate-500" : "text-sky/50";
  const selectClass = isLightTheme
    ? "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-cyan-400 focus:outline-none"
    : "mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky shadow-inner transition focus:border-cyan-300/50 focus:outline-none";

  return (
    <div className="space-y-4">
      <div className={`flex items-center gap-2 text-xs ${isLightTheme ? "text-slate-600" : "text-sky/70"}`}>
        <span className={`rounded-full border px-2 py-1 ${categoryClass[selectedCategory] || "bg-white/10 border-white/20"}`}>
          {normalizeCategoryLabel(selectedCategory)}
        </span>
        <span className={countChipClass}>
          {algorithms.length} algorithms
        </span>
      </div>

      <div>
        <label className={`text-xs uppercase tracking-[0.2em] ${labelClass}`}>Category</label>
        <select
          className={selectClass}
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          {categories.map((categoryOption) => (
            <option key={categoryOption.value} value={categoryOption.value}>
              {categoryOption.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={`text-xs uppercase tracking-[0.2em] ${labelClass}`}>Algorithm</label>
        <select
          className={selectClass}
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
    </div>
  );
};

export default AlgorithmSelector;
