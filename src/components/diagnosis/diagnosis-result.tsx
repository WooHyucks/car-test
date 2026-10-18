"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, AlertTriangle, CheckCircle2, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { lookupDtc } from "@/lib/dtc-catalog";
import { saveDiagnosisTransfer } from "@/lib/session";
import { getChassisSystemLabel } from "@/lib/vehicles";
import type { DiagnosisInput, DiagnosisResult } from "@/lib/types";

interface DiagnosisResultViewProps {
  input: DiagnosisInput;
  result: DiagnosisResult;
  onReset: () => void;
}

export function DiagnosisResultView({
  input,
  result,
  onReset,
}: DiagnosisResultViewProps) {
  const router = useRouter();

  const dtcMeta = lookupDtc(input.dtcCode);

  const handlePractice = () => {
    saveDiagnosisTransfer(input);
    toast.success("진단한 차량 정보로 실습을 시작합니다.");
    router.push("/simulation");
  };
  if (!result.supported) {
    return (
      <Card className="border-border bg-card shadow-none ring-1 ring-border">
        <CardHeader>
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="size-5" />
            <CardTitle>지원하지 않는 DTC 코드</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {result.unsupportedMessage}
          </p>
          <Button variant="outline" onClick={onReset}>
            <RotateCcw />
            다시 입력하기
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="print-area space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            AI DIAGNOSTIC REPORT
          </p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">
            진단 분석 리포트
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-success/10 text-success hover:bg-success/10">
            <CheckCircle2 className="size-3" />
            AI 분석 완료
          </Badge>
        </div>
      </div>

      <Card className="border-border bg-card shadow-none ring-1 ring-border">
        <CardHeader>
          <CardTitle>차량 정보 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["제조사", input.manufacturer],
              ["차종", input.model],
              ["연식", input.year],
              ["시스템", getChassisSystemLabel(input.system)],
              [
                "DTC 코드",
                dtcMeta
                  ? `${input.dtcCode.toUpperCase()} (${dtcMeta.abbr})`
                  : input.dtcCode.toUpperCase(),
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">고장코드명</p>
              <p className="mt-1 text-sm">{input.dtcName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">차량 증상</p>
              <p className="mt-1 text-sm">{input.symptoms}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-none ring-1 ring-border">
        <CardHeader>
          <CardTitle>고장 현상 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
            {result.symptomAnalysis}
          </p>
          <div className="mt-4 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-base font-semibold">가능한 고장 원인</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {result.causes.map((cause, i) => (
            <Card
              key={cause.id}
              className="border-border bg-card shadow-none ring-1 ring-border"
            >
              <CardHeader>
                <CardDescription>원인 {String(i + 1).padStart(2, "0")}</CardDescription>
                <CardTitle className="text-base">{cause.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="leading-relaxed text-muted-foreground">
                  {cause.description}
                </p>
                <div>
                  <p className="text-xs font-medium text-foreground">확인할 데이터</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {cause.dataToCheck}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">권장 점검 방법</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {cause.inspectionMethod}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-border bg-card shadow-none ring-1 ring-border">
        <CardHeader>
          <CardTitle>권장 진단 절차</CardTitle>
          <CardDescription>교육용 단계별 점검 가이드</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-0 border-l border-border ml-3">
            {result.steps.map((step) => (
              <li key={step.step} className="relative pb-6 last:pb-0 pl-6">
                <span className="absolute -left-[9px] top-1 size-4 rounded-full border-2 border-primary bg-card" />
                <p className="text-xs font-semibold tracking-wide text-primary">
                  STEP {String(step.step).padStart(2, "0")}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {step.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-accent/40 shadow-none ring-1 ring-primary/20">
        <CardHeader>
          <CardTitle>{result.integrationImpact.title}</CardTitle>
          <CardDescription>
            교육용 개념도 · 실제 차량별 제어 구조는 다를 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 py-4 sm:flex-row sm:justify-center sm:gap-3">
            {result.integrationImpact.flow.map((node, i) => (
              <div key={node} className="flex flex-col items-center sm:flex-row sm:gap-3">
                <div className="rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-medium shadow-sm">
                  {node}
                </div>
                {i < result.integrationImpact.flow.length - 1 ? (
                  <span className="my-1 text-primary sm:my-0">
                    <span className="sm:hidden">↓</span>
                    <span className="hidden sm:inline">→</span>
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {result.integrationImpact.description}
          </p>
        </CardContent>
      </Card>

      <div className="no-print flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => window.print()}
        >
          <Printer />
          분석 결과 인쇄
        </Button>
        <Button variant="outline" className="w-full sm:w-auto" onClick={onReset}>
          <RotateCcw />
          분석 초기화
        </Button>
        <Button
          className="h-8 w-full sm:w-auto"
          onClick={handlePractice}
        >
          이 고장으로 실습하기
          <ArrowRight data-icon="inline-end" />
        </Button>
        <p className="text-[11px] text-muted-foreground sm:ml-auto">
          AI 응답 시뮬레이션 · 교육용 데모
        </p>
      </div>
    </div>
  );
}
