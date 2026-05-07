import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Star,
  Briefcase,
  UserPlus,
  ShieldCheck,
  MessageSquare,
  CheckCircle2,
  Clock,
  CalendarDays,
  UserCheck,
  Globe,
} from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Avatar, Button, IconButton, Tag } from "../components/primitives";
import { TextInput } from "../components/inputs";
import {
  SAVED_TEMPLATES,
  TYPE_OPTIONS,
  type SavedTemplate,
  type TemplateStatus,
} from "../data";
import { useTemplate } from "../store";

const TYPE_ICON = {
  "long-term-order": Clock,
  "per-diem": CalendarDays,
  permanent: UserCheck,
  "internal-flex-pool": Globe,
} as const;

const STATUS_LABEL: Record<TemplateStatus, string> = {
  live: "Live",
  draft: "Draft",
  paused: "Paused",
  "pending-approval": "Pending approval",
};

const STATUS_STYLE: Record<TemplateStatus, string> = {
  live: "bg-mint-light text-primary",
  draft: "bg-surface-muted text-ink-3 border border-line",
  paused: "bg-coral-light text-[#993C1D]",
  "pending-approval": "bg-[#FAEEDA] text-[#854F0B]",
};

type Tab = "all" | "live" | "pending-approval" | "draft" | "paused";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "pending-approval", label: "Pending approval" },
  { id: "draft", label: "Drafts" },
  { id: "paused", label: "Paused" },
];

