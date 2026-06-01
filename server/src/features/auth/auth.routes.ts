import { Router } from "express";
import { asyncHandler } from "../../common/middlewares/asyncHandler.js";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../common/middlewares/validate.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { safeGuard } from "../../common/middlewares/safeGuard.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(AuthController.register),
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(AuthController.login),
);

router.get(
  "/me",
  safeGuard(["USER", "UMKM", "ADMIN"]),
  asyncHandler(AuthController.getMe),
);

export default router;
