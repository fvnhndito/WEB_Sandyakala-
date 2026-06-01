import type { Request, Response } from "express";
import UmkmService from "./umkm.service.js";

const UmkmController = {
  register: async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await UmkmService.registerUmkm(
      Number(userId),
      req.body,
      req.files,
    );

    res.status(201).json({
      success: true,
      message:
        "Pendaftaran UMKM berhasil. Profil Anda sedang dalam proses verifikasi.",
      data: result,
    });
  },

  myProfile: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await UmkmService.getUmkmByUserId(Number(userId));
    res.status(200).json({
      success: true,
      data: result || null,
    });
  },

  list: async (_: Request, res: Response) => {
    const result = await UmkmService.getAllUmkm();
    res.status(200).json({
      success: true,
      data: result,
    });
  },

  updateStatus: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await UmkmService.updateUmkmStatus(Number(id), status);
    res.status(200).json({
      success: true,
      message: `Status verifikasi akun berhasil diubah menjadi ${status}.`,
      data: result,
    });
  },
};

export default UmkmController;
