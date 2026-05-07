import type { Template, TemplateType } from "./types";

export const TYPE_OPTIONS: {
  id: TemplateType;
  title: string;
  description: string;
  tags: { label: string; variant?: "default" | "warn" }[];
  icon: "clock" | "calendar-days" | "user-check" | "globe";
}[] = [
  {
    id: "long-term-order",
    title: "Long-Term Order",
    description:
      "Sustained staffing for an ongoing operational need. Vendors submit candidates against this job until the order is closed.",
    tags: [{ label: "Recurring" }, { label: "Vendor-sourced" }, { label: "Shift-based" }],
    icon: "clock",
  },
  {
    id: "per-diem",
    title: "Per Diem",
    description:
      "Day-by-day or shift-by-shift coverage as needed. Best for unpredictable demand and short-notice fills.",
    tags: [{ label: "Ad-hoc" }, { label: "Vendor-sourced" }, { label: "Shift-based" }],
    icon: "calendar-days",
  },
  {
    id: "permanent",
    title: "Permanent",
    description:
      "Direct-hire conversion path. Vendors source candidates for full-time placement at your organisation.",
    tags: [{ label: "Full-time" }, { label: "Vendor-sourced" }, { label: "Annual rate" }],
    icon: "user-check",
  },
  {
    id: "internal-flex-pool",
    title: "Internal Flex Pool",
    description:
      "Internal redeployment of existing staff. No external sourcing — surfaces to your internal talent pool only.",
    tags: [
      { label: "Internal only", variant: "warn" },
      { label: "No vendors", variant: "warn" },
    ],
    icon: "globe",
  },
];

export const OCCUPATIONS = [
  "Registered Nurse",
  "Licensed Practical Nurse",
  "Certified Nursing Assistant",
  "Surgical Technologist",
  "Respiratory Therapist",
  "Physical Therapist",
  "Occupational Therapist",
  "Medical Laboratory Scientist",
  "Radiologic Technologist",
  "Pharmacist",
  "Physician Assistant",
  "Nurse Practitioner",
];

export const SPECIALTIES_BY_OCCUPATION: Record<string, string[]> = {
  "Registered Nurse": [
    "Intensive Care (ICU)",
    "Emergency Department",
    "Med-Surg",
    "Labor & Delivery",
    "Operating Room",
    "Telemetry",
    "Oncology",
    "Pediatrics",
    "Cardiac Cath Lab",
  ],
  "Licensed Practical Nurse": ["Long-Term Care", "Med-Surg", "Pediatrics", "Home Health"],
  "Certified Nursing Assistant": ["Acute Care", "Long-Term Care", "Home Health"],
  "Surgical Technologist": ["General Surgery", "Cardiothoracic", "Orthopedic", "Neuro"],
  "Respiratory Therapist": ["NICU", "Adult Critical Care", "Pulmonary"],
  "Physical Therapist": ["Acute Care", "Outpatient", "Neuro Rehab", "Orthopedic"],
  "Occupational Therapist": ["Acute Care", "Outpatient", "Pediatrics"],
  "Medical Laboratory Scientist": ["Clinical Chemistry", "Hematology", "Microbiology", "Blood Bank"],
  "Radiologic Technologist": ["CT", "MRI", "Mammography", "Interventional"],
  Pharmacist: ["Inpatient", "Oncology", "Critical Care", "Ambulatory"],
  "Physician Assistant": ["Emergency Medicine", "Surgery", "Primary Care"],
  "Nurse Practitioner": ["Family Practice", "Acute Care", "Psychiatric"],
};

export const LOCATIONS = [
  "Mercy Hospital — Downtown",
  "Mercy Hospital — North Campus",
  "Mercy Surgery Center — West",
  "Mercy Outpatient — East",
  "Mercy Children's — Riverside",
  "Mercy Behavioral Health — Midtown",
];

export const DEPARTMENTS = [
  "Critical Care Services",
  "Emergency Services",
  "Surgical Services",
  "Medical-Surgical",
  "Women & Infants",
  "Cardiology",
  "Oncology",
  "Imaging Services",
  "Laboratory Services",
  "Pharmacy Services",
  "Behavioral Health",
];

