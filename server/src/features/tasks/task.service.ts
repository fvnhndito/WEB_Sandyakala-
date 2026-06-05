import TaskRepository, { STATUS } from "./task.repository.js";
import type { SubmitTaskInput, ReviewTaskInput } from "./task.schema.js";

const TaskService = {
  getTasksByJobId: async (jobId: number) => {
    return await TaskRepository.getTasksByJobId(jobId);
  },

  submitTask: async (
    taskId: number,
    userId: number,
    data: SubmitTaskInput,
  ) => {
    const task = await TaskRepository.getTaskById(taskId);

    if (!task) {
      throw new Error("Tugas tidak ditemukan!");
    }

    // Tugas yang sudah SELESAI tidak bisa disubmit ulang
    if (task.status === STATUS.SELESAI) {
      throw new Error("Tugas sudah selesai dan tidak bisa diubah lagi.");
    }

    // Pastikan FG sudah diterima pada lowongan yang memiliki tugas ini
    const application = await TaskRepository.checkUserApplication(
      userId,
      task.job_id,
    );

    if (!application) {
      throw new Error(
        "Akses ditolak: Anda tidak terdaftar atau belum diterima pada lowongan ini.",
      );
    }

    // Simpan ke riwayat revisi terlebih dahulu
    await TaskRepository.createRevisionHistory(
      taskId,
      userId,
      data.submission_link,
      data.note,
    );

    // Update status dan submission_link di task utama
    await TaskRepository.updateTaskSubmit(taskId, data.submission_link);
  },

  reviewTask: async (taskId: number, data: ReviewTaskInput) => {
    const task = await TaskRepository.getTaskById(taskId);

    if (!task) {
      throw new Error("Tugas tidak ditemukan!");
    }

    // Hanya task berstatus REVIEW dan REVISI yang bisa di-tinjau
    if (task.status !== STATUS.REVIEW || STATUS.REVISI) {
      throw new Error("Tugas ini tidak dalam status menunggu tinjauan.");
    }

    // Jika disetujui = SELESAI, jika tidak = REVISI
    const status = data.is_approved ? STATUS.SELESAI : STATUS.REVISI;
    const finalNote = data.is_approved ? null : (data.revision_note ?? null);

    // Update task utama
    await TaskRepository.updateTaskReview(taskId, status, finalNote);

    // Update catatan revisi UMKM pada entri riwayat terbaru
    await TaskRepository.updateLatestRevisionNote(taskId, status, finalNote);
  },

  getTaskRevisions: async (taskId: number) => {
    const task = await TaskRepository.getTaskById(taskId);

    if (!task) {
      throw new Error("Tugas tidak ditemukan!");
    }

    return await TaskRepository.getRevisionsByTaskId(taskId);
  },
};

export default TaskService;
