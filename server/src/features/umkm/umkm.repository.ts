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

  findAllUmkm: async () => {
    const query = `
      SELECT p.id_umkm, p.user_id, p.owner_name, p.nib, p.business_name, p.business_category, p.employee_count, p.established_at, p.province, p.regency, p.district, p.subdistrict, p.website_sosmed, p.business_email, p.business_phone, p.status, p.created_at,
      d.logo_url, d.ktp_url, d.nib_file_url
      FROM umkm_profiles p
      LEFT JOIN umkm_documents d ON p.id_umkm = d.umkm_id
      ORDER BY p.created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

  findUmkmById: async (umkmId: number) => {
    const query = "SELECT * FROM umkm_profiles WHERE id_umkm = ?";
    const [rows]: any = await pool.execute(query, [umkmId]);
    return rows[0];
  },

  updateStatus: async (umkmId: number, status: string) => {
    const query = "UPDATE umkm_profiles SET status = ? WHERE id_umkm = ?";
    await pool.execute(query, [status, umkmId]);
  },

  findUmkmByUserId: async (userId: number) => {
    const query = `
      SELECT p.*, d.logo_url, d.ktp_url, d.nib_file_url
      FROM umkm_profiles p
      LEFT JOIN umkm_documents d ON p.id_umkm = d.umkm_id
      WHERE p.user_id = ?
    `;
    const [rows]: any = await pool.execute(query, [userId]);
    return rows[0];
  },

  updateUserRole: async (userId: number, role: string) => {
    const query = "UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?";
    await pool.execute(query, [role, userId]);
  },

  getReviewsByUmkmId: async (umkmId: number) => {
    const query = "SELECT * FROM umkm_reviews WHERE umkm_id = ? ORDER BY created_at DESC";
    const [rows] = await pool.execute(query, [umkmId]);
    return rows;
  },

  getBenefitsByUmkmId: async (umkmId: number) => {
  const [rows] = await pool.execute(
    "SELECT * FROM umkm_benefits WHERE id_umkm = ? ORDER BY created_at ASC",
    [umkmId],
  );
  return rows;
},

  createBenefit: async (umkmId: number, title: string, description: string) => {
    const [result]: any = await pool.execute(
      "INSERT INTO umkm_benefits (id_umkm, title, description, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [umkmId, title, description],
    );
    return result.insertId;
  },

  deleteBenefit: async (benefitId: number, umkmId: number) => {
    const [result]: any = await pool.execute(
      "DELETE FROM umkm_benefits WHERE id_benefit = ? AND id_umkm = ?",
      [benefitId, umkmId],
    );
    return result.affectedRows > 0;
  },

  updateDescription: async (umkmId: number, description: string) => {
    await pool.execute(
      "UPDATE umkm_profiles SET description = ? WHERE id_umkm = ?",
      [description, umkmId],
    );
  },
};

export default UmkmRepository;
