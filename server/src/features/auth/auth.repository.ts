import pool from "../../config/db.js";
import type { RegisterInput } from "./auth.schema.js";

export const AuthRepository = {
  findUserByEmail: async (email: string) => {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.execute(query, [email]);
    const users = rows as any[];
    return users[0];
  },

  createUser: async (user: RegisterInput, hashedPassword: string) => {
    const query = `
      INSERT INTO users 
      (fullname, email, password, role, is_verified, created_at, updated_at) 
      VALUES (?, ?, ?, 'user', true, NOW(), NOW())
    `;

    const [result] = await pool.execute(query, [
      user.fullname,
      user.email,
      hashedPassword,
    ]);

    return result;
  },

  findUserById: async (userId: number) => {
    const [userRows]: any = await pool.execute(
      "SELECT id, fullname, email, role FROM users WHERE id = ?",
      [userId],
    );

    return userRows[0];
  },
};
