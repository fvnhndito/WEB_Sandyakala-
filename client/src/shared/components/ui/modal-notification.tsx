type ButtonConfig =
  | {
      type: "double";
      cancelLabel: string;
      confirmLabel: string;
      onCancel: () => void;
      onConfirm: () => void;
    }
  | {
      type: "single";
      label: string;
      onPress: () => void;
    };

interface ModalNotificationProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  button: ButtonConfig;
  onClose?: () => void;
}

export function ModalNotification({
  visible,
  title,
  subtitle,
  button,
  onClose,
}: ModalNotificationProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl px-6 py-7 mx-4 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <p className="text-17 font-bold text-gray-900 text-center leading-snug mb-2">
          {title}
        </p>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-13 text-gray-500 text-center leading-relaxed mb-6">
            {subtitle}
          </p>
        )}

        {/* Buttons */}
        <div className= "mt-3">
          {button.type === "double" ? (
            <div className="flex gap-3 justify-center">
              <button
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium bg-white active:opacity-70 cursor-pointer"
                onClick={button.onCancel}
              >
                {button.cancelLabel}
              </button>
              <button
                className="flex-1 py-2.5 rounded-lg bg-primary-dark text-white text-sm font-medium active:opacity-70 cursor-pointer"
                onClick={button.onConfirm}
              >
                {button.confirmLabel}
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                className="px-10 py-2.5 rounded-lg bg-primary-dark text-white text-sm font-medium cursor-pointer active:opacity-70"
                onClick={button.onPress}
              >
                {button.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
