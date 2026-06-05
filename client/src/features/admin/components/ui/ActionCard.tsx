import { BiRightArrowAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  variant?: "info" | "error";
}

export default function ActionCard({
  title,
  description,
  icon,
  to,
  variant = "info",
}: ActionCardProps) {
  const variants = {
    info: "bg-info-100/50 border-info-300",
    error: "bg-error-100 border-error-300",
  };

  return (
    <Link to={to}>
      <div
        className={`flex gap-2 justify-between items-center mb-5 py-4 px-3 w-full rounded-3xl border-2 ${variants[variant]}`}
      >
        {icon}

        <div className="flex flex-col flex-1">
          <h1 className=" mb-1 text-sm">{title}</h1>
          <p className="text-sm">{description}</p>
        </div>

        <BiRightArrowAlt className="h-8 w-8" />
      </div>
    </Link>
  );
}
