import { normalizeCategoryLabel } from "../data/algorithms.js";

const AlgorithmSelector = ({ categories, selectedCategory, setSelectedCategory, algorithms, selectedAlgorithm, setSelectedAlgorithm }) => {
  const categoryClass = {
    sorting: "bg-accent-sorting/20 text-accent-sorting border-accent-sorting/30",
    graph: "bg-accent-graph/20 text-accent-graph border-accent-graph/30",
    dp: "bg-accent-dp/20 text-accent-dp border-accent-dp/30",
    string: "bg-accent-string/20 text-accent-string border-accent-string/30"
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-sky/70">
        <span className={`rounded-full border px-2 py-1 ${categoryClass[selectedCategory] || "bg-white/10 border-white/20"}`}>
          {normalizeCategoryLabel(selectedCategory)}
        </span>
        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">
          {algorithms.length} algorithms
        </span>
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Category</label>
        <select
          className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky shadow-inner transition focus:border-cyan-300/50 focus:outline-none"
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
        <label className="text-xs uppercase tracking-[0.2em] text-sky/50">Algorithm</label>
        <select
          className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-sky shadow-inner transition focus:border-cyan-300/50 focus:outline-none"
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
