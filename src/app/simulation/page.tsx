"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  ArrowRight,
  Signal,
  Gauge,
  CircleGauge,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SimulationWorkspace } from "@/components/simulation/simulation-workspace";
import {
  SCENARIOS,
  applyDiagnosisToScenario,
  getScenarioById,
  resolveScenarioIdFromDtc,
} from "@/lib/mock-scenarios";
import {
  clearDiagnosisTransfer,
  loadDiagnosisTransfer,
} from "@/lib/session";
import type { Scenario } from "@/lib/types";

const ICONS = [Signal, Gauge, CircleGauge];

const DIFFICULTY_COLOR: Record<string, string> = {
  초급: "bg-success/10 text-success",
  중급: "bg-warning/10 text-warning",
  고급: "bg-danger/10 text-danger",
};

export default function SimulationPage() {
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [fromDiagnosis, setFromDiagnosis] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const transfer = loadDiagnosisTransfer();

    if (transfer) {
      const scenarioId = resolveScenarioIdFromDtc(transfer.dtcCode);
      const base = getScenarioById(scenarioId) ?? SCENARIOS[0];
      const merged = applyDiagnosisToScenario(base, transfer);
      setSelected(merged);
      setFromDiagnosis(true);
      clearDiagnosisTransfer();

      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", "/simulation");
      }
    }

    setReady(true);
  }, []);

  const handleBack = () => {
    setSelected(null);
    setFromDiagnosis(false);
  };

  if (!ready) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center text-sm text-muted-foreground">
        실습 환경을 준비하는 중...
      </div>
    );
  }

  if (selected) {
    return (
      <div>
        <PageHeader
          title="AI 기반 섀시시스템 진단 실습"
          description={
            fromDiagnosis
              ? "고장 진단에서 입력한 차량 정보와 DTC를 바탕으로 실습을 진행합니다."
              : "가상 차량의 고장 상황을 분석하고 진단 절차를 직접 수행해 보세요."
          }
        />
        {fromDiagnosis ? (
          <div className="mb-4 rounded-lg border border-primary/20 bg-accent/40 px-4 py-3 text-xs text-muted-foreground">
            고장 진단에서 전달된 차량:{" "}
            <span className="font-medium text-foreground">
              {selected.vehicle.year} {selected.vehicle.manufacturer}{" "}
              {selected.vehicle.model}
            </span>
            {" · "}
            DTC{" "}
            <span className="font-medium text-foreground">
              {selected.dtcCode}
            </span>
          </div>
        ) : null}
        <SimulationWorkspace scenario={selected} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="AI 기반 섀시시스템 진단 실습"
        description="가상 차량의 고장 상황을 분석하고 진단 절차를 직접 수행해 보세요."
      />

      <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <GraduationCap className="size-3.5" />
        모든 시나리오는 교육용 가상 사례입니다. AI는 정답을 바로 알려주지
        않습니다.
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {SCENARIOS.map((scenario, i) => {
          const Icon = ICONS[i] ?? GraduationCap;
          return (
            <Card
              key={scenario.id}
              className="flex flex-col border-border bg-card shadow-none ring-1 ring-border"
            >
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <Badge
                    className={`${DIFFICULTY_COLOR[scenario.difficulty]} hover:bg-inherit`}
                  >
                    {scenario.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-base">{scenario.title}</CardTitle>
                <CardDescription>
                  {scenario.vehicle.year} {scenario.vehicle.manufacturer}{" "}
                  {scenario.vehicle.model}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">증상</p>
                    <p className="font-medium">{scenario.symptom}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">학습 목표</p>
                    <p className="text-muted-foreground">
                      {scenario.learningGoal}
                    </p>
                  </div>
                </div>
                <Button
                  className="h-9 w-full"
                  onClick={() => {
                    setFromDiagnosis(false);
                    setSelected(scenario);
                  }}
                >
                  실습 시작
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
