"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Users,
  Target,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ANALYTICS_MOCK } from "@/lib/mock-evaluation";

const STATS = [
  {
    label: "참여 학생",
    value: `${ANALYTICS_MOCK.participants}명`,
    icon: Users,
  },
  {
    label: "평균 진단 점수",
    value: `${ANALYTICS_MOCK.averageScore}점`,
    icon: Target,
  },
  {
    label: "실습 완료율",
    value: `${ANALYTICS_MOCK.completionRate}%`,
    icon: CheckCircle2,
  },
  {
    label: "주요 취약 영역",
    value: ANALYTICS_MOCK.weakArea,
    icon: AlertTriangle,
  },
];

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="교수자 학습 분석"
        description="학생들의 실습 데이터를 확인하고 수업 방향을 개선할 수 있는 대시보드입니다."
      />

      <div className="mb-4 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        모든 통계와 인사이트는 가상의 예시 데이터입니다. · AI 응답 시뮬레이션 ·
        교육용 데모
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-border bg-card shadow-none ring-1 ring-border"
            >
              <CardContent className="pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 truncate text-xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card className="border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <CardTitle className="text-base">학생별 진단 점수 분포</CardTitle>
            <CardDescription>점수 구간별 학생 수</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="h-56 min-w-[280px] sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ANALYTICS_MOCK.scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 11, fill: "#64748B" }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                    }}
                  />
                  <Bar dataKey="count" name="학생 수" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <CardTitle className="text-base">평가 항목별 평균 점수</CardTitle>
            <CardDescription>5개 역량 영역 비교</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="h-56 min-w-[280px] sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={ANALYTICS_MOCK.categoryAverages}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fontSize: 9, fill: "#64748B" }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "#64748B" }}
                  />
                  <Radar
                    name="평균"
                    dataKey="score"
                    stroke="#2563EB"
                    fill="#2563EB"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <CardTitle className="text-base">주요 오개념 분석</CardTitle>
            <CardDescription>실습 중 자주 나타난 오개념</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="h-56 min-w-[320px] sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={ANALYTICS_MOCK.misconceptions}
                  margin={{ left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 9, fill: "#64748B" }}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                    }}
                  />
                  <Bar dataKey="count" name="발생 수" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <CardTitle className="text-base">주차별 학습 성취도 변화</CardTitle>
            <CardDescription>평균 진단 점수 추이</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="h-56 min-w-[280px] sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ANALYTICS_MOCK.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: "#64748B" }}
                  />
                  <YAxis
                    width={36}
                    domain={[60, 100]}
                    tick={{ fontSize: 11, fill: "#64748B" }}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="평균 점수"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#10B981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border bg-card shadow-none ring-1 ring-border">
        <CardHeader>
          <CardTitle className="text-base">AI 교육 활용 루프</CardTitle>
          <CardDescription>
            DTC → 실습 → 평균 분석 → 다음 수업 추천으로 이어지는 교수 설계
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {ANALYTICS_MOCK.learningLoop.map((item, i) => (
              <div
                key={item.step}
                className="relative rounded-lg border border-border bg-muted/30 p-3"
              >
                <p className="text-[11px] font-semibold tracking-wide text-primary">
                  STEP {item.step}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
                {i < ANALYTICS_MOCK.learningLoop.length - 1 ? (
                  <ArrowRight className="absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 text-muted-foreground xl:block" />
                ) : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-primary/20 bg-accent/40 shadow-none ring-1 ring-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-primary" />
              AI 교수자 인사이트
            </CardTitle>
            <CardDescription>
              Mock AI 기반 수업 개선 제안 · 가상의 예시 데이터
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {ANALYTICS_MOCK.insight}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="size-4 text-primary" />
              다음 수업 준비 추천
            </CardTitle>
            <CardDescription>취약 영역 기반 보충 모듈</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ANALYTICS_MOCK.nextClassPlan.map((plan) => (
              <div
                key={plan.title}
                className="rounded-lg border border-border bg-muted/30 px-3 py-2.5"
              >
                <p className="text-sm font-medium text-foreground">
                  {plan.title}
                </p>
                <p className="mt-1 text-[11px] text-warning">{plan.reason}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {plan.action}
                </p>
              </div>
            ))}
            <Button
              render={<Link href="/cases" />}
              nativeButton={false}
              variant="outline"
              className="w-full"
            >
              활용 사례에 기록하기
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
