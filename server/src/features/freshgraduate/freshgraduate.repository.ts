import pool from "../../config/db.js";

const FreshGraduateRepository = {
  findAll: async () => {
    const query = `
      SELECT fp.id, fp.user_id, u.fullname, u.email, fp.no_hp, fp.last_education, fp.status, fp.created_at
      FROM fg_profiles fp
      JOIN users u ON fp.user_id = u.id
      ORDER BY fp.created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

  findByEmail: async (email: string) => {
    const query = `
      SELECT fp.id, fp.user_id, u.fullname, u.email, fp.no_hp, fp.last_education, fp.status, fp.created_at, fp.cv_url, fp.ktp_url, fp.portfolio_url, fp.profile_pic, fp.rejection_reason
      FROM fg_profiles fp
      JOIN users u ON fp.user_id = u.id
      WHERE u.email = ?
    `;
    const [rows]: any = await pool.execute(query, [email]);
    return rows[0];
  },

  findById: async (id: number) => {
    const query = `
      SELECT fp.*, u.fullname, u.email
      FROM fg_profiles fp
      JOIN users u ON fp.user_id = u.id
      WHERE fp.id = ?
    `;
    const [rows]: any = await pool.execute(query, [id]);
    return rows[0];
  },

  findByUserId: async (userId: number) => {
    const query = `
      SELECT fp.*, u.fullname, u.email
      FROM fg_profiles fp
      JOIN users u ON fp.user_id = u.id
      WHERE fp.user_id = ?
    `;
    const [rows]: any = await pool.execute(query, [userId]);
    return rows[0];
  },

  updateStatus: async (id: number, status: string, rejectionReason: string | null) => {
    const query = `
      UPDATE fg_profiles 
      SET status = ?, rejection_reason = ? 
      WHERE id = ?
    `;
    await pool.execute(query, [status, rejectionReason, id]);
  },

  upsertProfile: async (
    userId: number,
    data: { lastEducation: string; phone: string },
    files: { cvUrl: string; ktpUrl: string; portfolioUrl?: string | null; profilePic?: string | null }
  ) => {
    const [existing]: any = await pool.execute("SELECT id FROM fg_profiles WHERE user_id = ?", [userId]);
    if (existing.length > 0) {
      const query = `
        UPDATE fg_profiles 
        SET last_education = ?, no_hp = ?, cv_url = ?, ktp_url = ?, portfolio_url = COALESCE(?, portfolio_url), profile_pic = COALESCE(?, profile_pic), status = 'PENDING', rejection_reason = NULL
        WHERE user_id = ?
      `;
      await pool.execute(query, [
        data.lastEducation,
        data.phone,
        files.cvUrl,
        files.ktpUrl,
        files.portfolioUrl || null,
        files.profilePic || null,
        userId
      ]);
      return existing[0].id;
    } else {
      const query = `
        INSERT INTO fg_profiles 
        (user_id, last_education, no_hp, cv_url, ktp_url, portfolio_url, profile_pic, status, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', NOW())
      `;
      const [result]: any = await pool.execute(query, [
        userId,
        data.lastEducation,
        data.phone,
        files.cvUrl,
        files.ktpUrl,
        files.portfolioUrl || null,
        files.profilePic || null
      ]);
      return result.insertId;
    }
  }
};

export default FreshGraduateRepository;
