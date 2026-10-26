"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  BookMarked,
  BarChart3,
  Sparkles,
  Play,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DASHBOARD_STATS } from "@/lib/mock-evaluation";
import { cn } from "@/lib/utils";

const STATS = [
  {
    label: "총 진단 분석",
    value: `${DASHBOARD_STATS.totalDiagnosis}`,
    unit: "건",
    icon: FileSearch,
    tone: "text-blue-600 bg-blue-50",
  },
  {
    label: "실습 완료",
    value: `${DASHBOARD_STATS.completedSimulations}`,
    unit: "건",
    icon: CheckCircle2,
    tone: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "평균 진단 정확도",
    value: `${DASHBOARD_STATS.averageAccuracy}`,
    unit: "%",
    icon: Target,
    tone: "text-amber-600 bg-amber-50",
  },
  {
    label: "학습 진행률",
    value: `${DASHBOARD_STATS.progress}`,
    unit: "%",
    icon: TrendingUp,
    tone: "text-sky-600 bg-sky-50",
  },
];

const DEMO_FLOW = [
  {
    href: "/diagnosis",
    label: "DTC → 고장코드",
    desc: "코드 입력 · AI 분석",
    icon: ScanSearch,
  },
  {
    href: "/simulation",
    label: "학생 진단 실습",
    desc: "추론 유도 · 점검",
    icon: GraduationCap,
  },
  {
    href: "/analytics",
    label: "평균 · 취약점",
    desc: "학습 데이터 분석",
    icon: BarChart3,
  },
  {
    href: "/cases",
    label: "다음 수업 설계",
    desc: "사례 · 추천 기록",
    icon: BookMarked,
  },
];

const FEATURES = [
  {
    href: "/diagnosis",
    title: "AI 고장 진단 분석",
    description:
      "차량 정보와 DTC를 입력하면 고장 원인·점검 절차·통합제어 영향을 리포트로 제시합니다.",
    icon: ScanSearch,
    cta: "고장 진단 시작",
    accent: "from-blue-500/15 to-blue-600/5",
    iconBg: "bg-blue-600 text-white",
    step: "01",
  },
  {
    href: "/simulation",
    title: "AI 진단 실습",
    description:
      "정답을 바로 알려주지 않고, 학생이 센서·배선·가설을 스스로 점검하도록 유도합니다.",
    icon: GraduationCap,
    cta: "진단 실습 시작",
    accent: "from-emerald-500/15 to-emerald-600/5",
    iconBg: "bg-emerald-600 text-white",
    step: "02",
  },
  {
    href: "/cases",
    title: "활용 사례 기록",
    description:
      "실습에서 발견한 오개념과 교육 포인트를 남겨 다음 수업 설계에 바로 연결합니다.",
    icon: BookMarked,
    cta: "사례 보드 열기",
    accent: "from-sky-500/15 to-sky-600/5",
    iconBg: "bg-sky-600 text-white",
    step: "03",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="surface-card relative mb-7 overflow-hidden p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 size-40 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="bg-blue-600 text-white hover:bg-blue-600">
                <Sparkles className="size-3" />
                발표 시연용 프로토타입
              </Badge>
              <Badge variant="outline">Mock AI · No Live LLM</Badge>
            </div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              CHASSIS AI
            </h1>
            <p className="mt-2 text-base font-medium text-slate-700 sm:text-lg">
              차량 통합제어 및 미래 섀시시스템 학습
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              AI는 정답을 대신 찾지 않습니다. DTC 이해 → 학생 실습 → 학습 분석 →
              다음 수업 추천까지, 교수자의 교육 설계를 확장하는 도구입니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              render={<Link href="/diagnosis" />}
              nativeButton={false}
              size="lg"
              className="h-11 px-5 shadow-md shadow-blue-600/20"
            >
              <Play data-icon="inline-start" />
              시연 시작
            </Button>
            <Button
              render={<Link href="/analytics" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="h-11 px-5 bg-white/70"
            >
              학습 분석 보기
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Demo Flow · 시연 순서
          </p>
          <span className="text-[11px] text-muted-foreground">
            클릭하면 해당 단계로 이동합니다
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {DEMO_FLOW.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  className="surface-card surface-card-hover group flex h-full items-start gap-3 p-4"
                >
                  <span className="demo-step-num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Icon className="size-3.5 text-primary" />
                      <p className="text-sm font-semibold text-foreground">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.35 }}
            >
              <Card
                className={cn(
                  "surface-card surface-card-hover h-full overflow-hidden border-0 shadow-none ring-0",
                  "bg-gradient-to-br",
                  feature.accent
                )}
              >
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className={cn(
                        "flex size-11 items-center justify-center rounded-xl shadow-sm",
                        feature.iconBg
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      {feature.step}
                    </span>
                  </div>
                  <CardTitle className="font-heading text-lg">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    render={<Link href={feature.href} />}
                    nativeButton={false}
                    className="h-10 w-full sm:w-auto"
                  >
                    {feature.cta}
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              className="surface-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 font-heading text-3xl font-semibold tracking-tight">
                    {stat.value}
                    <span className="ml-0.5 text-base font-medium text-muted-foreground">
                      {stat.unit}
                    </span>
                  </p>
                </div>
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    stat.tone
                  )}
                >
                  <Icon className="size-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Card className="surface-card mt-8 border-0 shadow-none ring-0">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="size-4" />
            </div>
            <div>
              <CardTitle className="font-heading">최근 학습 활동</CardTitle>
              <CardDescription>
                Mock Data 기반 예시 활동 기록입니다.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {DASHBOARD_STATS.recentActivities.map((item, idx) => (
              <li key={item.id}>
                {idx > 0 ? <Separator className="my-1" /> : null}
                <div className="flex flex-col gap-2 rounded-xl px-2 py-3 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      {item.type === "diagnosis" ? (
                        <FileSearch className="size-4 text-blue-600" />
                      ) : (
                        <ClipboardCheck className="size-4 text-emerald-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 pl-12 text-xs text-muted-foreground sm:pl-0">
                    {item.time}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
        AI는 학생을 대신해 정답을 찾는 도구가 아니라,
        <br className="sm:hidden" /> 학생이 스스로 문제를 해결할 수 있도록 사고
        과정과 학습 경험을 확장하는 교육 도구입니다.
      </p>
    </div>
  );
}
