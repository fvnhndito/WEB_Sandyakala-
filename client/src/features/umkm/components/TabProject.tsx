import { Badge } from "@/shared/components/ui/badge";
import { Link } from "react-router-dom";
import ProgressBar from "./ui/ProgressBar";
import { FaPlus } from "react-icons/fa6";
import { Card } from "./ui/Card";
import TitleCard from "./ui/TitleCard";
import ImgEmptyData from "@/assets/images/Img Empty Data - Tab Project.png";
import type { StatusType } from "../types/dashboard.types";
import { projectProgress, taskList } from "../constants/mock-data";
import { EmptyData } from "./ui/EmptyData";

type StatusVariantType = "info" | "warning" | "error" | "success";

const statusVariantMap: Record<StatusType, StatusVariantType> = {
  Draft: "info",
  Review: "warning",
  Revisi: "error",
  Selesai: "success",
};

export default function TabProject() {
  return (
    <section className="container pb-10">
      <div className="flex gap-2 mb-8">
        <Link
          to="/umkm/dashboard/addproject"
          className="flex items-center gap-2 px-4 py-2.5 border hover:bg-mint-200 transition-all duration-100 hover:text-white cursor-pointer border-mint text-mint bg-mint-200/50 text-sm rounded-md"
        >
          <FaPlus className=" text-xl" /> Tambah Project
        </Link>
        <Link
          to="/umkm/dashboard/data-project"
          className="px-4 text-mint py-2.5 border hover:bg-mint-200/50 border-mint cursor-pointer text-sm rounded-md"
        >
          Lihat Project
        </Link>
      </div>

      {projectProgress.length === 0 && taskList.length === 0 ? (
        <EmptyData
          title="Belum Ada Task"
          description="Tambahkan task baru untuk mulai mengelola pekerjaan tim kamu."
          actionLabel="Tambah Task"
          actionTo="/umkm/dashboard"
          image={ImgEmptyData}
        />
      ) : (
        <>
          <TitleCard title="Proyek Terbaru" link="/umkm/projects" />
          <Card className="mb-10">
            {projectProgress.map((item, index) => (
              <div
                key={index}
                className="rounded-md shadow-md px-6 pt-3.5 bg-neutral-100"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-xs text-gray-400">
                      {item.role} - {item.taskInfo} deadline {item.deadline}
                    </p>
                  </div>
                  <Badge variant={"warning"} size={"sm"}>
                    {item.status}
                  </Badge>
                </div>
                <ProgressBar percentage={item.progress} />
              </div>
            ))}
          </Card>
          <TitleCard
            title="Task Aktif"
            link="/umkm/projects"
            className="mb-3"
          />
          <Card>
            <div className="flex gap-3 mb-6">
              <button className="px-4 py-2 text-sm bg-mint rounded-full text-white">
                Semua
              </button>
              <button className="px-4 py-2 text-sm border border-mint rounded-full">
                Draft
              </button>
              <button className="px-4 py-2 text-sm border border-mint rounded-full">
                Review
              </button>
              <button className="px-4 py-2 text-sm border border-mint rounded-full">
                Revisi
              </button>
              <button className="px-4 py-2 text-sm border border-mint rounded-full">
                Selesai
              </button>
            </div>

            <div className="space-y-2">
              {taskList.map((task, index) => (
                <div key={index} className="pb-3 border-b">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <h3 className="font-medium text-lg">{task.title}</h3>
                      <p className="text-xs text-gray-500">
                        {task.assignee} - {task.project}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Badge
                        variant={"error"}
                        size={"sm"}
                        className="py-2 px-5 bg-white"
                      >
                        {task.deadline}
                      </Badge>
                      <Badge
                        variant={statusVariantMap[task.status]}
                        size={"sm"}
                        className="py-2 px-5"
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </section>
  );
}
