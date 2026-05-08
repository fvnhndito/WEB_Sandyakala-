import { useState } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/umkm/LandingPage";
import DashboardPage from "./pages/admin/DashboardPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerificationPage from "./pages/admin/VerificationPage";
import DetailVerificationPage from "./pages/admin/DetailVerificationPage";
import ReportPage from "./pages/admin/ReportPage";
import DetailReportPage from "./pages/admin/DetailReportPage";
import HomeUmkmPage from "./pages/umkm/HomeUmkmPage";
import DashboardUmkmPage from "./pages/umkm/DashboardUmkmPage";
import LowonganUmkmPage from "./pages/umkm/LowonganUmkmPage";
import ProfileUmkmPage from "./pages/umkm/ProfileUmkmPage";
import AddShiftPage from "./pages/umkm/AddShiftPage";
import AddProjectPage from "./pages/umkm/AddProjectPage";
import ChatPage from "./pages/ChatPage";
import ReportUMKM from "./pages/umkm/ReportUMKM";
import AddLowonganPage from "./pages/umkm/AddLowonganPage";
import VerificationUMKM from "./pages/umkm/VerificationUMKM";
import VerificationFgPage from "./pages/admin/VerificationFg";
import DetailVerificationFgPage from "./pages/admin/DetailVerificationFgPage";
import DataLamaranMasuk from "./pages/umkm/DataLamaranMasuk";
import DataDalamSeleksi from "./pages/umkm/DataDalamSeleksi";
import DataPosisiTerbuka from "./pages/umkm/DataPosisiTerbuka";
import DataShift from "./pages/umkm/DataShift";
import DataProject from "./pages/umkm/DataProject";
import DataPekerja from "./pages/umkm/DataPekerja";

function App() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  return (
    <Routes>
      <Route path="/" Component={HomePage} />
      <Route path="/landing" Component={LandingPage} />

      <Route path="/auth">
        <Route path="login" Component={LoginPage} />
        <Route path="register" Component={RegisterPage} />
      </Route>

      {/* Admin */}
      <Route path="/admin">
        <Route path="dashboard" Component={DashboardPage} />
        <Route path="verifikasi-umkm" Component={VerificationPage} />
        <Route
          path="verifikasi-umkm/:namaUsaha"
          Component={DetailVerificationPage}
        />
        <Route path="verifikasi-freshgraduate" Component={VerificationFgPage} />
        <Route
          path="verifikasi-freshgraduate/:email"
          Component={DetailVerificationFgPage}
        />
        <Route path="laporan" Component={ReportPage} />
        <Route path="laporan/:namaUsaha" Component={DetailReportPage} />
      </Route>

        {/* Route for UMKM */}
        <Route path="/umkm/*">
          <Route path="home" Component={HomeUmkmPage} />
          <Route path="lowongan" Component={LowonganUmkmPage} />
          <Route path="profile" Component={ProfileUmkmPage} />
          <Route path="report" Component={ReportUMKM} />
          <Route path="add-lowongan" Component={AddLowonganPage} />
          <Route path="verification" Component={VerificationUMKM} />
        </Route>

        {/* Dashboard */}
        <Route
          path="dashboard"
          element={
            <Outlet
              context={{
                shifts,
                setShifts,
                projects,
                setProjects,
              }}
            />
          }
        >
          <Route index element={<DashboardUmkmPage />} />
          <Route path="data-shift" element={<DataShift />} />
          <Route path="data-project" element={<DataProject />} />
          <Route path="data-pekerja" element={<DataPekerja />} />
          <Route path="lamaran-masuk" element={<DataLamaranMasuk />} />
          <Route path="dalam-seleksi" element={<DataDalamSeleksi />} />
          <Route path="posisi-terbuka" element={<DataPosisiTerbuka />} />
          <Route
            path="addshift"
            element={<AddShiftPage shifts={shifts} setShifts={setShifts} />}
          />
          <Route
            path="addproject"
            element={
              <AddProjectPage projects={projects} setProjects={setProjects} />
            }
          />

        </Route>

        <Route path="/chat" Component={ChatPage} />

      <Route path="*" Component={NotFound} />
    </Routes>
  );
}

export default App;
