import { CircleAlert } from "lucide-react";
import { Material } from "./material";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function Alert({
  children,
  icon,
  className,
  variant,
}: {
  children?: ReactNode | ReactNode[] | undefined;
  icon?: ReactNode | ReactNode[] | undefined;
  className?: string | undefined;
  variant?: "error" | "info" | "normal" | "warning" | undefined;
}) {
  return (
    <Material
      padding="sm"
      className={cn(
        "flex flex-row space-x-2 items-center",
        variant === "error"
          ? "bg-[#fdeded_!important] dark:bg-[#160b0b_!important]"
          : variant === "warning"
          ? "bg-[#fef4e5_!important] dark:bg-[#191209_!important]"
          : variant === "info"
          ? "bg-[#e5f6fd_!important] dark:bg-[#091418_!important]"
          : "",
        className
      )}
    >
      {icon ? (
        icon
      ) : (
        <CircleAlert
          size={18}
          className={
            variant === "error"
              ? "text-[#d76463] dark:text-[#df2317]"
              : variant === "warning"
              ? "text-[#eea065] dark:text-[#e3920a]"
              : variant === "info"
              ? "text-[#67b1d5] dark:text-[#1a97e3]"
              : ""
          }
        />
      )}{" "}
      <p>{children}</p>
    </Material>
  );
}

export { Alert };
