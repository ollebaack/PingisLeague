import { createContext, useContext, useState, type ReactNode } from "react";

type PageContextType = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<string>("home");

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  );
};

export function usePage() {
  const context = useContext(PageContext);
  if (!context) throw new Error("usePage must be used within PageProvider");
  return context;
}
