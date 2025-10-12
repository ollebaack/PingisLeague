"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, systemTheme } = useTheme();

  const current = theme === "system" ? systemTheme : theme;

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost" className="w-full justify-start">
            {current === "dark" ? (
              <Moon className="mr-2" />
            ) : (
              <Sun className="mr-2" />
            )}
            <span className="truncate">
              {theme === "system"
                ? "System"
                : typeof current === "string"
                ? current[0].toUpperCase() + current.slice(1)
                : "Theme"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={current === "light" ? "default" : "ghost"}
              onClick={() => setTheme("light")}
            >
              <Sun className="mr-2" /> Light
            </Button>
            <Button
              size="sm"
              variant={current === "dark" ? "default" : "ghost"}
              onClick={() => setTheme("dark")}
            >
              <Moon className="mr-2" /> Dark
            </Button>
            <Button
              size="sm"
              variant={theme === "system" ? "default" : "ghost"}
              onClick={() => setTheme("system")}
            >
              <Monitor className="mr-2" /> System
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
