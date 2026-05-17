import type { Request, Response } from "express";
import JobService from "./job.service.js";
import { BadRequestError } from "../../common/utils/AppError.js";

const JobController = {
  create: async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const jobId = await JobService.createJob(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Lowongan pekerjaan berhasil dipublikasikan",
      data: {
        job_id: jobId,
      },
    });
  },

  getDetail: async (req: Request, res: Response) => {
    const jobId = Number(req.params.id);

    if (isNaN(jobId)) {
      throw new BadRequestError("ID Lowongan tidak valid");
    }

    const jobDetail = await JobService.getJobDetail(jobId);

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil detail lowongan",
      data: jobDetail,
    });
  },

  getAll: async (req: Request, res: Response) => {
    const result = await JobService.getAllJobs(req.query);

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil daftar lowongan",
      data: result.jobs,
      meta: result.meta,
    });
  },

  getMyJobs: async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const result = await JobService.getUmkmJobs(userId, req.query);

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil daftar lowongan Anda",
      data: result.jobs,
      meta: result.meta,
    });
  },

  update: async (req: Request, res: Response) => {
    const jobId = Number(req.params.id);
    if (isNaN(jobId)) throw new BadRequestError("ID Lowongan tidak valid");

    const userId = req.user!.id;

    await JobService.updateJob(jobId, userId, req.body);

    res.status(200).json({
      success: true,
      message: "Lowongan pekerjaan berhasil diperbarui",
    });
  },

  delete: async (req: Request, res: Response) => {
    const jobId = Number(req.params.id);
    if (isNaN(jobId)) throw new BadRequestError("ID Lowongan tidak valid");

    const userId = req.user!.id;

    await JobService.deleteJob(jobId, userId);

    res.status(200).json({
      success: true,
      message: "Lowongan pekerjaan berhasil dihapus",
    });
  },
};

export default JobController;
