import Link from "next/link";
import type { ComponentProps, ButtonHTMLAttributes, ReactNode } from "react";

type Tone = "primary" | "secondary" | "ghost";

const toneClasses: Record<Tone, string> = {
  primary:
    "bg-sky-600 text-white hover:bg-sky-700 focus-visible:outline-sky-500 shadow-[0_10px_30px_rgba(2,132,199,0.24)]",
  secondary:
    "border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-slate-400",
  ghost:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:outline-slate-400"
};

const baseClasses =
  "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export function Button({
  children,
  tone = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <button className={`${baseClasses} ${toneClasses[tone]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  tone = "primary",
  className = ""
}: {
  href: ComponentProps<typeof Link>["href"];
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Link href={href} className={`${baseClasses} ${toneClasses[tone]} ${className}`}>
      {children}
    </Link>
  );
}
