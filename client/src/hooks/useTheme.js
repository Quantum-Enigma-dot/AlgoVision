import { useEffect, useState } from "react";

const THEME_KEY = "algovision-theme";

export const useTheme = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
};