export const BENEFITS = [
  "Health Insurance",
  "Dental",
  "Vision",
  "401(k) Match",
  "Paid Time Off",
  "Continuing Education",
  "Sign-on Bonus",
  "Relocation Assistance",
  "Housing Stipend",
  "Travel Reimbursement",
  "License Reimbursement",
  "Loan Repayment",
];

export const COMPLIANCE_CHECKLISTS = [
  {
    id: "rn-licensure",
    title: "RN Licensure & Credentialing",
    items: 8,
    description: "State license, BLS, ACLS, primary-source verification, NPDB query.",
  },
  {
    id: "osha-bbp",
    title: "OSHA Bloodborne Pathogens",
    items: 4,
    description: "Annual training, exposure control plan acknowledgement, PPE fit test.",
  },
  {
    id: "hipaa",
    title: "HIPAA Privacy & Security",
    items: 3,
    description: "Privacy training certificate, security awareness, signed acknowledgement.",
  },
  {
    id: "mercy-onboarding",
    title: "Mercy Health Onboarding",
    items: 12,
    description:
      "Org-specific orientation, EHR competency, pharmacy badge, parking, ID issuance.",
  },
  {
    id: "drug-screen",
    title: "Pre-Placement Drug Screen",
    items: 2,
    description: "10-panel drug screen, breath alcohol, results uploaded to wallet.",
  },
  {
    id: "immunization",
    title: "Immunization & Health Records",
    items: 6,
    description: "MMR, Tdap, Hep B, varicella, influenza, COVID-19, TB clearance.",
  },
];

export const DEFAULT_TEMPLATE: Template = {
  type: "long-term-order",
  name: "13-Week ICU Travel Contract",
  occupation: "Registered Nurse",
  specialty: "Intensive Care (ICU)",
  location: "Mercy Hospital — Downtown",
  department: "Critical Care Services",
  benefits: ["Health Insurance", "Dental", "Vision", "401(k) Match", "Sign-on Bonus"],
  shifts: [
    {
      id: "shift-1",
      type: "day",
      start: "07:00",
      end: "19:00",
      days: ["mon", "tue", "wed", "thu", "fri"],
    },
    {
      id: "shift-2",
      type: "night",
      start: "19:00",
      end: "07:00",
      days: ["sat", "sun"],
    },
  ],
  billRate: 145,
  positions: 8,
  overtimeMultiplier: 1.5,
  incentives: {
    signOnBonus: { enabled: true, amount: 5000 },
    completionBonus: { enabled: true, amount: 2500 },
    referralBonus: { enabled: false, amount: 0 },
    holidayDifferential: { enabled: true, value: 1.5 },
    nightDifferential: { enabled: true, amount: 8 },
  },
  checklists: ["rn-licensure", "osha-bbp", "hipaa", "mercy-onboarding"],
  approvals: {
    hiringManager: true,
    departmentHead: true,
    complianceOfficer: false,
    autoPublish: false,
  },
  submission: {
    resumeRequired: true,
    referencesCount: 2,
    skillsAssessment: false,
    vendorScreeningCall: true,
  },
};

/* ------------------------------------------------------------------ *
 * Saved templates — populates the Requisitions list view
 * ------------------------------------------------------------------ */

export type TemplateStatus = "draft" | "active" | "scheduled";

export interface SavedTemplate {
  id: string;
  name: string;
  type: TemplateType;
  location: string;
  department: string;
  specialty: string;
  status: TemplateStatus;
  expiresInDays: number | null;
  starred: boolean;
  positions: { active: number; total: number };
  hiringManager: { name: string; initials: string };
  dueDate: string;
  facility: string;
  funnel: {
    submissions: number;
    rejected: number;
    inCompliance: number;
    interviewing: number;
    offers: number;
    placed: number;
  };
}

