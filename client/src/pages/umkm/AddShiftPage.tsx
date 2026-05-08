import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import AddShift from "@/features/umkm/components/AddShift"; 
import { useTask } from "./TaskContext";

export default function AddShiftPage() { 
const { shifts, setShifts } = useTask();
  return (
    <DashboardUmkmLayout>
      <AddShift type="pagi" shifts={shifts} setShifts={setShifts} />
    </DashboardUmkmLayout>
  );
}