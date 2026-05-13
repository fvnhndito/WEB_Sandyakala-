import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import AddShift from "@/features/umkm/components/AddShift"; 
import { useTask } from "./TaskContext";
import { mockLowongan } from "@/features/umkm/constants/mock-data";


export default function AddShiftPage() { 
const { shifts, setShifts } = useTask();
const lowonganPekerja = mockLowongan.find(
    (item) => item.posisi_lowongan === "UI/UX Designer"
  );
  return (
    <DashboardUmkmLayout>
      <AddShift type="pagi" shifts={shifts} setShifts={setShifts} jamKerjaLowongan={lowonganPekerja?.jam_kerja} />
    </DashboardUmkmLayout>
  );
}