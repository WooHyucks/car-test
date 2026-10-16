export type Manufacturer =
  | "현대자동차"
  | "기아"
  | "제네시스"
  | "르노삼성"
  | "BMW"
  | "Mercedes-Benz";

export type ChassisSystem =
  | "ABS"
  | "ESC"
  | "EPS"
  | "ECS"
  | "통합 섀시제어";

export interface DiagnosisInput {
  manufacturer: Manufacturer | "";
  model: string;
  year: string;
  system: ChassisSystem | "";
  dtcCode: string;
  dtcName: string;
  symptoms: string;
}

export interface FaultCause {
  id: string;
  name: string;
  description: string;
  dataToCheck: string;
  inspectionMethod: string;
}

export interface DiagnosisStep {
  step: number;
  title: string;
  description: string;
}

export interface DiagnosisResult {
  supported: boolean;
  unsupportedMessage?: string;
  symptomAnalysis: string;
  causes: FaultCause[];
  steps: DiagnosisStep[];
  integrationImpact: {
    title: string;
    flow: string[];
    description: string;
  };
  disclaimer: string;
}

export type Difficulty = "초급" | "중급" | "고급";

export type ToolAction =
  | "dtc"
  | "sensor"
  | "wiring"
  | "sensor_status"
  | "system_map";

export interface Scenario {
  id: string;
  title: string;
  difficulty: Difficulty;
  vehicle: {
    manufacturer: string;
    model: string;
    year: string;
    system: string;
  };
  symptom: string;
  dtcCode: string;
  dtcName: string;
  learningGoal: string;
  correctCause: string;
  causeOptions: string[];
  initialAiMessage: string;
  toolResults: Record<ToolAction, string>;
}

export interface ChatMessage {
  id: string;
  role: "ai" | "student";
  content: string;
  timestamp: number;
}

export interface SimulationSession {
  scenarioId: string;
  checkedTools: ToolAction[];
  messages: ChatMessage[];
  chatKeywords: string[];
  finalCause?: string;
  reasoning?: string;
  repairMethod?: string;
}

export interface EvaluationScores {
  dtcUnderstanding: number;
  procedureAppropriateness: number;
  sensorInterpretation: number;
  causeInference: number;
  reasoningLogic: number;
  total: number;
}

export interface EvaluationResult {
  scores: EvaluationScores;
  strengths: string[];
  improvements: string[];
  feedback: string;
}
