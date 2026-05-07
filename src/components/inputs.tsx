import {
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { ChevronDown, Search, Plus, X } from "lucide-react";

/* ------------------------------------------------------------------ *
 * Field wrapper — label + helper + child
 * ------------------------------------------------------------------ */
export function Field({
  label,
  helper,
  required,
  children,
  htmlFor,
}: {
  label: string;
  helper?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium text-ink-2 inline-flex items-center gap-1"
      >
        {label}
        {required && <span className="text-coral">*</span>}
      </label>
      {children}
      {helper && <span className="text-[12px] text-ink-3">{helper}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Text input
 * ------------------------------------------------------------------ */
export function TextInput({
  prefix,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { prefix?: ReactNode }) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-ink-3 text-body pointer-events-none">{prefix}</span>
      )}
      <input
        {...props}
        className={`w-full h-10 bg-surface border border-line rounded-sm text-body text-ink placeholder:text-ink-4
          ${prefix ? "pl-7" : "pl-3"} pr-3
          focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary-50
          disabled:bg-surface-muted disabled:text-ink-4
          transition-colors`}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Number input
 * ------------------------------------------------------------------ */
export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  ...rest
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <TextInput
      type="number"
      value={Number.isFinite(value) ? value : ""}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (Number.isFinite(n)) onChange(n);
      }}
      min={min}
      max={max}
      step={step}
      {...rest}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Currency input — $ prefix
 * ------------------------------------------------------------------ */
export function CurrencyInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <TextInput
      type="number"
      prefix="$"
      value={Number.isFinite(value) ? value : ""}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (Number.isFinite(n)) onChange(n);
      }}
      min={0}
      step={1}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Time input — paired HH:MM
 * ------------------------------------------------------------------ */
export function TimeInput({
  value,
  onChange,
}: {
  value: string; // "HH:MM"
  onChange: (v: string) => void;
}) {
  const [h, m] = value.split(":");
  const minRef = useRef<HTMLInputElement>(null);

  const setHours = (raw: string) => {
    const v = raw.replace(/\D/g, "").slice(0, 2);
    onChange(`${v.padStart(2, "0")}:${m ?? "00"}`);
    if (v.length === 2) minRef.current?.focus();
  };
  const setMinutes = (raw: string) => {
    const v = raw.replace(/\D/g, "").slice(0, 2);
    onChange(`${h ?? "00"}:${v.padStart(2, "0")}`);
  };

  return (
    <div className="inline-flex items-center h-10 bg-surface border border-line rounded-sm px-2 focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary-50">
      <input
        type="text"
        inputMode="numeric"
        value={h ?? ""}
        onChange={(e) => setHours(e.target.value)}
        className="w-7 text-center bg-transparent outline-none text-body tabular-nums"
        aria-label="Hours"
      />
      <span className="text-ink-3">:</span>
      <input
        ref={minRef}
        type="text"
        inputMode="numeric"
        value={m ?? ""}
        onChange={(e) => setMinutes(e.target.value)}
        className="w-7 text-center bg-transparent outline-none text-body tabular-nums"
        aria-label="Minutes"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Searchable Dropdown
 * ------------------------------------------------------------------ */
export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select…",
  searchable = true,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }
  }, [open]);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        className="w-full h-10 bg-surface border border-line rounded-sm px-3 text-left text-body
          flex items-center justify-between
          hover:border-line-2
          focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary-50
          transition-colors"
      >
        <span className={value ? "text-ink" : "text-ink-4"}>{value || placeholder}</span>
        <ChevronDown
          size={16}
          className={`text-ink-3 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.8}
        />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 left-0 right-0 bg-surface-elevated border border-line rounded-md shadow-card-hover overflow-hidden">
          {searchable && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-line">
              <Search size={14} className="text-ink-3" strokeWidth={1.8} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="bg-transparent text-body outline-none flex-1 placeholder:text-ink-4"
              />
            </div>
          )}
          <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-[13px] text-ink-3">No matches</li>
            )}
            {filtered.map((o) => (
              <li
                key={o}
                role="option"
                aria-selected={o === value}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                  setQuery("");
                }}
                className={`px-3 py-2 text-body cursor-pointer hover:bg-surface-muted ${
                  o === value ? "text-primary font-medium" : "text-ink-2"
                }`}
              >
                {o}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Multi-select chip group
 * ------------------------------------------------------------------ */
export function ChipSelect({
  options,
  value,
  onChange,
  allowCustom = true,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  allowCustom?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const allOptions = Array.from(new Set([...options, ...value]));

  const toggle = (o: string) =>
    onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o]);

  const submitCustom = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allOptions.map((o) => {
        const sel = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className={`inline-flex items-center gap-1 h-8 px-3 rounded-md border text-[13px] transition-colors
              ${
                sel
                  ? "bg-primary-50 border-primary-100 text-primary font-medium"
                  : "bg-surface border-line text-ink-2 hover:border-line-2"
              }`}
          >
            {o}
            {sel && <X size={12} strokeWidth={2} />}
          </button>
        );
      })}
      {allowCustom && !adding && (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-dashed border-line-2 text-[13px] text-ink-3 hover:text-ink-2 hover:border-ink-4 transition-colors"
        >
          <Plus size={12} strokeWidth={2} /> Add custom
        </button>
      )}
      {allowCustom && adding && (
        <span className="inline-flex items-center gap-1 h-8 px-2 rounded-md border border-line bg-surface">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitCustom();
              if (e.key === "Escape") {
                setDraft("");
                setAdding(false);
              }
            }}
            onBlur={submitCustom}
            placeholder="Custom benefit"
            className="text-[13px] outline-none bg-transparent w-32"
          />
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Day-of-week chips
 * ------------------------------------------------------------------ */
const DAY_LABELS: { value: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"; label: string }[] = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
];

export function DayPicker({
  value,
  onChange,
}: {
  value: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
  onChange: (v: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[]) => void;
}) {
  return (
    <div className="inline-flex border border-line rounded-md overflow-hidden bg-surface">
      {DAY_LABELS.map((d, i) => {
        const sel = value.includes(d.value);
        return (
          <button
            key={d.value}
            type="button"
            onClick={() =>
              onChange(sel ? value.filter((x) => x !== d.value) : [...value, d.value])
            }
            className={`px-3 h-9 text-[13px] font-medium transition-colors ${
              i > 0 ? "border-l border-line" : ""
            } ${sel ? "bg-primary text-ink-on-dark" : "text-ink-2 hover:bg-surface-muted"}`}
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
}
