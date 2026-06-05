import pool from "../../config/db.js";
import type { CreateJobInput } from "./job.schema.js";

const JobRepository = {
  // buat lowongan
  createJob: async (
    umkmId: number,
    data: CreateJobInput,
    uniqueSkills: string[],
  ) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const queryJob = `
        INSERT INTO jobs 
        (umkm_id, title, job_category, description, type, salary_min, salary_max, worker_needed, minimum_education, qualification_description, portfolio_requirement, deadline, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const [jobResult] = await connection.execute(queryJob, [
        umkmId,
        data.title,
        data.job_category,
        data.description,
        data.type,
        data.salary_min || null,
        data.salary_max || null,
        data.worker_needed,
        data.minimum_education,
        data.qualification_description,
        data.portfolio_requirement,
        data.deadline,
      ]);

      const jobId = (jobResult as any).insertId;

      const skillIds: number[] = [];

      for (const skillName of uniqueSkills) {
        const [existingSkill]: any = await connection.execute(
          "SELECT id FROM skills WHERE LOWER(skill_name) = ?",
          [skillName.toLowerCase()],
        );

        if (existingSkill.length > 0) {
          skillIds.push(existingSkill[0].id);
        } else {
          const [newSkill]: any = await connection.execute(
            "INSERT INTO skills (skill_name) VALUES (?)",
            [skillName],
          );
          skillIds.push(newSkill.insertId);
        }
      }

      if (skillIds.length > 0) {
        const skillPlaceholders = skillIds.map(() => "(?, ?)").join(", ");
        const skillParams = skillIds.flatMap((skillId) => [jobId, skillId]);
        await connection.execute(
          `INSERT INTO job_skills (job_id, skill_id) VALUES ${skillPlaceholders}`,
          skillParams,
        );
      }

      if (data.type === "SHIFT" && data.shifts) {
        const shiftPlaceholders = data.shifts.map(() => "(?, ?)").join(", ");
        const shiftParams = data.shifts.flatMap((shiftType) => [jobId, shiftType]);
        await connection.execute(
          `INSERT INTO job_shifts (job_id, shift_type) VALUES ${shiftPlaceholders}`,
          shiftParams,
        );
      } else if (data.type === "PROJECT" && data.project_tasks) {
        const taskPlaceholders = data.project_tasks
          .map(() => "(?, ?, ?, ?, ?, NOW())")
          .join(", ");
        const taskParams = data.project_tasks.flatMap((task) => [
          jobId,
          task.task_name,
          task.task_order,
          task.project_start,
          task.project_end,
        ]);
        await connection.execute(
          `INSERT INTO job_project_tasks (job_id, task_name, task_order, project_start, project_end, created_at) VALUES ${taskPlaceholders}`,
          taskParams,
        );
      }

      await connection.commit();
      return jobId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getJobById: async (jobId: number) => {
    const queryJob = `
      SELECT 
        j.*, 
        u.business_name, 
        d.logo_url, 
        u.regency 
      FROM jobs j
      JOIN umkm_profiles u ON j.umkm_id = u.id_umkm
      JOIN umkm_documents d ON j.umkm_id = d.umkm_id
      WHERE j.id = ?
    `;
    const [jobRows]: any = await pool.execute(queryJob, [jobId]);

    if (jobRows.length === 0) return null;

    const jobData = jobRows[0];

    const querySkills = `
      SELECT s.id, s.skill_name 
      FROM skills s
      JOIN job_skills js ON s.id = js.skill_id
      WHERE js.job_id = ?
    `;
    const [skillRows]: any = await pool.execute(querySkills, [jobId]);

    let shifts: string[] = [];
    let projectTasks: any[] = [];

    if (jobData.type === "SHIFT") {
      const [shiftRows]: any = await pool.execute(
        "SELECT shift_type FROM job_shifts WHERE job_id = ?",
        [jobId],
      );
      shifts = shiftRows.map((row: any) => row.shift_type);
    } else if (jobData.type === "PROJECT") {
      const [taskRows]: any = await pool.execute(
        `SELECT 
          id, task_name, task_order, project_start, project_end, 
          status, submission_link, revision_note
        FROM job_project_tasks 
        WHERE job_id = ? 
        ORDER BY task_order ASC`,
        [jobId],
      );
      projectTasks = taskRows;
    }

    return {
      ...jobData,
      skills: skillRows,
      shifts: shifts.length > 0 ? shifts : undefined,
      project_tasks: projectTasks.length > 0 ? projectTasks : undefined,
    };
  },

  getAllJobs: async (filters: {
    search?: string;
    type?: string;
    shift?: string;
    limit: number;
    offset: number;
  }) => {
    let baseQuery = `
      SELECT 
        j.id, 
        j.title, 
        j.type, 
        j.salary_min, 
        j.salary_max, 
        u.business_name, 
        u.regency
      FROM jobs j
      JOIN umkm_profiles u ON j.umkm_id = u.id_umkm
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(j.id) as total
      FROM jobs j
      JOIN umkm_profiles u ON j.umkm_id = u.id_umkm
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    const countParams: any[] = [];

    if (filters.search) {
      const searchStr = `%${filters.search}%`;
      baseQuery += ` AND j.title LIKE ?`;
      countQuery += ` AND j.title LIKE ?`;
      queryParams.push(searchStr);
      countParams.push(searchStr);
    }

    if (filters.type) {
      baseQuery += ` AND j.type = ?`;
      countQuery += ` AND j.type = ?`;
      queryParams.push(filters.type);
      countParams.push(filters.type);
    }

    if (filters.shift) {
      const shiftClause = ` AND EXISTS (SELECT 1 FROM job_shifts js WHERE js.job_id = j.id AND js.shift_type = ?)`;
      baseQuery += shiftClause;
      countQuery += shiftClause;
      queryParams.push(filters.shift);
      countParams.push(filters.shift);
    }

    baseQuery += ` ORDER BY j.created_at DESC`;
    baseQuery += ` LIMIT ${filters.limit} OFFSET ${filters.offset}`;

    const [rows]: any = await pool.execute(baseQuery, queryParams);
    const [countRows]: any = await pool.execute(countQuery, countParams);

    return {
      data: rows,
      total: countRows[0].total,
    };
  },

  // ambil data lowongan
  getJobsByUmkmId: async (umkmId: number, limit: number, offset: number) => {
    const baseQuery = `
      SELECT 
        id, 
        title, 
        type, 
        salary_min, 
        salary_max, 
        worker_needed, 
        deadline, 
        created_at
      FROM jobs
      WHERE umkm_id = ?
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `SELECT COUNT(id) as total FROM jobs WHERE umkm_id = ?`;

    const [rows]: any = await pool.execute(baseQuery, [umkmId]);
    const [countRows]: any = await pool.execute(countQuery, [umkmId]);

    return {
      data: rows,
      total: countRows[0].total,
    };
  },

  // edit lowongan
  updateJob: async (
    jobId: number,
    umkmId: number,
    data: CreateJobInput,
    uniqueSkills: string[],
  ) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const queryUpdateJob = `
        UPDATE jobs 
        SET title = ?, job_category = ?, description = ?, type = ?, 
            salary_min = ?, salary_max = ?, worker_needed = ?, minimum_education = ?, 
            qualification_description = ?, portfolio_requirement = ?, deadline = ?, updated_at = NOW()
        WHERE id = ? AND umkm_id = ?
      `;

      const [updateResult]: any = await connection.execute(queryUpdateJob, [
        data.title,
        data.job_category,
        data.description,
        data.type,
        data.salary_min ?? null,
        data.salary_max ?? null,
        data.worker_needed,
        data.minimum_education,
        data.qualification_description,
        data.portfolio_requirement,
        data.deadline,
        jobId,
        umkmId,
      ]);

      if (updateResult.affectedRows === 0) {
        throw new Error("NOT_FOUND_OR_UNAUTHORIZED");
      }

      // Hapus relasi lama
      await connection.execute("DELETE FROM job_skills WHERE job_id = ?", [jobId]);
      await connection.execute("DELETE FROM job_shifts WHERE job_id = ?", [jobId]);
      await connection.execute("DELETE FROM job_project_tasks WHERE job_id = ?", [jobId]);

      // Cari atau buat skill baru
      const skillIds: number[] = [];

      for (const skillName of uniqueSkills) {
        const [existingSkill]: any = await connection.execute(
          "SELECT id FROM skills WHERE LOWER(skill_name) = ?",
          [skillName.toLowerCase()],
        );

        if (existingSkill.length > 0) {
          skillIds.push(existingSkill[0].id);
        } else {
          const [newSkill]: any = await connection.execute(
            "INSERT INTO skills (skill_name) VALUES (?)",
            [skillName],
          );
          skillIds.push(newSkill.insertId);
        }
      }

      if (skillIds.length > 0) {
        const skillPlaceholders = skillIds.map(() => "(?, ?)").join(", ");
        const skillParams = skillIds.flatMap((skillId) => [jobId, skillId]);
        await connection.execute(
          `INSERT INTO job_skills (job_id, skill_id) VALUES ${skillPlaceholders}`,
          skillParams,
        );
      }

      if (data.type === "SHIFT" && data.shifts) {
        const shiftPlaceholders = data.shifts.map(() => "(?, ?)").join(", ");
        const shiftParams = data.shifts.flatMap((shiftType) => [jobId, shiftType]);
        await connection.execute(
          `INSERT INTO job_shifts (job_id, shift_type) VALUES ${shiftPlaceholders}`,
          shiftParams,
        );
      } else if (data.type === "PROJECT" && data.project_tasks) {
        // FIX: project_start & project_end sekarang ikut diinsert (sebelumnya hilang)
        const taskPlaceholders = data.project_tasks
          .map(() => "(?, ?, ?, ?, ?, NOW())")
          .join(", ");
        const taskParams = data.project_tasks.flatMap((task) => [
          jobId,
          task.task_name,
          task.task_order,
          task.project_start,
          task.project_end,
        ]);
        await connection.execute(
          `INSERT INTO job_project_tasks (job_id, task_name, task_order, project_start, project_end, created_at) VALUES ${taskPlaceholders}`,
          taskParams,
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // hapus lowongan
  deleteJob: async (jobId: number, umkmId: number) => {
    const [result]: any = await pool.execute(
      "DELETE FROM jobs WHERE id = ? AND umkm_id = ?",
      [jobId, umkmId],
    );

    if (result.affectedRows === 0) {
      throw new Error("NOT_FOUND_OR_UNAUTHORIZED");
    }

    return true;
  },

  toggleSaveJob: async (
    userId: number,
    jobId: number,
  ): Promise<{ isSaved: boolean }> => {
    const [rows]: any = await pool.execute(
      "SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?",
      [userId, jobId],
    );

    if (rows.length > 0) {
      await pool.execute(
        "DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?",
        [userId, jobId],
      );
      return { isSaved: false };
    } else {
      await pool.execute(
        "INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)",
        [userId, jobId],
      );
      return { isSaved: true };
    }
  },

  // untuk simpan lowongan
  getMySavedJobs: async (userId: number, limit: number, offset: number) => {
    const baseQuery = `
      SELECT 
        j.id, j.title, j.type, j.salary_min, j.salary_max, 
        u.business_name, 
        u.regency,
        sj.created_at AS saved_at
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
      JOIN umkm_profiles u ON j.umkm_id = u.id_umkm
      WHERE sj.user_id = ?
      ORDER BY sj.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `SELECT COUNT(id) as total FROM saved_jobs WHERE user_id = ?`;

    const [rows]: any = await pool.execute(baseQuery, [userId]);
    const [countRows]: any = await pool.execute(countQuery, [userId]);

    return { data: rows, total: countRows[0].total };
  },
};

export default JobRepository;
