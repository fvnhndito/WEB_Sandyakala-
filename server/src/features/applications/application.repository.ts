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

  checkAlreadyApplied: async (userId: number, jobId: number): Promise<boolean> => {
    const [rows]: any = await pool.execute(
      "SELECT id FROM applications WHERE user_id = ? AND job_id = ?",
      [userId, jobId],
    );
    return rows.length > 0;
  },

  getApplicantsByUmkm: async (umkmId: number, limit: number, offset: number) => {
  const baseQuery = `
    SELECT 
      a.id AS application_id,
      j.id AS job_id,
      j.type AS job_type,
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
    ORDER BY a.applied_at DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(a.id) AS total
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE j.umkm_id = ?
  `;

  const [rows]: any = await pool.execute(baseQuery, [umkmId, limit, offset]);
  const [countRows]: any = await pool.execute(countQuery, [umkmId]);

  return { data: rows, total: countRows[0].total };
},

  // Update status aplikasi (PENDING → INTERVIEW / REJECTED / ACCEPTED)
  updateStatus: async (applicationId: number, status: string, rejectionReason?: string) => {
    const query = `
      UPDATE applications 
      SET status = ?, rejection_reason = ?
      WHERE id = ?
    `;
    const [result]: any = await pool.execute(query, [
      status,
      rejectionReason ?? null,
      applicationId,
    ]);
    if (result.affectedRows === 0) throw new Error("APPLICATION_NOT_FOUND");
    return true;
  },

  // Buat jadwal interview
  createInterview: async (data: {
  applicationId: number;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  link: string;
  notes: string;
}) => {
  await pool.execute(
    `INSERT INTO interviews 
      (application_id, date, start_time, end_time, type, link, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.applicationId, data.date, data.startTime, data.endTime, data.type, data.link, data.notes]
  );
},

  // Ambil semua interview milik UMKM beserta detail pelamar
  getInterviewsByUmkm: async (umkmId: number) => {
    const query = `
      SELECT
        i.id AS interview_id,
        i.application_id,
        i.date AS tanggal_wawancara,
        i.type AS metode_wawancara,
        i.link AS tautan_wawancara,
        i.status AS status_wawancara,
        a.id AS application_id,
        a.status AS application_status,
        u.fullname AS nama_pelamar,
        j.title AS posisi_lowongan,
        j.type AS job_type,
        j.id AS job_id,
        fp.last_education AS pendidikan_terakhir_pelamar,
        fp.no_hp AS kontak_pelamar,
        fp.profile_pic
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      JOIN fg_profiles fp ON a.user_id = fp.user_id
      WHERE j.umkm_id = ?
      ORDER BY i.date DESC
    `;
    const [rows]: any = await pool.execute(query, [umkmId]);
    return rows;
  },

  // Ambil detail 1 aplikasi
  getApplicationById: async (applicationId: number) => {
    const query = `
      SELECT a.*, j.umkm_id, j.type AS job_type
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ?
    `;
    const [rows]: any = await pool.execute(query, [applicationId]);
    return (rows as any[])[0];
  },

  updateInterviewStatus: async (interviewId: number, status: string) => {
  const [result]: any = await pool.execute(
    "UPDATE interviews SET status = ? WHERE id = ?",
    [status, interviewId]
  );
  if (result.affectedRows === 0) throw new Error("INTERVIEW_NOT_FOUND");
  return true;
},

getInterviewByApplicationId: async (applicationId: number) => {
  const [rows]: any = await pool.execute(
    "SELECT * FROM interviews WHERE application_id = ? ORDER BY created_at DESC LIMIT 1",
    [applicationId]
  );
  return (rows as any[])[0] ?? null;
},

createEmployee: async (applicationId: number) => {
  const [result]: any = await pool.execute(
    "INSERT INTO employees (application_id, status) VALUES (?, 'Aktif')",
    [applicationId]
  );
  return result.insertId;
},

// Update status employee (Aktif/Nonaktif)
updateEmployeeStatus: async (
  employeeId: number,
  status: string
) => {
  const [result]: any = await pool.execute(
    "UPDATE employees SET status = ? WHERE id = ?",
    [status, employeeId]
  );

  return result.affectedRows > 0;
},

// Query workers dari tabel employees
getWorkersByUmkm: async (umkmId: number) => {
  const [rows]: any = await pool.execute(
    `SELECT 
      e.id AS employee_id,
      e.application_id,
      e.status AS status_pekerja,
      e.joined_at AS tanggal_masuk,
      u.fullname AS nama_pekerja,
      j.title AS posisi_pekerja,
      j.type AS jenis_penugasan,
      fp.no_hp,
      fp.profile_pic,
      fp.cv_url
    FROM employees e
    JOIN applications a ON e.application_id = a.id
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.user_id = u.id
    JOIN fg_profiles fp ON a.user_id = fp.user_id
    WHERE j.umkm_id = ?
    ORDER BY e.joined_at DESC`,
    [umkmId]
  );
  return rows;
},
};

export default ApplicationRepository;