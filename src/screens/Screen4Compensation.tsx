import { Sparkles } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Stepper, StepHeader, StickyFooter } from "../components/Stepper";
import {
  AnnotationList,
  AnnotationPin,
  DocumentMetaBar,
} from "../components/annotation";
import { InfoCallout, Toggle } from "../components/primitives";
import {
  CurrencyInput,
  Field,
  NumberInput,
  TextInput,
} from "../components/inputs";
import { useTemplate } from "../store";
import type { AnnotationEntry } from "../types";

const ANNOTATIONS: AnnotationEntry[] = [
  {
    number: 1,
    title: "Bill rate is what the org pays",
    body: "This is the all-in hourly rate billed to the organisation. Vendor margin and per-vendor pay rates are calculated downstream and are never displayed in this portal — visibility is enforced at the data layer, not by hiding fields with color.",
    pin: { top: "10px", right: "10px" },
  },
  {
    number: 2,
    title: "Positions controls job spawn",
    body: "Number of positions controls how many slots open under this job. Editing the job after publish doesn't retroactively change positions already filled — that's the Snapshot Rule.",
    pin: { top: "10px", right: "10px" },
  },
  {
    number: 3,
    title: "Incentives are optional but flagged",
    body: "We surface a soft warning if no sign-on bonus is set for high-demand specialties (ICU, Emergency). Not a hard block — sometimes orgs negotiate this off-platform — but it's the kind of thing that closes vendor placements 40% faster when present.",
    pin: { top: "-4px", left: "108px" },
  },
];

