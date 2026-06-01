import { Router } from "express";
import TaskController from "./task.controller.js";
import { validate } from "../../common/middlewares/validate.js";
import { asyncHandler } from "../../common/middlewares/asyncHandler.js";
import { submitTaskSchema, reviewTaskSchema } from "./task.schema.js";
import { safeGuard } from "../../common/middlewares/safeGuard.js";

const router = Router();

// [UMKM] Melihat daftar tugas berdasarkan Job ID
// GET /api/tasks/job/:jobId
router.get(
  "/job/:jobId",
  safeGuard(["UMKM"]),
  asyncHandler(TaskController.getTasksByJob),
);

// [UMKM & FG] Melihat riwayat revisi sebuah tugas
// GET /api/tasks/:taskId/revisions
router.get(
  "/:taskId/revisions",
  safeGuard(["UMKM", "USER"]),
  asyncHandler(TaskController.getRevisions),
);

// [UMKM] Memberikan review (setujui/revisi)
// PUT /api/tasks/:taskId/review
router.put(
  "/:taskId/review",
  safeGuard(["UMKM"]),
  validate(reviewTaskSchema),
  asyncHandler(TaskController.reviewTask),
);

// [FG] Mengirim hasil kerja
// PUT /api/tasks/:taskId/submit
router.put(
  "/:taskId/submit",
  safeGuard(["USER"]),
  validate(submitTaskSchema),
  asyncHandler(TaskController.submitTask),
);

export default router;
