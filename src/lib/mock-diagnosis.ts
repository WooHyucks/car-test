import type { DiagnosisInput, DiagnosisResult } from "./types";

const SUPPORTED_DTCS = ["C0035", "C0036", "C0040", "C0051", "C1014"];

function normalizeDtc(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

const C0035_RESULT: DiagnosisResult = {
  supported: true,
  symptomAnalysis:
    "입력된 DTC 및 증상을 바탕으로 좌측 전륜 휠 속도 신호 계통의 이상 가능성을 우선적으로 검토할 수 있습니다.\n\n휠 속도 정보는 ABS 및 ESC 제어에 활용되므로, 관련 신호 이상이 복수의 제어 기능에 영향을 미칠 수 있습니다.",
  causes: [
    {
      id: "sensor",
      name: "휠 속도센서 자체 이상",
      description:
        "센서 내부 회로 손상 또는 감지 성능 저하로 인해 정상적인 휠 속도 신호를 생성하지 못할 수 있습니다.",
      dataToCheck: "해당 휠 실시간 속도 신호, 센서 저항값, 신호 파형",
      inspectionMethod:
        "진단기로 4개 휠 속도 신호를 비교하고, 센서 저항 및 출력 파형을 점검합니다.",
    },
    {
      id: "wiring",
      name: "센서 배선 또는 커넥터 이상",
      description:
        "배선 단선, 단락, 커넥터 접촉 불량으로 신호 전달이 불안정해질 수 있습니다.",
      dataToCheck: "커넥터 핀 상태, 배선 연속성, 전원/접지 전압",
      inspectionMethod:
        "커넥터 외관·고정 상태를 확인하고 배선 연속성 및 전압을 측정합니다.",
    },
    {
      id: "encoder",
      name: "휠 베어링 엔코더 링 이상",
      description:
        "엔코더 링의 오염, 손상, 에어갭 이상으로 센서가 회전을 정확히 감지하지 못할 수 있습니다.",
      dataToCheck: "엔코더 링 외관, 에어갭, 휠 베어링 유격",
      inspectionMethod:
        "휠을 들어 올려 엔코더 링과 에어갭을 육안·측정 점검합니다.",
    },
    {
      id: "ecu",
      name: "ABS 제어장치 입력 신호 이상",
      description:
        "센서와 배선이 정상이어도 ABS 제어장치의 입력 회로 이상으로 신호가 잘못 인식될 수 있습니다.",
      dataToCheck: "ABS ECU 입력 신호, 관련 통신 데이터, 기타 DTC",
      inspectionMethod:
        "다른 휠 신호와 비교 후 센서·배선이 정상이면 ECU 입력 회로를 재평가합니다.",
    },
  ],
  steps: [
    {
      step: 1,
      title: "관련 DTC 및 프리즈 프레임 확인",
      description: "현재 DTC, 발생 조건, 프리즈 프레임 데이터를 확인합니다.",
    },
    {
      step: 2,
      title: "휠 속도센서 실시간 데이터 비교",
      description: "4개 휠의 실시간 속도 신호를 비교하여 이상 바퀴를 식별합니다.",
    },
    {
      step: 3,
      title: "센서 및 커넥터 외관 점검",
      description: "센서 장착 상태, 커넥터 고정 및 오염·손상 여부를 확인합니다.",
    },
    {
      step: 4,
      title: "배선 및 신호 상태 점검",
      description: "배선 연속성, 단락/단선, 신호 파형을 점검합니다.",
    },
    {
      step: 5,
      title: "점검 결과에 따라 원인 재평가",
      description: "확인된 데이터를 바탕으로 가능한 원인을 재정리합니다.",
    },
    {
      step: 6,
      title: "정비 후 DTC 및 기능 재확인",
      description: "정비 후 DTC를 지우고 ABS/ESC 기능을 재확인합니다.",
    },
  ],
  integrationImpact: {
    title: "섀시 통합제어 시스템 영향",
    flow: ["휠 속도센서", "ABS 제어장치", "ABS / ESC 제어 기능"],
    description:
      "휠 속도센서 신호는 ABS 제어장치에 전달되어 제동 압력 제어와 ESC 차량 자세 제어에 공통으로 사용됩니다. 한 개 휠의 신호 이상은 ABS 경고뿐 아니라 ESC 기능 제한으로 이어질 수 있습니다.",
  },
  disclaimer:
    "이 내용은 교육용 Mock 분석 결과이며 실제 차량의 확정 진단이 아닙니다. 제조사별 DTC 정의와 진단 절차는 다를 수 있으므로 공식 정비 정보를 확인해야 합니다.",
};

const DTC_RESULTS: Record<string, DiagnosisResult> = {
  C0035: C0035_RESULT,
  C0036: {
    ...C0035_RESULT,
    symptomAnalysis:
      "입력된 DTC를 바탕으로 우측 전륜 휠 속도 신호 계통의 이상 가능성을 우선적으로 검토할 수 있습니다.\n\n휠 속도 정보는 ABS 및 ESC 제어에 활용되므로, 관련 신호 이상이 복수의 제어 기능에 영향을 미칠 수 있습니다.",
  },
  C0040: {
    ...C0035_RESULT,
    symptomAnalysis:
      "입력된 DTC를 바탕으로 좌측 후륜 휠 속도 신호 계통의 이상 가능성을 검토할 수 있습니다.\n\n후륜 속도 신호 이상은 ABS 제동 제어뿐 아니라 ESC 요레이트 보정에도 영향을 줄 수 있습니다.",
  },
  C0051: {
    supported: true,
    symptomAnalysis:
      "입력된 DTC 및 증상을 바탕으로 조향각 센서 신호 계통의 이상 가능성을 우선적으로 검토할 수 있습니다.\n\n조향각 정보는 ESC 차량 자세 제어의 핵심 입력이므로, 신호 이상은 ESC 경고등 점등 및 제어 기능 제한으로 이어질 수 있습니다.",
    causes: [
      {
        id: "sas",
        name: "조향각 센서 자체 이상",
        description:
          "조향각 센서의 내부 고장 또는 캘리브레이션 이상으로 조향 각도 정보가 부정확할 수 있습니다.",
        dataToCheck: "조향각 실시간 값, 센서 캘리브레이션 상태",
        inspectionMethod:
          "진단기로 조향각 값을 확인하고 영점 보정 상태를 점검합니다.",
      },
      {
        id: "wiring",
        name: "센서 배선 또는 커넥터 이상",
        description: "배선 이상으로 조향각 신호 전달이 불안정할 수 있습니다.",
        dataToCheck: "커넥터 상태, 통신 라인 전압, 연속성",
        inspectionMethod: "커넥터와 배선의 외관·연속성을 점검합니다.",
      },
      {
        id: "calibration",
        name: "조향각 센서 보정 미실시",
        description:
          "휠 얼라인먼트 또는 센서 교체 후 보정이 누락되면 ESC가 비정상 상태로 인식할 수 있습니다.",
        dataToCheck: "보정 이력, 중립 조향각 값",
        inspectionMethod: "제조사 절차에 따라 조향각 센서 보정을 수행합니다.",
      },
      {
        id: "esc-ecu",
        name: "ESC 제어장치 입력 이상",
        description:
          "센서와 배선이 정상이어도 ESC ECU 입력 회로 이상을 배제할 수 없습니다.",
        dataToCheck: "ESC ECU 관련 DTC, 입력 신호 비교",
        inspectionMethod:
          "센서·배선 정상 확인 후 ESC 제어장치 입력을 재평가합니다.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "관련 DTC 및 프리즈 프레임 확인",
        description: "ESC 관련 DTC와 발생 조건을 확인합니다.",
      },
      {
        step: 2,
        title: "조향각 센서 실시간 데이터 확인",
        description: "조향 조작에 따른 각도 값 변화를 확인합니다.",
      },
      {
        step: 3,
        title: "센서 및 커넥터 외관 점검",
        description: "조향 컬럼 주변 센서·커넥터 상태를 점검합니다.",
      },
      {
        step: 4,
        title: "배선 및 통신 상태 점검",
        description: "신호/통신 라인의 연속성과 전압을 점검합니다.",
      },
      {
        step: 5,
        title: "보정 및 원인 재평가",
        description: "필요 시 보정을 수행하고 원인을 재정리합니다.",
      },
      {
        step: 6,
        title: "정비 후 ESC 기능 재확인",
        description: "DTC 삭제 후 ESC 경고등 및 기능을 재확인합니다.",
      },
    ],
    integrationImpact: {
      title: "섀시 통합제어 시스템 영향",
      flow: ["조향각 센서", "ESC 제어장치", "차량 자세 제어 기능"],
      description:
        "조향각 센서 정보는 운전자의 조향 의도를 파악하는 데 사용되며, 요레이트·횡가속도 센서와 함께 ESC 제어 로직의 핵심 입력입니다.",
    },
    disclaimer: C0035_RESULT.disclaimer,
  },
  C1014: {
    supported: true,
    symptomAnalysis:
      "입력된 DTC 및 증상을 바탕으로 조향 토크센서 신호 계통의 이상 가능성을 우선적으로 검토할 수 있습니다.\n\n토크센서 정보는 EPS 조향 보조 토크 산출에 직접 사용되므로, 신호 이상은 조향력 증가와 경고등 점등으로 나타날 수 있습니다.",
    causes: [
      {
        id: "torque",
        name: "조향 토크센서 자체 이상",
        description:
          "토크센서 내부 이상으로 운전자 조향 토크를 정확히 측정하지 못할 수 있습니다.",
        dataToCheck: "토크센서 실시간 값, 신호 편차",
        inspectionMethod:
          "조향 조작 시 토크 신호 변화를 진단기로 확인합니다.",
      },
      {
        id: "wiring",
        name: "센서 배선 또는 커넥터 이상",
        description: "배선 이상으로 토크 신호 전달이 불안정할 수 있습니다.",
        dataToCheck: "커넥터 상태, 전원/접지, 신호 연속성",
        inspectionMethod: "커넥터·배선의 외관과 전기적 상태를 점검합니다.",
      },
      {
        id: "motor",
        name: "EPS 모터 또는 구동 회로 이상",
        description:
          "보조 모터 또는 구동 회로 이상으로 조향 보조가 제한될 수 있습니다.",
        dataToCheck: "모터 전류, EPS 관련 DTC, 온도 정보",
        inspectionMethod:
          "토크센서 정상 확인 후 모터·구동 회로를 점검합니다.",
      },
      {
        id: "eps-ecu",
        name: "EPS 제어장치 이상",
        description:
          "센서와 액추에이터가 정상이어도 EPS ECU 연산/출력 이상을 고려해야 합니다.",
        dataToCheck: "EPS ECU 상태, 통신 데이터, 관련 DTC",
        inspectionMethod:
          "단계별 점검 후 최종적으로 EPS 제어장치를 재평가합니다.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "관련 DTC 및 프리즈 프레임 확인",
        description: "EPS 관련 DTC와 발생 조건을 확인합니다.",
      },
      {
        step: 2,
        title: "토크센서 실시간 데이터 확인",
        description: "조향 시 토크 신호 변화를 확인합니다.",
      },
      {
        step: 3,
        title: "센서 및 커넥터 외관 점검",
        description: "조향 컬럼 주변 커넥터·배선을 점검합니다.",
      },
      {
        step: 4,
        title: "모터 및 구동 회로 점검",
        description: "EPS 모터 전류와 구동 상태를 점검합니다.",
      },
      {
        step: 5,
        title: "점검 결과에 따라 원인 재평가",
        description: "확인된 데이터를 바탕으로 원인을 재정리합니다.",
      },
      {
        step: 6,
        title: "정비 후 EPS 기능 재확인",
        description: "DTC 삭제 후 조향 보조 기능을 재확인합니다.",
      },
    ],
    integrationImpact: {
      title: "섀시 통합제어 시스템 영향",
      flow: ["조향 토크센서", "EPS 제어장치", "조향 보조 / 통합 섀시제어"],
      description:
        "조향 토크센서 신호는 EPS 보조 토크 산출에 사용되며, 일부 통합 섀시제어에서는 조향 개입을 위한 입력으로도 활용될 수 있습니다.",
    },
    disclaimer: C0035_RESULT.disclaimer,
  },
};

export function getSupportedDtcs(): string[] {
  return [...SUPPORTED_DTCS];
}

export function analyzeDiagnosis(input: DiagnosisInput): DiagnosisResult {
  const dtc = normalizeDtc(input.dtcCode);

  if (!SUPPORTED_DTCS.includes(dtc)) {
    return {
      supported: false,
      unsupportedMessage: `입력하신 DTC 코드 "${input.dtcCode.trim()}"는 현재 데모에서 지원하지 않습니다.\n\n지원 가능한 데모 사례: ${SUPPORTED_DTCS.join(", ")}\n\n제조사별 DTC 코드 정의가 다를 수 있으며, 코드와 차량의 조합이 검증되지 않은 경우 차량별 공식 진단 정보를 확인해야 합니다.`,
      symptomAnalysis: "",
      causes: [],
      steps: [],
      integrationImpact: {
        title: "",
        flow: [],
        description: "",
      },
      disclaimer:
        "AI 응답 시뮬레이션 · 교육용 데모. 실제 차량 확정 진단이 아닙니다.",
    };
  }

  return DTC_RESULTS[dtc];
}

export const LOADING_MESSAGES = [
  "차량 정보를 분석하고 있습니다...",
  "DTC 코드와 섀시시스템을 확인하고 있습니다...",
  "가능한 고장 원인을 추론하고 있습니다...",
];
