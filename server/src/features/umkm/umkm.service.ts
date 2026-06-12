import { BadRequestError } from "../../common/utils/AppError.js";
import CloudinaryUtil from "../../common/utils/cloudinary.js";
import { AppConfig } from "../../config/app.js";
import UmkmRepository from "./umkm.repository.js";
import type { RegisterUmkmInput } from "./umkm.schema.js";

const UmkmService = {
  registerUmkm: async (userId: number, data: RegisterUmkmInput, files: any) => {
    if (!files || !files.logo || !files.ktp || !files.nib_document) {
      throw new BadRequestError("Documents (logo, ktp, nib) wajib diunggah");
    }

    const logoUrl = await CloudinaryUtil.uploadFile(
      files.logo[0],
      AppConfig.CLOUDINARY_FOLDER,
    );
    const ktpUrl = await CloudinaryUtil.uploadFile(
      files.ktp[0],
      AppConfig.CLOUDINARY_FOLDER,
    );
    const nibUrl = await CloudinaryUtil.uploadFile(
      files.nib_document[0],
      AppConfig.CLOUDINARY_FOLDER,
    );

    const documentUrls = {
      logo_url: logoUrl,
      ktp_url: ktpUrl,
      nib_file_url: nibUrl,
    };

    try {
      if (data.nib) {
        const isNibExists = await UmkmRepository.checkNibExists(data.nib);
        if (isNibExists) {
          throw new BadRequestError(
            "NIB ini sudah terdaftar. Silakan periksa kembali atau gunakan NIB lain.",
          );
        }
      }

      const umkmId = await UmkmRepository.createUmkmProfileAndDocs(
        userId,
        data,
        documentUrls,
      );

      return {
        umkm_id: umkmId,
        status: "PENDING",
      };
    } catch (error) {
      console.log(
        "Terjadi kegagalan di Database. Memulai proses Rollback Cloudinary...",
      );

      await Promise.all([
        CloudinaryUtil.deleteFile(logoUrl, AppConfig.CLOUDINARY_FOLDER),
        CloudinaryUtil.deleteFile(ktpUrl, AppConfig.CLOUDINARY_FOLDER),
        CloudinaryUtil.deleteFile(nibUrl, AppConfig.CLOUDINARY_FOLDER),
      ]);

      throw error;
    }
  },

  getAllUmkm: async () => {
    const umkms = (await UmkmRepository.findAllUmkm()) as any[];
    for (const umkm of umkms) {
      umkm.reviews = await UmkmRepository.getReviewsByUmkmId(umkm.id_umkm);
    }
    return umkms;
  },

  getUmkmByUserId: async (userId: number) => {
    const umkm = await UmkmRepository.findUmkmByUserId(userId);
    if (umkm) {
      umkm.reviews = await UmkmRepository.getReviewsByUmkmId(umkm.id_umkm);
    }
    return umkm;
  },

  updateUmkmStatus: async (umkmId: number, status: string) => {
    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      throw new BadRequestError("Status verifikasi tidak valid");
    }

    const umkm = await UmkmRepository.findUmkmById(umkmId);
    if (!umkm) {
      throw new BadRequestError("Profil UMKM tidak ditemukan");
    }

    await UmkmRepository.updateStatus(umkmId, status);
    
    if (status === "APPROVED") {
      await UmkmRepository.updateUserRole(umkm.user_id, "UMKM");
    } else if (status === "REJECTED" || status === "PENDING") {
      await UmkmRepository.updateUserRole(umkm.user_id, "USER");
    }

    return { umkm_id: umkmId, status };
  },

  getBenefits: async (umkmId: number) => {
    return UmkmRepository.getBenefitsByUmkmId(umkmId);
  },
 
  addBenefit: async (umkmId: number, title: string, description: string) => {
    if (!title || title.trim().length === 0) {
      throw new BadRequestError("Judul fasilitas wajib diisi");
    }
    if (title.trim().length < 3) {
      throw new BadRequestError("Judul fasilitas minimal 3 karakter");
    }
    if (title.trim().length > 100) {
      throw new BadRequestError("Judul fasilitas maksimal 100 karakter");
    }
    if (description && description.trim().length > 500) {
      throw new BadRequestError("Deskripsi fasilitas maksimal 500 karakter");
    }
  
    const insertId = await UmkmRepository.createBenefit(
      umkmId,
      title.trim(),
      description?.trim() || "",
    );
  
    return {
      id_benefit: insertId,
      id_umkm: umkmId,
      title: title.trim(),
      description: description?.trim() || "",
    };
  },
  
  deleteBenefit: async (benefitId: number, umkmId: number) => {
    if (!benefitId || isNaN(benefitId)) {
      throw new BadRequestError("ID fasilitas tidak valid");
    }
    const deleted = await UmkmRepository.deleteBenefit(benefitId, umkmId);
    if (!deleted) {
      throw new BadRequestError("Fasilitas tidak ditemukan atau bukan milik Anda");
    }
    return true;
  },
  
  
  updateDescription: async (umkmId: number, description: string) => {
    if (!description || description.trim().length === 0) {
      throw new BadRequestError("Deskripsi usaha wajib diisi");
    }
    if (description.trim().length < 20) {
      throw new BadRequestError("Deskripsi usaha minimal 20 karakter");
    }
    if (description.trim().length > 2000) {
      throw new BadRequestError("Deskripsi usaha maksimal 2000 karakter");
    }
    await UmkmRepository.updateDescription(umkmId, description.trim());
    return true;
  },
  getReviewsByUmkmId: async (umkmId: number) => {
    return UmkmRepository.getReviewsByUmkmId(umkmId);
  },
};

export default UmkmService;
