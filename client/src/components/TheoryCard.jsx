import ComplexityBadge from "./ComplexityBadge.jsx";
import { normalizeCategoryLabel } from "../data/algorithms.js";
import { Link } from "react-router-dom";

const TheoryCard = ({ theory, nMeaning, algorithmName, howItWorks, keyInsight, whenToUse = [], whenToAvoid = [] }) => {
  return (
    <div className="rounded-2xl border border-white/10 panel p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-sky">{theory.name}</h3>
        <span className="rounded-full border border-emerald-300/30 bg-emerald-400/20 px-3 py-1 text-xs text-emerald-200">
          {normalizeCategoryLabel(theory.category)}
        </span>
      </div>
      <p className="mt-3 text-sm text-sky/70">{theory.description}</p>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-xs uppercase tracking-[0.2em] text-sky/40">How It Works</h4>
        <p className="mt-2 text-sm leading-6 text-sky/75">{howItWorks}</p>
      </div>

      <div className="mt-4 rounded-xl border border-cyan-300/30 bg-cyan-400/10 p-4 text-sm text-cyan-100">
        <span className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">Key Insight</span>
        <p className="mt-2">{keyInsight}</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ComplexityBadge label="Best" value={theory.complexity.best_time} note={nMeaning?.best_time} />
        <ComplexityBadge label="Average" value={theory.complexity.average_time} note={nMeaning?.average_time} />
        <ComplexityBadge label="Worst" value={theory.complexity.worst_time} note={nMeaning?.worst_time} />
        <ComplexityBadge label="Space" value={theory.complexity.space} note={nMeaning?.space} />
      </div>
      <div className="mt-4 grid gap-4 text-sm text-sky/75 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-sky/40">Use Cases</h4>
          <ul className="mt-2 space-y-1">
            {theory.use_cases.map((item) => (
              <li key={item} className="rounded-md bg-white/5 px-2 py-1">{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-sky/40">Limitations</h4>
          <ul className="mt-2 space-y-1">
            {theory.limitations.map((item) => (
              <li key={item} className="rounded-md bg-white/5 px-2 py-1">{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-sky/40">Optimization Tips</h4>
          <ul className="mt-2 space-y-1">
            {theory.optimization_tips.map((item) => (
              <li key={item} className="rounded-md bg-white/5 px-2 py-1">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 p-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">When to Use</h4>
          <ul className="mt-2 space-y-1 text-sm text-emerald-100/90">
            {whenToUse.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-red-300/30 bg-red-400/10 p-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-red-100/80">When to Avoid</h4>
          <ul className="mt-2 space-y-1 text-sm text-red-100/90">
            {whenToAvoid.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        to={`/analyzer?category=${theory.category}&algorithm=${algorithmName}`}
        className="mt-4 inline-flex rounded-lg border border-cyan-300/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20"
      >
        Visualize in Analyzer
      </Link>
    </div>
  );
};

export default TheoryCard;
