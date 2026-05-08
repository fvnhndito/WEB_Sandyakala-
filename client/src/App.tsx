
import { Route, Routes } from "react-router-dom";
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
import ReportUMKM from "./pages/umkm/ReportUMKM";
import AddLowonganPage from "./pages/umkm/AddLowonganPage";
import VerificationUMKM from "./pages/umkm/VerificationUMKM";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/landing" element={<LandingPage />} />

      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin">
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="verifikasi-umkm" element={<VerificationPage />} />
        <Route path="verifikasi-umkm/:namaUsaha" element={<DetailVerificationPage />} />
        <Route path="verifikasi-freshgraduate" element={<VerificationFgPage />} />
        <Route path="verifikasi-freshgraduate/:email" element={<DetailVerificationFgPage />} />
        <Route path="laporan" element={<ReportPage />} />
        <Route path="laporan/:namaUsaha" element={<DetailReportPage />} />
      </Route>

      {/* UMKM */}
      <Route path="/umkm">
        <Route path="home" element={<HomeUmkmPage />} />
        <Route path="lowongan" element={<LowonganUmkmPage />} />
        <Route path="profile" element={<ProfileUmkmPage />} />
        <Route path="report" element={<ReportUMKM />} />
        <Route path="add-lowongan" element={<AddLowonganPage />} />
        <Route path="verification" element={<VerificationUMKM />} />

        <Route path="dashboard" element={<TaskLayoutContent />}>
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

      <Route path="/chat" element={<ChatPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;