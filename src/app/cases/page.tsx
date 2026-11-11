"use client";

import { useEffect, useState } from "react";
import {
  BookMarked,
  Lightbulb,
  Plus,
  Trash2,
  ArrowRight,
  GraduationCap,
  ScanSearch,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  clearFlowCaseDraft,
  deleteUserCase,
  loadCases,
  loadFlowCaseDraft,
  saveUserCase,
  type LearningCase,
} from "@/lib/cases";
import { lookupDtc } from "@/lib/dtc-catalog";

const EMPTY = {
  title: "",
  dtcCode: "",
  dtcName: "",
  vehicle: "",
  finding: "",
  teachingNote: "",
};

export default function CasesPage() {
  const [cases, setCases] = useState<LearningCase[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [fromFlow, setFromFlow] = useState(false);

  useEffect(() => {
    setCases(loadCases());
    const draft = loadFlowCaseDraft();
    if (!draft) return;

    const dtcName = draft.dtcName || lookupDtc(draft.dtcCode)?.name || "";
    setForm({
      title: "",
      dtcCode: draft.dtcCode.toUpperCase(),
      dtcName,
      vehicle: draft.vehicle,
      finding: "",
      teachingNote: "",
    });
    setFromFlow(true);
  }, []);

  const refresh = () => setCases(loadCases());

  const handleDtcBlurOrChange = (code: string) => {
    const entry = lookupDtc(code);
    setForm((prev) => ({
      ...prev,
      dtcCode: code.toUpperCase(),
      dtcName: entry ? entry.name : prev.dtcName,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("사례 제목을 입력해 주세요.");
    if (!form.dtcCode.trim()) return toast.error("DTC 코드를 입력해 주세요.");
    if (!form.finding.trim()) return toast.error("발견 내용을 입력해 주세요.");

    saveUserCase({
      title: form.title.trim(),
      dtcCode: form.dtcCode.trim().toUpperCase(),
      dtcName: form.dtcName.trim() || lookupDtc(form.dtcCode)?.name || "",
      vehicle: form.vehicle.trim() || "미기재",
      finding: form.finding.trim(),
      teachingNote: form.teachingNote.trim() || "수업 보완 메모를 추가해 주세요.",
    });
    clearFlowCaseDraft();
    setFromFlow(false);
    setForm(EMPTY);
    refresh();
    toast.success("활용 사례가 저장되었습니다.");
  };

  return (
    <div>
      <PageHeader
        title="활용 사례 · 진단 발견 기록"
        description="DTC 진단과 학생 실습에서 발견한 교육 포인트를 기록하고, 다음 수업 설계에 활용합니다."
      />

      <Card className="mb-6 border-primary/20 bg-accent/30 shadow-none ring-1 ring-primary/20">
        <CardHeader>
          <CardTitle className="text-base">AI 교육 활용 루프</CardTitle>
          <CardDescription>
            교수 채용 시연용 · AI는 정답을 대신하지 않고 학습 설계를 확장합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {[
              { icon: ScanSearch, label: "고장진단·분석" },
              { icon: GraduationCap, label: "고장실습" },
              { icon: BookMarked, label: "최종진단 제출" },
              { icon: Lightbulb, label: "활용사례 자동반영" },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium">
                    <Icon className="size-4 text-primary" />
                    {step.label}
                  </div>
                  {i < 3 ? (
                    <ArrowRight className="hidden size-4 text-muted-foreground sm:block" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit border-border bg-card shadow-none ring-1 ring-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="size-4 text-primary" />
              발견 사례 추가
            </CardTitle>
            <CardDescription>
              진단·실습에서 발견한 내용을 기록합니다 (로컬 저장)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fromFlow ? (
              <div className="mb-4 rounded-lg border border-primary/20 bg-accent/40 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  실습 플로우 데이터 반영
                </span>
                · DTC · 차량 · 고장코드명만 자동 채움.{" "}
                <span className="text-foreground">사례 제목</span>과{" "}
                <span className="text-foreground">발견한 내용</span>은 직접
                작성해 주세요.
                <button
                  type="button"
                  className="mt-1.5 block text-primary underline-offset-2 hover:underline"
                  onClick={() => {
                    clearFlowCaseDraft();
                    setFromFlow(false);
                    setForm(EMPTY);
                  }}
                >
                  자동 채움 지우기
                </button>
              </div>
            ) : null}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>사례 제목</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="예: 배선 점검 생략 패턴"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>DTC</Label>
                  <Input
                    className="font-mono uppercase"
                    value={form.dtcCode}
                    onChange={(e) => handleDtcBlurOrChange(e.target.value)}
                    placeholder="C0035"
                  />
                </div>
                <div className="space-y-2">
                  <Label>차량</Label>
                  <Input
                    value={form.vehicle}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, vehicle: e.target.value }))
                    }
                    placeholder="2022 아반떼"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>고장코드명</Label>
                <Input
                  value={form.dtcName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dtcName: e.target.value }))
                  }
                  placeholder="DTC 입력 시 자동 매칭"
                  readOnly={fromFlow && Boolean(form.dtcName)}
                  className={
                    fromFlow && form.dtcName
                      ? "bg-muted/50 text-foreground"
                      : undefined
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>발견한 내용</Label>
                <Textarea
                  value={form.finding}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, finding: e.target.value }))
                  }
                  placeholder="학생 반응, 오개념, 진단 포인트 등"
                />
              </div>
              <div className="space-y-2">
                <Label>다음 수업 메모</Label>
                <Textarea
                  className="min-h-20"
                  value={form.teachingNote}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, teachingNote: e.target.value }))
                  }
                  placeholder="보충 학습·실습 개선 아이디어"
                />
              </div>
              <Button type="submit" className="h-10 w-full">
                사례 저장
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookMarked className="size-4" />
            총 {cases.length}건 · 교육용 AI + 사용자 기록
          </div>

          {cases.map((item) => {
            const meta = lookupDtc(item.dtcCode);
            return (
              <Card
                key={item.id}
                className="border-border bg-card shadow-none ring-1 ring-border"
              >
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {item.vehicle} · {item.createdAt}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {item.dtcCode}
                        {meta ? ` · ${meta.abbr}` : ""}
                      </Badge>
                      <Badge
                        className={
                          item.source === "user"
                            ? "bg-primary/10 text-primary hover:bg-primary/10"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }
                      >
                        {item.source === "user" ? "내 기록" : "예시"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-xs text-muted-foreground">
                    {item.dtcName || meta?.name}
                  </p>
                  <div>
                    <p className="text-xs font-medium text-foreground">발견</p>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      {item.finding}
                    </p>
                  </div>
                  <div className="rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Lightbulb className="size-3.5 text-warning" />
                      다음 수업 추천
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.teachingNote}
                    </p>
                  </div>
                  {item.source === "user" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => {
                        deleteUserCase(item.id);
                        refresh();
                        toast.message("사례를 삭제했습니다.");
                      }}
                    >
                      <Trash2 />
                      삭제
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
