import { createContext, useContext, useState } from "react";
import { dataDummy } from "@/features/umkm/constants/mock-data";
import type { Pelamar } from "@/features/umkm/types/dashboard.types";

type RekrutmenContextType = {
  pelamarList: Pelamar[];
  updateStatus: (id: number, status: Pelamar["status_pelamar"]) => void;
};

const RekrutmenContext = createContext<RekrutmenContextType | null>(null);

export function RekrutmenProvider({ children }: { children: React.ReactNode }) {
  const [pelamarList, setPelamarList] = useState<Pelamar[]>(dataDummy);

  const updateStatus = (id: number, status: Pelamar["status_pelamar"]) => {
    setPelamarList(prev =>
      prev.map(p => p.id === id ? { ...p, status_pelamar: status } : p)
    );
  };

  return (
    <RekrutmenContext.Provider value={{ pelamarList, updateStatus }}>
      {children}
    </RekrutmenContext.Provider>
  );
}

export const useRekrutmen = () => {
  const ctx = useContext(RekrutmenContext);
  if (!ctx) throw new Error("useRekrutmen must be used inside RekrutmenProvider");
  return ctx;
};