import type {
  EvaluationResult,
  SimulationSession,
  ToolAction,
} from "./types";
import { getScenarioById } from "./mock-scenarios";

const IDEAL_TOOLS: ToolAction[] = [
  "dtc",
  "sensor",
  "wiring",
  "sensor_status",
];

function clamp(n: number, min = 40, max = 98): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function evaluateSimulation(
  session: SimulationSession
): EvaluationResult {
  const scenario = getScenarioById(session.scenarioId);
  if (!scenario) {
    return {
      scores: {
        dtcUnderstanding: 50,
        procedureAppropriateness: 50,
        sensorInterpretation: 50,
        causeInference: 50,
        reasoningLogic: 50,
        total: 50,
      },
      strengths: ["실습 세션 데이터가 확인되었습니다."],
      improvements: ["시나리오를 다시 선택하여 실습을 진행해 주세요."],
      feedback: "유효한 시나리오 세션을 찾을 수 없습니다.",
    };
  }

  const tools = new Set(session.checkedTools);
  const hasDtc = tools.has("dtc");
  const hasSensor = tools.has("sensor");
  const hasWiring = tools.has("wiring");
  const hasSensorStatus = tools.has("sensor_status");
  const hasMap = tools.has("system_map");

  const toolCoverage =
    IDEAL_TOOLS.filter((t) => tools.has(t)).length / IDEAL_TOOLS.length;

  const causeCorrect = session.finalCause === scenario.correctCause;
  const reasoningLength = (session.reasoning ?? "").trim().length;
  const repairLength = (session.repairMethod ?? "").trim().length;
  const chatDepth = session.messages.filter((m) => m.role === "student").length;
  const keywordCount = session.chatKeywords.length;

  let dtcUnderstanding = 55;
  if (hasDtc) dtcUnderstanding += 25;
  if (keywordCount > 0 || chatDepth > 0) dtcUnderstanding += 8;
  if (hasMap) dtcUnderstanding += 5;

  let procedureAppropriateness = 50;
  procedureAppropriateness += toolCoverage * 35;
  if (hasDtc && hasSensor) procedureAppropriateness += 8;
  if (hasWiring && hasSensorStatus) procedureAppropriateness += 7;
  if (!hasWiring && causeCorrect && scenario.id === "abs-wheel-speed") {
    procedureAppropriateness -= 12;
  }

  let sensorInterpretation = 48;
  if (hasSensor) sensorInterpretation += 30;
  if (hasSensorStatus) sensorInterpretation += 12;
  if (
    (session.reasoning ?? "").includes("좌측") ||
    (session.reasoning ?? "").includes("신호") ||
    (session.reasoning ?? "").includes("데이터")
  ) {
    sensorInterpretation += 8;
  }

  let causeInference = 45;
  if (causeCorrect) causeInference += 40;
  else causeInference += 10;
  if (hasSensor && hasWiring) causeInference += 8;
  if (hasSensorStatus) causeInference += 5;

  let reasoningLogic = 50;
  if (reasoningLength >= 20) reasoningLogic += 15;
  if (reasoningLength >= 60) reasoningLogic += 10;
  if (repairLength >= 15) reasoningLogic += 10;
  if (chatDepth >= 2) reasoningLogic += 8;
  if (causeCorrect && hasWiring) reasoningLogic += 5;

  const scores = {
    dtcUnderstanding: clamp(dtcUnderstanding),
    procedureAppropriateness: clamp(procedureAppropriateness),
    sensorInterpretation: clamp(sensorInterpretation),
    causeInference: clamp(causeInference),
    reasoningLogic: clamp(reasoningLogic),
    total: 0,
  };

  scores.total = clamp(
    (scores.dtcUnderstanding +
      scores.procedureAppropriateness +
      scores.sensorInterpretation +
      scores.causeInference +
      scores.reasoningLogic) /
      5,
    45,
    96
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (hasSensor) {
    strengths.push(
      scenario.id === "abs-wheel-speed"
        ? "휠 속도센서의 이상 신호를 정확하게 파악했습니다."
        : "관련 센서 데이터를 점검에 활용했습니다."
    );
  }
  if (hasDtc) {
    strengths.push("DTC 확인을 통해 진단의 출발점을 잘 설정했습니다.");
  }
  if (causeCorrect) {
    strengths.push("최종 고장 원인을 올바르게 추론했습니다.");
  }
  if (chatDepth >= 2) {
    strengths.push("AI 어시스턴트와 대화하며 진단 과정을 단계적으로 진행했습니다.");
  }
  if (strengths.length === 0) {
    strengths.push("실습 절차에 참여하여 진단 과정을 경험했습니다.");
  }

  if (!hasWiring && scenario.id === "abs-wheel-speed") {
    improvements.push(
      "센서 교체를 결정하기 전에 배선 및 커넥터 상태를 확인하는 절차가 필요합니다."
    );
  }
  if (!hasSensor) {
    improvements.push(
      "실시간 센서 데이터를 확인하면 고장 부위 특정에 도움이 됩니다."
    );
  }
  if (!causeCorrect) {
    improvements.push(
      `이번 시나리오의 핵심 원인은 「${scenario.correctCause}」입니다. 확보한 데이터와 원인을 다시 연결해 보세요.`
    );
  }
  if (reasoningLength < 20) {
    improvements.push(
      "판단 근거를 더 구체적으로 서술하면 진단의 논리성이 높아집니다."
    );
  }
  if (!hasDtc) {
    improvements.push("진단 초기에 DTC와 프리즈 프레임을 확인하는 습관을 권장합니다.");
  }
  if (improvements.length === 0) {
    improvements.push(
      "전반적으로 우수한 진단 절차입니다. 통합제어 관점에서 영향 범위를 한 단계 더 설명해 보세요."
    );
  }

  const feedback = causeCorrect
    ? "학생은 점검 데이터를 바탕으로 타당한 고장 원인을 도출했습니다. AI는 정답을 대신 찾지 않고, 학생의 추론 과정을 확장하는 역할을 수행했습니다."
    : "일부 점검 항목은 잘 수행했으나 최종 원인 추론에서 보완이 필요합니다. 센서 데이터와 배선 점검 결과를 함께 재검토해 보세요.";

  return { scores, strengths, improvements, feedback };
}

export const ANALYTICS_MOCK = {
  participants: 32,
  averageScore: 81,
  completionRate: 87,
  weakArea: "센서 데이터 해석",
  scoreDistribution: [
    { range: "90-100", count: 5 },
    { range: "80-89", count: 11 },
    { range: "70-79", count: 9 },
    { range: "60-69", count: 5 },
    { range: "60 미만", count: 2 },
  ],
  categoryAverages: [
    { category: "DTC 이해도", score: 88 },
    { category: "진단 절차", score: 82 },
    { category: "센서 데이터 해석", score: 74 },
    { category: "고장 원인 추론", score: 76 },
    { category: "근거 논리성", score: 79 },
  ],
  misconceptions: [
    { name: "센서 이상 시 즉시 교체 판단", count: 14 },
    { name: "배선 점검 생략", count: 11 },
    { name: "ESC 입력 센서 혼동", count: 8 },
    { name: "프리즈 프레임 미확인", count: 7 },
  ],
  weeklyProgress: [
    { week: "1주차", score: 68 },
    { week: "2주차", score: 72 },
    { week: "3주차", score: 75 },
    { week: "4주차", score: 79 },
    { week: "5주차", score: 81 },
    { week: "6주차", score: 84 },
  ],
  insight:
    "학생들의 DTC 코드 이해도는 높지만, 센서 데이터 해석과 고장 원인 추론 과정에서 상대적으로 낮은 성취도를 보였습니다.\n\n다음 수업에서는 휠 속도센서 신호 분석과 ABS·ESC 통합제어 관계를 중심으로 보충 학습을 진행하는 것을 권장합니다.",
};

export const DASHBOARD_STATS = {
  totalDiagnosis: 24,
  completedSimulations: 12,
  averageAccuracy: 86,
  progress: 72,
  recentActivities: [
    {
      id: "1",
      type: "diagnosis",
      title: "ABS 휠 속도센서 DTC 분석",
      detail: "C0035 · 현대 아반떼 2022",
      time: "오늘 14:20",
    },
    {
      id: "2",
      type: "simulation",
      title: "ABS 진단 실습 완료",
      detail: "종합 평가 85점",
      time: "오늘 13:05",
    },
    {
      id: "3",
      type: "diagnosis",
      title: "ESC 조향각 센서 분석",
      detail: "C0051 · 현대 쏘나타 2023",
      time: "어제 16:40",
    },
    {
      id: "4",
      type: "simulation",
      title: "EPS 진단 실습 진행",
      detail: "시나리오 3 · 진행 중",
      time: "어제 11:15",
    },
  ],
};
