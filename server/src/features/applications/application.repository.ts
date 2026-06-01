import pool from "../../config/db.js";

const ApplicationRepository = {
  applyJob: async (userId: number, jobId: number) => {
    const query = `
      INSERT INTO applications (user_id, job_id, status, applied_at) 
      VALUES (?, ?, 'PENDING', NOW())
    `;

    const [result]: any = await pool.execute(query, [userId, jobId]);
    return result.insertId;
  },

  checkAlreadyApplied: async (
    userId: number,
    jobId: number,
  ): Promise<boolean> => {
    const [rows]: any = await pool.execute(
      "SELECT id FROM applications WHERE user_id = ? AND job_id = ?",
      [userId, jobId],
    );
    return rows.length > 0;
  },

  getApplicantsByUmkm: async (
    umkmId: number,
    limit: number,
    offset: number,
  ) => {
    let baseQuery = `
      SELECT 
        a.id AS application_id,
        j.id AS job_id,
        u.fullname AS applicant_name,
        j.title AS job_title,
        fp.last_education,
        fp.no_hp,
        a.applied_at,
        a.status,
        fp.cv_url,
        fp.ktp_url,
        fp.portfolio_url,
        fp.profile_pic
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN fg_profiles fp ON a.user_id = fp.user_id
      JOIN users u ON a.user_id = u.id
      WHERE j.umkm_id = ?
    `;

    // Query untuk menghitung total data (Pagination)
    let countQuery = `
      SELECT COUNT(a.id) AS total
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.umkm_id = ?
    `;

    const queryParams: any[] = [umkmId];
    const countParams: any[] = [umkmId];

    baseQuery += ` ORDER BY a.applied_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows]: any = await pool.execute(baseQuery, queryParams);
    const [countRows]: any = await pool.execute(countQuery, countParams);

    return {
      data: rows,
      total: countRows[0].total,
    };
  },
};

export default ApplicationRepository;
