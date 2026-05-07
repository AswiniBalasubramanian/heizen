import { Shield, ListChecks, ArrowRight } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Stepper, StepHeader, StickyFooter } from "../components/Stepper";
import {
  AnnotationList,
  AnnotationPin,
  DocumentMetaBar,
} from "../components/annotation";
import { InfoCallout, SelectedBadge, Toggle } from "../components/primitives";
import { Field, NumberInput } from "../components/inputs";
import { COMPLIANCE_CHECKLISTS } from "../data";
import { useTemplate } from "../store";
import type { AnnotationEntry } from "../types";
import { useNavigate } from "react-router-dom";

const ANNOTATIONS: AnnotationEntry[] = [
  {
    number: 1,
    title: "Checklists are immutable once attached",
    body: "Compliance Immutability Rule — once this job is published, its checklist is frozen. Editing the job afterwards only affects new copies you spawn from it. The frozen behavior protects in-flight placements from regulatory drift.",
    pin: { top: "-10px", left: "-10px" },
  },
  {
    number: 2,
    title: "Approval chain is a flow, not a list",
    body: "Each toggle adds a step to a left-to-right flow. The visualization makes it obvious where bottlenecks will form. Auto-publish is mutually exclusive with required approvals — toggling it disables the others.",
    pin: { top: "-12px", right: "-10px" },
  },
  {
    number: 3,
    title: "Submission rules apply to vendor candidates",
    body: "Internal Flex Pool placements skip these checks — internal staff already have a verified employment record on file. Submission rules only enforce for vendor-sourced candidates.",
    pin: { top: "10px", left: "10px" },
  },
];

