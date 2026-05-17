import { Router } from "express";
import { validate } from "../../common/middlewares/validate.js";
import { asyncHandler } from "../../common/middlewares/asyncHandler.js";
import { createJobSchema } from "./job.schema.js";
import JobController from "./job.controller.js";
import { safeGuard } from "../../common/middlewares/safeGuard.js";

const jobRouter = Router();

jobRouter.post(
  "/",
  safeGuard(["UMKM"]),
  validate(createJobSchema),
  asyncHandler(JobController.create),
);

jobRouter.get(
  "/umkm/me",
  safeGuard(["UMKM"]),
  asyncHandler(JobController.getMyJobs),
);

jobRouter.get("/", safeGuard(["USER"]), asyncHandler(JobController.getAll));

jobRouter.get(
  "/:id",
  safeGuard(["USER", "UMKM"]),
  asyncHandler(JobController.getDetail),
);

jobRouter.put(
  "/:id",
  safeGuard(["UMKM"]),
  validate(createJobSchema),
  asyncHandler(JobController.update),
);

jobRouter.delete(
  "/:id",
  safeGuard(["UMKM"]),
  asyncHandler(JobController.delete),
);

export default jobRouter;
