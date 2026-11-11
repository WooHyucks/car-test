import type { DiagnosisInput, DiagnosisResult, FaultCause } from "./types";

export const RENAULT_MODELS = [
  "클리오",
  "콜레오스",
  "아르카나",
  "XM3",
  "SM6",
  "QM6",
  "캡처",
] as const;

export type RenaultModel = (typeof RENAULT_MODELS)[number];

export interface RenaultProfile {
  model: RenaultModel;
  platformNote: string;
  symptomFocus: string;
  primaryCauseHint: string;
  analysisExtra: string;
  causeTweaks: Partial<
    Record<string, { description?: string; dataToCheck?: string; inspectionMethod?: string }>
  >;
  extraCause?: FaultCause;
  toolHint: string;
}

/** 르노코리아 차종별 교육용 AI 프로필 — 차종 선택 시 분석 결과가 달라지도록 사용 */
export const RENAULT_PROFILES: Record<RenaultModel, RenaultProfile> = {
  클리오: {
    model: "클리오",
    platformNote: "B-세그먼트 해치 · 도심 저속 주행 비중 높음",
    symptomFocus: "짧은 트립·정체 구간에서 센서 오염·커넥터 수분 유입 가능성이 상대적으로 높습니다.",
    primaryCauseHint: "휠 아치 쪽 센서 오염·커넥터 부식",
    analysisExtra:
      "클리오는 휠하우스 공간이 좁아 센서 하네스 꺾임·오염이 자주 논의되는 교육 사례입니다. 도심 저속 반복 주행 시 좌측 전륜 신호 드롭을 우선 비교하세요.",
    causeTweaks: {
      sensor: {
        description:
          "도심 먼·염분 환경에서 클리오 휠 속도센서 감지면 오염으로 신호가 간헐 소실될 수 있습니다.",
        inspectionMethod:
          "좌측 전륜 센서 장착면·커넥터 실링을 우선 확인하고 4휠 속도를 저속 구간에서 비교합니다.",
      },
      wiring: {
        description:
          "좁은 휠하우스에서 하네스 꺾임·클립 이탈로 간헐 단선이 발생할 수 있습니다.",
      },
    },
    toolHint:
      "클리오 포인트: 저속(10~30km/h) 구간 좌측 전륜 신호 드롭과 커넥터 수분 흔적을 함께 확인하세요.",
  },
  콜레오스: {
    model: "콜레오스",
    platformNote: "중형 SUV · 하중·휠 베어링 부하 큼",
    symptomFocus: "SUV 하중과 휠 베어링/엔코더 링 상태 점검 비중이 커집니다.",
    primaryCauseHint: "휠 베어링 엔코더 이상·에어갭 변화",
    analysisExtra:
      "콜레오스는 차체 하중이 커 베어링 유격·엔코더 링 손상이 ABS/ESC 입력 이상으로 이어지는 사례를 강조합니다. 센서 교체 전 베어링 유격을 반드시 포함하세요.",
    causeTweaks: {
      encoder: {
        description:
          "SUV 하중으로 휠 베어링 유격이 커지면 엔코더 링 에어갭이 변동해 휠 속도 신호가 왜곡될 수 있습니다.",
        dataToCheck: "휠 베어링 유격, 엔코더 링 외관, 에어갭, 고속 주행 시 휠 속도 편차",
        inspectionMethod:
          "휠을 들어 베어링 유격을 확인하고 엔코더 링 손상·자성체 오염을 점검합니다.",
      },
      sensor: {
        description:
          "센서 자체보다 베어링 측 이상이 동반되는 비율이 높은 교육용 패턴입니다.",
      },
    },
    extraCause: {
      id: "suv-load",
      name: "SUV 하중·타이어 편마모 연계 이상",
      description:
        "타이어 편마모와 하중 불균형이 ESC 개입 빈도를 높여 관련 DTC 해석을 어렵게 만들 수 있습니다.",
      dataToCheck: "타이어 마모 상태, 공기압, ESC 개입 로그",
      inspectionMethod:
        "4륜 공기압·마모를 먼저 맞춘 뒤 동일 조건에서 휠 속도 데이터를 재수집합니다.",
    },
    toolHint:
      "콜레오스 포인트: 센서 교체 전 휠 베어링 유격·엔코더 링을 필수 점검 항목으로 두세요.",
  },
  아르카나: {
    model: "아르카나",
    platformNote: "쿠페형 SUV · E-TECH 하이브리드 협조제어",
    symptomFocus: "회생제동·하이브리드 협조제어와 섀시 입력의 상호작용을 함께 봅니다.",
    primaryCauseHint: "회생제동 협조·브레이크 유압 전환 구간 신호 이상",
    analysisExtra:
      "아르카나는 E-TECH 회생제동 전환 구간에서 휠 속도·감속 신호가 순간적으로 불일치할 수 있습니다. ABS DTC라도 하이브리드 협조 로직을 함께 해석하는 교육 포인트입니다.",
    causeTweaks: {
      ecu: {
        description:
          "회생제동↔유압제동 전환 시 ECU 입력 해석 지연/불일치가 경고등으로 나타날 수 있습니다.",
        dataToCheck: "회생제동 개입 여부, 휠 속도, 브레이크 압력, 하이브리드 관련 동시 DTC",
      },
      sensor: {
        description:
          "센서 이상과 회생제동 협조 이상을 구분하려면 감속 패턴별 데이터 비교가 필요합니다.",
      },
    },
    extraCause: {
      id: "regen",
      name: "회생제동 협조제어 신호 불일치",
      description:
        "모터 회생과 유압 제동 전환 시 휠 속도 입력 타이밍이 어긋나 관련 경고가 발생할 수 있습니다.",
      dataToCheck: "회생 토크, 휠 속도, 브레이크 페달 신호",
      inspectionMethod:
        "회생 강/약 조건에서 동일 감속을 반복하며 휠 속도·제동 압력 동시 기록을 비교합니다.",
    },
    toolHint:
      "아르카나 포인트: 회생제동 ON/OFF 조건에서 휠 속도 편차가 달라지는지 비교하세요.",
  },
  XM3: {
    model: "XM3",
    platformNote: "컴팩트 쿠페 SUV · CMF-B 플랫폼",
    symptomFocus: "도심·고속 혼합 주행에서 ESC 입력 센서 교정 누락 사례를 강조합니다.",
    primaryCauseHint: "조향각/요레이트 센서 교정·장착 상태",
    analysisExtra:
      "XM3는 얼라인먼트·타이어 교체 후 조향각 센서 보정 누락이 ESC 경고로 이어지는 교육 시나리오에 적합합니다. DTC만 보고 부품 교체하지 않도록 보정 절차를 먼저 확인하세요.",
    causeTweaks: {
      wiring: {
        description:
          "XM3 휠하우스 배선 클립 이탈로 간헐 접촉 불량이 보고되는 교육용 패턴입니다.",
      },
    },
    toolHint:
      "XM3 포인트: 휠 얼라인먼트/타이어 작업 이력과 조향각 센서 보정 여부를 먼저 확인하세요.",
  },
  SM6: {
    model: "SM6",
    platformNote: "중형 세단 · 고속도로 정속 주행 비중",
    symptomFocus: "고속 정속 구간에서 EPS/ESC 입력 안정성과 통신 이상을 구분합니다.",
    primaryCauseHint: "EPS 토크센서 이중신호 편차·통신 노이즈",
    analysisExtra:
      "SM6는 고속 정속 시 조향 보조감 변화와 토크센서 주/보조 신호 편차를 연결해 보는 사례입니다. 배선 양호 시 센서 이중신호 비교가 핵심입니다.",
    causeTweaks: {
      sensor: {
        description:
          "SM6 EPS 토크센서 주·보조 신호 편차가 고속 정속 조향 보조 제한으로 나타날 수 있습니다.",
        dataToCheck: "토크센서 주/보조 신호, EPS 모터 전류, 관련 통신 DTC",
      },
    },
    toolHint:
      "SM6 포인트: 토크센서 이중신호를 동시에 보고 편차가 규격을 넘는지 확인하세요.",
  },
  QM6: {
    model: "QM6",
    platformNote: "중형 SUV · AWD/ESC 협조",
    symptomFocus: "AWD·ESC 협조제어에서 휠 속도 입력 신뢰도가 중요합니다.",
    primaryCauseHint: "후륜/사이드 휠 속도 편차·AWD 제어 연계",
    analysisExtra:
      "QM6는 AWD 제어가 휠 속도 입력을 공유하므로, 한쪽 휠 신호 이상이 구동 배분 이상으로 확대될 수 있습니다. ABS DTC를 AWD 관점과 함께 설명하세요.",
    causeTweaks: {
      sensor: {
        description:
          "단일 휠 속도 이상이 AWD 토크 배분 로직에 영향을 줄 수 있습니다.",
      },
      encoder: {
        description:
          "후륜 베어링/엔코더 이상은 미끄럼 판단 오차로 AWD·ESC 동시 경고를 유발할 수 있습니다.",
      },
    },
    extraCause: {
      id: "awd",
      name: "AWD 협조제어 입력 왜곡",
      description:
        "휠 속도 입력 오류가 AWD 제어기의 슬립 판단에 반영되어 이질적인 구동감·경고를 만들 수 있습니다.",
      dataToCheck: "4휠 속도, AWD 모드, ESC 개입 로그",
      inspectionMethod:
        "2WD/AWD 모드별 동일 노면에서 휠 속도 편차와 경고 재현 여부를 비교합니다.",
    },
    toolHint:
      "QM6 포인트: ABS DTC와 AWD/ESC 동시 코드를 함께 읽어 입력 공유 구조를 설명하세요.",
  },
  캡처: {
    model: "캡처",
    platformNote: "소형 SUV · 도심·비포장 혼합",
    symptomFocus: "비포장·연석 충격 후 센서 장착 각도·에어갭 변화를 점검합니다.",
    primaryCauseHint: "연석 충격 후 센서 장착 불량·에어갭",
    analysisExtra:
      "캡처는 도심 연석·방지턱 충격 후 센서 브라켓 변형으로 에어갭이 바뀌는 사례가 교육적으로 명확합니다. 외관 장착 상태부터 확인하세요.",
    causeTweaks: {
      sensor: {
        description:
          "충격 후 센서 브라켓 변형으로 감지 거리가 달라져 간헐 DTC가 발생할 수 있습니다.",
        inspectionMethod:
          "센서 장착 볼트·브라켓 변형 여부와 에어갭을 실측합니다.",
      },
      wiring: {
        description:
          "휠하우스 하부 배선이 돌·이물질에 쓸려 피복 손상되는 패턴을 점검합니다.",
      },
    },
    toolHint:
      "캡처 포인트: 센서 교체 전 브라켓·에어갭·하부 배선 쓸림을 먼저 확인하세요.",
  },
};

