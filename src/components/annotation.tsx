import { useAnnotations } from "../store";
import type { AnnotationEntry } from "../types";

/* Pin — numbered coral circle, absolutely positioned by parent */
export function AnnotationPin({
  number,
  position,
}: {
  number: number;
  position: { top: string; right?: string; left?: string };
}) {
  const { annotationsOn } = useAnnotations();
  if (!annotationsOn) return null;

  return (
    <span
      className="absolute z-20 w-[22px] h-[22px] rounded-full bg-coral text-white font-mono font-semibold text-[11px] grid place-items-center select-none"
      style={{
        ...position,
        boxShadow: "0 2px 8px rgba(224,120,86,0.4)",
      }}
      aria-hidden="true"
    >
      {number}
    </span>
  );
}

/* Toggle (sits in topbar) */
export function AnnotationToggle() {
  const { annotationsOn, toggle } = useAnnotations();
  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 h-9 px-3 rounded-md border text-[12px] font-medium transition-colors ${
        annotationsOn
          ? "bg-coral text-white border-coral hover:bg-coral/90"
          : "bg-surface text-ink-2 border-line hover:border-line-2"
      }`}
      title="Toggle design annotations"
    >
      <span
        className={`w-2 h-2 rounded-full ${annotationsOn ? "bg-white" : "bg-coral"}`}
      />
      {annotationsOn ? "Annotations on" : "Annotations off"}
    </button>
  );
}

/* List below the canvas — only visible when annotations are on */
export function AnnotationList({ entries }: { entries: AnnotationEntry[] }) {
  const { annotationsOn } = useAnnotations();
  if (!annotationsOn) return null;

  return (
    <div className="bg-surface border border-line rounded-lg p-s-5 mt-s-5">
      <div className="eyebrow mb-4 flex items-center gap-3">
        Design notes
        <span className="h-px flex-1 bg-line" />
      </div>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-s-4">
        {entries.map((a) => (
          <li key={a.number} className="flex gap-3">
            <span
              className="w-[22px] h-[22px] mt-[2px] shrink-0 rounded-full bg-coral text-white font-mono font-semibold text-[11px] grid place-items-center"
              style={{ boxShadow: "0 2px 8px rgba(224,120,86,0.4)" }}
            >
              {a.number}
            </span>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-ink mb-[2px]">{a.title}</div>
              <p className="text-[12px] text-ink-3 leading-[1.55]">{a.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* Document meta bar — design-review only */
export function DocumentMetaBar({
  screen,
  step,
}: {
  screen: number;
  step: string;
}) {
  const { annotationsOn } = useAnnotations();
  if (!annotationsOn) return null;
  return (
    <div className="font-mono text-[12px] text-ink-3 flex flex-wrap items-center gap-s-3 mb-s-3 px-1">
      <span>NexusForce · Create job</span>
      <Pill>Screen {screen} of 5 · {step}</Pill>
      <Pill>1360 × 768</Pill>
      <span className="ml-auto">Hi-fidelity · DM Sans · 8-grid</span>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-[2px] rounded-[4px] border border-line bg-surface">
      {children}
    </span>
  );
}
