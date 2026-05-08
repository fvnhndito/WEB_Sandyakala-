import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/admin/DashboardPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerificationPage from "./pages/admin/VerificationPage";
import DetailVerificationPage from "./pages/admin/DetailVerificationPage";
import ReportPage from "./pages/admin/ReportPage";
import DetailReportPage from "./pages/admin/DetailReportPage";

import HomeUmkmPage from "./pages/umkm/HomeUmkmPage";
import LandingPage from "./pages/umkm/LandingPage";
import DashboardUmkmPage from "./pages/umkm/DashboardUmkmPage";
import LowonganUmkmPage from "./pages/umkm/LowonganUmkmPage";
import ProfileUmkmPage from "./pages/umkm/ProfileUmkmPage";

import DataShift from "./features/umkm/components/DataShift";
import DataProject from "./features/umkm/components/DataProject";
import DataPekerja from "./features/umkm/components/DataPekerja";

import AddShiftPage from "./pages/umkm/AddShiftPage";
import AddProjectPage from "./pages/umkm/AddProjectPage";
import TaskLayoutContent from "./pages/umkm/TaskLayoutContent";

import VerificationFgPage from "./pages/admin/VerificationFg";
import DetailVerificationFgPage from "./pages/admin/DetailVerificationFgPage";

import DataLamaranMasuk from "./pages/umkm/DataLamaranMasuk";
import DataDalamSeleksi from "./pages/umkm/DataDalamSeleksi";
import DataPosisiTerbuka from "./pages/umkm/DataPosisiTerbuka";


function App() {
  return (
    <Routes>
      <Route path="/" Component={HomePage} />

      <Route path="/auth">
        <Route path="login" Component={LoginPage} />
        <Route path="register" Component={RegisterPage} />
      </Route>

      {/* Admin */}
      <Route path="/admin">
        <Route path="dashboard" Component={DashboardPage} />
        <Route path="verifikasi-umkm" Component={VerificationPage} />
        <Route path="verifikasi-umkm/:namaUsaha" Component={DetailVerificationPage} />
        <Route path="verifikasi-freshgraduate" Component={VerificationFgPage} />
        <Route path="verifikasi-freshgraduate/:email" Component={DetailVerificationFgPage} />
        <Route path="laporan" Component={ReportPage} />
        <Route path="laporan/:namaUsaha" Component={DetailReportPage} />
      </Route>

      {/* UMKM */}
      <Route path="/umkm">
        <Route path="home" Component={HomeUmkmPage} />
        <Route path="landing" Component={LandingPage} />
        <Route path="lowongan" Component={LowonganUmkmPage} />
        <Route path="profile" Component={ProfileUmkmPage} />

        <Route path="dashboard" Component={TaskLayoutContent}>
          <Route index element={<DashboardUmkmPage />} />
          <Route path="data-shift" element={<DataShift />} />
          <Route path="data-project" element={<DataProject />} />
          <Route path="data-pekerja" element={<DataPekerja />} />
          <Route path="lamaran-masuk" element={<DataLamaranMasuk />} />
          <Route path="dalam-seleksi" element={<DataDalamSeleksi />} />
          <Route path="posisi-terbuka" element={<DataPosisiTerbuka />} />
          <Route path="addshift" element={<AddShiftPage />} />
          <Route path="addproject" element={<AddProjectPage />} />
        </Route>
      </Route>

      <Route path="*" Component={NotFound} />
    </Routes>
  );
}

export default App;