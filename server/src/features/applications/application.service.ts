import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../common/utils/AppError.js";
import pool from "../../config/db.js";
import ApplicationRepository from "./application.repository.js";

const ApplicationService = {
  applyForJob: async (userId: number, jobId: number) => {
    const [fgRows]: any = await pool.execute(
      "SELECT id, status FROM fg_profiles WHERE user_id = ?",
      [userId],
    );
    if (fgRows.length === 0)
      throw new BadRequestError("Anda harus melengkapi profil terlebih dahulu.");
    if (fgRows[0].status !== "APPROVED")
      throw new BadRequestError("Profil Anda masih dalam tahap verifikasi.");

    const [jobRows]: any = await pool.execute(
      "SELECT id, deadline FROM jobs WHERE id = ?",
      [jobId],
    );
    if (jobRows.length === 0) throw new NotFoundError("Lowongan tidak ditemukan.");
    if (new Date() > new Date(jobRows[0].deadline))
      throw new BadRequestError("Lowongan sudah ditutup.");

    const hasApplied = await ApplicationRepository.checkAlreadyApplied(userId, jobId);
    if (hasApplied) throw new BadRequestError("Anda sudah melamar ke lowongan ini.");

    return await ApplicationRepository.applyJob(userId, jobId);
  },

  getUmkmApplicants: async (userId: number, query: any) => {
    const umkmId = await getVerifiedUmkmId(userId);
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 50);
    const offset = (page - 1) * limit;
    const result = await ApplicationRepository.getApplicantsByUmkm(umkmId, limit, offset);
    return {
      applicants: result.data,
      meta: {
        page,
        limit,
        total_data: result.total,
        total_pages: Math.ceil(result.total / limit),
      },
    };
  },

  rejectApplication: async (userId: number, applicationId: number, reason: string) => {
    const umkmId = await getVerifiedUmkmId(userId);
    const app = await ApplicationRepository.getApplicationById(applicationId);
    if (!app) throw new NotFoundError("Lamaran tidak ditemukan.");
    await verifyUmkmOwnsApplication(app, umkmId);
    await ApplicationRepository.updateStatus(applicationId, "REJECTED", reason);
    return true;
  },

  scheduleInterview: async (
  userId: number,
  applicationId: number,
  data: { 
    date: string; 
    startTime: string; 
    endTime: string; 
    type: string; 
    link: string; 
    notes: string 
  },
) => {
  const umkmId = await getVerifiedUmkmId(userId);
  const app = await ApplicationRepository.getApplicationById(applicationId);
  if (!app) throw new NotFoundError("Lamaran tidak ditemukan.");
  await verifyUmkmOwnsApplication(app, umkmId);
  await ApplicationRepository.updateStatus(applicationId, "INTERVIEW");
  await ApplicationRepository.createInterview({ applicationId, ...data });
  return true;
},

  acceptApplicant: async (userId: number, applicationId: number) => {
    const umkmId = await getVerifiedUmkmId(userId);
    const app = await ApplicationRepository.getApplicationById(applicationId);
    if (!app) throw new NotFoundError("Lamaran tidak ditemukan.");
    await verifyUmkmOwnsApplication(app, umkmId);
    await ApplicationRepository.updateStatus(applicationId, "ACCEPTED");
    await ApplicationRepository.createEmployee(applicationId); 
    return true;
  },

  getInterviews: async (userId: number) => {
    const umkmId = await getVerifiedUmkmId(userId);
    return await ApplicationRepository.getInterviewsByUmkm(umkmId);
  },

  getWorkers: async (userId: number) => {
    const umkmId = await getVerifiedUmkmId(userId);
    return await ApplicationRepository.getWorkersByUmkm(umkmId);
  },

  updateInterviewStatus: async (userId: number, interviewId: number, status: string) => {
    const umkmId = await getVerifiedUmkmId(userId);
    const [rows]: any = await pool.execute(
      `SELECT i.id FROM interviews i
       JOIN applications a ON i.application_id = a.id
       JOIN jobs j ON a.job_id = j.id
       WHERE i.id = ? AND j.umkm_id = ?`,
      [interviewId, umkmId],
    );
    if (!rows.length)
      throw new UnauthorizedError("Anda tidak berhak mengakses interview ini.");
    await ApplicationRepository.updateInterviewStatus(interviewId, status);
    return true;
  },

  updateEmployeeStatus: async (
  userId: number,
  employeeId: number,
  status: string
) => {
  await getVerifiedUmkmId(userId);

  const updated =
    await ApplicationRepository.updateEmployeeStatus(
      employeeId,
      status
    );

  if (!updated) {
    throw new NotFoundError("Data pekerja tidak ditemukan.");
  }

  return true;
},
};

async function getVerifiedUmkmId(userId: number): Promise<number> {
  const [rows]: any = await pool.execute(
    "SELECT id_umkm AS id, status FROM umkm_profiles WHERE user_id = ?",
    [userId],
  );
  if (rows.length === 0)
    throw new UnauthorizedError("Anda belum mendaftar sebagai UMKM.");
  if (rows[0].status !== "APPROVED")
    throw new BadRequestError("Profil UMKM belum diverifikasi.");
  return rows[0].id;
}

async function verifyUmkmOwnsApplication(app: any, umkmId: number) {
  const [jobRows]: any = await pool.execute(
    "SELECT umkm_id FROM jobs WHERE id = ?",
    [app.job_id],
  );
  if (!jobRows.length || jobRows[0].umkm_id !== umkmId)
    throw new UnauthorizedError("Anda tidak berhak mengakses lamaran ini.");
}

export default ApplicationService;