import { createContext, useContext, useEffect, useState } from "react";
import Themes from "./themes.json";

const initialState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      document.documentElement.setAttribute("data-theme", systemTheme);
      return;
    }

    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // const theme_options = ["light", "dark", "green", "dark-green", "dark-blue"];
  const theme_options = Object.keys(Themes);
  const theme_type = ["light", "light-green"].includes(theme)
    ? "light"
    : "dark";

  const value = {
    theme,
    theme_options,
    theme_type,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
