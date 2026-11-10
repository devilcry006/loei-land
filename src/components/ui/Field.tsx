import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** สไตล์ช่องกรอกตาม mockup (select, input, textarea) */
export const controlClass = cn(
  "w-full rounded-card border border-line bg-white px-3 py-2.5 text-ink outline-none",
  "placeholder:text-muted/70 focus:border-brand focus:shadow-focus",
  "aria-invalid:border-danger",
);

type FieldProps = {
  label: ReactNode;
  htmlFor: string;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** label + ช่องกรอก + ข้อความช่วย/ข้อผิดพลาด (ใน mockup คือ .field) */
export function Field({ label, htmlFor, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-xs font-bold text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClass, "h-11", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(controlClass, "h-11 py-0", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlClass, className)} {...props} />;
}
