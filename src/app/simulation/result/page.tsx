"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  RefreshCw,
  Trophy,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { evaluateSimulation } from "@/lib/mock-evaluation";
import { getScenarioById } from "@/lib/mock-scenarios";
import { loadSimulationSession } from "@/lib/session";
import type { EvaluationResult, SimulationSession } from "@/lib/types";

const SCORE_LABELS: { key: keyof EvaluationResult["scores"]; label: string }[] =
  [
    { key: "dtcUnderstanding", label: "DTC 이해도" },
    { key: "procedureAppropriateness", label: "진단 절차의 적절성" },
    { key: "sensorInterpretation", label: "센서 데이터 해석" },
    { key: "causeInference", label: "고장 원인 추론" },
    { key: "reasoningLogic", label: "진단 근거의 논리성" },
  ];

export default function SimulationResultPage() {
  const router = useRouter();
  const [session, setSession] = useState<SimulationSession | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    const saved = loadSimulationSession();
    if (!saved) {
      router.replace("/simulation");
      return;
    }
    setSession(saved);
    setResult(evaluateSimulation(saved));
  }, [router]);

  if (!session || !result) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        평가 결과를 불러오는 중...
      </div>
    );
  }

  const scenario = getScenarioById(session.scenarioId);

  return (
    <div>
      <PageHeader
        title="AI 진단 실습 결과"
        description={
          scenario
            ? `${scenario.title} · ${scenario.vehicle.year} ${scenario.vehicle.manufacturer} ${scenario.vehicle.model}`
            : "실습 평가 결과"
        }
      />

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Card className="border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <CardDescription>종합 평가</CardDescription>
            <CardTitle className="flex items-end gap-2 text-4xl font-semibold tracking-tight">
              {result.scores.total}
              <span className="mb-1 text-base font-medium text-muted-foreground">
                점
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Trophy className="size-6" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              점수는 학생이 선택한 진단 단계와 최종 답변에 따라 달라집니다.
              Mock Data 기반 교육용 평가입니다.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <CardTitle>평가 항목</CardTitle>
            <CardDescription>
              AI 응답 시뮬레이션 · 교육용 데모
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {SCORE_LABELS.map(({ key, label }) => {
              const score = result.scores[key];
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">{score}점</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="size-4 text-success" />
              강점
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.strengths.map((s) => (
                <li
                  key={s}
                  className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm leading-relaxed"
                >
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="size-4 text-warning" />
              개선점
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.improvements.map((s) => (
                <li
                  key={s}
                  className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm leading-relaxed"
                >
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5 border-border bg-card shadow-none ring-1 ring-border">
        <CardHeader>
          <CardTitle>종합 피드백</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.feedback}
          </p>
          {session.finalCause ? (
            <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">제출한 원인</p>
                <p className="mt-1 font-medium">{session.finalCause}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">사용한 진단 도구</p>
                <p className="mt-1 font-medium">
                  {session.checkedTools.length}개
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">대화 메시지</p>
                <p className="mt-1 font-medium">
                  {session.messages.filter((m) => m.role === "student").length}
                  회
                </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.push(`/simulation`)}
        >
          <RefreshCw />
          다시 실습하기
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          render={<Link href="/simulation" />}
          nativeButton={false}
        >
          <ArrowLeft />
          다른 시나리오 선택
        </Button>
        <Button
          className="w-full sm:w-auto"
          render={<Link href="/analytics" />}
          nativeButton={false}
        >
          <BarChart3 />
          학습 분석 확인
        </Button>
      </div>
    </div>
  );
}
