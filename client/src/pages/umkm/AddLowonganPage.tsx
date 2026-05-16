// import React, { useState } from "react";
import DashboardUmkmLayout from "@/shared/layouts/DashboardUmkmLayout";
import { Card } from "@/features/umkm/components/ui/Card";
import { Button } from "@/shared/components/ui/button";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  // FiClock,
  FiX,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

const InputField = ({ label, placeholder, type = "text", ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    {" "}
    <label className="text-[14px] font-bold text-gray-800">{label}</label>{" "}
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent placeholder:text-gray-400"
      {...props}
    />{" "}
  </div>
);

const TextAreaField = ({ label, placeholder, rows = 4, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[14px] font-bold text-gray-800">{label}</label>
    <textarea
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent placeholder:text-gray-400"
      {...props}
    />
  </div>
);

const steps = [
  { id: 1, name: "Informasi Lowongan" },
  { id: 2, name: "Kualifikasi" },
  // { id: 3, name: "Detail Pekerjaan" },
  { id: 3, name: "Publikasi" },
];

export default function AddLowonganPage() {
  const [step, setStep] = useState(1);
  const [jobType, setJobType] = useState("shift");
  const [portfolio, setPortfolio] = useState("wajib");
  // const [activeTab, setActiveTab] = useState("shift");
  // const [shiftType, setShiftType] = useState("pagi");
  const [jamKerja, setJamKerja] = useState<"pagi" | "siang" | "malam">("pagi");
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<string[]>([""]);

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const addTaskProject = () => {
    setTasks([...tasks, ""]);
  };

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks.length ? newTasks : [""]);
  };


  const renderStep1 = () => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="rounded-[16px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 md:p-8">
        <h3 className="text-[18px] font-extrabold text-gray-900 mb-6">
          Informasi Dasar Lowongan
        </h3>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Judul Lowongan"
              placeholder="Judul lowongan pekerjaan"
            />
            <InputField
              label="Bidang Pekerjaan"
              placeholder="Contoh: Keuangan, Desain, Marketing"
            />
          </div>
          <TextAreaField
            label="Deskripsi Pekerjaan"
            placeholder="Jelaskan tugas, tanggung jawab, jam kerja, dan aktivitas utama pekerjaan ini"
            rows={3}
          />

          <div className="mt-2">
            <label className="text-[14px] font-bold text-gray-800 mb-3 block">
              Jenis Lowongan Pekerjaan
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`cursor-pointer border rounded-xl p-4 flex gap-3 transition-colors ${jobType === "project" ? "border-[#3B82F6] bg-blue-50/20" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name="jobType"
                    value="project"
                    checked={jobType === "project"}
                    onChange={() => setJobType("project")}
                    className="w-4 h-4 text-[#3B82F6] border-gray-300 focus:ring-[#3B82F6]"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-gray-900 mb-1">
                    Berbasis Proyek
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Lowongan berbasis proyek berisi tugas-tugas di dalamnya yang
                    akan dilacak melalui fitur task track.
                  </p>
                </div>
              </label>
              <label
                className={`cursor-pointer border rounded-xl p-4 flex gap-3 transition-colors ${jobType === "shift" ? "border-[#3B82F6] bg-blue-50/20" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name="jobType"
                    value="shift"
                    checked={jobType === "shift"}
                    onChange={() => setJobType("shift")}
                    className="w-4 h-4 text-[#3B82F6] border-gray-300 focus:ring-[#3B82F6]"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-gray-900 mb-1">
                    Pekerja Harian (Shift)
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Shift Harian digunakan untuk pekerjaan non-proyek seperti
                    koki, kasir, barista.
                  </p>
                </div>
              </label>
              {/* jam kerja */}
              {jobType === "shift" && (
                <div className="mt-2 md:col-span-2">
                  <label className="text-[14px] font-bold text-gray-800 mb-3 block">
                    Jam Kerja
                  </label>
                  <div className="flex gap-3">
                    {(["pagi", "siang", "malam"] as const).map((jam) => (
                      <button
                        key={jam}
                        type="button"
                        onClick={() => setJamKerja(jam)}
                        className={`px-5 py-2 rounded-lg text-xs font-bold border transition-colors capitalize ${
                          jamKerja === jam
                            ? "bg-[#E6F4F1] border-[#99F6E4] text-[#0F766E]"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {jam.charAt(0).toUpperCase() + jam.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* project details */}
              {jobType === "project" && (
                <div className="mt-2 md:col-span-2 flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-[14px] font-bold text-gray-800">
                        Tanggal Mulai Project
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400 text-gray-700"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-[14px] font-bold text-gray-800">
                        Tanggal Akhir Project
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400 text-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[14px] font-bold text-gray-800 mb-3 block">
                      Milestone
                    </label>
                    <div className="flex flex-col gap-3">
                    {tasks.map((task, index) => (
                      <div
                        key={index}
                        className="flex flex-row items-center border border-gray-200 px-4 py-3 rounded-lg bg-white"
                      >
                        <span className="mr-4 text-[11px] font-bold bg-[#0F766E] w-6 h-6 flex items-center justify-center text-white rounded-full shrink-0">
                          {index + 1}
                        </span>

                        <input
                          value={task}
                          onChange={(e) => handleTaskChange(index, e.target.value)}
                          placeholder="Tugas project"
                          className="w-full text-sm focus:outline-none placeholder:text-gray-400 bg-transparent"
                        />

                        <button
                          type="button"
                          className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => removeTask(index)}
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTaskProject}
                      className="w-max bg-white border border-[#99F6E4] text-[#0F766E] rounded-lg mt-2 hover:bg-[#E6F4F1] font-bold text-xs"
                    >
                      <FiPlus className="mr-2" /> Tambah Tugas
                    </Button>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-[16px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 md:p-8">
        <h3 className="text-[18px] font-extrabold text-gray-900 mb-6">
          Informasi Upah
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Upah Minimum (Rp)"
            placeholder="Contoh: 1.500.000"
          />
          <InputField
            label="Upah Maksimum (Rp)"
            placeholder="Contoh: 4.000.000"
          />
        </div>
      </Card>

      <Card className="rounded-[16px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 md:p-8">
        <h3 className="text-[18px] font-extrabold text-gray-900 mb-6">
          Jumlah Pekerja yang Dicari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[14px] font-bold text-gray-800">
              Jumlah <span className="px-1 rounded-sm">Lowongan</span> Kerja
            </label>
            <input
              type="text"
              placeholder="Masukkan jumlah pekerja yang ingin dicari"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[14px] font-bold text-gray-800">
              Batas Waktu Melamar
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tanggal berakhir lowongan"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
              />
              <FiCalendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end mt-2">
        <Button
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-2.5 rounded-lg font-bold text-[14px]"
          onClick={() => setStep(2)}
        >
          Lanjut <FiArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <Card className="rounded-[16px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 md:p-8">
        <h3 className="text-[18px] font-extrabold text-gray-900 mb-6">
          Kualifikasi yang Dicari
        </h3>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              Pendidikan Minimum
            </label>
            <input
              type="text"
              placeholder="Minimal pendidikan yang dibutuhkan"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              Kualifikasi Lowongan
            </label>
            <input
              type="text"
              placeholder="Tuliskan kualifikasi dan kriteria kandidat yang dibutuhkan"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              Keahlian Spesifik
            </label>
            <p className="text-[11px] text-gray-500 -mt-1 mb-1">
              Tambahkan keahlian spesifik yang dibutuhkan
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="bg-[#E6F4F1] text-[#0F766E] px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border border-[#99F6E4] cursor-pointer hover:bg-[#CCFBF1] transition">
                Figma <FiX className="text-[#0F766E]" />
              </span>
              <span className="bg-[#E6F4F1] text-[#0F766E] px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border border-[#99F6E4] cursor-pointer hover:bg-[#CCFBF1] transition">
                Canva <FiX className="text-[#0F766E]" />
              </span>
              <span className="bg-[#E6F4F1] text-[#0F766E] px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border border-[#99F6E4] cursor-pointer hover:bg-[#CCFBF1] transition">
                Adobe Illustrator <FiX className="text-[#0F766E]" />
              </span>
              <span className="bg-white text-gray-500 px-4 py-1.5 rounded-full text-[11px] font-semibold border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition">
                + Keahlian
              </span>
            </div>
          </div>

          <div className="mt-2">
            <label className="text-[14px] font-bold text-gray-800 mb-3 block">
              Persyaratan Portofolio
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`cursor-pointer border rounded-xl p-4 flex gap-3 transition-colors ${portfolio === "wajib" ? "border-[#3B82F6] bg-blue-50/20" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name="portfolio"
                    value="wajib"
                    checked={portfolio === "wajib"}
                    onChange={() => setPortfolio("wajib")}
                    className="w-4 h-4 text-[#3B82F6] border-gray-300 focus:ring-[#3B82F6]"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-gray-900 mb-1">
                    Wajib melampirkan portofolio
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Pelamar wajib melampirkan portofolio sesuai bidang yang
                    dilamar
                  </p>
                </div>
              </label>
              <label
                className={`cursor-pointer border rounded-xl p-4 flex gap-3 transition-colors ${portfolio === "opsional" ? "border-[#3B82F6] bg-blue-50/20" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name="portfolio"
                    value="opsional"
                    checked={portfolio === "opsional"}
                    onChange={() => setPortfolio("opsional")}
                    className="w-4 h-4 text-[#3B82F6] border-gray-300 focus:ring-[#3B82F6]"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-gray-900 mb-1">
                    Opsional
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Portofolio tidak wajib, bisa dilihat dari CV saja.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between mt-2">
        <Button
          variant="outline"
          className="px-6 md:px-8 py-2.5 rounded-lg font-bold text-gray-600 border-gray-300 hover:bg-gray-50 bg-white"
          onClick={() => setStep(1)}
        >
          <FiArrowLeft className="mr-2" /> Kembali
        </Button>
        <Button
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 md:px-8 py-2.5 rounded-lg font-bold text-[14px]"
          onClick={() => setStep(3)}
        >
          Lanjut <FiArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );

  // const renderStep3 = () => (
  //   <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
  //     <div className="grid grid-cols-2 gap-4">
  //       <button
  //         className={`py-3.5 rounded-lg font-bold transition-all text-[15px] ${activeTab === "shift" ? "bg-[#E6F4F1] border border-[#99F6E4] text-[#0F766E]" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm"}`}
  //         onClick={() => setActiveTab("shift")}
  //       >
  //         Shift Harian
  //       </button>
  //       <button
  //         className={`py-3.5 rounded-lg font-bold transition-all text-[15px] ${activeTab === "project" ? "bg-[#E6F4F1] border border-[#99F6E4] text-[#0F766E]" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm"}`}
  //         onClick={() => setActiveTab("project")}
  //       >
  //         Project
  //       </button>
  //     </div>

  //     <Card className="rounded-[16px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 md:p-8">
  //       {activeTab === "shift" ? (
  //         <>
  //           <h3 className="text-[18px] font-extrabold text-gray-900 mb-6">
  //             Detail Shift Harian
  //           </h3>
  //           <div className="flex flex-col gap-5">
  //             <InputField label="Nama Tugas Shift" placeholder="" />
  //             <InputField
  //               label="Nama Pekerja"
  //               placeholder="Pekerja yang ditugaskan pada shift tersebut"
  //             />

  //             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  //               <div className="flex flex-col gap-2 w-full">
  //                 <label className="text-[14px] font-bold text-gray-800">
  //                   Tanggal Shift
  //                 </label>
  //                 <div className="relative">
  //                   <input
  //                     type="text"
  //                     placeholder="02/10/2023"
  //                     className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
  //                   />
  //                   <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  //                 </div>
  //               </div>
  //               <div className="flex flex-col gap-2 w-full">
  //                 <label className="text-[14px] font-bold text-gray-800">
  //                   Waktu Mulai
  //                 </label>
  //                 <div className="relative">
  //                   <input
  //                     type="text"
  //                     placeholder="10:00 AM"
  //                     className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
  //                   />
  //                   <FiClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  //                 </div>
  //               </div>
  //               <div className="flex flex-col gap-2 w-full">
  //                 <label className="text-[14px] font-bold text-gray-800">
  //                   Waktu Selesai
  //                 </label>
  //                 <div className="relative">
  //                   <input
  //                     type="text"
  //                     placeholder="12:00 PM"
  //                     className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] placeholder:text-gray-400"
  //                   />
  //                   <FiClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="flex flex-col gap-2 mt-2">
  //               <label className="text-[14px] font-bold text-gray-800">
  //                 Jenis Shift
  //               </label>
  //               <div className="flex gap-3 mt-1">
  //                 {["Pagi", "Siang", "Malam"].map((type) => (
  //                   <button
  //                     key={type}
  //                     onClick={() => setShiftType(type.toLowerCase())}
  //                     className={`px-5 py-2 rounded-lg text-xs font-bold border transition-colors ${shiftType === type.toLowerCase() ? "bg-[#E6F4F1] border-[#99F6E4] text-[#0F766E]" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
  //                   >
  //                     {type}
  //                   </button>
  //                 ))}
  //               </div>
  //             </div>

  //             <div className="mt-2">
  //               <TextAreaField
  //                 label="Deskripsi Tugas"
  //                 placeholder=""
  //                 rows={4}
  //               />
  //             </div>
  //           </div>
  //         </>
  //       ) : (
  //         <div className="flex flex-col gap-5 py-10 items-center justify-center text-center">
  //           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
  //             <FiClock className="w-8 h-8" />
  //           </div>
  //           <h3 className="text-[18px] font-extrabold text-gray-900">
  //             Detail Project
  //           </h3>
  //           <p className="text-gray-500 text-sm max-w-sm">
  //             Formulir detail project akan ditampilkan di sini. Silakan kembali
  //             ke Shift Harian untuk melihat form yang sesuai desain.
  //           </p>
  //         </div>
  //       )}
  //     </Card>

  //     <div className="flex justify-between mt-2">
  //       <Button
  //         variant="outline"
  //         className="px-6 md:px-8 py-2.5 rounded-lg font-bold text-gray-600 border-gray-300 hover:bg-gray-50 bg-white"
  //         onClick={() => setStep(2)}
  //       >
  //         <FiArrowLeft className="mr-2" /> Kembali
  //       </Button>
  //       <Button
  //         className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 md:px-8 py-2.5 rounded-lg font-bold text-[14px]"
  //         onClick={() => setStep(4)}
  //       >
  //         Lanjut <FiArrowRight className="ml-2" />
  //       </Button>
  //     </div>
  //   </div>
  // );

  const renderStep3 = () => (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
      <Card className="rounded-[16px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-12 text-center min-h-[350px] flex flex-col items-center justify-center bg-white relative overflow-hidden">
        <div className="w-24 h-24 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
          Siap Dipublikasi!
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Semua data lowongan telah lengkap. Pastikan informasi yang Anda
          masukkan sudah benar sebelum dipublikasikan ke para pencari kerja.
        </p>
      </Card>

      <div className="flex justify-between mt-2">
        <Button
          variant="outline"
          className="px-6 md:px-8 py-2.5 rounded-lg font-bold text-gray-600 border-gray-300 hover:bg-gray-50 bg-white"
          onClick={() => setStep(2)}
        >
          <FiArrowLeft className="mr-2" /> Kembali
        </Button>
        <Button
          className="bg-[#0F766E] hover:bg-[#0D645E] text-white px-6 md:px-10 py-2.5 rounded-lg font-bold text-[15px]"
          onClick={() => {
            navigate("/umkm/lowongan");
          }}
        >
          Publikasikan <FiArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardUmkmLayout>
      <div className="w-full min-h-screen bg-[#F8FAFC] pt-[60px]">
        {/* Top Header Background */}
        <div className="bg-[#E2E8F0] pt-10 pb-20 px-4 md:px-8">
          <div className="container mx-auto max-w-5xl">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 cursor-pointer text-[#1E293B] hover:text-black font-extrabold text-xl md:text-[24px] mb-2 transition-colors"
            >
              <FiArrowLeft strokeWidth={3} /> Buka{" "}
              <span className="rounded-sm leading-tight">Lowongan</span>
            </button>
          </div>
        </div>

        {/* Stepper & Content */}
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl -mt-12 pb-24 relative z-10">
          {/* Stepper Card */}
          <div className="w-full bg-white rounded-[14px] shadow-sm border border-gray-100 p-4 md:px-8 md:py-5 mb-8 flex justify-between items-center relative overflow-hidden">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gray-100 -z-10 transform -translate-y-1/2 hidden md:block"></div>

            {steps.map((s) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;

              return (
                <div
                  key={s.id}
                  className="flex flex-col md:flex-row items-center gap-3 bg-white px-1 md:px-4 z-10"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${
                      isActive || isCompleted
                        ? "bg-[#2DD4BF] text-white"
                        : "bg-white border-2 border-gray-200 text-gray-400"
                    }`}
                  >
                    {s.id}
                  </div>
                  <span
                    className={`text-[13px] font-bold hidden sm:block transition-colors duration-300 ${
                      isActive || isCompleted
                        ? "text-[#1E293B]"
                        : "text-gray-400"
                    }`}
                  >
                    {s.name.split(" ").map((word, idx) =>
                      word === "Lowongan" && isActive ? (
                        <span key={idx} className="px-1 rounded-sm">
                          {word}
                        </span>
                      ) : (
                        <span key={idx}> {word}</span>
                      ),
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dynamic Forms */}
          <div className="max-w-4xl mx-auto">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {/* {step === 3 && renderStep3()} */}
            {step === 3 && renderStep3()}
          </div>
        </div>
      </div>
    </DashboardUmkmLayout>
  );
}
