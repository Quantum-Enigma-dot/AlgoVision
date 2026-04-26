import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ComplexityTable from "./ComplexityTable.jsx";
import { useTheme } from "../hooks/useTheme.js";

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const start = performance.now();
    const duration = 500;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(target * progress));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [value]);

  return display;
};

const MetricsPanel = ({ metrics, complexity, nMeaning, metadata }) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const effectiveComplexity = complexity || metadata?.complexity || null;
  const emptyTextClass = isLightTheme ? "text-sm text-slate-500" : "text-sm text-sky/50";
  const skeletonClass = isLightTheme
    ? "relative h-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
    : "relative h-16 overflow-hidden rounded-xl border border-white/10 bg-white/5";
  const cardClass = isLightTheme
    ? "rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
    : "rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-3";
  const labelClass = isLightTheme ? "text-[11px] uppercase tracking-[0.2em] text-slate-500" : "text-[11px] uppercase tracking-[0.2em] text-sky/45";
  const spaceCardClass = isLightTheme
    ? "rounded-xl border border-slate-200 bg-slate-50/90 p-3 shadow-sm"
    : "rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-3";
  const spaceLabelClass = isLightTheme ? "text-xs uppercase tracking-[0.2em] text-slate-500" : "text-xs uppercase tracking-[0.2em] text-sky/40";

  if (!metrics) {
    return (
      <div className="space-y-3">
        <p className={emptyTextClass}>Run an algorithm to see metrics.</p>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className={skeletonClass}>
              <div className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Time (ms)", value: metrics.execution_time_ms ?? 0, tone: "text-accent-sorting" },
    { label: "Comparisons", value: metrics.comparisons ?? 0, tone: "text-accent-graph" },
    { label: "Swaps", value: metrics.swaps ?? 0, tone: "text-accent-dp" },
    { label: "Recursion", value: metrics.recursion_depth ?? 0, tone: "text-accent-string" }
  ];

  return (
    <div className="grid gap-3 text-sm text-sky/80">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className={cardClass}
          >
            <p className={labelClass}>{card.label}</p>
            <p className={`mt-2 text-xl font-semibold ${card.tone}`}><AnimatedNumber value={card.value} /></p>
          </motion.div>
        ))}
      </div>
      <div className={spaceCardClass}>
        <p className={spaceLabelClass}>Space Estimate</p>
        <p className="mt-2 text-lg font-semibold">{metrics.space_estimate ?? "-"}</p>
      </div>
      {effectiveComplexity && <ComplexityTable complexity={effectiveComplexity} nMeaning={nMeaning} compact title="Complexity Table" />}
    </div>
  );
};

export default MetricsPanel;
