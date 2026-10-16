"use client";

import Link from "next/link";
import {
  ScanSearch,
  GraduationCap,
  Activity,
  CheckCircle2,
  Target,
  TrendingUp,
  ArrowRight,
  FileSearch,
  ClipboardCheck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DASHBOARD_STATS } from "@/lib/mock-evaluation";

const STATS = [
  {
    label: "총 진단 분석",
    value: `${DASHBOARD_STATS.totalDiagnosis}건`,
    icon: FileSearch,
  },
  {
    label: "실습 완료",
    value: `${DASHBOARD_STATS.completedSimulations}건`,
    icon: CheckCircle2,
  },
  {
    label: "평균 진단 정확도",
    value: `${DASHBOARD_STATS.averageAccuracy}%`,
    icon: Target,
  },
  {
    label: "학습 진행률",
    value: `${DASHBOARD_STATS.progress}%`,
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="차량 통합제어 및 미래 섀시시스템 학습"
        description="AI 기반 고장 진단 분석과 시뮬레이션 실습을 통해 차량 제어 시스템의 이해와 문제 해결 능력을 향상시킵니다."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ScanSearch className="size-5" />
            </div>
            <CardTitle className="text-lg">AI 고장 진단 분석</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              차량 정보와 DTC 코드를 기반으로 섀시시스템의 고장 원인과 진단
              절차를 분석합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              render={<Link href="/diagnosis" />}
              nativeButton={false}
              size="lg"
              className="h-10 px-4"
            >
              고장 진단 시작
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-5" />
            </div>
            <CardTitle className="text-lg">AI 진단 실습</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              실제 정비 상황을 재현한 가상 시나리오에서 학생이 직접 고장 원인을
              추론하고 진단합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              render={<Link href="/simulation" />}
              nativeButton={false}
              size="lg"
              className="h-10 px-4"
            >
              진단 실습 시작
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-border bg-card shadow-none ring-1 ring-border"
            >
              <CardContent className="pt-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                  <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 border-border bg-card shadow-none ring-1 ring-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <CardTitle>최근 학습 활동</CardTitle>
          </div>
          <CardDescription>
            Mock Data 기반 예시 활동 기록입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {DASHBOARD_STATS.recentActivities.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-md bg-muted">
                    {item.type === "diagnosis" ? (
                      <FileSearch className="size-4 text-muted-foreground" />
                    ) : (
                      <ClipboardCheck className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        AI는 학생을 대신해 정답을 찾는 도구가 아니라, 학생이 스스로 문제를
        해결할 수 있도록 사고 과정과 학습 경험을 확장하는 교육 도구입니다.
      </p>
    </div>
  );
}
