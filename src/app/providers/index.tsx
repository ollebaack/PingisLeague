// app/providers/index.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { PageProvider } from "./page-provider";
import { PlayersProvider } from "./players-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <PageProvider>
        <PlayersProvider>{children}</PlayersProvider>
      </PageProvider>
    </SidebarProvider>
  );
}
