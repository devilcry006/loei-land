import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "dark" | "status" | "soft" | "note";

const variants: Record<BadgeVariant, string> = {
  dark: "bg-ink/80 text-white",
  status: "bg-brand text-white",
  soft: "bg-soft text-brand",
  note: "bg-note text-note-ink",
};

type BadgeProps = ComponentProps<"span"> & { variant?: BadgeVariant };

export function Badge({ variant = "dark", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full px-2.5 py-1 text-xs font-extrabold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
