import { Outlet } from "react-router-dom";
import { TaskProvider } from "@/pages/umkm/TaskContext";
import { RekrutmenProvider } from "./RekrutmenContext";

export default function TaskLayoutContent() {
  return (
    <TaskProvider>
      <RekrutmenProvider>
        <Outlet />
      </RekrutmenProvider>
    </TaskProvider>
  );
}
