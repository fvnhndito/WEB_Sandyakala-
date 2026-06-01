import type { Request, Response } from "express";
import TaskService from "./task.service.js";
import type { SubmitTaskInput, ReviewTaskInput } from "./task.schema.js";

const TaskController = {
  // [UMKM] Mengambil daftar tugas berdasarkan ID Lowongan
  getTasksByJob: async (req: Request, res: Response) => {
    try {
      const jobId = Number(req.params.jobId);

      if (isNaN(jobId)) {
        res.status(400).json({ success: false, message: "ID Lowongan tidak valid" });
        return;
      }

      const tasks = await TaskService.getTasksByJobId(jobId);

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil daftar tugas",
        data: tasks,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  },

  // [FG] Freshgraduate mengirim hasil kerja
  submitTask: async (req: Request, res: Response) => {
    try {
      const taskId = Number(req.params.taskId);

      if (isNaN(taskId)) {
        res.status(400).json({ success: false, message: "ID Tugas tidak valid" });
        return;
      }

      const data = req.body as SubmitTaskInput;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: token tidak ditemukan",
        });
        return;
      }

      await TaskService.submitTask(taskId, userId, data);

      res.status(200).json({
        success: true,
        message: "Tugas berhasil dikirim, menunggu tinjauan UMKM.",
      });
    } catch (error: any) {
      if (
        error.message?.includes("Akses ditolak") ||
        error.message?.includes("tidak terdaftar")
      ) {
        res.status(403).json({ success: false, message: error.message });
      } else if (
        error.message?.includes("tidak ditemukan") ||
        error.message?.includes("sudah selesai")
      ) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat mengirim tugas",
        });
      }
    }
  },

  // [UMKM] UMKM meninjau tugas (setujui atau minta revisi)
  reviewTask: async (req: Request, res: Response) => {
    try {
      const taskId = Number(req.params.taskId);

      if (isNaN(taskId)) {
        res.status(400).json({ success: false, message: "ID Tugas tidak valid" });
        return;
      }

      const data = req.body as ReviewTaskInput;

      await TaskService.reviewTask(taskId, data);

      res.status(200).json({
        success: true,
        message: data.is_approved
          ? "Tugas berhasil disetujui."
          : "Catatan revisi berhasil dikirim ke pekerja.",
      });
    } catch (error: any) {
      if (
        error.message?.includes("tidak ditemukan") ||
        error.message?.includes("tidak dalam status")
      ) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat meninjau tugas",
        });
      }
    }
  },

  // [UMKM & FG] Mengambil riwayat revisi sebuah tugas
  getRevisions: async (req: Request, res: Response) => {
    try {
      const taskId = Number(req.params.taskId);

      if (isNaN(taskId)) {
        res.status(400).json({ success: false, message: "ID Tugas tidak valid" });
        return;
      }

      const revisions = await TaskService.getTaskRevisions(taskId);

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil riwayat revisi",
        data: revisions,
      });
    } catch (error: any) {
      if (error.message?.includes("tidak ditemukan")) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat mengambil riwayat revisi",
        });
      }
    }
  },
};

export default TaskController;
