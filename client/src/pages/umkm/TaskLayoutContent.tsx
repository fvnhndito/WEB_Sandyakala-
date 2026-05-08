import { Outlet } from "react-router-dom";
import { TaskProvider } from "@/pages/umkm/TaskContext";

export default function TaskLayoutContent() {
  return (
    <TaskProvider>
      <Outlet />
    </TaskProvider>
  );
}