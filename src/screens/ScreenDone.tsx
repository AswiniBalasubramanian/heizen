import { useEffect } from "react";
import { CheckCircle2, ClipboardList, ArrowRight, Copy, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { AppShell } from "../components/AppShell";
import { Button, Tag } from "../components/primitives";
import { DocumentMetaBar } from "../components/annotation";
import { useTemplate } from "../store";
import { TYPE_OPTIONS } from "../data";

/* On-system celebration palette — primary, mint, gold, coral light */
const CELEBRATION_COLORS = ["#1E4E47", "#7FB7A5", "#D9A741", "#E07856", "#DDEFE7"];

function celebrate() {
  // Center burst
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 35,
    origin: { x: 0.5, y: 0.45 },
    colors: CELEBRATION_COLORS,
    scalar: 0.9,
    ticks: 220,
  });
  // Side cannons (offset slightly so they read as "from the headline")
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0.15, y: 0.55 },
      colors: CELEBRATION_COLORS,
      scalar: 0.8,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 0.85, y: 0.55 },
      colors: CELEBRATION_COLORS,
      scalar: 0.8,
    });
  }, 180);
  // Drifty trailing burst
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 100,
      startVelocity: 25,
      origin: { x: 0.5, y: 0.4 },
      colors: CELEBRATION_COLORS,
      scalar: 1.1,
      gravity: 0.6,
      ticks: 300,
    });
  }, 400);
}

export default function ScreenDone() {
  const { template, reset } = useTemplate();
  const navigate = useNavigate();
  const typeMeta = TYPE_OPTIONS.find((t) => t.id === template.type);

  useEffect(() => {
    const id = window.setTimeout(celebrate, 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <DocumentMetaBar screen={5} step="Published" />
      <AppShell
        breadcrumb={[
          { label: "Requisitions", to: "/requisitions/templates" },
          { label: "Jobs", to: "/requisitions/templates" },
          { label: template.name || "New job" },
        ]}
      >
        <div className="max-w-[760px] mx-auto mt-s-7 text-center">
          <div className="inline-flex w-14 h-14 rounded-full bg-mint-light items-center justify-center mb-s-4">
            <CheckCircle2 size={28} className="text-primary" strokeWidth={1.8} />
          </div>
          <div className="eyebrow mb-2 text-mint">Published</div>
          <h1 className="text-title font-medium text-ink mb-2">
            Job is live.
          </h1>
          <p className="text-body-lg text-ink-2 max-w-[520px] mx-auto">
            {template.positions} position{template.positions === 1 ? "" : "s"} will open under
            this job
            {template.approvals.autoPublish
              ? " — auto-published, no approvals."
              : " once approvals are complete."}
          </p>

          <div className="bg-surface border border-line rounded-lg p-s-5 mt-s-5 text-left">
            <div className="flex items-center gap-3 mb-s-3">
              <ClipboardList size={20} className="text-primary" strokeWidth={1.8} />
              <div>
                <div className="eyebrow mb-1">{typeMeta?.title}</div>
                <div className="text-heading font-medium text-ink">{template.name}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-s-5 gap-y-s-3 mt-s-4 text-[13px]">
              <Row label="Occupation" value={`${template.occupation} · ${template.specialty}`} />
              <Row label="Location" value={template.location} />
              <Row label="Department" value={template.department} />
              <Row
                label="Bill rate"
                value={
                  template.type === "internal-flex-pool"
                    ? "Internal — uses existing comp"
                    : `$${template.billRate}/hr`
                }
              />
              <Row label="Positions" value={String(template.positions)} />
              <Row
                label="Shifts"
                value={`${template.shifts.length} (${template.shifts
                  .map((s) => s.type)
                  .join(", ")})`}
              />
              <Row
                label="Compliance"
                value={`${template.checklists.length} checklists attached`}
              />
              <Row
                label="Approvals"
                value={
                  template.approvals.autoPublish
                    ? "Auto-publish"
                    : Object.entries(template.approvals)
                        .filter(([k, v]) => v && k !== "autoPublish")
                        .map(([k]) =>
                          k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())
                        )
                        .join(" → ") || "None"
                }
              />
            </div>

            <div className="mt-s-4 pt-s-3 border-t border-line flex flex-wrap gap-2">
              {template.benefits.slice(0, 6).map((b) => (
                <Tag key={b}>{b}</Tag>
              ))}
              {template.benefits.length > 6 && (
                <Tag>+{template.benefits.length - 6} more</Tag>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-s-3 mt-s-5">
            <Button
              variant="secondary"
              leadingIcon={<Eye size={14} strokeWidth={1.8} />}
              onClick={() => navigate("/requisitions/templates/new/type")}
            >
              View live jobs
            </Button>
            <Button
              variant="secondary"
              leadingIcon={<Copy size={14} strokeWidth={1.8} />}
              onClick={() => {
                reset();
                navigate("/requisitions/templates/new/type");
              }}
            >
              Duplicate job
            </Button>
            <Button
              trailingIcon={<ArrowRight size={14} strokeWidth={2.2} />}
              onClick={() => {
                reset();
                navigate("/requisitions/templates/new/type");
              }}
            >
              Create another
            </Button>
          </div>
        </div>
      </AppShell>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow mb-1">{label}</div>
      <div className="text-ink">{value}</div>
    </div>
  );
}