export function isRenaultKorea(manufacturer: string): boolean {
  return manufacturer === "르노코리아";
}

export function getRenaultProfile(model: string): RenaultProfile | null {
  if ((RENAULT_MODELS as readonly string[]).includes(model)) {
    return RENAULT_PROFILES[model as RenaultModel];
  }
  return null;
}

/** 르노코리아 선택 시에만 진단 결과에 차종별 오버레이를 적용 */
export function applyRenaultOverlay(
  result: DiagnosisResult,
  input: DiagnosisInput
): DiagnosisResult {
  if (!result.supported || !isRenaultKorea(input.manufacturer)) return result;

  const profile = getRenaultProfile(input.model);
  if (!profile) return result;

  const causes = result.causes.map((cause) => {
    const tweak = profile.causeTweaks[cause.id];
    if (!tweak) return cause;
    return {
      ...cause,
      description: tweak.description ?? cause.description,
      dataToCheck: tweak.dataToCheck ?? cause.dataToCheck,
      inspectionMethod: tweak.inspectionMethod ?? cause.inspectionMethod,
    };
  });

  if (profile.extraCause) {
    causes.push(profile.extraCause);
  }

  return {
    ...result,
    symptomAnalysis: `${result.symptomAnalysis}\n\n[르노코리아 · ${profile.model}]\n${profile.platformNote}\n${profile.symptomFocus}\n\n${profile.analysisExtra}\n\n교육 힌트: ${profile.primaryCauseHint}`,
    causes,
    integrationImpact: {
      ...result.integrationImpact,
      description: `${result.integrationImpact.description}\n\n르노코리아 ${profile.model}: ${profile.toolHint}`,
    },
  };
}
