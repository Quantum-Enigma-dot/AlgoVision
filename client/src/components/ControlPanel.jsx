import { motion } from "framer-motion";

const ActionButton = ({ children, className, onClick }) => (
  <motion.button
    whileHover={{ y: -2, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
    className={className}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

const ControlPanel = ({
  status,
  onRun,
  onPause,
  onResume,
  onReset,
  onStepForward,
  onStepBackward,
  speed,
  setSpeed
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <ActionButton
          className="min-w-[100px] flex-[1_1_calc(33%-8px)] rounded-lg border border-emerald-300/30 bg-emerald-400/20 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/30"
          onClick={onRun}
        >
          ▶ Run
        </ActionButton>
        <ActionButton
          className="min-w-[100px] flex-[1_1_calc(33%-8px)] rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm transition hover:border-white/35"
          onClick={onPause}
        >
          ⏸ Pause
        </ActionButton>
        <ActionButton
          className="min-w-[100px] flex-[1_1_calc(33%-8px)] rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm transition hover:border-white/35"
          onClick={onResume}
        >
          ⏵ Resume
        </ActionButton>
        <ActionButton
          className="min-w-[100px] flex-[1_1_calc(33%-8px)] rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm transition hover:border-white/35"
          onClick={onReset}
        >
          ↺ Reset
        </ActionButton>
        <ActionButton
          className="min-w-[100px] flex-[1_1_calc(33%-8px)] rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm transition hover:border-white/35"
          onClick={onStepBackward}
        >
          ◀ Step
        </ActionButton>
        <ActionButton
          className="min-w-[100px] flex-[1_1_calc(33%-8px)] rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm transition hover:border-white/35"
          onClick={onStepForward}
        >
          Step ▶
        </ActionButton>
      </div>

      <div className="grid gap-2 rounded-xl border border-white/10 bg-slate-900/40 p-3 md:grid-cols-[1fr_auto] md:items-center">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-sky/60">
            <span className="shrink-0">Speed</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-sky/80">{speed} ms</span>
          </div>
          <input
            className="w-full min-w-0"
            type="range"
            min="100"
            max="1500"
            step="100"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
          <div className="flex items-center justify-between text-[11px] text-sky/50">
            <span>Fast (100ms)</span>
            <span>Slow (1500ms)</span>
          </div>
        </div>

        <div className="min-w-0">
          <span className="inline-flex max-w-full items-center truncate rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-cyan-100">
            {String(status).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
