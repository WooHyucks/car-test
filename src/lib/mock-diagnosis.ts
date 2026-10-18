import type { DiagnosisInput, DiagnosisResult, FaultCause } from "./types";
import {
  type DtcCategory,
  type DtcEntry,
  getSupportedDtcs as catalogCodes,
  lookupDtc,
  normalizeDtc,
} from "./dtc-catalog";

export { getSupportedDtcs } from "./dtc-catalog";

const DISCLAIMER =
  "이 내용은 교육용 Mock 분석 결과이며 실제 차량의 확정 진단이 아닙니다. 제조사별 DTC 정의와 진단 절차는 다를 수 있으므로 공식 정비 정보를 확인해야 합니다.";

const CAUSES_BY_CATEGORY: Record<DtcCategory, FaultCause[]> = {
  wheel_speed: [
    {
      id: "sensor",
      name: "휠 속도센서 자체 이상",
      description:
        "센서 내부 회로 손상 또는 감지 성능 저하로 정상 휠 속도 신호를 생성하지 못할 수 있습니다.",
      dataToCheck: "해당 휠 실시간 속도 신호, 센서 저항값, 신호 파형",
      inspectionMethod:
        "진단기로 4개 휠 속도 신호를 비교하고 센서 저항·출력 파형을 점검합니다.",
    },
    {
      id: "wiring",
      name: "센서 배선 또는 커넥터 이상",
      description:
        "배선 단선·단락, 커넥터 접촉 불량으로 신호 전달이 불안정해질 수 있습니다.",
      dataToCheck: "커넥터 핀 상태, 배선 연속성, 전원/접지 전압",
      inspectionMethod:
        "커넥터 외관·고정 상태를 확인하고 배선 연속성 및 전압을 측정합니다.",
    },
    {
      id: "encoder",
      name: "휠 베어링 엔코더 링 이상",
      description:
        "엔코더 링 오염·손상·에어갭 이상으로 센서가 회전을 정확히 감지하지 못할 수 있습니다.",
      dataToCheck: "엔코더 링 외관, 에어갭, 휠 베어링 유격",
      inspectionMethod: "휠을 들어 올려 엔코더 링과 에어갭을 육안·측정 점검합니다.",
    },
    {
      id: "ecu",
      name: "ABS 제어장치 입력 신호 이상",
      description:
        "센서와 배선이 정상이어도 ABS ECU 입력 회로 이상으로 신호가 잘못 인식될 수 있습니다.",
      dataToCheck: "ABS ECU 입력 신호, 관련 통신 데이터, 기타 DTC",
      inspectionMethod:
        "다른 휠 신호와 비교 후 센서·배선이 정상이면 ECU 입력을 재평가합니다.",
    },
  ],
  steering_angle: [
    {
      id: "sas",
      name: "조향각 센서 자체 이상",
      description: "센서 내부 고장 또는 캘리브레이션 이상으로 조향각 정보가 부정확할 수 있습니다.",
      dataToCheck: "조향각 실시간 값, 센서 캘리브레이션 상태",
      inspectionMethod: "진단기로 조향각 변화를 확인하고 영점 보정 상태를 점검합니다.",
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
      description: "얼라인먼트 또는 센서 교체 후 보정 누락 시 ESC가 비정상으로 인식할 수 있습니다.",
      dataToCheck: "보정 이력, 중립 조향각 값",
      inspectionMethod: "제조사 절차에 따라 조향각 센서 보정을 수행합니다.",
    },
    {
      id: "esc-ecu",
      name: "ESC 제어장치 입력 이상",
      description: "센서·배선이 정상이어도 ESC ECU 입력 이상을 배제할 수 없습니다.",
      dataToCheck: "ESC ECU 관련 DTC, 입력 신호 비교",
      inspectionMethod: "센서·배선 정상 확인 후 ESC 제어장치 입력을 재평가합니다.",
    },
  ],
  yaw_rate: [
    {
      id: "yrs",
      name: "요레이트/횡가속도 센서 이상",
      description: "자세 감지 센서 이상으로 ESC가 차량 거동을 잘못 판단할 수 있습니다.",
      dataToCheck: "요레이트, 횡가속도 실시간 값",
      inspectionMethod: "직진·선회 시 센서 값 변화를 진단기로 확인합니다.",
    },
    {
      id: "mount",
      name: "센서 장착/보정 이상",
      description: "장착 각도나 보정 상태 이상이 신호 오프셋을 유발할 수 있습니다.",
      dataToCheck: "장착 상태, 보정 이력",
      inspectionMethod: "센서 장착과 보정 절차를 점검합니다.",
    },
    {
      id: "wiring",
      name: "배선 또는 커넥터 이상",
      description: "신호선 이상으로 센서 데이터가 불안정할 수 있습니다.",
      dataToCheck: "커넥터, 전원/접지, 연속성",
      inspectionMethod: "전기적 연속성과 커넥터 상태를 점검합니다.",
    },
    {
      id: "esc-ecu",
      name: "ESC 제어장치 연산 이상",
      description: "입력 정상 시 ESC 내부 연산/출력 이상을 고려합니다.",
      dataToCheck: "ESC 상태, 관련 DTC",
      inspectionMethod: "단계별 점검 후 ESC 제어장치를 재평가합니다.",
    },
  ],
  torque: [
    {
      id: "torque",
      name: "조향 토크센서 자체 이상",
      description: "토크센서 이상으로 운전자 조향 입력을 정확히 측정하지 못할 수 있습니다.",
      dataToCheck: "토크센서 실시간 값, 신호 편차",
      inspectionMethod: "조향 조작 시 토크 신호 변화를 진단기로 확인합니다.",
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
      description: "보조 모터/구동 회로 이상으로 조향 보조가 제한될 수 있습니다.",
      dataToCheck: "모터 전류, EPS 관련 DTC",
      inspectionMethod: "토크센서 정상 확인 후 모터·구동 회로를 점검합니다.",
    },
    {
      id: "eps-ecu",
      name: "EPS 제어장치 이상",
      description: "센서와 액추에이터가 정상이어도 EPS ECU 이상을 고려해야 합니다.",
      dataToCheck: "EPS ECU 상태, 통신 데이터",
      inspectionMethod: "단계별 점검 후 EPS 제어장치를 재평가합니다.",
    },
  ],
  abs_hydraulic: [
    {
      id: "pump",
      name: "ABS 펌프/밸브 액추에이터 이상",
      description: "유압 제어 액추에이터 이상으로 ABS 기능이 제한될 수 있습니다.",
      dataToCheck: "펌프 전류, 밸브 작동음, 관련 DTC",
      inspectionMethod: "진단기 액추에이터 테스트와 전류 측정을 수행합니다.",
    },
    {
      id: "wiring",
      name: "액추에이터 배선 이상",
      description: "펌프/밸브 배선 불량이 동일 증상을 유발할 수 있습니다.",
      dataToCheck: "배선 연속성, 커넥터, 전원",
      inspectionMethod: "관련 배선과 커넥터를 점검합니다.",
    },
    {
      id: "fluid",
      name: "브레이크 유압/오일 상태 이상",
      description: "유압 부족이나 에어 혼입이 제어 이상을 유발할 수 있습니다.",
      dataToCheck: "오일 레벨, 누유, 페달감",
      inspectionMethod: "유압 계통 육안 점검과 블리딩 상태를 확인합니다.",
    },
    {
      id: "ecu",
      name: "ABS 제어장치 이상",
      description: "입력·액추에이터가 정상이면 ECU 내부 이상을 재평가합니다.",
      dataToCheck: "ABS ECU 상태, 통신",
      inspectionMethod: "단계별 점검 후 ECU를 재평가합니다.",
    },
  ],
  eps: [
    {
      id: "motor",
      name: "EPS 모터/구동부 이상",
      description: "모터 또는 구동 회로 이상으로 조향 보조가 제한됩니다.",
      dataToCheck: "모터 전류, 온도, 관련 DTC",
      inspectionMethod: "전류·온도 데이터와 작동 상태를 점검합니다.",
    },
    {
      id: "wiring",
      name: "전원/배선 이상",
      description: "전원 공급 불안정이 EPS 제한을 유발할 수 있습니다.",
      dataToCheck: "배터리 전압, 전원선, 접지",
      inspectionMethod: "전원·접지 회로를 측정합니다.",
    },
    {
      id: "thermal",
      name: "과열 보호 로직 개입",
      description: "장시간 조향 부하 시 보호 로직이 보조력을 제한할 수 있습니다.",
      dataToCheck: "EPS 온도, 보호 이력",
      inspectionMethod: "냉각 후 재현 여부와 온도 데이터를 확인합니다.",
    },
    {
      id: "eps-ecu",
      name: "EPS 제어장치 이상",
      description: "기타 항목이 정상이면 ECU를 재평가합니다.",
      dataToCheck: "EPS ECU 상태",
      inspectionMethod: "단계별 점검 후 제어장치를 재평가합니다.",
    },
  ],
  communication: [
    {
      id: "can",
      name: "CAN 통신 라인 이상",
      description: "통신선 단선·단락 또는 종단 저항 이상이 통신 두절을 유발할 수 있습니다.",
      dataToCheck: "CAN High/Low 전압, 저항",
      inspectionMethod: "통신 라인 전압과 종단 저항을 점검합니다.",
    },
    {
      id: "connector",
      name: "제어장치 커넥터 접촉 불량",
      description: "커넥터 접촉 불량으로 간헐적 통신 두절이 발생할 수 있습니다.",
      dataToCheck: "커넥터 핀, 고정 상태",
      inspectionMethod: "관련 커넥터를 점검·재체결합니다.",
    },
    {
      id: "module",
      name: "대상 제어장치 전원 이상",
      description: "대상 모듈 전원 이상으로 통신이 끊길 수 있습니다.",
      dataToCheck: "모듈 전원/접지",
      inspectionMethod: "제어장치 전원 공급을 확인합니다.",
    },
    {
      id: "bus-load",
      name: "버스 과부하/타 모듈 영향",
      description: "다른 모듈 이상으로 버스 통신이 불안정할 수 있습니다.",
      dataToCheck: "관련 통신 DTC, 네트워크 토폴로지",
      inspectionMethod: "네트워크 진단으로 영향 모듈을 분리·확인합니다.",
    },
  ],
  power: [
    {
      id: "battery",
      name: "배터리 상태 이상",
      description: "전압 저하/과다가 센서·제어장치 오동작을 유발할 수 있습니다.",
      dataToCheck: "배터리 전압, 부하 시 전압",
      inspectionMethod: "시동 전후 전압과 부하 테스트를 수행합니다.",
    },
    {
      id: "alternator",
      name: "충전 계통 이상",
      description: "알터네이터 출력 이상이 전압 변동을 만들 수 있습니다.",
      dataToCheck: "충전 전압, 리플",
      inspectionMethod: "충전 계통을 점검합니다.",
    },
    {
      id: "ground",
      name: "차체 접지 불량",
      description: "접지 불량이 다중 섀시 DTC로 나타날 수 있습니다.",
      dataToCheck: "주요 접지점 저항",
      inspectionMethod: "접지 포인트를 점검·재체결합니다.",
    },
    {
      id: "wiring",
      name: "전원 배선 이상",
      description: "전원선 접촉 불량으로 간헐 이상이 발생할 수 있습니다.",
      dataToCheck: "퓨즈, 릴레이, 전원 커넥터",
      inspectionMethod: "관련 전원 회로를 점검합니다.",
    },
  ],
};

