"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

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

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2.5 rounded-2xl border border-subtle bg-surface text-main hover:bg-surface-hover transition-colors duration-150 flex items-center justify-center select-none cursor-pointer"
      title={`Thème actuel : ${theme === "light" ? "Clair" : theme === "dark" ? "Sombre" : "Système"} (Cliquez pour changer)`}
      aria-label="Changer le thème"
    >
      {theme === "light" && <Sun className="h-4 w-4 text-amber-500" />}
      {theme === "dark" && <Moon className="h-4 w-4 text-indigo-400" />}
      {theme === "system" && <Monitor className="h-4 w-4 text-slate-400" />}
    </button>
  );
}
