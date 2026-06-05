import { Router } from "express";
import authRoute from "../features/auth/auth.routes.js";
import umkmRouter from "../features/umkm/umkm.routes.js";
import { safeGuard } from "../common/middlewares/safeGuard.js";
import skillRouter from "../features/skills/skill.route.js";
import jobRouter from "../features/jobs/job.route.js";
import applicationRouter from "../features/applications/application.route.js";
import taskRoutes from "../features/tasks/task.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/umkm", safeGuard(["USER", "UMKM", "ADMIN"]), umkmRouter);
router.use("/skills", safeGuard(["UMKM"]), skillRouter);
router.use("/jobs", jobRouter); // safeGuard diterapkan di dalam job.route.ts
router.use("/applications", applicationRouter); // safeGuard diterapkan di dalam application.route.ts
router.use("/tasks", taskRoutes)

export default router;