const FLOW_BY_CATEGORY: Record<
  DtcCategory,
  { title: string; flow: string[]; description: string }
> = {
  wheel_speed: {
    title: "섀시 통합제어 시스템 영향",
    flow: ["휠 속도센서", "ABS 제어장치", "ABS / ESC 제어 기능"],
    description:
      "휠 속도센서 신호는 ABS·ESC에 공통 사용되므로, 한 개 휠 신호 이상이 제동 제어와 자세 제어에 함께 영향을 줄 수 있습니다.",
  },
  steering_angle: {
    title: "섀시 통합제어 시스템 영향",
    flow: ["조향각 센서", "ESC 제어장치", "차량 자세 제어 기능"],
    description:
      "조향각은 운전자 조향 의도를 나타내는 ESC 핵심 입력이며, 요레이트·횡가속도와 함께 제어 로직에 사용됩니다.",
  },
  yaw_rate: {
    title: "섀시 통합제어 시스템 영향",
    flow: ["요레이트/횡가속 센서", "ESC 제어장치", "자세 제어 개입"],
    description:
      "요레이트·횡가속도는 차량 실제 거동을 나타내며 ESC가 목표 거동과 비교해 개입 여부를 결정합니다.",
  },
  torque: {
    title: "섀시 통합제어 시스템 영향",
    flow: ["조향 토크센서", "EPS 제어장치", "조향 보조 / 통합 섀시제어"],
    description:
      "토크센서 신호는 EPS 보조 토크 산출에 사용되며, 일부 통합제어에서는 조향 개입 입력으로도 활용됩니다.",
  },
  abs_hydraulic: {
    title: "섀시 통합제어 시스템 영향",
    flow: ["ABS HCU", "ABS 제어장치", "제동 유압 제어"],
    description:
      "ABS 유압 장치는 휠 슬립 제어의 실행부이며, 이상은 제동 안정성과 ESC 개입에도 영향을 줍니다.",
  },
  eps: {
    title: "섀시 통합제어 시스템 영향",
    flow: ["EPS 모터", "EPS 제어장치", "조향 보조 출력"],
    description:
      "EPS 모터/구동 이상은 조향 보조력에 직접 영향을 주며 안전 관련 경고로 이어질 수 있습니다.",
  },
  communication: {
    title: "섀시 통합제어 시스템 영향",
    flow: ["CAN 버스", "섀시 제어장치군", "통합제어 기능"],
    description:
      "통신 두절은 개별 센서 고장처럼 보이더라도 실제로는 네트워크/전원 문제일 수 있어 시스템 관점 점검이 필요합니다.",
  },
  power: {
    title: "섀시 통합제어 시스템 영향",
    flow: ["전원/충전 계통", "섀시 ECU", "다중 제어 기능"],
    description:
      "전원 이상은 여러 섀시 제어장치에 동시에 영향을 주어 복합 DTC로 나타날 수 있습니다.",
  },
};

