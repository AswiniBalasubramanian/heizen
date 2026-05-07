import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Star,
  Clock,
  CreditCard,
  BarChart3,
  Settings,
  Search,
  Bell,
  Building2,
  ChevronDown,
} from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, IconButton } from "./primitives";
import { AnnotationToggle } from "./annotation";

/**
 * Module access for the current user.
 * Rule: "no-access" modules must be entirely absent from the navigation —
 * not greyed out, not hidden behind a tooltip, not present at all.
 *
 * The signed-in demo user (Aswini, Hiring Manager) has no access to
 * Invoicing or Settings — so those rows never render.
 */
type AccessLevel = "full" | "read-only" | "no-access";

const CURRENT_USER_ACCESS: Record<string, AccessLevel> = {
  dashboard: "full",
  requisitions: "full",
  candidates: "full",
  placements: "full",
  timekeeping: "full",
  invoicing: "no-access",
  reports: "read-only",
  settings: "no-access",
};

type NavChild = { id: string; label: string; to: string; matchPrefix?: string };
type NavItem = {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  to: string;
  children?: NavChild[];
};

const NAV_GROUPS_RAW: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
      {
        id: "requisitions",
        label: "Requisitions",
        icon: ClipboardList,
        to: "/requisitions/templates",
        children: [
          {
            id: "new-job-template",
            label: "New job template",
            to: "/requisitions/templates/new/type",
            matchPrefix: "/requisitions/templates/new",
          },
        ],
      },
      { id: "candidates", label: "Candidates", icon: Users, to: "/candidates" },
      { id: "placements", label: "Placements", icon: Star, to: "/placements" },
      { id: "timekeeping", label: "Timekeeping", icon: Clock, to: "/timekeeping" },
      { id: "invoicing", label: "Invoicing", icon: CreditCard, to: "/invoicing" },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "reports", label: "Reports", icon: BarChart3, to: "/reports" },
      { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
    ],
  },
];

// Filter no-access items out of nav groups. Drop empty groups entirely.
const NAV_GROUPS = NAV_GROUPS_RAW
  .map((group) => ({
    ...group,
    items: group.items.filter(
      (it) => (CURRENT_USER_ACCESS[it.id] ?? "no-access") !== "no-access"
    ),
  }))
  .filter((group) => group.items.length > 0);

export function AppShell({
  breadcrumb,
  children,
}: {
  breadcrumb: { label: string; to?: string }[];
  children: ReactNode;
}) {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <div
      className="grid bg-cream"
      style={{
        gridTemplateColumns: "240px 1fr",
        gridTemplateRows: "64px 1fr",
        gridTemplateAreas: '"sidebar topbar" "sidebar main"',
        minHeight: 768,
      }}
    >
      {/* Sidebar */}
      <aside
        style={{ gridArea: "sidebar" }}
        className="bg-primary text-ink-on-dark flex flex-col sticky top-0 h-screen self-start"
      >
        <div className="px-6 pt-5 pb-6 flex items-center gap-2.5">
          <img
            src="/logo.svg"
            alt="NexusForce"
            className="h-7 w-auto shrink-0"
          />
          <span className="font-medium text-[16px] tracking-tight leading-none">
            NexusForce
          </span>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-5 overflow-y-auto pb-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-on-dark/50">
                {group.label}
              </div>
              <ul className="flex flex-col gap-[2px]">
                {group.items.map((it) => {
                  const sectionActive =
                    pathname === it.to ||
                    pathname.startsWith(it.to + "/") ||
                    !!it.children?.some((c) =>
                      c.matchPrefix
                        ? pathname.startsWith(c.matchPrefix)
                        : pathname === c.to
                    );
                  const showChildren = it.children && sectionActive;
                  return (
                    <li key={it.id}>
                      <NavLink
                        to={it.to}
                        end={!it.children}
                        className={({ isActive }) =>
                          `relative flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13.5px] transition-colors ${
                            isActive || sectionActive
                              ? "bg-white/10 text-ink-on-dark font-medium"
                              : "text-ink-on-dark/75 hover:text-ink-on-dark hover:bg-white/5"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {(isActive || sectionActive) && (
                              <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r bg-mint" />
                            )}
                            <it.icon size={16} strokeWidth={1.8} />
                            {it.label}
                          </>
                        )}
                      </NavLink>
                      {showChildren && (
                        <ul className="mt-[2px] mb-1 ml-7 flex flex-col gap-[2px] border-l border-white/10 pl-3">
                          {it.children!.map((c) => {
                            const childActive = c.matchPrefix
                              ? pathname.startsWith(c.matchPrefix)
                              : pathname === c.to;
                            return (
                              <li key={c.id}>
                                <NavLink
                                  to={c.to}
                                  className={`block px-3 py-1.5 rounded-md text-[12.5px] transition-colors ${
                                    childActive
                                      ? "text-ink-on-dark font-medium bg-white/5"
                                      : "text-ink-on-dark/60 hover:text-ink-on-dark hover:bg-white/5"
                                  }`}
                                >
                                  {c.label}
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-[12px] text-ink-on-dark/70">
            <span className="w-2 h-2 rounded-full bg-mint" />
            All systems operational
          </div>
        </div>
      </aside>

      {/* Topbar */}
      <header
        style={{ gridArea: "topbar" }}
        className="bg-cream border-b border-line px-s-5 flex items-center justify-between sticky top-0 z-10 gap-3"
      >
        <Breadcrumb items={breadcrumb} />
        <div className="flex items-center gap-3 shrink-0">
          <AnnotationToggle />
          <button className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-line bg-surface text-[13px] text-ink-2 hover:border-line-2 transition-colors">
            <Building2 size={14} className="text-ink-3" strokeWidth={1.8} />
            Mercy Health Group
            <ChevronDown size={14} className="text-ink-3" strokeWidth={1.8} />
          </button>
          <IconButton ariaLabel="Search">
            <Search size={16} strokeWidth={1.8} />
          </IconButton>
          <IconButton ariaLabel="Notifications">
            <Bell size={16} strokeWidth={1.8} />
          </IconButton>
          <Avatar initials="AS" />
        </div>
      </header>

      {/* Main */}
      <main style={{ gridArea: "main" }}>
        <div className="px-s-6 pt-s-5 pb-s-6">{children}</div>
      </main>
    </div>
  );
}

function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] min-w-0 flex-1">
      <ol className="flex items-center gap-2 min-w-0">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2 min-w-0 shrink-0 last:shrink last:min-w-0">
              {it.to && !last ? (
                <NavLink
                  to={it.to}
                  className="text-ink-3 hover:text-ink-2 whitespace-nowrap"
                >
                  {it.label}
                </NavLink>
              ) : (
                <span
                  className={`${last ? "text-ink font-medium truncate" : "text-ink-3 whitespace-nowrap"} ${last ? "max-w-[280px]" : ""}`}
                  title={last ? it.label : undefined}
                >
                  {it.label}
                </span>
              )}
              {!last && <span className="text-ink-4 shrink-0">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
