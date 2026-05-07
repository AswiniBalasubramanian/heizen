import { AppShell } from "../components/AppShell";
import { Stepper, StepHeader, StickyFooter } from "../components/Stepper";
import {
  AnnotationList,
  AnnotationPin,
  DocumentMetaBar,
} from "../components/annotation";
import { InfoCallout } from "../components/primitives";
import {
  ChipSelect,
  Dropdown,
  Field,
  TextInput,
} from "../components/inputs";
import {
  BENEFITS,
  DEPARTMENTS,
  LOCATIONS,
  OCCUPATIONS,
  SPECIALTIES_BY_OCCUPATION,
} from "../data";
import { useTemplate } from "../store";
import type { AnnotationEntry } from "../types";

const ANNOTATIONS: AnnotationEntry[] = [
  {
    number: 1,
    title: "Specialty cascades from Occupation",
    body: "Specialty options change based on Occupation, so the user can't pick an impossible combination. If Occupation changes, Specialty resets — clearly indicated by an animated reset, not silent loss.",
    pin: { top: "10px", right: "10px" },
  },
  {
    number: 2,
    title: "Benefits as chips, not checkboxes",
    body: "Multi-select chips read faster, take less vertical space, and let users scan a horizontal cohort of selections at once. “+ Add custom” gives an escape hatch without cluttering the default set.",
    pin: { top: "10px", right: "10px" },
  },
  {
    number: 3,
    title: "Department & Location scoped to org",
    body: "Hiring managers see only their assigned scope. The hierarchy of Mercy Health Group is enforced at the data layer — these dropdowns never expose facilities the user doesn't manage.",
    pin: { top: "10px", left: "10px" },
  },
];

export default function Screen2Details() {
  const { template, update } = useTemplate();
  const specialties = SPECIALTIES_BY_OCCUPATION[template.occupation] ?? [];

  return (
    <>
      <DocumentMetaBar screen={2} step="Details" />
      <AppShell
        breadcrumb={[
          { label: "Requisitions", to: "/requisitions/templates" },
          { label: "Jobs", to: "/requisitions/templates" },
          { label: "New job" },
        ]}
      >
        <Stepper current={2} />

        <div className="mt-s-5">
          <StepHeader
            step={2}
            title="Who are you hiring, and where?"
            subtitle="Name the job, then describe the role's identity. Vendors will see this exact framing when matching candidates."
          />

          <div className="grid grid-cols-2 gap-x-s-5 gap-y-s-3 mt-s-4">
            <div className="col-span-2">
              <Field
                label="Job name"
                helper="Visible internally and on submitted candidate rosters. 80 characters max."
                required
              >
                <TextInput
                  value={template.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. 13-Week ICU Travel Contract"
                  maxLength={80}
                />
              </Field>
            </div>

            <Field label="Occupation" required>
              <Dropdown
                value={template.occupation}
                onChange={(v) => {
                  update("occupation", v);
                  // reset specialty if not valid for new occupation
                  const valid = SPECIALTIES_BY_OCCUPATION[v] ?? [];
                  if (!valid.includes(template.specialty)) update("specialty", valid[0] ?? "");
                }}
                options={OCCUPATIONS}
              />
            </Field>

            <div className="relative">
              <AnnotationPin number={1} position={ANNOTATIONS[0].pin} />
              <Field
                label="Specialty"
                helper={`${specialties.length} options for ${template.occupation || "this occupation"}.`}
                required
              >
                <Dropdown
                  value={template.specialty}
                  onChange={(v) => update("specialty", v)}
                  options={specialties}
                />
              </Field>
            </div>

            <div className="relative">
              <AnnotationPin number={3} position={ANNOTATIONS[2].pin} />
              <Field label="Location" required>
                <Dropdown
                  value={template.location}
                  onChange={(v) => update("location", v)}
                  options={LOCATIONS}
                />
              </Field>
            </div>

            <Field label="Department" required>
              <Dropdown
                value={template.department}
                onChange={(v) => update("department", v)}
                options={DEPARTMENTS}
              />
            </Field>

            <div className="col-span-2 relative mt-s-2">
              <AnnotationPin number={2} position={ANNOTATIONS[1].pin} />
              <Field
                label="Benefits"
                helper="Select all that apply. Surfaced to candidates and used by vendors when ranking matches."
              >
                <ChipSelect
                  options={BENEFITS}
                  value={template.benefits}
                  onChange={(v) => update("benefits", v)}
                />
              </Field>
            </div>
          </div>

          <div className="mt-s-4">
            <InfoCallout title="Why we ask for this.">
              Vendors filter the open requisitions feed by occupation, specialty, and location.
              Vague templates surface fewer matches; specific ones bring qualified candidates
              faster.
            </InfoCallout>
          </div>

          <StickyFooter
            back={{
              label: "Back to Type",
              to: "/requisitions/templates/new/type",
            }}
            next={{
              label: "Continue to Shift & schedule",
              to: "/requisitions/templates/new/schedule",
              disabled:
                !template.name ||
                !template.occupation ||
                !template.specialty ||
                !template.location ||
                !template.department,
            }}
          />
        </div>
      </AppShell>
      <AnnotationList entries={ANNOTATIONS} />
    </>
  );
}
