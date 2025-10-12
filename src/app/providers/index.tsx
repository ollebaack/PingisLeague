// app/providers/index.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { PageProvider } from "./page-provider";
import { PlayersProvider } from "./players-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <ThemeProvider>
        <PageProvider>
          <PlayersProvider>{children}</PlayersProvider>
        </PageProvider>
      </ThemeProvider>
    </SidebarProvider>
  );
}
