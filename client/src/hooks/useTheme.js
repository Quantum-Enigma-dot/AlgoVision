import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";

const THEME_KEY = "algovision-theme";
const ThemeContext = createContext(undefined);

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle("light", theme === "light");
    document.body.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
