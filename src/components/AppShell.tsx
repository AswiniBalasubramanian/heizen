import { NavLink } from "react-router-dom";
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

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
      {
        id: "requisitions",
        label: "Requisitions",
        icon: ClipboardList,
        to: "/requisitions/templates",
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

export function AppShell({
  breadcrumb,
  children,
}: {
  breadcrumb: { label: string; to?: string }[];
  children: ReactNode;
}) {
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
        <div className="px-6 pt-4 pb-6 flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="NexusForce"
            className="h-8 w-auto"
          />
          <span className="font-medium text-[16px] tracking-tight">NexusForce</span>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-5 overflow-y-auto pb-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-on-dark/50">
                {group.label}
              </div>
              <ul className="flex flex-col gap-[2px]">
                {group.items.map((it) => (
                  <li key={it.id}>
                    <NavLink
                      to={it.to}
                      className={({ isActive }) =>
                        `relative flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13.5px] transition-colors ${
                          isActive
                            ? "bg-white/10 text-ink-on-dark font-medium"
                            : "text-ink-on-dark/75 hover:text-ink-on-dark hover:bg-white/5"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r bg-mint" />
                          )}
                          <it.icon size={16} strokeWidth={1.8} />
                          {it.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
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
        className="bg-cream border-b border-line px-s-5 flex items-center justify-between sticky top-0 z-10"
      >
        <Breadcrumb items={breadcrumb} />
        <div className="flex items-center gap-3">
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
    <nav aria-label="Breadcrumb" className="text-[13px]">
      <ol className="flex items-center gap-2">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {it.to && !last ? (
                <NavLink to={it.to} className="text-ink-3 hover:text-ink-2">
                  {it.label}
                </NavLink>
              ) : (
                <span className={last ? "text-ink font-medium" : "text-ink-3"}>{it.label}</span>
              )}
              {!last && <span className="text-ink-4">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
