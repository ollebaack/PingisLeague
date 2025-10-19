"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { open } = useSidebar();
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4 text-white">
      <div className="flex items-center gap-3">
        <SidebarTrigger
          className={cn(
            open ? "invisible" : "",
            "text-white hover:bg-[#3a3f44] rounded-md p-1"
          )}
        />
      </div>
    </header>
  );
}

export default TopBar;
