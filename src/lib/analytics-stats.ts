const COMPLETION_KEY = "chassis-ai-simulation-completions";

/** 기본 예시 인원 + 로컬에서 최종 진단 제출한 횟수 */
export const BASE_PARTICIPANTS = 32;

export function getSimulationCompletions(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(COMPLETION_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function incrementSimulationCompletions(): number {
  if (typeof window === "undefined") return 0;
  const next = getSimulationCompletions() + 1;
  localStorage.setItem(COMPLETION_KEY, String(next));
  return next;
}

export function getLiveParticipants(base = BASE_PARTICIPANTS): number {
  return base + getSimulationCompletions();
}
