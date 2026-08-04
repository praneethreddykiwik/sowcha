"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  defaultTheme,
  isThemeId,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "@/config/themes";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme);

  // The inline script in layout.tsx has already applied the stored theme to
  // <html> before paint; here we only sync React state to it.
  useEffect(() => {
    const applied = document.documentElement.dataset.theme;
    if (isThemeId(applied)) setThemeState(applied);
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode / storage disabled — the theme still applies for this visit.
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

/**
 * Runs before first paint so a returning visitor never sees the default theme
 * flash before their own.
 */
export const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var valid = ["sage","blossom","lavender"];
    document.documentElement.dataset.theme = valid.indexOf(t) > -1 ? t : ${JSON.stringify(defaultTheme)};
  } catch (e) {
    document.documentElement.dataset.theme = ${JSON.stringify(defaultTheme)};
  }
})();
`;