export const SAVED_TEMPLATES: SavedTemplate[] = [
  {
    id: "T-1042",
    name: "13-Week ICU Travel Contract",
    type: "long-term-order",
    location: "Mercy Hospital — Downtown",
    department: "Critical Care",
    specialty: "Intensive Care (ICU)",
    status: "active",
    expiresInDays: 18,
    starred: true,
    positions: { active: 6, total: 8 },
    hiringManager: { name: "Aswini Balasubramanian", initials: "AB" },
    dueDate: "Nov 30, 2026",
    facility: "Mercy Health · Critical Care",
    funnel: {
      submissions: 24,
      rejected: 4,
      inCompliance: 10,
      interviewing: 5,
      offers: 4,
      placed: 3,
    },
  },
  {
    id: "T-1041",
    name: "Per-Diem Med-Surg Coverage",
    type: "per-diem",
    location: "Mercy Hospital — North Campus",
    department: "Medical-Surgical",
    specialty: "Med-Surg",
    status: "active",
    expiresInDays: 7,
    starred: false,
    positions: { active: 12, total: 15 },
    hiringManager: { name: "Ronald Richards", initials: "RR" },
    dueDate: "May 15, 2026",
    facility: "Mercy North · Med-Surg Float",
    funnel: {
      submissions: 142,
      rejected: 18,
      inCompliance: 44,
      interviewing: 22,
      offers: 12,
      placed: 11,
    },
  },
  {
    id: "T-1038",
    name: "Surgical Tech — Direct Hire",
    type: "permanent",
    location: "Mercy Surgery Center — West",
    department: "Surgical Services",
    specialty: "Cardiothoracic",
    status: "scheduled",
    expiresInDays: null,
    starred: false,
    positions: { active: 0, total: 3 },
    hiringManager: { name: "Courtney Henry", initials: "CH" },
    dueDate: "Jun 30, 2026",
    facility: "Mercy West · OR",
    funnel: {
      submissions: 0,
      rejected: 0,
      inCompliance: 0,
      interviewing: 0,
      offers: 0,
      placed: 0,
    },
  },
  {
    id: "T-1037",
    name: "Emergency Float Pool — Internal Activation",
    type: "internal-flex-pool",
    location: "Mercy Health — Multi-site",
    department: "Emergency Services",
    specialty: "Emergency Department",
    status: "active",
    expiresInDays: 2,
    starred: true,
    positions: { active: 4, total: 6 },
    hiringManager: { name: "Jacob Jones", initials: "JJ" },
    dueDate: "May 09, 2026",
    facility: "Mercy Health Group",
    funnel: {
      submissions: 14,
      rejected: 2,
      inCompliance: 8,
      interviewing: 3,
      offers: 0,
      placed: 0,
    },
  },
  {
    id: "T-1031",
    name: "NICU Respiratory Therapist — 26 Week",
    type: "long-term-order",
    location: "Mercy Children's — Riverside",
    department: "Neonatal",
    specialty: "NICU",
    status: "active",
    expiresInDays: 42,
    starred: false,
    positions: { active: 2, total: 4 },
    hiringManager: { name: "Ralph Edwards", initials: "RE" },
    dueDate: "Nov 12, 2026",
    facility: "Mercy Children's Riverside",
    funnel: {
      submissions: 8,
      rejected: 1,
      inCompliance: 4,
      interviewing: 2,
      offers: 1,
      placed: 0,
    },
  },
  {
    id: "T-1029",
    name: "Medical Lab Scientist — Microbiology",
    type: "long-term-order",
    location: "Mercy Outpatient — East",
    department: "Laboratory Services",
    specialty: "Microbiology",
    status: "draft",
    expiresInDays: null,
    starred: false,
    positions: { active: 0, total: 2 },
    hiringManager: { name: "Aswini Balasubramanian", initials: "AB" },
    dueDate: "Jul 01, 2026",
    facility: "Mercy East · Lab",
    funnel: {
      submissions: 0,
      rejected: 0,
      inCompliance: 0,
      interviewing: 0,
      offers: 0,
      placed: 0,
    },
  },
];

export const STEPS = [
  { id: 1, eyebrow: "Step 1", name: "Type", path: "/requisitions/templates/new/type" },
  { id: 2, eyebrow: "Step 2", name: "Details", path: "/requisitions/templates/new/details" },
  {
    id: 3,
    eyebrow: "Step 3",
    name: "Shift & schedule",
    path: "/requisitions/templates/new/schedule",
  },
  {
    id: 4,
    eyebrow: "Step 4",
    name: "Compensation",
    path: "/requisitions/templates/new/compensation",
  },
  {
    id: 5,
    eyebrow: "Step 5",
    name: "Compliance",
    path: "/requisitions/templates/new/compliance",
  },
];
