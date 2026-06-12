import { IoClose } from "react-icons/io5";

type ProfileModalProps = {
  title?: string;
  onClose?: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export default function ProfileModal({
  title = "Edit Profile UMKM",
  onClose,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  children,
}: ProfileModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 pt-6 pb-6">
          <h2 className="font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-neutral-800 transition cursor-pointer">
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-6 pb-6 space-y-4">
          {children}
        </div>

        {/* BUTTON */}
        <div className="px-6 pb-6">
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-mint-100 text-mint font-semibold text-sm hover:bg-mint-200/75 cursor-pointer transition"
          >
            {submitLabel ?? "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}