import { useTheme } from "../hooks/useTheme.js";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-emerald-300"
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
};

export default ThemeToggle;
