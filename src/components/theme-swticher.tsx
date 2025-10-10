"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect runs only on the client, ensuring access to 'theme'
  useEffect(() => setMounted(true), []);

  // Avoid rendering the UI before the theme is resolved to prevent hydration mismatch
  if (!mounted) return null;

  const currentTheme = resolvedTheme || theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <Button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-900 dark:bg-gray-200   transition-all"
      aria-label="Toggle Dark Mode"
    >
      {currentTheme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </Button>
  );
}
