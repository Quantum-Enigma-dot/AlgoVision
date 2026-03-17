import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

const MetricsPanel = ({ metrics, complexity, nMeaning }) => {
  if (!metrics) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-sky/50">Run an algorithm to see metrics.</p>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="relative h-16 overflow-hidden rounded-xl border border-white/10 bg-white/5">
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
            className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-3"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky/45">{card.label}</p>
            <p className={`mt-2 text-xl font-semibold ${card.tone}`}><AnimatedNumber value={card.value} /></p>
          </motion.div>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-3">
        <p className="text-xs uppercase tracking-[0.2em] text-sky/40">Space Estimate</p>
        <p className="mt-2 text-lg font-semibold">{metrics.space_estimate ?? "-"}</p>
      </div>
      {complexity && (
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-sky/40">Complexity</p>
          <div className="mt-2 space-y-2 text-sm">
            <div>
              <p>Best: <span className="font-semibold">{complexity.best_time}</span></p>
              {nMeaning?.best_time && <p className="text-xs text-sky/45">{nMeaning.best_time}</p>}
            </div>
            <div>
              <p>Average: <span className="font-semibold">{complexity.average_time}</span></p>
              {nMeaning?.average_time && <p className="text-xs text-sky/45">{nMeaning.average_time}</p>}
            </div>
            <div>
              <p>Worst: <span className="font-semibold">{complexity.worst_time}</span></p>
              {nMeaning?.worst_time && <p className="text-xs text-sky/45">{nMeaning.worst_time}</p>}
            </div>
            <div>
              <p>Space: <span className="font-semibold">{complexity.space}</span></p>
              {nMeaning?.space && <p className="text-xs text-sky/45">{nMeaning.space}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsPanel;
