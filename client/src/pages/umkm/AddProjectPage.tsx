import AddProject from "@/features/umkm/components/AddProject";
import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import { useTask } from "@/pages/umkm/TaskContext";

export default function AddProjectPage() {
  const { projects, setProjects } = useTask(); 

  return (
    <DashboardUmkmLayout>
      <AddProject projects={projects} setProjects={setProjects} />
    </DashboardUmkmLayout>
  );
}