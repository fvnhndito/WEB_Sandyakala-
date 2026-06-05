import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { BadRequestError } from "../../common/utils/AppError.js";

export const AuthController = {
  register: async (req: Request, res: Response) => {
    const user = await AuthService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: user,
    });
  },

  login: async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: result,
    });
  },

  getMe: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const user = await AuthService.getMe(userId);

    res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan data user",
      data: user,
    });
  },
};
