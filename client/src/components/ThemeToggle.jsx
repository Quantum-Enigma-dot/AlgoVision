import { useTheme } from "../hooks/useTheme.js";
import { MoonStar, SunMedium } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={isLight}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-sm font-semibold text-sky/85 transition hover:border-emerald-300/50 hover:bg-white/10 hover:text-sky focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
    >
      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${isLight ? "bg-amber-400/15 text-amber-200" : "bg-slate-900/70 text-cyan-200"}`}>
        {isLight ? <MoonStar size={16} /> : <SunMedium size={16} />}
      </span>
      <span className="hidden sm:inline">{isLight ? "Dark mode" : "Light mode"}</span>
    </button>
  );
};

export default ThemeToggle;
