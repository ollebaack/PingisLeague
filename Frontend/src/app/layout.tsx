import { AppSidebar } from "@/components/app-sidebar";
import { AppProviders } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import TopBar from "@/components/top-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <div className="flex w-full">
        <div className="fixed top-0 left-0 z-50">
          <AppSidebar />
        </div>

        <main className="flex-1 flex flex-col min-h-screen">
          <TopBar />
          <div className="flex-1 p-6">{children}</div>
        </main>
        <Toaster />
      </div>
    </AppProviders>
  );
}
