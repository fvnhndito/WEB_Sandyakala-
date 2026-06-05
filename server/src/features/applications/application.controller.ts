import type { Request, Response } from "express";
import { BadRequestError } from "../../common/utils/AppError.js";
import ApplicationService from "./application.service.js";

const ApplicationController = {
  apply: async (req: Request, res: Response) => {
    const jobId = Number(req.params.jobId);
    if (isNaN(jobId)) throw new BadRequestError("ID Lowongan tidak valid");
    const userId = Number(req.user!.id);
    await ApplicationService.applyForJob(userId, jobId);
    res.status(201).json({ success: true, message: "Lamaran berhasil dikirim!" });
  },

updateEmployeeStatus: async (req: Request, res: Response) => {
  const employeeId = Number(req.params.id);

  if (isNaN(employeeId))
    throw new BadRequestError("ID pekerja tidak valid");

  const userId = Number(req.user!.id);
  const { status } = req.body;

  if (!status)
    throw new BadRequestError("Status wajib diisi.");

  await ApplicationService.updateEmployeeStatus(
    userId,
    employeeId,
    status,
  );

  res.status(200).json({
    success: true,
    message: "Status pekerja berhasil diperbarui.",
  });
},

  getUmkmApplicants: async (req: Request, res: Response) => {
    const userId = Number(req.user!.id);
    const result = await ApplicationService.getUmkmApplicants(userId, req.query);
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil daftar pelamar",
      data: result.applicants,
      meta: result.meta,
    });
  },

  // Tolak lamaran
  rejectApplication: async (req: Request, res: Response) => {
  const applicationId = Number(req.params.id);
  if (isNaN(applicationId)) throw new BadRequestError("ID Lamaran tidak valid");
  const userId = Number(req.user!.id);
  const { reason } = req.body;

  if (!reason || reason.trim() === "") {
    throw new BadRequestError("Alasan penolakan wajib diisi.");
  }

  await ApplicationService.rejectApplication(userId, applicationId, reason.trim());
  res.status(200).json({ success: true, message: "Lamaran berhasil ditolak." });
},

  // Jadwalkan interview
  scheduleInterview: async (req: Request, res: Response) => {
  const applicationId = Number(req.params.id);
  if (isNaN(applicationId)) throw new BadRequestError("ID Lamaran tidak valid");

  const userId = Number(req.user!.id);
  const { date, startTime, endTime, type, link, notes } = req.body;

  // Validasi field wajib
  if (!date) throw new BadRequestError("Tanggal wajib diisi.");
  if (!startTime) throw new BadRequestError("Waktu mulai wajib diisi.");
  if (!endTime) throw new BadRequestError("Waktu selesai wajib diisi.");
  if (!type) throw new BadRequestError("Metode interview wajib diisi.");

  // Validasi enum type
  const VALID_TYPES = ["google_meet", "tatap_muka"];
  if (!VALID_TYPES.includes(type)) {
    throw new BadRequestError("Metode interview tidak valid.");
  }

  // Validasi link/lokasi wajib diisi
  if (!link) throw new BadRequestError(
    type === "google_meet" ? "Link Google Meet wajib diisi." : "Lokasi wajib diisi."
  );

  // Validasi waktu selesai harus setelah waktu mulai
  if (startTime >= endTime) {
    throw new BadRequestError("Waktu selesai harus lebih dari waktu mulai.");
  }

  await ApplicationService.scheduleInterview(userId, applicationId, {
    date,
    startTime,
    endTime,
    type,
    link,
    notes: notes ?? "",
  });

  res.status(200).json({ success: true, message: "Jadwal interview berhasil dibuat." });
},

  // Terima sebagai pekerja
  acceptApplicant: async (req: Request, res: Response) => {
    const applicationId = Number(req.params.id);
    if (isNaN(applicationId)) throw new BadRequestError("ID Lamaran tidak valid");
    const userId = Number(req.user!.id);
    await ApplicationService.acceptApplicant(userId, applicationId);
    res.status(200).json({ success: true, message: "Pelamar berhasil diterima sebagai pekerja." });
  },

  // Ambil daftar interview
  getInterviews: async (req: Request, res: Response) => {
    const userId = Number(req.user!.id);
    const data = await ApplicationService.getInterviews(userId);
    res.status(200).json({ success: true, message: "Berhasil mengambil data interview", data });
  },

  getWorkers: async (req: Request, res: Response) => {
  const userId = Number(req.user!.id);
  const data = await ApplicationService.getWorkers(userId);
  res.status(200).json({ success: true, message: "Berhasil mengambil data pekerja", data });
},

  updateInterviewStatus: async (req: Request, res: Response) => {
  const interviewId = Number(req.params.id);
  if (isNaN(interviewId)) throw new BadRequestError("ID Interview tidak valid");
  const userId = Number(req.user!.id);
  const { status } = req.body;
  if (!status) throw new BadRequestError("Status wajib diisi.");
  await ApplicationService.updateInterviewStatus(userId, interviewId, status);
  res.status(200).json({ success: true, message: "Status interview berhasil diperbarui." });
},
};

export default ApplicationController;