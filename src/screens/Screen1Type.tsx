import { Clock, CalendarDays, UserCheck, Globe } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Stepper, StepHeader, StickyFooter } from "../components/Stepper";
import {
  AnnotationList,
  AnnotationPin,
  DocumentMetaBar,
} from "../components/annotation";
import { Tag, InfoCallout, SelectedBadge } from "../components/primitives";
import { TYPE_OPTIONS } from "../data";
import { useTemplate } from "../store";
import type { AnnotationEntry, TemplateType } from "../types";

const ICONS = {
  clock: Clock,
  "calendar-days": CalendarDays,
  "user-check": UserCheck,
  globe: Globe,
} as const;

const ANNOTATIONS: AnnotationEntry[] = [
  {
    number: 1,
    title: "Cards over dropdown — deliberate weight",
    body: "The four types are mutually exclusive and downstream-consequential. A dropdown would compress the choice; cards force users to read the descriptions and understand what each type implies. Each card carries a 3-tag fingerprint so users can scan-compare without reading every word.",
    pin: { top: "12px", left: "12px" },
  },
  {
    number: 2,
    title: "Internal Flex Pool flagged differently",
    body: "“Internal only” tag uses the coral warning treatment — this type changes downstream behavior significantly (no vendor visibility, no bill-rate field in Step 4). The visual difference primes the user before they pick.",
    pin: { top: "12px", right: "12px" },
  },
  {
    number: 3,
    title: "Lock-in warning is honest, not dramatic",
    body: "Type can be changed after Step 2 because it forks the data model. Rather than a modal confirmation later, the warning sits inline at the moment of choice — and offers a sensible escape hatch (duplicate the job).",
    pin: { top: "12px", right: "12px" },
  },
];

export default function Screen1Type() {
  const { template, update } = useTemplate();

  return (
    <>
      <DocumentMetaBar screen={1} step="Type Selection" />
      <AppShell
        breadcrumb={[
          { label: "Requisitions", to: "/requisitions/templates" },
          { label: "Jobs", to: "/requisitions/templates" },
          { label: "New job" },
        ]}
      >
        <Stepper current={1} />

        <div className="mt-s-5">
          <StepHeader
            step={1}
            title="What kind of role are you filling?"
            subtitle="Pick the engagement type. This shapes the fields you'll see in the next four steps — and how this job behaves once it goes live."
          />

          {/* Type cards grid */}
          <div className="grid grid-cols-2 gap-s-3 mt-s-4">
            {TYPE_OPTIONS.map((opt, i) => {
              const Icon = ICONS[opt.icon];
              const selected = template.type === opt.id;
              const showPin1 = i === 0; // Long-Term Order
              const showPin2 = i === 3; // Internal Flex Pool

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update("type", opt.id as TemplateType)}
                  className={`relative text-left transition-all duration-[180ms] rounded-lg p-s-4 ${
                    selected
                      ? "bg-primary-50 border-[1.5px] border-primary"
                      : "bg-surface border border-line hover:border-line-2 hover:shadow-card-hover hover:-translate-y-[1px]"
                  }`}
                  style={{ minHeight: 168 }}
                >
                  {showPin1 && <AnnotationPin number={1} position={ANNOTATIONS[0].pin} />}
                  {showPin2 && <AnnotationPin number={2} position={ANNOTATIONS[1].pin} />}
                  {selected && <SelectedBadge />}

                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-9 h-9 grid place-items-center rounded-md bg-mint-light text-primary shrink-0">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <div>
                      <div className="text-[16px] font-medium text-ink leading-tight">
                        {opt.title}
                      </div>
                    </div>
                  </div>
                  <p className="text-small text-ink-2 mb-s-3 leading-[1.55]">
                    {opt.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {opt.tags.map((t) => (
                      <Tag
                        key={t.label}
                        variant={selected ? "selected" : t.variant ?? "default"}
                      >
                        {t.label}
                      </Tag>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Lock-in callout */}
          <div className="relative mt-s-4">
            <AnnotationPin number={3} position={ANNOTATIONS[2].pin} />
            <InfoCallout title="Type can't be changed after Step 2.">
              It determines which fields appear in the rest of this flow. Pick carefully — but
              if you change your mind later, you can duplicate this job and swap the type.
            </InfoCallout>
          </div>

          <StickyFooter
            back={{ label: "Back to jobs" }}
            next={{
              label: "Continue to Details",
              to: "/requisitions/templates/new/details",
            }}
          />
        </div>
      </AppShell>
      <AnnotationList entries={ANNOTATIONS} />
    </>
  );
}
