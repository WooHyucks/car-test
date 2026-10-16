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

export const CHASSIS_SYSTEMS: { value: ChassisSystem; label: string }[] = [
  { value: "ABS", label: "ABS (잠김 방지 제동 시스템)" },
  { value: "ESC", label: "ESC (차체 자세 제어 시스템)" },
  { value: "EPS", label: "EPS (전자식 파워 스티어링)" },
  { value: "ECS", label: "ECS (전자제어 서스펜션)" },
  { value: "통합 섀시제어", label: "통합 섀시제어" },
];
