import type { ToolAction } from "./types";
import { getScenarioById } from "./mock-scenarios";

interface ChatContext {
  scenarioId: string;
  checkedTools: ToolAction[];
  previousKeywords: string[];
}

const KEYWORD_RESPONSES: {
  keywords: string[];
  response: string;
  tag: string;
}[] = [
  {
    keywords: ["휠 속도", "센서 데이터", "실시간", "데이터 확인"],
    tag: "sensor_data",
    response:
      "실시간 데이터를 확인한 결과,\n좌측 전륜 휠 속도 신호가 다른 바퀴와 일치하지 않는 현상이 관찰됩니다.\n\n이 정보를 바탕으로 다음 점검 항목을 선택해 보세요.",
  },
  {
    keywords: ["배선", "커넥터", "하네스"],
    tag: "wiring",
    response:
      "배선 및 커넥터 점검 결과,\n특이사항은 확인되지 않았습니다.\n\n다음으로 어떤 가능성을 검토하시겠습니까?",
  },
  {
    keywords: ["센서 자체", "센서 불량", "센서 교체", "센서 이상"],
    tag: "sensor_fault",
    response:
      "가능한 가설입니다.\n\n현재까지 확인한 데이터를 바탕으로\n그렇게 판단한 근거를 설명해 보세요.",
  },
  {
    keywords: ["DTC", "고장코드", "진단코드", "프리즈"],
    tag: "dtc",
    response:
      "관련 DTC와 프리즈 프레임을 확인하는 것은 좋은 시작입니다.\n\n고장코드가 지시하는 회로와\n실제 센서 데이터를 함께 비교해 보세요.",
  },
  {
    keywords: ["ABS", "제어장치", "ECU"],
    tag: "ecu",
    response:
      "제어장치 이상을 의심하기 전에\n센서 신호와 배선 상태를 먼저 확인하는 것이\n일반적인 진단 절차입니다.\n\n현재까지 어떤 데이터를 확인하셨나요?",
  },
  {
    keywords: ["조향각", "캘리브", "보정"],
    tag: "steering_angle",
    response:
      "조향각 센서는 하드웨어 고장뿐 아니라\n보정 상태 이상도 경고를 유발할 수 있습니다.\n\n실시간 값과 캘리브레이션 상태를\n함께 확인해 보세요.",
  },
  {
    keywords: ["토크", "조향 보조", "EPS"],
    tag: "torque",
    response:
      "토크센서 신호는 EPS 보조 토크 산출의 핵심 입력입니다.\n\n주신호와 보조신호의 편차,\n그리고 배선 상태를 순서대로 점검해 보세요.",
  },
  {
    keywords: ["엔코더", "베어링", "에어갭"],
    tag: "encoder",
    response:
      "엔코더 링이나 에어갭 이상도\n휠 속도 신호 이상을 유발할 수 있습니다.\n\n다만 현재 시나리오에서는\n먼저 센서 신호와 배선을 확인하는 것이 효과적입니다.",
  },
  {
    keywords: ["도움", "힌트", "다음", "어떻게"],
    tag: "hint",
    response:
      "정답을 바로 알려드리기보다,\n학생이 직접 추론하도록 도와드리겠습니다.\n\n오른쪽 진단 도구에서\nDTC와 실시간 센서 데이터를 먼저 확인해 보세요.",
  },
];

const DEFAULT_RESPONSES = [
  "흥미로운 접근입니다.\n\n현재 확보한 점검 결과와 연결하여\n가설을 조금 더 구체화해 볼 수 있을까요?",
  "그 방향으로 생각해 볼 수 있습니다.\n\n관련 센서 데이터나 배선 점검 결과를\n함께 확인하면 판단이 더 명확해질 수 있습니다.",
  "좋은 질문입니다.\n\n다만 교육용 데모에서는\n정의되지 않은 측정값을 임의로 생성하지 않습니다.\n\n오른쪽 진단 도구의 점검 결과를 활용해 주세요.",
];

export function getMockChatResponse(
  message: string,
  context: ChatContext
): { response: string; matchedTag: string | null } {
  const scenario = getScenarioById(context.scenarioId);
  const normalized = message.toLowerCase().replace(/\s+/g, " ");

  for (const entry of KEYWORD_RESPONSES) {
    if (entry.keywords.some((k) => normalized.includes(k.toLowerCase()))) {
      if (
        entry.tag === "sensor_data" &&
        scenario?.id === "abs-wheel-speed" &&
        !context.checkedTools.includes("sensor")
      ) {
        return {
          matchedTag: entry.tag,
          response:
            "휠 속도 데이터를 확인하려는 접근이 좋습니다.\n\n오른쪽 진단 도구에서\n「실시간 센서 데이터」를 먼저 열어보세요.\n확인된 데이터를 바탕으로 대화를 이어가겠습니다.",
        };
      }
      return { response: entry.response, matchedTag: entry.tag };
    }
  }

  const index =
    (context.previousKeywords.length + message.length) %
    DEFAULT_RESPONSES.length;

  return {
    response: DEFAULT_RESPONSES[index],
    matchedTag: null,
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function simulateTypingDelay(textLength: number): Promise<void> {
  const ms = Math.min(1800, 600 + textLength * 8);
  await delay(ms);
}
