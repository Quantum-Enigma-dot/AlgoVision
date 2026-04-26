import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme.js";

const ActionButton = ({ children, className, onClick, disabled = false }) => (
  <motion.button
    whileHover={{ y: -2, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
    className={className}
    onClick={onClick}
    disabled={disabled}
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
  setSpeed,
  canRun = true
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const disabledClass = "disabled:cursor-not-allowed disabled:opacity-45";
  const runButtonClass = isLightTheme
    ? `min-w-[100px] flex-[1_1_calc(33%-8px)] rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100 ${disabledClass}`
    : `min-w-[100px] flex-[1_1_calc(33%-8px)] rounded-lg border border-emerald-300/30 bg-emerald-400/20 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/30 ${disabledClass}`;
  const secondaryButtonClass = isLightTheme
    ? `min-w-[100px] flex-[1_1_calc(33%-8px)] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 ${disabledClass}`
    : `min-w-[100px] flex-[1_1_calc(33%-8px)] rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm transition hover:border-white/35 ${disabledClass}`;
  const sliderPanelClass = isLightTheme
    ? "grid gap-2 rounded-xl border border-slate-200 bg-slate-50/90 p-3 md:grid-cols-[1fr_auto] md:items-center"
    : "grid gap-2 rounded-xl border border-white/10 bg-slate-900/40 p-3 md:grid-cols-[1fr_auto] md:items-center";
  const metaTextClass = isLightTheme ? "flex flex-wrap items-center gap-2 text-xs text-slate-500" : "flex flex-wrap items-center gap-2 text-xs text-sky/60";
  const speedChipClass = isLightTheme
    ? "rounded-full border border-slate-200 bg-white px-2 py-0.5 text-slate-700 shadow-sm"
    : "rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-sky/80";
  const rangeLabelClass = isLightTheme ? "flex items-center justify-between text-[11px] text-slate-500" : "flex items-center justify-between text-[11px] text-sky/50";
  const statusChipClass = isLightTheme
    ? "inline-flex max-w-full items-center truncate rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-cyan-700"
    : "inline-flex max-w-full items-center truncate rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-cyan-100";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <ActionButton
          className={runButtonClass}
          onClick={onRun}
          disabled={!canRun}
        >
          ▶ Run
        </ActionButton>
        <ActionButton
          className={secondaryButtonClass}
          onClick={onPause}
          disabled={!canRun}
        >
          ⏸ Pause
        </ActionButton>
        <ActionButton
          className={secondaryButtonClass}
          onClick={onResume}
          disabled={!canRun}
        >
          ⏵ Resume
        </ActionButton>
        <ActionButton
          className={secondaryButtonClass}
          onClick={onReset}
          disabled={!canRun}
        >
          ↺ Reset
        </ActionButton>
        <ActionButton
          className={secondaryButtonClass}
          onClick={onStepBackward}
          disabled={!canRun}
        >
          ◀ Step
        </ActionButton>
        <ActionButton
          className={secondaryButtonClass}
          onClick={onStepForward}
          disabled={!canRun}
        >
          Step ▶
        </ActionButton>
      </div>

      <div className={sliderPanelClass}>
        <div className="min-w-0 space-y-2">
          <div className={metaTextClass}>
            <span className="shrink-0">Speed</span>
            <span className={speedChipClass}>{speed} ms</span>
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
          <div className={rangeLabelClass}>
            <span>Fast (100ms)</span>
            <span>Slow (1500ms)</span>
          </div>
        </div>

        <div className="min-w-0">
          <span className={statusChipClass}>
            {String(status).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
