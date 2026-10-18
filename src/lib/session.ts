import type { DiagnosisInput, SimulationSession } from "./types";

const KEY = "chassis-ai-simulation-session";
const DIAGNOSIS_TRANSFER_KEY = "chassis-ai-diagnosis-transfer";

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

export function saveDiagnosisTransfer(input: DiagnosisInput): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DIAGNOSIS_TRANSFER_KEY, JSON.stringify(input));
}

export function loadDiagnosisTransfer(): DiagnosisInput | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(DIAGNOSIS_TRANSFER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DiagnosisInput;
  } catch {
    return null;
  }
}

export function clearDiagnosisTransfer(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DIAGNOSIS_TRANSFER_KEY);
}
