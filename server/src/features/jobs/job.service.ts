import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../common/utils/AppError.js";
import pool from "../../config/db.js";
import JobRepository from "./job.repository.js";
import type { CreateJobInput } from "./job.schema.js";

// helper function
const getVerifiedUmkmId = async (
  userId: string | number,
  requireApproved: boolean = false,
): Promise<number> => {
  const [umkmRows]: any = await pool.execute(
    "SELECT id_umkm AS id, status FROM umkm_profiles WHERE user_id = ?",
    [userId],
  );

  if (umkmRows.length === 0) {
    throw new UnauthorizedError(
      "Akses ditolak. Anda belum mendaftar sebagai UMKM.",
    );
  }

  if (requireApproved && umkmRows[0].status !== "APPROVED") {
    throw new BadRequestError(
      "Data/Profil UMKM Anda tidak aktif atau sedang dalam tahap verifikasi Admin.",
    );
  }

  return umkmRows[0].id;
};

const JobService = {
  createJob: async (userId: number, data: CreateJobInput) => {
    const umkmId = await getVerifiedUmkmId(userId, true);

    const cleanSkills = data.skills
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    const uniqueSkills = [...new Set(cleanSkills)];

    if (uniqueSkills.length === 0) {
      throw new BadRequestError(
        "Keahlian/Skills tidak boleh kosong setelah divalidasi",
      );
    }

    const jobId = await JobRepository.createJob(umkmId, data, uniqueSkills);

    return jobId;
  },

  getJobDetail: async (jobId: number) => {
    const jobDetail = await JobRepository.getJobById(jobId);

    if (!jobDetail) {
      throw new NotFoundError("Lowongan pekerjaan tidak ditemukan.");
    }

    return jobDetail;
  },

  getAllJobs: async (query: any) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const offset = (page - 1) * limit;

    const filters = {
      search: query.search || undefined,
      type: query.type || undefined, // Contoh: 'SHIFT' atau 'PROJECT'
      shift: query.shift || undefined, // Contoh: 'PAGI' atau 'MALAM'
      limit,
      offset,
    };

    const result = await JobRepository.getAllJobs(filters);

    return {
      jobs: result.data,
      meta: {
        page,
        limit,
        total_data: result.total,
        total_pages: Math.ceil(result.total / limit),
      },
    };
  },

  getUmkmJobs: async (userId: string | number, query: any) => {
    const umkmId = await getVerifiedUmkmId(userId, false);

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const offset = (page - 1) * limit;

    const result = await JobRepository.getJobsByUmkmId(umkmId, limit, offset);

    return {
      jobs: result.data,
      meta: {
        page,
        limit,
        total_data: result.total,
        total_pages: Math.ceil(result.total / limit),
      },
    };
  },

  updateJob: async (
    jobId: number,
    userId: string | number,
    data: CreateJobInput,
  ) => {
    const umkmId = await getVerifiedUmkmId(userId, true);

    const cleanSkills = data.skills
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
    const uniqueSkills = [...new Set(cleanSkills)];

    if (uniqueSkills.length === 0) {
      throw new BadRequestError(
        "Keahlian/Skills tidak boleh kosong setelah divalidasi",
      );
    }

    try {
      await JobRepository.updateJob(jobId, umkmId, data, uniqueSkills);
    } catch (error: any) {
      if (error.message === "NOT_FOUND_OR_UNAUTHORIZED") {
        throw new NotFoundError(
          "Lowongan tidak ditemukan atau Anda tidak berhak mengeditnya.",
        );
      }
      throw error;
    }

    return true;
  },

  deleteJob: async (jobId: number, userId: string | number) => {
    const umkmId = await getVerifiedUmkmId(userId, true);

    try {
      await JobRepository.deleteJob(jobId, umkmId);
    } catch (error: any) {
      if (error.message === "NOT_FOUND_OR_UNAUTHORIZED") {
        throw new NotFoundError(
          "Lowongan tidak ditemukan atau Anda tidak berhak menghapusnya.",
        );
      }
      throw error;
    }

    return true;
  },
};

export default JobService;
