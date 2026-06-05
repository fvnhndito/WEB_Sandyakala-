import { Router } from "express";
import { asyncHandler } from "../../common/middlewares/asyncHandler.js";
import ApplicationController from "./application.controller.js";
import { safeGuard } from "../../common/middlewares/safeGuard.js";

const applicationRouter = Router();

applicationRouter.get(
  "/umkm",
  safeGuard(["UMKM"]),
  asyncHandler(ApplicationController.getUmkmApplicants),
);

applicationRouter.get(
  "/umkm/interviews",
  safeGuard(["UMKM"]),
  asyncHandler(ApplicationController.getInterviews),
);

applicationRouter.get(
  "/umkm/workers",
  safeGuard(["UMKM"]),
  asyncHandler(ApplicationController.getWorkers),
);

applicationRouter.patch(
  "/interviews/:id/status",
  safeGuard(["UMKM"]),
  asyncHandler(ApplicationController.updateInterviewStatus),
);

applicationRouter.post(
  "/:jobId/apply",
  safeGuard(["USER"]),
  asyncHandler(ApplicationController.apply),
);

applicationRouter.patch(
  "/:id/reject",
  safeGuard(["UMKM"]),
  asyncHandler(ApplicationController.rejectApplication),
);

applicationRouter.post(
  "/:id/schedule-interview",
  safeGuard(["UMKM"]),
  asyncHandler(ApplicationController.scheduleInterview),
);

applicationRouter.patch(
  "/:id/accept",
  safeGuard(["UMKM"]),
  asyncHandler(ApplicationController.acceptApplicant),
);

applicationRouter.patch(
  "/workers/:id/status",
  safeGuard(["UMKM"]),
  asyncHandler(ApplicationController.updateEmployeeStatus),
);

export default applicationRouter;