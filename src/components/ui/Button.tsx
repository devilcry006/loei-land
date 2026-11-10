import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "ghost" | "pill";

const variants: Record<ButtonVariant, string> = {
  primary: "border-brand bg-brand font-bold text-white hover:bg-brand-dark",
  ghost: "border-line bg-paper font-bold text-brand hover:bg-soft",
  pill: "border-line bg-paper text-ink hover:bg-soft",
};

export function buttonClass(variant: ButtonVariant = "pill", className?: string) {
  return cn(
    // min-h-11 (44px) แทน 38px ของ mockup ให้แตะบนมือถือได้
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
    "focus-visible:shadow-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant };

export function Button({ variant, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}
