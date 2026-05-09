import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

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
};
