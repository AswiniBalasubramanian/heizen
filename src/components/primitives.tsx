import type { ReactNode } from "react";
import { Info, AlertCircle, CheckCircle2, Check } from "lucide-react";

/* ------------------------------------------------------------------ *
 * Tag
 * ------------------------------------------------------------------ */
export function Tag({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "warn" | "selected";
}) {
  const styles =
    variant === "warn"
      ? "bg-coral-light border-coral/30 text-[#993C1D]"
      : variant === "selected"
        ? "bg-white/70 border-primary-100 text-primary"
        : "bg-surface-muted border-line text-ink-3";

  return (
    <span
      className={`inline-flex items-center font-mono text-[11px] font-medium tracking-[0.02em] px-1.5 py-[3px] rounded-[4px] border whitespace-nowrap ${styles}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Avatar
 * ------------------------------------------------------------------ */
export function Avatar({
  initials,
  size = 32,
}: {
  initials: string;
  size?: 24 | 32 | 48;
}) {
  const fontSize = size === 48 ? 16 : size === 24 ? 10 : 12;
  return (
    <div
      className="rounded-full bg-primary text-ink-on-dark font-semibold inline-flex items-center justify-center"
      style={{ width: size, height: size, fontSize }}
    >
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * InfoCallout — info / warn / success
 * ------------------------------------------------------------------ */
export function InfoCallout({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "warn" | "success";
  title?: string;
  children: ReactNode;
}) {
  const Icon = variant === "warn" ? AlertCircle : variant === "success" ? CheckCircle2 : Info;
  const borderClass =
    variant === "warn"
      ? "border-l-coral"
      : variant === "success"
        ? "border-l-mint"
        : "border-l-primary";
  const iconColor =
    variant === "warn" ? "text-coral" : variant === "success" ? "text-mint" : "text-primary";

  return (
    <div
      className={`bg-surface border border-line ${borderClass} border-l-[3px] rounded-lg px-[18px] py-[14px] flex gap-3 items-start`}
    >
      <Icon size={18} className={`${iconColor} mt-[1px] shrink-0`} strokeWidth={1.8} />
      <div className="text-[13px] leading-[1.5] text-ink-2">
        {title && <span className="font-semibold text-ink mr-1">{title}</span>}
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Card surfaces
 * ------------------------------------------------------------------ */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-surface border border-line rounded-lg p-s-4 ${className}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Button
 * ------------------------------------------------------------------ */
type BtnProps = {
  variant?: "primary" | "secondary" | "ghost";
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({
  variant = "primary",
  leadingIcon,
  trailingIcon,
  children,
  type = "button",
  disabled,
  onClick,
}: BtnProps) {
  const base =
    "inline-flex items-center gap-2 px-[18px] h-10 rounded-md text-[14px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0";
  const variantClass =
    variant === "primary"
      ? "bg-primary text-ink-on-dark hover:bg-primary-hover"
      : variant === "secondary"
        ? "bg-surface text-ink border border-line-2 hover:bg-surface-muted"
        : "bg-transparent text-ink-2 hover:bg-black/[0.04]";

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${variantClass}`}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}

export function IconButton({
  ariaLabel,
  children,
  onClick,
}: {
  ariaLabel: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="w-9 h-9 grid place-items-center bg-surface border border-line rounded-lg text-ink-2 hover:bg-surface-muted transition-colors"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Toggle
 * ------------------------------------------------------------------ */
export function Toggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative inline-block w-9 h-5 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-line-2"
      }`}
    >
      <span
        className="absolute top-[2px] w-4 h-4 rounded-full bg-white transition-all"
        style={{ left: checked ? 18 : 2 }}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Selected badge (small filled checkmark for cards)
 * ------------------------------------------------------------------ */
export function SelectedBadge() {
  return (
    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary grid place-items-center">
      <Check size={14} className="text-mint-light" strokeWidth={2.4} />
    </div>
  );
}
