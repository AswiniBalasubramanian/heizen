import { Plus, Trash2, Sun, Sunset, Moon, CalendarRange, BellRing } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Stepper, StepHeader, StickyFooter } from "../components/Stepper";
import {
  AnnotationList,
  AnnotationPin,
  DocumentMetaBar,
} from "../components/annotation";
import { Button, InfoCallout } from "../components/primitives";
import { DayPicker, Field, TimeInput } from "../components/inputs";
import { useTemplate } from "../store";
import type { AnnotationEntry, Shift, ShiftType } from "../types";

const SHIFT_TYPES: {
  id: ShiftType;
  label: string;
  icon: typeof Sun;
  defaultStart: string;
  defaultEnd: string;
}[] = [
  { id: "day", label: "Day", icon: Sun, defaultStart: "07:00", defaultEnd: "19:00" },
  { id: "evening", label: "Evening", icon: Sunset, defaultStart: "15:00", defaultEnd: "23:00" },
  { id: "night", label: "Night", icon: Moon, defaultStart: "19:00", defaultEnd: "07:00" },
  {
    id: "weekend",
    label: "Weekend",
    icon: CalendarRange,
    defaultStart: "07:00",
    defaultEnd: "19:00",
  },
  { id: "on-call", label: "On-call", icon: BellRing, defaultStart: "00:00", defaultEnd: "00:00" },
];

const ANNOTATIONS: AnnotationEntry[] = [
  {
    number: 1,
    title: "Shift type seeds the row",
    body: "Picking a type pre-fills sensible default times so the user only adjusts what's specific to their facility. Less typing, fewer errors.",
    pin: { top: "76px", right: "12px" },
  },
  {
    number: 2,
    title: "Time inputs auto-jump",
    body: "Two paired 2-digit inputs separated by colon. Hours field jumps to minutes after 2 chars typed — keeps the user on the keyboard, no mouse round-trip.",
    pin: { top: "-12px", right: "12px" },
  },
  {
    number: 3,
    title: "Hours/week is computed, not asked",
    body: "Total hours sum across all shifts and selected days. Displayed inline so the user catches over-scheduling before publishing — vendors see this number and won't submit candidates against unrealistic loads.",
    pin: { top: "10px", right: "10px" },
  },
];

function calcWeeklyHours(shifts: Shift[]): number {
  return shifts.reduce((acc, s) => {
    const [sh, sm] = s.start.split(":").map(Number);
    const [eh, em] = s.end.split(":").map(Number);
    let mins = eh * 60 + em - (sh * 60 + sm);
    if (mins <= 0) mins += 24 * 60; // crosses midnight
    const hrs = mins / 60;
    return acc + hrs * s.days.length;
  }, 0);
}

