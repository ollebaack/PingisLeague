import { SidebarProvider } from "@/components/ui/sidebar";
import { PlayersProvider } from "./players-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <ThemeProvider>
        <PlayersProvider>{children}</PlayersProvider>
      </ThemeProvider>
    </SidebarProvider>
  );
}
