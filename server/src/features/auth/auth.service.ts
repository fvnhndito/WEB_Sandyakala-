import {
  BadRequestError,
  UnauthorizedError,
} from "../../common/utils/AppError.js";
import HashUtil from "../../common/utils/hash.util.js";
import { signToken } from "../../common/utils/jwt.utils.js";
import { AuthRepository } from "./auth.repository.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

export const AuthService = {
  registerUser: async (data: RegisterInput) => {
    const existingUser = await AuthRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new BadRequestError("Email sudah terdaftar");
    }

    const hashedPassword = await HashUtil.hashPassword(data.password);

    await AuthRepository.createUser(data, hashedPassword);

    return {
      fullname: data.fullname,
      email: data.email,
      is_verified: true,
    };
  },

  loginUser: async (data: LoginInput) => {
    const user = await AuthRepository.findUserByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError("Email atau password salah");
    }

    const isPasswordValid = await HashUtil.comparePassword(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Email atau password salah");
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = signToken(tokenPayload);

    const {
      id,
      password,
      is_verified,
      created_at,
      updated_at,
      ...userWithoutPassword
    } = user;

    return {
      user: userWithoutPassword,
      accessToken: token,
    };
  },
};
