export type TemplateType =
  | "long-term-order"
  | "per-diem"
  | "permanent"
  | "internal-flex-pool";

export type ShiftType = "day" | "evening" | "night" | "weekend" | "on-call";

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface Shift {
  id: string;
  type: ShiftType;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  days: DayOfWeek[];
}

export interface Incentive {
  enabled: boolean;
  amount: number;
}

export interface Multiplier {
  enabled: boolean;
  value: number;
}

export interface Incentives {
  signOnBonus: Incentive;
  completionBonus: Incentive;
  referralBonus: Incentive;
  holidayDifferential: Multiplier;
  nightDifferential: Incentive;
}

export interface Approvals {
  hiringManager: boolean;
  departmentHead: boolean;
  complianceOfficer: boolean;
  autoPublish: boolean;
}

export interface SubmissionRules {
  resumeRequired: boolean;
  referencesCount: number;
  skillsAssessment: boolean;
  vendorScreeningCall: boolean;
}

export interface Template {
  type: TemplateType;
  name: string;
  occupation: string;
  specialty: string;
  location: string;
  department: string;
  benefits: string[];
  shifts: Shift[];
  billRate: number;
  positions: number;
  overtimeMultiplier: number;
  incentives: Incentives;
  checklists: string[];
  approvals: Approvals;
  submission: SubmissionRules;
}

export interface AnnotationEntry {
  number: number;
  title: string;
  body: string;
  /** Inline-position for the pin, relative to its anchor wrapper. */
  pin: { top: string; right?: string; left?: string };
}
