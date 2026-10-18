export type DtcCategory =
  | "wheel_speed"
  | "steering_angle"
  | "yaw_rate"
  | "torque"
  | "abs_hydraulic"
  | "eps"
  | "communication"
  | "power";

export interface DtcEntry {
  code: string;
  /** 약어/짧은 표기 */
  abbr: string;
  name: string;
  category: DtcCategory;
  system: string;
  defaultSymptoms: string;
  scenarioHint: "abs-wheel-speed" | "esc-stability" | "eps-assist";
}

/** 교육용 Mock DTC 카탈로그 (실제 제조사별 정의와 다를 수 있음) */
export const DTC_CATALOG: DtcEntry[] = [
  {
    code: "C0035",
    abbr: "FL WSS",
    name: "좌측 전륜 휠 속도센서 회로 이상",
    category: "wheel_speed",
    system: "ABS",
    defaultSymptoms: "ABS 경고등 점등, 제동 시 진동 발생",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "C0036",
    abbr: "FR WSS",
    name: "우측 전륜 휠 속도센서 회로 이상",
    category: "wheel_speed",
    system: "ABS",
    defaultSymptoms: "ABS 경고등 점등",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "C0037",
    abbr: "RL WSS",
    name: "좌측 후륜 휠 속도센서 회로 이상",
    category: "wheel_speed",
    system: "ABS",
    defaultSymptoms: "ABS 경고등 점등, 저속 제동 시 이음",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "C0038",
    abbr: "RR WSS",
    name: "우측 후륜 휠 속도센서 회로 이상",
    category: "wheel_speed",
    system: "ABS",
    defaultSymptoms: "ABS 경고등 점등",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "C0040",
    abbr: "RL WSS Sig",
    name: "좌측 후륜 휠 속도센서 신호 이상",
    category: "wheel_speed",
    system: "ABS",
    defaultSymptoms: "ABS/ESC 경고등 점등",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "C0041",
    abbr: "RR WSS Sig",
    name: "우측 후륜 휠 속도센서 신호 이상",
    category: "wheel_speed",
    system: "ABS",
    defaultSymptoms: "ABS 경고등 점등, ESC 기능 제한",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "C0051",
    abbr: "SAS",
    name: "조향각 센서 신호 이상",
    category: "steering_angle",
    system: "ESC",
    defaultSymptoms: "ESC 경고등 점등",
    scenarioHint: "esc-stability",
  },
  {
    code: "C0052",
    abbr: "SAS Range",
    name: "조향각 센서 범위/성능 이상",
    category: "steering_angle",
    system: "ESC",
    defaultSymptoms: "ESC 경고등, 직진 시 조향각 오프셋",
    scenarioHint: "esc-stability",
  },
  {
    code: "C0061",
    abbr: "YRS",
    name: "요레이트 센서 신호 이상",
    category: "yaw_rate",
    system: "ESC",
    defaultSymptoms: "ESC 경고등 점등, 선회 시 제어 개입 이상",
    scenarioHint: "esc-stability",
  },
  {
    code: "C0062",
    abbr: "LAT Acc",
    name: "횡가속도 센서 신호 이상",
    category: "yaw_rate",
    system: "ESC",
    defaultSymptoms: "ESC 경고등 점등",
    scenarioHint: "esc-stability",
  },
  {
    code: "C1014",
    abbr: "TS",
    name: "조향 토크센서 신호 이상",
    category: "torque",
    system: "EPS",
    defaultSymptoms: "조향 보조 경고등 및 조향력 증가",
    scenarioHint: "eps-assist",
  },
  {
    code: "C1015",
    abbr: "TS Dual",
    name: "조향 토크센서 이중신호 불일치",
    category: "torque",
    system: "EPS",
    defaultSymptoms: "EPS 경고등, 조향 보조 제한",
    scenarioHint: "eps-assist",
  },
  {
    code: "C1101",
    abbr: "Batt Low",
    name: "배터리 전압 저하 (섀시제어)",
    category: "power",
    system: "ICC",
    defaultSymptoms: "다중 경고등, 제어 기능 간헐 제한",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "C1102",
    abbr: "Batt High",
    name: "배터리 전압 과다 (섀시제어)",
    category: "power",
    system: "ICC",
    defaultSymptoms: "경고등 점등, 센서 신호 불안정",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "C1200",
    abbr: "ABS Pump",
    name: "ABS 펌프 모터 회로 이상",
    category: "abs_hydraulic",
    system: "ABS",
    defaultSymptoms: "ABS 경고등, 제동 시 펌프 작동음 이상",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "C1201",
    abbr: "HCU Valve",
    name: "ABS 유압 제어 밸브 이상",
    category: "abs_hydraulic",
    system: "ABS",
    defaultSymptoms: "ABS 경고등, 제동감 불균일",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "C1234",
    abbr: "ABS ECU",
    name: "ABS 제어장치 내부 이상",
    category: "abs_hydraulic",
    system: "ABS",
    defaultSymptoms: "ABS/ESC 경고등 동시 점등",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "C1513",
    abbr: "EPS Motor",
    name: "EPS 모터 회로 이상",
    category: "eps",
    system: "EPS",
    defaultSymptoms: "조향 보조 경고등, 조향력 급증",
    scenarioHint: "eps-assist",
  },
  {
    code: "C1604",
    abbr: "EPS Temp",
    name: "EPS 과열 보호 작동",
    category: "eps",
    system: "EPS",
    defaultSymptoms: "장시간 조향 후 보조력 감소",
    scenarioHint: "eps-assist",
  },
  {
    code: "U0121",
    abbr: "CAN ABS",
    name: "ABS 제어장치와 통신 두절",
    category: "communication",
    system: "ICC",
    defaultSymptoms: "ABS/ESC 경고, 통신 관련 다중 DTC",
    scenarioHint: "abs-wheel-speed",
  },
  {
    code: "U0131",
    abbr: "CAN EPS",
    name: "EPS 제어장치와 통신 두절",
    category: "communication",
    system: "EPS",
    defaultSymptoms: "EPS 경고등, 조향 보조 제한",
    scenarioHint: "eps-assist",
  },
  {
    code: "C0045",
    abbr: "BRK Switch",
    name: "브레이크 페달 스위치 회로 이상",
    category: "abs_hydraulic",
    system: "ABS",
    defaultSymptoms: "제동등/ABS 관련 경고, 크루즈 해제",
    scenarioHint: "abs-wheel-speed",
  },
];

export function normalizeDtc(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export function lookupDtc(code: string): DtcEntry | undefined {
  const normalized = normalizeDtc(code);
  return DTC_CATALOG.find((d) => d.code === normalized);
}

export function getSupportedDtcs(): string[] {
  return DTC_CATALOG.map((d) => d.code);
}

export function searchDtcs(query: string): DtcEntry[] {
  const q = query.trim().toUpperCase();
  if (!q) return DTC_CATALOG.slice(0, 8);
  return DTC_CATALOG.filter(
    (d) =>
      d.code.includes(q) ||
      d.abbr.toUpperCase().includes(q) ||
      d.name.includes(query.trim())
  ).slice(0, 8);
}
