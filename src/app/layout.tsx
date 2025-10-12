// app/layout.tsx
import { AppSidebar } from "@/components/app-sidebar";
import { AppProviders } from "./providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AppProviders>
  );
}