export default function Screen5Compliance() {
  const { template, update } = useTemplate();
  const navigate = useNavigate();
  const sub = template.submission;
  const app = template.approvals;
  const isInternalFlex = template.type === "internal-flex-pool";

  const toggleChecklist = (id: string) => {
    update(
      "checklists",
      template.checklists.includes(id)
        ? template.checklists.filter((c) => c !== id)
        : [...template.checklists, id]
    );
  };

  const setApproval = (key: keyof typeof app, value: boolean) => {
    if (key === "autoPublish" && value) {
      update("approvals", {
        hiringManager: false,
        departmentHead: false,
        complianceOfficer: false,
        autoPublish: true,
      });
    } else {
      update("approvals", { ...app, [key]: value, autoPublish: false });
    }
  };

  const totalChecklistItems = template.checklists.reduce(
    (acc, id) =>
      acc + (COMPLIANCE_CHECKLISTS.find((c) => c.id === id)?.items ?? 0),
    0
  );

  return (
    <>
      <DocumentMetaBar screen={5} step="Compliance" />
      <AppShell
        breadcrumb={[
          { label: "Requisitions", to: "/requisitions/templates" },
          { label: "Jobs", to: "/requisitions/templates" },
          { label: "New job" },
        ]}
      >
        <Stepper current={5} />

        <div className="mt-s-5">
          <StepHeader
            step={5}
            title="What rules govern submission and publish?"
            subtitle="Pick the compliance checklists candidates must satisfy and decide who has to sign off before this job goes live."
          />

          {/* Checklists */}
          <section className="mt-s-4">
            <div className="flex items-end justify-between mb-s-3">
              <div>
                <div className="eyebrow mb-1">Compliance checklists</div>
                <h2 className="text-heading font-medium text-ink flex items-center gap-2">
                  <Shield size={20} className="text-primary" strokeWidth={1.8} />
                  Saved checklists
                </h2>
                <p className="text-small text-ink-3 mt-1">
                  Select all that apply. Candidates must complete every item before placement
                  starts.
                </p>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-ink-3">Total items</div>
                <div className="text-heading font-medium text-ink tabular-nums">
                  {totalChecklistItems}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-s-3 relative">
              {COMPLIANCE_CHECKLISTS.map((c, i) => {
                const sel = template.checklists.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleChecklist(c.id)}
                    className={`relative text-left rounded-lg p-s-3 transition-all ${
                      sel
                        ? "bg-primary-50 border-[1.5px] border-primary"
                        : "bg-surface border border-line hover:border-line-2 hover:shadow-card-hover hover:-translate-y-[1px]"
                    }`}
                  >
                    {i === 0 && (
                      <AnnotationPin number={1} position={ANNOTATIONS[0].pin} />
                    )}
                    {sel && <SelectedBadge />}
                    <div className="flex items-center gap-2 mb-1">
                      <ListChecks
                        size={16}
                        className={sel ? "text-primary" : "text-ink-3"}
                        strokeWidth={1.8}
                      />
                      <span className="text-[14px] font-medium text-ink">{c.title}</span>
                    </div>
                    <p className="text-[12px] text-ink-3 leading-[1.5] mb-2">{c.description}</p>
                    <div className="text-[11px] font-mono text-ink-3">{c.items} items</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Approval workflow */}
          <section className="mt-s-5">
            <div className="eyebrow mb-1">Approval workflow</div>
            <h2 className="text-heading font-medium text-ink mb-1">Who has to sign off?</h2>
            <p className="text-small text-ink-3 mb-s-3">
              Approvals run in order — left to right. The template can't spawn jobs until every
              required step is complete.
            </p>

            <div className="relative bg-surface border border-line rounded-lg p-s-4">
              <AnnotationPin number={2} position={ANNOTATIONS[1].pin} />
              <ApprovalFlow
                steps={[
                  { label: "Hiring manager", on: app.hiringManager },
                  { label: "Department head", on: app.departmentHead },
                  { label: "Compliance officer", on: app.complianceOfficer },
                  { label: "Auto-publish", on: app.autoPublish, terminal: true },
                ]}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-s-3 mt-s-4">
                <ApprovalToggle
                  label="Hiring manager"
                  helper="Department-level approval"
                  checked={app.hiringManager}
                  onChange={(v) => setApproval("hiringManager", v)}
                  disabled={app.autoPublish}
                />
                <ApprovalToggle
                  label="Department head"
                  helper="Service-line owner"
                  checked={app.departmentHead}
                  onChange={(v) => setApproval("departmentHead", v)}
                  disabled={app.autoPublish}
                />
                <ApprovalToggle
                  label="Compliance officer"
                  helper="For high-risk roles"
                  checked={app.complianceOfficer}
                  onChange={(v) => setApproval("complianceOfficer", v)}
                  disabled={app.autoPublish}
                />
                <ApprovalToggle
                  label="Auto-publish"
                  helper="Skip approvals — spawns immediately"
                  checked={app.autoPublish}
                  onChange={(v) => setApproval("autoPublish", v)}
                  intent="warn"
                />
              </div>
            </div>
          </section>

          {/* Submission rules */}
          {!isInternalFlex && (
            <section className="mt-s-5">
              <div className="relative">
                <AnnotationPin number={3} position={ANNOTATIONS[2].pin} />
                <div className="eyebrow mb-1">Submission rules</div>
                <h2 className="text-heading font-medium text-ink mb-1">
                  What must vendors include?
                </h2>
                <p className="text-small text-ink-3 mb-s-3">
                  Set the minimum bar for a candidate submission. Anything missing is rejected
                  at intake.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-s-3">
                <SubmissionToggle
                  label="Resume required"
                  helper="PDF, max 2MB"
                  checked={sub.resumeRequired}
                  onChange={(v) =>
                    update("submission", { ...sub, resumeRequired: v })
                  }
                />
                <SubmissionToggle
                  label="Skills assessment"
                  helper="Specialty-matched, 20 min"
                  checked={sub.skillsAssessment}
                  onChange={(v) =>
                    update("submission", { ...sub, skillsAssessment: v })
                  }
                />
                <SubmissionToggle
                  label="Vendor screening call"
                  helper="Vendor confirms availability"
                  checked={sub.vendorScreeningCall}
                  onChange={(v) =>
                    update("submission", { ...sub, vendorScreeningCall: v })
                  }
                />
                <div className="bg-surface border border-line rounded-lg p-s-3">
                  <Field label="Professional references" helper="Minimum count, 0 to skip">
                    <NumberInput
                      value={sub.referencesCount}
                      onChange={(v) =>
                        update("submission", { ...sub, referencesCount: v })
                      }
                      min={0}
                      max={5}
                    />
                  </Field>
                </div>
              </div>
            </section>
          )}

          <div className="mt-s-4">
            <InfoCallout title="Immutability Rule.">
              The version of each checklist attached here is snapshotted when this job
              is published. Edits to a checklist template afterwards (for example, adding
              an item to RN Licensure) have no effect on ongoing jobs — only on future
              jobs that attach the updated checklist.
            </InfoCallout>
          </div>

          <StickyFooter
            back={{
              label: "Back to previous step",
              to: "/requisitions/templates/new/compensation",
            }}
            next={{
              label: "Publish job",
              onClick: () => navigate("/requisitions/templates/new/done"),
              disabled: template.checklists.length === 0,
            }}
          />
        </div>
      </AppShell>
      <AnnotationList entries={ANNOTATIONS} />
    </>
  );
}

function ApprovalFlow({
  steps,
}: {
  steps: { label: string; on: boolean; terminal?: boolean }[];
}) {
  const enabledSteps = steps.filter((s) => s.on);
  if (enabledSteps.length === 0) {
    return (
      <div className="text-[13px] text-ink-3 italic">
        No approvals selected — template can't publish until at least one approver is set.
      </div>
    );
  }
  return (
    <div className="flex items-center flex-wrap gap-2">
      {enabledSteps.map((s, i) => (
        <span key={s.label} className="inline-flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 h-9 px-3 rounded-md text-[13px] font-medium border ${
              s.terminal
                ? "bg-coral-light border-coral/30 text-[#993C1D]"
                : "bg-primary-50 border-primary-100 text-primary"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full grid place-items-center text-[10px] font-mono ${
                s.terminal ? "bg-coral text-white" : "bg-primary text-ink-on-dark"
              }`}
            >
              {i + 1}
            </span>
            {s.label}
          </span>
          {i < enabledSteps.length - 1 && (
            <ArrowRight size={14} className="text-ink-3" strokeWidth={1.8} />
          )}
        </span>
      ))}
    </div>
  );
}

function ApprovalToggle({
  label,
  helper,
  checked,
  onChange,
  disabled,
  intent,
}: {
  label: string;
  helper: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  intent?: "warn";
}) {
  return (
    <div
      className={`bg-surface border rounded-lg p-s-3 ${
        disabled ? "opacity-40" : ""
      } ${
        checked
          ? intent === "warn"
            ? "border-coral/40"
            : "border-primary-100"
          : "border-line"
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="text-[13px] font-medium text-ink">{label}</div>
        <Toggle
          checked={checked}
          onChange={(v) => !disabled && onChange(v)}
          ariaLabel={label}
        />
      </div>
      <div className="text-[12px] text-ink-3">{helper}</div>
    </div>
  );
}

function SubmissionToggle({
  label,
  helper,
  checked,
  onChange,
}: {
  label: string;
  helper: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className={`bg-surface border rounded-lg p-s-3 ${
        checked ? "border-primary-100" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="text-[13px] font-medium text-ink">{label}</div>
        <Toggle checked={checked} onChange={onChange} ariaLabel={label} />
      </div>
      <div className="text-[12px] text-ink-3">{helper}</div>
    </div>
  );
}
