import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * ป้ายเล็กตาม mockup
 * - dark:   .badge (รหัสทรัพย์ ป้ายบนรูป)
 * - status: .status (สถานะ เช่น พร้อมขาย)
 * - soft:   ป้ายเขียวอ่อน (แท็ก)
 * - note:   .inline-note แบบสั้น (คำเตือน)
 */
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
