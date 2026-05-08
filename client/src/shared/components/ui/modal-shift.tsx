import { GoArrowLeft } from "react-icons/go";

interface ModalShiftProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  subtitle2?: string;
  status?: string;
}

export function ModalShift({
  open,
  onClose,
  children,
  title,
  subtitle,
  subtitle2,
  status,
}: ModalShiftProps) {
  if (!open) return null;

  const statusClasses: Record<string, string> = {
    Disetujui: "bg-green-100 text-green-700",
    Proses: "bg-gray-200 text-gray-700",
    Review: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-500/50">
          <div className="flex items-center gap-7">
            <GoArrowLeft
              className="text-2xl cursor-pointer"
              onClick={onClose}
            />

            <div className="flex flex-col items-start">
              <p className="font-bold text-md">{title}</p>
              <p className="text-xs text-neutral-500">
                {subtitle} - {subtitle2}
              </p>
            </div>
          </div>

          {status && (
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                statusClasses[status] || "bg-neutral-200 text-neutral-700"
              }`}
            >
              {status}
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
