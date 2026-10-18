import type { ChassisSystem, Manufacturer } from "./types";

export const MANUFACTURERS: Manufacturer[] = [
  "현대자동차",
  "기아",
  "제네시스",
  "르노삼성",
  "BMW",
  "Mercedes-Benz",
];

export const MODELS_BY_MANUFACTURER: Record<Manufacturer, string[]> = {
  현대자동차: ["아반떼", "쏘나타", "그랜저", "투싼"],
  기아: ["K3", "K5", "K8", "스포티지"],
  제네시스: ["G70", "G80", "GV70", "GV80"],
  르노삼성: ["SM6", "QM6", "XM3", "QM3"],
  BMW: ["3 Series", "5 Series", "X3", "X5"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE"],
};

export const YEARS = Array.from({ length: 9 }, (_, i) => String(2018 + i));

/** value = 약어, label = 약어 (영문 풀네임) */
export const CHASSIS_SYSTEMS: {
  value: ChassisSystem;
  abbr: string;
  label: string;
  fullEn: string;
}[] = [
  {
    value: "ABS",
    abbr: "ABS",
    fullEn: "Anti-lock Braking System",
    label: "ABS (Anti-lock Braking System)",
  },
  {
    value: "ESC",
    abbr: "ESC",
    fullEn: "Electronic Stability Control",
    label: "ESC (Electronic Stability Control)",
  },
  {
    value: "TCS",
    abbr: "TCS",
    fullEn: "Traction Control System",
    label: "TCS (Traction Control System)",
  },
  {
    value: "EBD",
    abbr: "EBD",
    fullEn: "Electronic Brakeforce Distribution",
    label: "EBD (Electronic Brakeforce Distribution)",
  },
  {
    value: "BAS",
    abbr: "BAS",
    fullEn: "Brake Assist System",
    label: "BAS (Brake Assist System)",
  },
  {
    value: "EPS",
    abbr: "EPS",
    fullEn: "Electric Power Steering",
    label: "EPS (Electric Power Steering)",
  },
  {
    value: "ECS",
    abbr: "ECS",
    fullEn: "Electronically Controlled Suspension",
    label: "ECS (Electronically Controlled Suspension)",
  },
  {
    value: "EPB",
    abbr: "EPB",
    fullEn: "Electronic Parking Brake",
    label: "EPB (Electronic Parking Brake)",
  },
  {
    value: "TPMS",
    abbr: "TPMS",
    fullEn: "Tire Pressure Monitoring System",
    label: "TPMS (Tire Pressure Monitoring System)",
  },
  {
    value: "AWD",
    abbr: "AWD",
    fullEn: "All-Wheel Drive Control",
    label: "AWD (All-Wheel Drive Control)",
  },
  {
    value: "VDC",
    abbr: "VDC",
    fullEn: "Vehicle Dynamic Control",
    label: "VDC (Vehicle Dynamic Control)",
  },
  {
    value: "ICC",
    abbr: "ICC",
    fullEn: "Integrated Chassis Control",
    label: "ICC (Integrated Chassis Control)",
  },
];

export function getChassisSystemLabel(value: string): string {
  const found = CHASSIS_SYSTEMS.find((s) => s.value === value);
  if (found) return `${found.abbr} (${found.fullEn})`;
  if (value === "통합 섀시제어") return "ICC (Integrated Chassis Control)";
  return value;
}
