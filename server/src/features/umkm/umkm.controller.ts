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

  getBenefits: async (req: Request, res: Response) => {
  const userId = req.user.id;
  const umkm = await UmkmService.getUmkmByUserId(Number(userId));
  if (!umkm) {
    res.status(404).json({ success: false, message: "Profil UMKM tidak ditemukan" });
    return
  }
  const benefits = await UmkmService.getBenefits(umkm.id_umkm);
  res.status(200).json({ success: true, data: benefits });
},
 
addBenefit: async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { title, description } = req.body;
  const umkm = await UmkmService.getUmkmByUserId(Number(userId));
  if (!umkm) {
    res.status(404).json({ success: false, message: "Profil UMKM tidak ditemukan" });
    return;
  }
  const benefit = await UmkmService.addBenefit(umkm.id_umkm, title, description);
  res.status(201).json({ success: true, message: "Fasilitas berhasil ditambahkan", data: benefit });
},
 
deleteBenefit: async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { benefitId } = req.params;
  const umkm = await UmkmService.getUmkmByUserId(Number(userId));
  if (!umkm) {
    res.status(404).json({ success: false, message: "Profil UMKM tidak ditemukan" });
    return;
  }
  await UmkmService.deleteBenefit(Number(benefitId), umkm.id_umkm);
  res.status(200).json({ success: true, message: "Fasilitas berhasil dihapus" });
},
 
 
updateDescription: async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { description } = req.body;
  const umkm = await UmkmService.getUmkmByUserId(Number(userId));
  if (!umkm) {
    res.status(404).json({ success: false, message: "Profil UMKM tidak ditemukan" });
    return;  
  }
  await UmkmService.updateDescription(umkm.id_umkm, description);
  res.status(200).json({ success: true, message: "Deskripsi berhasil diperbarui" });
},

getReviews: async (req: Request, res: Response) => {
  const userId = req.user.id;
  const umkm = await UmkmService.getUmkmByUserId(Number(userId));
  if (!umkm) {
    res.status(404).json({ success: false, message: "Profil UMKM tidak ditemukan" });
    return;  
  }
  const reviews = await UmkmService.getReviewsByUmkmId(umkm.id_umkm);
  res.status(200).json({ success: true, data: reviews });
},
};

export default UmkmController;
