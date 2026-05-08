import { createContext, useContext, useState } from "react";
import type {
  Shift,
  Project,
  Pelamar,
  Wawancara,
} from "@/features/umkm/types/dashboard.types";
import {
  dataDummy,
  mockProjects,
  mockShifts,
  mockWawancara,
} from "@/features/umkm/constants/mock-data";

type TaskContextType = {
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  pelamarList: Pelamar[];
  updateStatusPelamar: (id: number, status: Pelamar["status_pelamar"]) => void;
  wawancaraList: (Pelamar & Wawancara)[];
  addWawancara: (data: Pelamar & Wawancara) => void;
};

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [pelamarList, setPelamarList] = useState<Pelamar[]>(dataDummy);
  const [wawancaraList, setWawancaraList] =
    useState<(Pelamar & Wawancara)[]>(mockWawancara);

  const updateStatusPelamar = (
    id: number,
    status: Pelamar["status_pelamar"],
  ) => {
    setPelamarList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status_pelamar: status } : p)),
    );
  };

  const addWawancara = (data: Pelamar & Wawancara) => {
    setWawancaraList((prev) => [...prev, data]);
  };

  return (
    <TaskContext.Provider
      value={{
        shifts,
        setShifts,
        projects,
        setProjects,
        pelamarList,
        updateStatusPelamar,
        wawancaraList,
        addWawancara,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask harus digunakan dengan TaskProvider");
  return context;
}