export default function Screen4Compensation() {
  const { template, update } = useTemplate();
  const isInternalFlex = template.type === "internal-flex-pool";
  const inc = template.incentives;

  return (
    <>
      <DocumentMetaBar screen={4} step="Compensation" />
      <AppShell
        breadcrumb={[
          { label: "Requisitions", to: "/requisitions/templates" },
          { label: "Jobs", to: "/requisitions/templates" },
          { label: "New job" },
        ]}
      >
        <Stepper current={4} />

        <div className="mt-s-5">
          <StepHeader
            step={4}
            title="What's the compensation envelope?"
            subtitle="Set what the organisation will pay for this role and how many positions to fill. Vendor rates and margin are computed downstream — they never appear here."
          />

          {/* Top compensation grid */}
          <div className="grid grid-cols-3 gap-s-4 mt-s-4">
            {!isInternalFlex && (
              <div className="relative">
                <AnnotationPin number={1} position={ANNOTATIONS[0].pin} />
                <Field label="Bill rate" helper="Per hour, USD" required>
                  <CurrencyInput
                    value={template.billRate}
                    onChange={(v) => update("billRate", v)}
                  />
                </Field>
              </div>
            )}

            <div className="relative">
              <AnnotationPin number={2} position={ANNOTATIONS[1].pin} />
              <Field label="Number of positions" helper="Each position is a separate hire under this job" required>
                <NumberInput
                  value={template.positions}
                  onChange={(v) => update("positions", v)}
                  min={1}
                  max={500}
                />
              </Field>
            </div>

            <Field
              label="Overtime multiplier"
              helper="Applied to hours above 40/week"
            >
              <TextInput
                type="number"
                step={0.1}
                min={1}
                max={3}
                value={template.overtimeMultiplier}
                onChange={(e) =>
                  update("overtimeMultiplier", Number(e.target.value) || 1.5)
                }
              />
            </Field>
          </div>

          {isInternalFlex && (
            <div className="mt-s-4">
              <InfoCallout variant="warn" title="Internal Flex Pool roles use existing comp.">
                Internal redeployment uses the staff member's existing compensation — no bill
                rate is set on this job. The Vendor portal won't see this requisition.
              </InfoCallout>
            </div>
          )}

          {/* Incentives section */}
          <div className="relative mt-s-5">
            <AnnotationPin number={3} position={ANNOTATIONS[2].pin} />

            <div className="flex items-center justify-between mb-s-3">
              <div>
                <div className="eyebrow mb-1">Incentives</div>
                <h2 className="text-heading font-medium text-ink">
                  Optional add-ons
                </h2>
                <p className="text-small text-ink-3 mt-1">
                  Surfaced to vendors and shown to candidates on the offer page.
                </p>
              </div>
              <Sparkles size={20} className="text-gold" strokeWidth={1.6} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-s-3">
              <IncentiveRow
                label="Sign-on bonus"
                helper="Paid on day 1 of placement"
                enabled={inc.signOnBonus.enabled}
                onToggle={(v) =>
                  update("incentives", {
                    ...inc,
                    signOnBonus: { ...inc.signOnBonus, enabled: v },
                  })
                }
                amount={inc.signOnBonus.amount}
                onAmountChange={(v) =>
                  update("incentives", {
                    ...inc,
                    signOnBonus: { ...inc.signOnBonus, amount: v },
                  })
                }
                kind="currency"
              />
              <IncentiveRow
                label="Completion bonus"
                helper="Paid at end of contract"
                enabled={inc.completionBonus.enabled}
                onToggle={(v) =>
                  update("incentives", {
                    ...inc,
                    completionBonus: { ...inc.completionBonus, enabled: v },
                  })
                }
                amount={inc.completionBonus.amount}
                onAmountChange={(v) =>
                  update("incentives", {
                    ...inc,
                    completionBonus: { ...inc.completionBonus, amount: v },
                  })
                }
                kind="currency"
              />
              <IncentiveRow
                label="Referral bonus"
                helper="Paid to candidate referrer"
                enabled={inc.referralBonus.enabled}
                onToggle={(v) =>
                  update("incentives", {
                    ...inc,
                    referralBonus: { ...inc.referralBonus, enabled: v },
                  })
                }
                amount={inc.referralBonus.amount}
                onAmountChange={(v) =>
                  update("incentives", {
                    ...inc,
                    referralBonus: { ...inc.referralBonus, amount: v },
                  })
                }
                kind="currency"
              />
              <IncentiveRow
                label="Holiday differential"
                helper="Multiplier on bill rate"
                enabled={inc.holidayDifferential.enabled}
                onToggle={(v) =>
                  update("incentives", {
                    ...inc,
                    holidayDifferential: {
                      ...inc.holidayDifferential,
                      enabled: v,
                    },
                  })
                }
                amount={inc.holidayDifferential.value}
                onAmountChange={(v) =>
                  update("incentives", {
                    ...inc,
                    holidayDifferential: {
                      ...inc.holidayDifferential,
                      value: v,
                    },
                  })
                }
                kind="multiplier"
              />
              <IncentiveRow
                label="Night differential"
                helper="Per hour, on top of bill rate"
                enabled={inc.nightDifferential.enabled}
                onToggle={(v) =>
                  update("incentives", {
                    ...inc,
                    nightDifferential: { ...inc.nightDifferential, enabled: v },
                  })
                }
                amount={inc.nightDifferential.amount}
                onAmountChange={(v) =>
                  update("incentives", {
                    ...inc,
                    nightDifferential: { ...inc.nightDifferential, amount: v },
                  })
                }
                kind="currency"
              />
            </div>
          </div>

          {!inc.signOnBonus.enabled && template.specialty === "Intensive Care (ICU)" && (
            <div className="mt-s-4">
              <InfoCallout variant="warn" title="No sign-on bonus on a high-demand specialty.">
                ICU placements close ~40% faster when a sign-on bonus is offered. You can still
                publish without one — this is informational, not a block.
              </InfoCallout>
            </div>
          )}

          <StickyFooter
            back={{
              label: "Back to Schedule",
              to: "/requisitions/templates/new/schedule",
            }}
            next={{
              label: "Continue to Compliance",
              to: "/requisitions/templates/new/compliance",
              disabled: !isInternalFlex && template.billRate <= 0,
            }}
          />
        </div>
      </AppShell>
      <AnnotationList entries={ANNOTATIONS} />
    </>
  );
}

function IncentiveRow({
  label,
  helper,
  enabled,
  onToggle,
  amount,
  onAmountChange,
  kind,
}: {
  label: string;
  helper: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  amount: number;
  onAmountChange: (v: number) => void;
  kind: "currency" | "multiplier";
}) {
  return (
    <div
      className={`bg-surface border rounded-lg p-s-3 transition-colors ${
        enabled ? "border-primary-100" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between mb-s-2">
        <div>
          <div className="text-[14px] font-medium text-ink">{label}</div>
          <div className="text-[12px] text-ink-3">{helper}</div>
        </div>
        <Toggle checked={enabled} onChange={onToggle} ariaLabel={`Enable ${label}`} />
      </div>
      <div className={enabled ? "opacity-100" : "opacity-40 pointer-events-none"}>
        {kind === "currency" ? (
          <CurrencyInput value={amount} onChange={onAmountChange} />
        ) : (
          <TextInput
            type="number"
            step={0.1}
            min={1}
            max={3}
            value={amount}
            onChange={(e) => onAmountChange(Number(e.target.value) || 1)}
          />
        )}
      </div>
    </div>
  );
}
