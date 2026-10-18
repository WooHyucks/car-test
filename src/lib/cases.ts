export interface LearningCase {
  id: string;
  title: string;
  dtcCode: string;
  dtcName: string;
  vehicle: string;
  finding: string;
  teachingNote: string;
  createdAt: string;
  source: "seed" | "user";
}

const STORAGE_KEY = "chassis-ai-learning-cases";

export const SEED_CASES: LearningCase[] = [
  {
    id: "seed-1",
    title: "ABS 경고등 — 센서 교체 전 배선 점검의 중요성",
    dtcCode: "C0035",
    dtcName: "좌측 전륜 휠 속도센서 회로 이상",
    vehicle: "2022 현대 아반떼",
    finding:
      "학생 다수가 실시간 데이터에서 좌측 전륜 이상만 확인하고 즉시 센서 교체를 선택했습니다. 배선 점검을 거친 그룹의 원인 추론 점수가 더 높았습니다.",
    teachingNote:
      "다음 수업에서 ‘데이터 → 배선 → 부품’ 순서를 체크리스트로 강제하는 실습을 권장합니다.",
    createdAt: "2026-10-10",
    source: "seed",
  },
  {
    id: "seed-2",
    title: "ESC 경고 — 조향각 보정 누락 사례",
    dtcCode: "C0051",
    dtcName: "조향각 센서 신호 이상",
    vehicle: "2023 현대 쏘나타",
    finding:
      "하드웨어 고장으로 오인한 비율이 높았고, 캘리브레이션 개념을 연결한 학생은 소수였습니다.",
    teachingNote:
      "휠 얼라인먼트 후 센서 보정 절차를 짧은 실습 모듈로 분리하면 효과적입니다.",
    createdAt: "2026-10-12",
    source: "seed",
  },
  {
    id: "seed-3",
    title: "EPS 조향력 증가 — 토크센서 이중신호",
    dtcCode: "C1014",
    dtcName: "조향 토크센서 신호 이상",
    vehicle: "2024 기아 K5",
    finding:
      "증상과 DTC는 잘 연결했으나, 통합제어 관점(조향 보조가 다른 섀시 기능에 미치는 영향) 설명이 부족했습니다.",
    teachingNote:
      "진단 리포트의 Flow Diagram을 학생 발표에 활용하도록 과제로 연결합니다.",
    createdAt: "2026-10-14",
    source: "seed",
  },
];

export function loadCases(): LearningCase[] {
  if (typeof window === "undefined") return SEED_CASES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const userCases: LearningCase[] = raw ? JSON.parse(raw) : [];
    return [...userCases, ...SEED_CASES];
  } catch {
    return SEED_CASES;
  }
}

export function saveUserCase(
  input: Omit<LearningCase, "id" | "createdAt" | "source">
): LearningCase {
  const next: LearningCase = {
    ...input,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
    source: "user",
  };

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: LearningCase[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...existing]));
  }

  return next;
}

export function deleteUserCase(id: string): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEY);
  const existing: LearningCase[] = raw ? JSON.parse(raw) : [];
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing.filter((c) => c.id !== id))
  );
}
