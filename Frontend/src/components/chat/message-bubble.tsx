import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  children: ReactNode;
  className?: string;
}

export function MessageBubble({
  role,
  children,
  className,
}: MessageBubbleProps) {
  const base =
    "rounded-lg px-3 py-2 text-sm whitespace-pre-wrap max-w-[80%] shadow-sm";
  const variant =
    role === "user"
      ? "bg-primary text-primary-foreground ml-auto"
      : role === "assistant"
      ? "bg-muted"
      : "bg-secondary text-secondary-foreground mx-auto";
  return (
    <div data-role={role} className={cn(base, variant, className)}>
      {children}
    </div>
  );
}