function buildSteps(entry: DtcEntry) {
  return [
    {
      step: 1,
      title: "관련 DTC 및 프리즈 프레임 확인",
      description: `${entry.code}(${entry.abbr}) 발생 조건과 프리즈 프레임을 확인합니다.`,
    },
    {
      step: 2,
      title: "관련 실시간 데이터 확인",
      description: `${entry.system} 관련 센서·액추에이터 데이터를 비교합니다.`,
    },
    {
      step: 3,
      title: "외관·커넥터 점검",
      description: "센서/액추에이터와 커넥터 장착·오염·손상 여부를 확인합니다.",
    },
    {
      step: 4,
      title: "배선 및 신호/통신 상태 점검",
      description: "전기적 연속성, 전압, 필요 시 통신 상태를 점검합니다.",
    },
    {
      step: 5,
      title: "점검 결과에 따라 원인 재평가",
      description: "확보한 데이터를 바탕으로 가능한 원인을 재정리합니다.",
    },
    {
      step: 6,
      title: "정비 후 DTC 및 기능 재확인",
      description: "정비 후 DTC를 지우고 관련 기능을 재확인합니다.",
    },
  ];
}

function buildResult(entry: DtcEntry, input: DiagnosisInput): DiagnosisResult {
  const impact = FLOW_BY_CATEGORY[entry.category];
  return {
    supported: true,
    symptomAnalysis: `입력된 DTC ${entry.code}(${entry.abbr}) — 「${entry.name}」 및 증상 정보를 바탕으로 ${entry.system} 계통의 이상 가능성을 우선 검토할 수 있습니다.\n\n증상: ${input.symptoms || entry.defaultSymptoms}\n\n관련 신호/기능은 통합 섀시제어에 연결될 수 있으므로, 단일 부품 교체보다 데이터 기반의 단계적 진단이 교육적으로 중요합니다.`,
    causes: CAUSES_BY_CATEGORY[entry.category],
    steps: buildSteps(entry),
    integrationImpact: impact,
    disclaimer: DISCLAIMER,
  };
}

