import pool from "../../config/db.js";
import type { RegisterUmkmInput } from "./umkm.schema.js";

const UmkmRepository = {
  createUmkmProfileAndDocs: async (
    userId: number,
    data: RegisterUmkmInput,
    files: { logo_url: string; ktp_url: string; nib_file_url: string },
  ) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const queryProfile = `
        INSERT INTO umkm_profiles 
        (user_id, owner_name, nib, business_name, business_category, employee_count, established_at, province, regency, district, subdistrict, website_sosmed, business_email, business_phone, status, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', NOW())
      `;

      const [profileResult] = await connection.execute(queryProfile, [
        userId,
        data.owner_name,
        data.nib,
        data.business_name,
        data.business_category,
        data.employee_count,
        data.established_at,
        data.province,
        data.regency,
        data.district,
        data.subdistrict,
        data.website_sosmed || null,
        data.business_email,
        data.business_phone,
      ]);

      const umkmId = (profileResult as any).insertId;

      const queryDocs = `
        INSERT INTO umkm_documents 
        (umkm_id, logo_url, ktp_url, nib_file_url, created_at) 
        VALUES (?, ?, ?, ?, NOW())
      `;

      await connection.execute(queryDocs, [
        umkmId,
        files.logo_url,
        files.ktp_url,
        files.nib_file_url,
      ]);

      await connection.commit();
      return umkmId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  checkNibExists: async (nib: string): Promise<boolean> => {
    const [rows]: any = await pool.execute(
      "SELECT id_umkm FROM umkm_profiles WHERE nib = ?",
      [nib],
    );
    return rows.length > 0;
  },
};

export default UmkmRepository;
