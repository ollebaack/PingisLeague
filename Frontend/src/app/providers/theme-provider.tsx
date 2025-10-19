"use client";

import * as React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

type Props = {
  children: React.ReactNode;
};

// A thin wrapper around next-themes ThemeProvider so components can use theme
// switching. This follows the shadcn approach (client component).
export function ThemeProvider({ children }: Props) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemeProvider>
  );
}
