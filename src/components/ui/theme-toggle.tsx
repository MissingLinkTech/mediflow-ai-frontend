"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const subscribe = () => () => undefined;

export function ThemeToggle({ className }: { className?: string }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("rounded-full", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}
