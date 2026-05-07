import { useNavigate } from "react-router-dom";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { STEPS } from "../data";
import { Button } from "./primitives";
import { useTemplate } from "../store";

/* ------------------------------------------------------------------ *
 * Stepper — horizontal, clickable
 * ------------------------------------------------------------------ */
export function Stepper({ current }: { current: number }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-[64px] z-[5] bg-cream py-3 -mx-s-6 px-s-6">
      <div className="bg-surface border border-line rounded-[12px] px-s-4 py-s-3 shadow-card">
        <ol className="flex items-stretch">
        {STEPS.map((s, i) => {
          const state =
            s.id === current ? "active" : s.id < current ? "complete" : "upcoming";
          const last = i === STEPS.length - 1;
          return (
            <li key={s.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => s.id <= current && navigate(s.path)}
                disabled={s.id > current}
                className="flex items-center gap-3 text-left disabled:cursor-not-allowed group"
              >
                <Bubble state={state}>{state === "complete" ? <Check size={14} strokeWidth={2.4} /> : s.id}</Bubble>
                <div className="flex flex-col leading-tight">
                  <span
                    className={`uppercase font-medium tracking-[0.14em] text-[10px] ${
                      state === "upcoming" ? "text-ink-4" : "text-ink-3"
                    }`}
                  >
                    {s.eyebrow}
                  </span>
                  <span
                    className={`text-[13px] ${
                      state === "active"
                        ? "text-ink font-semibold"
                        : state === "complete"
                          ? "text-ink-2"
                          : "text-ink-4"
                    }`}
                  >
                    {s.name}
                  </span>
                </div>
              </button>
              {!last && (
                <span className="mx-3 flex-1 h-px bg-line" aria-hidden="true" />
              )}
            </li>
          );
        })}
        </ol>
      </div>
    </div>
  );
}

function Bubble({
  state,
  children,
}: {
  state: "active" | "complete" | "upcoming";
  children: ReactNode;
}) {
  const styles =
    state === "active"
      ? "bg-primary text-ink-on-dark"
      : state === "complete"
        ? "bg-mint text-primary"
        : "bg-surface-muted text-ink-4 border border-line";
  return (
    <span
      className={`w-7 h-7 rounded-full grid place-items-center text-[12px] font-semibold ${styles}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * StepHeader — eyebrow + title (question) + subtitle
 * ------------------------------------------------------------------ */
export function StepHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle: string;
}) {
  const stepLabel = STEPS.find((s) => s.id === step)?.name ?? "";
  return (
    <div className="mb-s-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="h-px w-4 bg-ink-3 opacity-50" />
        <span className="eyebrow">
          Step {step} of 5 · {stepLabel}
        </span>
      </div>
      <h1 className="text-title font-medium text-ink mb-2">{title}</h1>
      <p className="text-body-lg text-ink-2 max-w-[560px]">{subtitle}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sticky footer CTA
 * ------------------------------------------------------------------ */
export function StickyFooter({
  back,
  next,
}: {
  back?: { label: string; to?: string; onClick?: () => void };
  next?: { label: string; to?: string; onClick?: () => void; disabled?: boolean };
}) {
  const navigate = useNavigate();
  const { savedAgo, isSaving } = useTemplate();

  return (
    <div className="sticky bottom-0 z-[5] bg-cream -mx-s-6 px-s-6 mt-s-5 pt-s-3 pb-s-3 border-t border-line">
      <div className="flex items-center gap-s-4">
        {back && (
          <Button
            variant="ghost"
            leadingIcon={<ArrowLeft size={14} strokeWidth={2} />}
            onClick={back.onClick ?? (() => back.to && navigate(back.to))}
          >
            {back.label}
          </Button>
        )}
        <SaveStatus savedAgo={savedAgo} isSaving={isSaving} />
        <div className="ml-auto flex items-center gap-s-3">
          <Button variant="secondary">Save as draft</Button>
          {next && (
            <Button
              trailingIcon={<ArrowRight size={14} strokeWidth={2.2} />}
              onClick={next.onClick ?? (() => next.to && navigate(next.to))}
              disabled={next.disabled}
            >
              {next.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SaveStatus({ savedAgo, isSaving }: { savedAgo: number; isSaving: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[12px] text-ink-3">
      <span
        className={`w-[6px] h-[6px] rounded-full ${
          isSaving ? "bg-gold" : "bg-mint"
        } ${isSaving ? "animate-pulse" : ""}`}
      />
      {isSaving
        ? "Saving…"
        : savedAgo === 0
          ? "Auto-saved · just now"
          : `Auto-saved · ${savedAgo} sec ago`}
    </span>
  );
}