export function analyzeDiagnosis(input: DiagnosisInput): DiagnosisResult {
  const dtc = normalizeDtc(input.dtcCode);
  const entry = lookupDtc(dtc);

  if (!entry) {
    return {
      supported: false,
      unsupportedMessage: `입력하신 DTC 코드 "${input.dtcCode.trim()}"는 현재 데모 카탈로그에 없습니다.\n\n지원 가능한 데모 DTC: ${catalogCodes().join(", ")}\n\n제조사별 DTC 정의가 다를 수 있으며, 검증되지 않은 조합은 차량별 공식 진단 정보를 확인해야 합니다.`,
      symptomAnalysis: "",
      causes: [],
      steps: [],
      integrationImpact: { title: "", flow: [], description: "" },
      disclaimer: "AI 응답 시뮬레이션 · 교육용 데모. 실제 차량 확정 진단이 아닙니다.",
    };
  }

  return buildResult(entry, input);
}

export const ANALYSIS_STAGES = [
  {
    id: "search",
    icon: "search" as const,
    title: "기술 자료 검색",
    detail: "DTC 정의 · TSB · 정비 매뉴얼 키워드를 조회하는 중...",
  },
  {
    id: "web",
    icon: "globe" as const,
    title: "참고 사례 수집",
    detail: "유사 고장 사례와 섀시 통합제어 관계를 수집하는 중...",
  },
  {
    id: "ai",
    icon: "sparkles" as const,
    title: "AI 추론 분석",
    detail: "가능 원인과 교육용 진단 절차를 구조화하는 중...",
  },
  {
    id: "report",
    icon: "file" as const,
    title: "진단 리포트 생성",
    detail: "학생 실습으로 연결 가능한 리포트를 구성하는 중...",
  },
];

export const LOADING_MESSAGES = ANALYSIS_STAGES.map((s) => s.detail);