export default function ScreenRequisitionsList() {
  const navigate = useNavigate();
  const { reset } = useTemplate();
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: SAVED_TEMPLATES.length };
    for (const t of SAVED_TEMPLATES) c[t.status] = (c[t.status] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = SAVED_TEMPLATES;
    if (tab !== "all") list = list.filter((t) => t.status === tab);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.specialty.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.hiringManager.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tab, query]);

  const startNewTemplate = () => {
    reset();
    navigate("/requisitions/templates/new/type");
  };

  return (
    <AppShell
      breadcrumb={[
        { label: "Requisitions", to: "/requisitions/templates" },
        { label: "Jobs" },
      ]}
    >
      {/* Page header */}
      <div className="flex items-end justify-between mb-s-4">
        <div>
          <h1 className="text-[24px] leading-[1.3] font-medium text-ink">
            Job Requisition
          </h1>
          <p className="text-small text-ink-3 mt-1 max-w-[560px]">
            Every job carries the role's identity, schedule, comp envelope,
            and compliance ruleset — and tracks every candidate vendors submit
            against it.
          </p>
        </div>
        <Button
          leadingIcon={<Plus size={14} strokeWidth={2.4} />}
          onClick={startNewTemplate}
        >
          New job
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-line mb-s-3">
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-3 py-3 text-[13px] font-medium transition-colors ${
                tab === t.id
                  ? "text-ink"
                  : "text-ink-3 hover:text-ink-2"
              }`}
            >
              {t.label}
              <span
                className={`ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-mono ${
                  tab === t.id
                    ? "bg-primary text-ink-on-dark"
                    : "bg-surface-muted text-ink-3 border border-line"
                }`}
              >
                {counts[t.id] ?? 0}
              </span>
              {tab === t.id && (
                <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pb-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
              strokeWidth={1.8}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs"
              className="h-9 pl-8 pr-3 w-[260px] bg-surface border border-line rounded-md text-[13px] focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary-50"
            />
          </div>
          <div className="inline-flex border border-line rounded-md overflow-hidden bg-surface">
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              className={`w-9 h-9 grid place-items-center transition-colors ${
                view === "list" ? "bg-primary-50 text-primary" : "text-ink-3"
              }`}
            >
              <ListIcon size={14} strokeWidth={1.8} />
            </button>
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={`w-9 h-9 grid place-items-center transition-colors border-l border-line ${
                view === "grid" ? "bg-primary-50 text-primary" : "text-ink-3"
              }`}
            >
              <LayoutGrid size={14} strokeWidth={1.8} />
            </button>
          </div>
          <IconButton ariaLabel="Sort">
            <SlidersHorizontal size={14} strokeWidth={1.8} />
          </IconButton>
          <IconButton ariaLabel="Filter">
            <Filter size={14} strokeWidth={1.8} />
          </IconButton>
        </div>
      </div>

      {/* Result count */}
      <div className="text-[13px] text-ink-3 mb-s-3">
        {filtered.length} job{filtered.length === 1 ? "" : "s"}
        {tab !== "all" && ` · ${TABS.find((t) => t.id === tab)?.label}`}
      </div>

      {/* List */}
      {view === "list" ? (
        <ul className="flex flex-col gap-s-2">
          {filtered.map((t) => (
            <TemplateRow key={t.id} template={t} />
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-2 gap-s-3">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-s-7 bg-surface border border-line border-dashed rounded-lg">
          <div className="text-[15px] text-ink-2 mb-1">No jobs match</div>
          <div className="text-[13px] text-ink-3">
            Try a different tab or clear your search.
          </div>
        </div>
      )}
    </AppShell>
  );
}

/* ------------------------------------------------------------------ *
 * List row — wide layout matching the reference image
 * ------------------------------------------------------------------ */
function TemplateRow({ template }: { template: SavedTemplate }) {
  const navigate = useNavigate();
  const TypeIcon = TYPE_ICON[template.type];
  const typeMeta = TYPE_OPTIONS.find((o) => o.id === template.type);

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate("/requisitions/templates/new/type")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/requisitions/templates/new/type");
          }
        }}
        className="w-full text-left bg-surface border border-line rounded-lg overflow-hidden hover:border-line-2 hover:shadow-card-hover transition-all cursor-pointer focus:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-50 focus-visible:border-primary"
      >
        {/* Header row */}
        <div className="flex items-center gap-s-3 px-s-4 pt-s-3 pb-s-2">
          <input
            type="checkbox"
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-line accent-primary"
            aria-label={`Select ${template.name}`}
          />
          <div className="flex-1 min-w-0 flex items-center flex-wrap gap-x-2 gap-y-1">
            <span className="text-[15px] font-medium text-ink truncate max-w-[420px]">
              {template.name}
            </span>
            <span className="font-mono text-[12px] text-ink-3">#{template.id}</span>
            <Bullet />
            <span className="text-[13px] text-ink-3">{template.location}</span>
            <Bullet />
            <span className="text-[13px] text-ink-3">{template.specialty}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <ExpiryLabel days={template.expiresInDays} />
            <button
              onClick={(e) => e.stopPropagation()}
              className="text-ink-4 hover:text-gold transition-colors"
              aria-label="Star job"
            >
              <Star
                size={14}
                strokeWidth={1.8}
                fill={template.starred ? "var(--gold)" : "none"}
                className={template.starred ? "text-gold" : ""}
              />
            </button>
            <StatusPill status={template.status} />
          </div>
        </div>

        <div className="border-t border-line bg-surface-muted/40 px-s-4 py-s-3 flex items-center gap-s-3">
          <Stat value={`${template.positions.active}/${template.positions.total}`} label="Positions" />
          <Divider />
          <div className="flex items-center gap-2 w-[160px] shrink-0">
            <Avatar initials={template.hiringManager.initials} size={24} />
            <div className="leading-tight min-w-0">
              <div className="text-[13px] text-ink truncate">
                {template.hiringManager.name}
              </div>
              <div className="text-[11px] text-ink-3">Hiring manager</div>
            </div>
          </div>
          <Divider />
          <div className="leading-tight w-[90px] shrink-0">
            <div className="text-[13px] text-ink">{template.dueDate}</div>
            <div className="text-[11px] text-ink-3">Due date</div>
          </div>
          <Divider />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="w-6 h-6 rounded-md bg-mint-light text-primary grid place-items-center shrink-0">
              <TypeIcon size={12} strokeWidth={2} />
            </span>
            <div className="leading-tight min-w-0">
              <div className="text-[13px] text-ink truncate">
                {template.facility}
              </div>
              <div className="text-[11px] text-ink-3">{typeMeta?.title}</div>
            </div>
          </div>

          {/* Funnel — compact, 5 stages */}
          <div className="flex items-center gap-2 shrink-0">
            <FunnelStat icon={Briefcase} value={template.positions.active} tone="mint" label="Active jobs" />
            <FunnelStat icon={UserPlus} value={template.funnel.submissions} tone="mint" label="Submissions" />
            <FunnelStat icon={ShieldCheck} value={template.funnel.inCompliance} tone="primary" label="In compliance" />
            <FunnelStat icon={MessageSquare} value={template.funnel.interviewing} tone="primary" label="Interviewing" />
            <FunnelStat icon={CheckCircle2} value={template.funnel.placed} tone="mint" label="Placed" />
          </div>
        </div>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ *
 * Grid card variant — lighter density
 * ------------------------------------------------------------------ */
function TemplateCard({ template }: { template: SavedTemplate }) {
  const navigate = useNavigate();
  const TypeIcon = TYPE_ICON[template.type];
  const typeMeta = TYPE_OPTIONS.find((o) => o.id === template.type);

  return (
    <button
      onClick={() => navigate("/requisitions/templates/new/type")}
      className="text-left bg-surface border border-line rounded-lg p-s-4 hover:border-line-2 hover:shadow-card-hover transition-all"
    >
      <div className="flex items-start justify-between mb-s-3">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-md bg-mint-light text-primary grid place-items-center">
            <TypeIcon size={18} strokeWidth={1.8} />
          </span>
          <div>
            <div className="font-mono text-[11px] text-ink-3">#{template.id}</div>
            <div className="text-[10px] uppercase tracking-[0.14em] font-medium text-ink-3">
              {typeMeta?.title}
            </div>
          </div>
        </div>
        <StatusPill status={template.status} />
      </div>

      <div className="text-[16px] font-medium text-ink mb-1 leading-tight">
        {template.name}
      </div>
      <div className="text-[13px] text-ink-3 mb-s-3">
        {template.location} · {template.specialty}
      </div>

      <div className="flex items-center gap-s-3 mb-s-3">
        <Stat value={`${template.positions.active}/${template.positions.total}`} label="Positions" />
        <Divider />
        <Stat value={String(template.funnel.submissions)} label="Submitted" />
        <Divider />
        <Stat value={String(template.funnel.placed)} label="Placed" />
      </div>

      <div className="border-t border-line pt-s-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar initials={template.hiringManager.initials} size={24} />
          <span className="text-[12px] text-ink-2">{template.hiringManager.name}</span>
        </div>
        <ExpiryLabel days={template.expiresInDays} />
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="leading-tight">
      <div className="text-[16px] font-medium text-ink tabular-nums">
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-[0.06em] text-ink-3">
        {label}
      </div>
    </div>
  );
}

function FunnelStat({
  icon: Icon,
  value,
  tone,
  label,
}: {
  icon: typeof Briefcase;
  value: number;
  tone: "mint" | "coral" | "gold" | "primary";
  label: string;
}) {
  const toneClass =
    tone === "mint"
      ? "text-primary bg-mint-light"
      : tone === "coral"
        ? "text-coral bg-coral-light"
        : tone === "gold"
          ? "text-[#854F0B] bg-[#FAEEDA]"
          : "text-primary bg-primary-50";
  return (
    <div className="flex flex-col items-center gap-[2px]" title={label}>
      <span
        className={`w-7 h-7 rounded-md grid place-items-center ${toneClass}`}
      >
        <Icon size={13} strokeWidth={2} />
      </span>
      <span className="text-[11px] font-mono text-ink-2 tabular-nums">
        {value < 10 ? `0${value}` : value}
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: TemplateStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] rounded-md text-[11px] font-medium ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function Bullet() {
  return <span className="text-ink-4 mx-1">·</span>;
}

function Divider() {
  return <span className="w-px h-8 bg-line shrink-0" />;
}

function ExpiryLabel({ days }: { days: number | null }) {
  if (days === null) return null;
  const isUrgent = days <= 3;
  return (
    <span className={`text-[12px] ${isUrgent ? "text-coral font-medium" : "text-ink-3"}`}>
      {days === 0
        ? "Expires today"
        : isUrgent
          ? `Expires in ${days} day${days === 1 ? "" : "s"}`
          : `${days} days to go`}
    </span>
  );
}