export default function Screen3Schedule() {
  const { template, update } = useTemplate();

  const updateShift = (id: string, patch: Partial<Shift>) => {
    update(
      "shifts",
      template.shifts.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };
  const removeShift = (id: string) =>
    update("shifts", template.shifts.filter((s) => s.id !== id));
  const addShift = () => {
    const id = `shift-${Date.now()}`;
    update("shifts", [
      ...template.shifts,
      {
        id,
        type: "day",
        start: "07:00",
        end: "19:00",
        days: ["mon", "tue", "wed"],
      },
    ]);
  };
  const setShiftType = (id: string, t: ShiftType) => {
    const meta = SHIFT_TYPES.find((x) => x.id === t)!;
    updateShift(id, { type: t, start: meta.defaultStart, end: meta.defaultEnd });
  };

  const weeklyHours = calcWeeklyHours(template.shifts);

  return (
    <>
      <DocumentMetaBar screen={3} step="Shift & schedule" />
      <AppShell
        breadcrumb={[
          { label: "Requisitions", to: "/requisitions/templates" },
          { label: "Jobs", to: "/requisitions/templates" },
          { label: "New job" },
        ]}
      >
        <Stepper current={3} />

        <div className="mt-s-5">
          <StepHeader
            step={3}
            title="When will the role work?"
            subtitle="Add one or more shifts. Each shift can run on different days at different times — vendors will see the full schedule before submitting candidates."
          />

          <div className="flex flex-col gap-s-3 mt-s-4">
            {template.shifts.map((shift, idx) => (
              <div
                key={shift.id}
                className="relative bg-surface border border-line rounded-lg p-s-4"
              >
                {idx === 0 && (
                  <AnnotationPin number={1} position={ANNOTATIONS[0].pin} />
                )}

                <div className="flex items-center justify-between mb-s-3">
                  <div className="eyebrow">Shift {idx + 1}</div>
                  {template.shifts.length > 1 && (
                    <button
                      onClick={() => removeShift(shift.id)}
                      className="inline-flex items-center gap-1 text-[12px] text-ink-3 hover:text-coral transition-colors"
                    >
                      <Trash2 size={12} strokeWidth={1.8} /> Remove
                    </button>
                  )}
                </div>

                <Field label="Shift type">
                  <div className="flex flex-wrap gap-2">
                    {SHIFT_TYPES.map((t) => {
                      const Icon = t.icon;
                      const active = shift.type === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setShiftType(shift.id, t.id)}
                          className={`inline-flex items-center gap-2 h-9 px-3 rounded-md border text-[13px] transition-colors ${
                            active
                              ? "bg-primary-50 border-primary-100 text-primary font-medium"
                              : "bg-surface border-line text-ink-2 hover:border-line-2"
                          }`}
                        >
                          <Icon size={14} strokeWidth={1.8} />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-s-4 mt-s-3">
                  <div className="relative">
                    {idx === 0 && (
                      <AnnotationPin number={2} position={ANNOTATIONS[1].pin} />
                    )}
                    <Field label="Start time">
                      <TimeInput
                        value={shift.start}
                        onChange={(v) => updateShift(shift.id, { start: v })}
                      />
                    </Field>
                  </div>
                  <Field label="End time">
                    <TimeInput
                      value={shift.end}
                      onChange={(v) => updateShift(shift.id, { end: v })}
                    />
                  </Field>
                </div>

                <div className="mt-s-3">
                  <Field label="Days">
                    <DayPicker
                      value={shift.days}
                      onChange={(days) => updateShift(shift.id, { days })}
                    />
                  </Field>
                </div>
              </div>
            ))}

            <button
              onClick={addShift}
              className="inline-flex items-center justify-center gap-2 h-12 rounded-lg border border-dashed border-line-2 text-[13px] text-ink-3 hover:text-ink-2 hover:border-ink-4 transition-colors"
            >
              <Plus size={14} strokeWidth={2} />
              Add another shift
            </button>
          </div>

          <div className="relative mt-s-4">
            <AnnotationPin number={3} position={ANNOTATIONS[2].pin} />
            <div className="bg-surface-muted border border-line rounded-lg p-s-4 flex items-center justify-between">
              <div>
                <div className="eyebrow mb-1">Weekly load</div>
                <div className="text-heading font-medium text-ink">
                  {weeklyHours.toFixed(1)} hrs / week
                </div>
                <p className="text-small text-ink-3 mt-1">
                  Computed from {template.shifts.length} shift{template.shifts.length === 1 ? "" : "s"}.
                  Vendors see this exact number.
                </p>
              </div>
              <div className="flex items-center gap-s-3">
                <Stat label="Shifts" value={String(template.shifts.length)} />
                <Stat
                  label="Days covered"
                  value={String(
                    new Set(template.shifts.flatMap((s) => s.days)).size
                  )}
                />
              </div>
            </div>
          </div>

          {template.type === "long-term-order" && (
            <div className="mt-s-3">
              <InfoCallout title="Long-Term Orders run on a recurring schedule.">
                The shifts you set above will repeat each week until the order is closed.
                Vendors will only submit candidates whose availability covers all selected days.
              </InfoCallout>
            </div>
          )}

          <StickyFooter
            back={{
              label: "Back to previous step",
              to: "/requisitions/templates/new/details",
            }}
            next={{
              label: "Continue to Compensation",
              to: "/requisitions/templates/new/compensation",
              disabled: template.shifts.length === 0,
            }}
          />
        </div>
      </AppShell>
      <AnnotationList entries={ANNOTATIONS} />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-line rounded-md px-s-3 py-2 text-center min-w-[80px]">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-3 font-medium">
        {label}
      </div>
      <div className="text-[18px] font-medium text-ink tabular-nums">{value}</div>
    </div>
  );
}
