import { BadRequestError } from "../../common/utils/AppError.js";
import CloudinaryUtil from "../../common/utils/cloudinary.js";
import { AppConfig } from "../../config/app.js";
import FreshGraduateRepository from "./freshgraduate.repository.js";

const FreshGraduateService = {
  getAllProfiles: async () => {
    return await FreshGraduateRepository.findAll();
  },

  getProfileByEmail: async (email: string) => {
    const profile = await FreshGraduateRepository.findByEmail(email);
    if (!profile) {
      throw new BadRequestError("Profil Fresh Graduate tidak ditemukan");
    }
    return profile;
  },

  updateProfileStatus: async (id: number, status: string, rejectionReason: string | null) => {
    const upperStatus = status.toUpperCase();
    if (!["APPROVED", "REJECTED", "PENDING"].includes(upperStatus)) {
      throw new BadRequestError("Status verifikasi tidak valid");
    }

    const profile = await FreshGraduateRepository.findById(id);
    if (!profile) {
      throw new BadRequestError("Profil Fresh Graduate tidak ditemukan");
    }

    await FreshGraduateRepository.updateStatus(id, upperStatus, rejectionReason || null);

    return { id, status: upperStatus };
  },

  getMyProfile: async (userId: number) => {
    const profile = await FreshGraduateRepository.findByUserId(userId);
    return profile || null;
  },

  upsertProfile: async (
    userId: number,
    data: { lastEducation: string; phone: string },
    files: any
  ) => {
    if (!files || !files.cv || !files.ktp) {
      throw new BadRequestError("Dokumen CV dan KTP wajib diunggah.");
    }

    // Upload CV
    const cvUrl = await CloudinaryUtil.uploadFile(
      files.cv[0],
      AppConfig.CLOUDINARY_FOLDER
    );

    // Upload KTP
    const ktpUrl = await CloudinaryUtil.uploadFile(
      files.ktp[0],
      AppConfig.CLOUDINARY_FOLDER
    );

    // Optional Upload Portfolio
    let portfolioUrl = undefined;
    if (files.portfolio && files.portfolio[0]) {
      portfolioUrl = await CloudinaryUtil.uploadFile(
        files.portfolio[0],
        AppConfig.CLOUDINARY_FOLDER
      );
    }

    // Optional Upload Profile Pic
    let profilePicUrl = undefined;
    if (files.profile_pic && files.profile_pic[0]) {
      profilePicUrl = await CloudinaryUtil.uploadFile(
        files.profile_pic[0],
        AppConfig.CLOUDINARY_FOLDER
      );
    }

    const fileUrls = {
      cvUrl,
      ktpUrl,
      portfolioUrl: portfolioUrl || null,
      profilePic: profilePicUrl || null,
    };

    try {
      const profileId = await FreshGraduateRepository.upsertProfile(userId, data, fileUrls);
      return {
        profile_id: profileId,
        status: "PENDING",
      };
    } catch (error) {
      console.log("Database save failed. Rolling back Cloudinary uploads...");
      await Promise.all([
        CloudinaryUtil.deleteFile(cvUrl, AppConfig.CLOUDINARY_FOLDER),
        CloudinaryUtil.deleteFile(ktpUrl, AppConfig.CLOUDINARY_FOLDER),
        portfolioUrl ? CloudinaryUtil.deleteFile(portfolioUrl, AppConfig.CLOUDINARY_FOLDER) : Promise.resolve(),
        profilePicUrl ? CloudinaryUtil.deleteFile(profilePicUrl, AppConfig.CLOUDINARY_FOLDER) : Promise.resolve(),
      ]);
      throw error;
    }
  },
};

export default FreshGraduateService;
