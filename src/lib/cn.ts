/** รวม className ที่มีเงื่อนไข: cn("a", cond && "b") */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
