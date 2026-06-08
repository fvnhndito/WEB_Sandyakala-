import { Router } from "express";
import { asyncHandler } from "../../common/middlewares/asyncHandler.js";
import { uploadMiddleware } from "../../common/middlewares/upload.js";
import { safeGuard } from "../../common/middlewares/safeGuard.js";
import FreshGraduateController from "./freshgraduate.controller.js";

const freshGraduateRouter = Router();

// Admin Endpoints
freshGraduateRouter.get(
  "/",
  safeGuard(["ADMIN"]),
  asyncHandler(FreshGraduateController.list),
);

freshGraduateRouter.get(
  "/detail/:email",
  safeGuard(["ADMIN"]),
  asyncHandler(FreshGraduateController.detail),
);

freshGraduateRouter.patch(
  "/:id/status",
  safeGuard(["ADMIN"]),
  asyncHandler(FreshGraduateController.updateStatus),
);

// Mobile / Fresh Graduate User Endpoints
freshGraduateRouter.get(
  "/my-profile",
  safeGuard(["USER"]),
  asyncHandler(FreshGraduateController.myProfile),
);

freshGraduateRouter.post(
  "/profile",
  safeGuard(["USER"]),
  uploadMiddleware.fields([
    { name: "cv", maxCount: 1 },
    { name: "ktp", maxCount: 1 },
    { name: "portfolio", maxCount: 1 },
    { name: "profile_pic", maxCount: 1 },
  ]),
  asyncHandler(FreshGraduateController.upsertProfile),
);

export default freshGraduateRouter;
