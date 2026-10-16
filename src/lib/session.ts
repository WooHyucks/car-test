import type { SimulationSession } from "./types";

const KEY = "chassis-ai-simulation-session";

export function saveSimulationSession(session: SimulationSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSimulationSession(): SimulationSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SimulationSession;
  } catch {
    return null;
  }
}

export function clearSimulationSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
