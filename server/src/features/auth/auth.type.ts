import type { RowDataPacket } from "mysql2";

export interface UserType extends RowDataPacket {
  id: number;
  fullname: string;
  email: string;
  password: string;
  role: "ADMIN" | "UMKM" | "USER";
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}
