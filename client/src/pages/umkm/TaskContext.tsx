import { createContext, useContext, useState } from "react";
import type { Shift, Project } from "@/features/umkm/types/dashboard.types";
import { mockProjects, mockShifts } from "@/features/umkm/constants/mock-data";

type TaskContextType = {
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
};

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  return (
    <TaskContext.Provider value={{ shifts, setShifts, projects, setProjects }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask harus digunakan dengan TaskProvider");
  return context;
}