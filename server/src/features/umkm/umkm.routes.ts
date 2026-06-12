import { Router } from "express";
import { asyncHandler } from "../../common/middlewares/asyncHandler.js";
import { uploadMiddleware } from "../../common/middlewares/upload.js";
import { validate } from "../../common/middlewares/validate.js";
import UmkmController from "./umkm.controller.js";
import { registerUmkmSchema } from "./umkm.schema.js";

const umkmRouter = Router();

umkmRouter.post(
  "/register",
  uploadMiddleware.fields([
    { name: "logo", maxCount: 1 },
    { name: "ktp", maxCount: 1 },
    { name: "nib_document", maxCount: 1 },
  ]),
  validate(registerUmkmSchema),
  asyncHandler(UmkmController.register),
);

umkmRouter.get(
  "/my-profile",
  asyncHandler(UmkmController.myProfile),
);

umkmRouter.get(
  "/",
  asyncHandler(UmkmController.list),
);

umkmRouter.patch(
  "/:id/status",
  asyncHandler(UmkmController.updateStatus),
);

umkmRouter.get(
  "/benefits",
  asyncHandler(UmkmController.getBenefits),
);
 
umkmRouter.post(
  "/benefits",
  asyncHandler(UmkmController.addBenefit),
);
 
umkmRouter.delete(
  "/benefits/:benefitId",
  asyncHandler(UmkmController.deleteBenefit),
);
 
umkmRouter.patch(
  "/description",
  asyncHandler(UmkmController.updateDescription),
);
 
umkmRouter.get(
  "/reviews",
  asyncHandler(UmkmController.getReviews),
);

export default umkmRouter;
