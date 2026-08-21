import { createContext, useContext, type ReactNode } from "react";

// Dark mode disabled. Light-only theme provider kept for API compatibility.
type Theme = "light";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeCtx.Provider value={{ theme: "light", toggle: () => {} }}>{children}</ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
