import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Setting({
  className,
  children,
}: {
  className?: string;
  children: ReactNode | ReactNode[] | undefined;
}) {
  return (
    <div
      className={cn(
        "flex flex-col w-full justify-between gap-2 max-w-full @container/setting",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SettingContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode | ReactNode[] | undefined;
}) {
  return (
    <div className="flex flex-col @md/setting:flex-row items-center gap-2">
      {children}
    </div>
  );
}

export function SettingMeta({
  className,
  children,
}: {
  className?: string;
  children: ReactNode | ReactNode[] | undefined;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 flex-[2] w-full flex-shrink-0 min-w-48",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SettingTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode | ReactNode[] | undefined;
}) {
  return <h1 className={cn("font-medium text-base", className)}>{children}</h1>;
}

export function SettingDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode | ReactNode[] | undefined;
}) {
  return (
    <p className={cn("text-slate-800 dark:text-zinc-200 text-sm", className)}>
      {children}
    </p>
  );
}
