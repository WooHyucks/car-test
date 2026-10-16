import type { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "abs-wheel-speed",
    title: "ABS 휠 속도센서 이상",
    difficulty: "초급",
    vehicle: {
      manufacturer: "현대자동차",
      model: "아반떼",
      year: "2022",
      system: "ABS",
    },
    symptom: "ABS 경고등 점등",
    dtcCode: "C0035",
    dtcName: "좌측 전륜 휠 속도센서 회로 이상",
    learningGoal: "휠 속도센서 신호와 ABS 제어의 관계 이해",
    correctCause: "휠 속도센서 자체 이상",
    causeOptions: [
      "휠 속도센서 자체 이상",
      "센서 배선 또는 커넥터 이상",
      "ABS 제어장치 고장",
      "브레이크 패드 마모",
    ],
    initialAiMessage:
      "차량의 ABS 경고등이 점등되었습니다.\n\n진단기를 통해 관련 고장코드가 확인된 상황입니다.\n\n어떤 항목부터 점검하시겠습니까?",
    toolResults: {
      dtc: "DTC C0035 — 좌측 전륜 휠 속도센서 회로 이상이 확인되었습니다.\n프리즈 프레임: 차속 약 40km/h, ABS 활성 상태.\n\n※ 교육용 가상 진단 데이터입니다.",
      sensor:
        "실시간 휠 속도 데이터\n· 좌측 전륜: 간헐적 0km/h 신호\n· 우측 전륜: 약 40km/h\n· 좌측 후륜: 약 40km/h\n· 우측 후륜: 약 40km/h\n\n좌측 전륜만 비정상 패턴이 관찰됩니다.\n\n※ 교육용 가상 센서 데이터입니다.",
      wiring:
        "배선 및 커넥터 점검 결과\n· 커넥터 고정 상태: 양호\n· 핀 부식/손상: 없음\n· 배선 연속성: 정상\n\n특이사항은 확인되지 않았습니다.\n\n※ 교육용 가상 점검 결과입니다.",
      sensor_status:
        "센서 상태 점검 결과\n· 장착 상태: 정상\n· 센서 저항값: 규격 범위를 벗어남\n· 신호 파형: 간헐적 단절\n\n센서 자체 이상을 의심할 수 있는 데이터입니다.\n\n※ 교육용 가상 점검 결과입니다.",
      system_map:
        "제어 시스템 구조(교육용 개념도)\n\n휠 속도센서 → ABS 제어장치 → ABS / ESC 제어 기능\n\n좌측 전륜 속도 신호 이상은 ABS 제동 제어와 ESC 자세 제어에 공통으로 영향을 줄 수 있습니다.\n실제 차량별 제어 구조는 다를 수 있습니다.",
    },
  },
  {
    id: "esc-stability",
    title: "ESC 차량 자세 제어 이상",
    difficulty: "중급",
    vehicle: {
      manufacturer: "현대자동차",
      model: "쏘나타",
      year: "2023",
      system: "ESC",
    },
    symptom: "ESC 경고등 점등",
    dtcCode: "C0051",
    dtcName: "조향각 센서 신호 이상",
    learningGoal: "차량 자세 제어에 필요한 센서 정보와 제어 로직 이해",
    correctCause: "조향각 센서 보정 미실시",
    causeOptions: [
      "조향각 센서 보정 미실시",
      "요레이트 센서 고장",
      "휠 속도센서 고장",
      "브레이크 유압 부족",
    ],
    initialAiMessage:
      "차량의 ESC 경고등이 점등되었습니다.\n\n진단기를 통해 조향각 센서 관련 고장코드가 확인된 상황입니다.\n\n어떤 항목부터 점검하시겠습니까?",
    toolResults: {
      dtc: "DTC C0051 — 조향각 센서 신호 이상이 확인되었습니다.\n프리즈 프레임: 직진 주행 중, ESC 비활성.\n\n※ 교육용 가상 진단 데이터입니다.",
      sensor:
        "실시간 센서 데이터\n· 조향각: 직진 시에도 약 15° 오프셋\n· 요레이트: 정상 범위\n· 횡가속도: 정상 범위\n\n조향각 값의 오프셋이 관찰됩니다.\n\n※ 교육용 가상 센서 데이터입니다.",
      wiring:
        "배선 및 커넥터 점검 결과\n· 커넥터 상태: 양호\n· 통신 라인: 정상\n\n특이사항은 확인되지 않았습니다.\n\n※ 교육용 가상 점검 결과입니다.",
      sensor_status:
        "센서 상태 점검 결과\n· 센서 하드웨어: 외관상 정상\n· 캘리브레이션 상태: 미보정 또는 보정 값 이상\n\n보정 절차 수행이 필요할 수 있습니다.\n\n※ 교육용 가상 점검 결과입니다.",
      system_map:
        "제어 시스템 구조(교육용 개념도)\n\n조향각 센서 → ESC 제어장치 → 차량 자세 제어 기능\n\n조향각은 운전자 조향 의도를 나타내는 핵심 입력이며, 요레이트·횡가속도와 함께 ESC 로직에 사용됩니다.",
    },
  },
  {
    id: "eps-assist",
    title: "EPS 조향 보조 시스템 이상",
    difficulty: "고급",
    vehicle: {
      manufacturer: "기아",
      model: "K5",
      year: "2024",
      system: "EPS",
    },
    symptom: "조향 보조 경고등 및 조향력 증가",
    dtcCode: "C1014",
    dtcName: "조향 토크센서 신호 이상",
    learningGoal: "조향 토크센서와 전동식 조향 제어 이해",
    correctCause: "조향 토크센서 자체 이상",
    causeOptions: [
      "조향 토크센서 자체 이상",
      "EPS 모터 과열",
      "타이어 공기압 부족",
      "배터리 전압 저하",
    ],
    initialAiMessage:
      "조향 보조 경고등이 점등되었고 조향력이 증가한 상황입니다.\n\n진단기를 통해 토크센서 관련 고장코드가 확인되었습니다.\n\n어떤 항목부터 점검하시겠습니까?",
    toolResults: {
      dtc: "DTC C1014 — 조향 토크센서 신호 이상이 확인되었습니다.\n프리즈 프레임: 저속 선회 중, EPS 보조 제한.\n\n※ 교육용 가상 진단 데이터입니다.",
      sensor:
        "실시간 센서 데이터\n· 토크센서 주신호: 불안정\n· 토크센서 보조신호: 편차 발생\n· 조향각: 정상 변화\n\n토크 신호의 불일치가 관찰됩니다.\n\n※ 교육용 가상 센서 데이터입니다.",
      wiring:
        "배선 및 커넥터 점검 결과\n· 커넥터 상태: 양호\n· 전원/접지: 정상\n\n특이사항은 확인되지 않았습니다.\n\n※ 교육용 가상 점검 결과입니다.",
      sensor_status:
        "센서 상태 점검 결과\n· 토크센서 신호 편차: 규격 초과\n· EPS 모터 전류: 보조 제한 상태\n\n토크센서 자체 이상을 우선 검토할 수 있습니다.\n\n※ 교육용 가상 점검 결과입니다.",
      system_map:
        "제어 시스템 구조(교육용 개념도)\n\n조향 토크센서 → EPS 제어장치 → 조향 보조 모터\n\n토크센서는 운전자 조향 입력을 감지하여 보조 토크를 산출하는 핵심 센서입니다.",
    },
  },
];

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function generateWheelSpeedData() {
  const points = Array.from({ length: 21 }, (_, i) => {
    const t = i * 0.5;
    const normal = 38 + Math.sin(i * 0.4) * 2 + (i % 3) * 0.3;
    const flAbnormal = i % 4 === 0 || i % 5 === 0 ? 0 : normal * 0.95;
    return {
      time: `${t.toFixed(1)}s`,
      좌측전륜: Math.round(flAbnormal * 10) / 10,
      우측전륜: Math.round(normal * 10) / 10,
      좌측후륜: Math.round((normal - 0.5) * 10) / 10,
      우측후륜: Math.round((normal + 0.3) * 10) / 10,
    };
  });
  return points;
}
