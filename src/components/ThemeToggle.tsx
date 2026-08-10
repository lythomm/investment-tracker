"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-2xl bg-slate-900 dark:bg-white border border-slate-900 dark:border-white hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors duration-150 flex items-center justify-center select-none cursor-pointer"
      title={`Thème : ${isDark ? "Sombre" : "Clair"} (Cliquez pour passer au mode ${isDark ? "Clair" : "Sombre"})`}
      aria-label="Basculer le mode sombre"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-slate-900" />
      ) : (
        <Moon className="h-4 w-4 text-white" />
      )}
    </button>
  );
}
