"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, ScanSearch, BookOpenCheck, Sparkles } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChassisSystem, DiagnosisInput, Manufacturer } from "@/lib/types";
import {
  CHASSIS_SYSTEMS,
  MANUFACTURERS,
  MODELS_BY_MANUFACTURER,
  YEARS,
} from "@/lib/vehicles";
import {
  DTC_CATALOG,
  lookupDtc,
  searchDtcs,
  type DtcEntry,
} from "@/lib/dtc-catalog";

interface DiagnosisFormProps {
  onSubmit: (input: DiagnosisInput) => void;
  isLoading: boolean;
}

const INITIAL: DiagnosisInput = {
  manufacturer: "",
  model: "",
  year: "",
  system: "",
  dtcCode: "",
  dtcName: "",
  symptoms: "",
};

export function DiagnosisForm({ onSubmit, isLoading }: DiagnosisFormProps) {
  const [form, setForm] = useState<DiagnosisInput>(INITIAL);

  const models = useMemo(() => {
    if (!form.manufacturer) return [];
    return MODELS_BY_MANUFACTURER[form.manufacturer as Manufacturer] ?? [];
  }, [form.manufacturer]);

  const matchedDtc = useMemo(
    () => lookupDtc(form.dtcCode),
    [form.dtcCode]
  );

  const suggestions = useMemo(
    () => searchDtcs(form.dtcCode),
    [form.dtcCode]
  );

  const update = <K extends keyof DiagnosisInput>(
    key: K,
    value: DiagnosisInput[K]
  ) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "manufacturer") next.model = "";
      return next;
    });
  };

  const applyDtcEntry = (entry: DtcEntry) => {
    setForm((prev) => ({
      ...prev,
      dtcCode: entry.code,
      dtcName: entry.name,
      symptoms: prev.symptoms.trim() ? prev.symptoms : entry.defaultSymptoms,
      system: (prev.system || entry.system) as ChassisSystem | "",
    }));
  };

  const handleDtcChange = (raw: string) => {
    const upper = raw.toUpperCase();
    const entry = lookupDtc(upper);
    setForm((prev) => ({
      ...prev,
      dtcCode: upper,
      dtcName: entry ? entry.name : prev.dtcName,
      symptoms:
        entry && !prev.symptoms.trim() ? entry.defaultSymptoms : prev.symptoms,
      system:
        entry && !prev.system
          ? (entry.system as ChassisSystem)
          : prev.system,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.manufacturer) return toast.error("제조사를 선택해 주세요.");
    if (!form.model) return toast.error("차종을 선택해 주세요.");
    if (!form.year) return toast.error("연식을 선택해 주세요.");
    if (!form.system) return toast.error("섀시시스템을 선택해 주세요.");
    if (!form.dtcCode.trim()) return toast.error("DTC 코드를 입력해 주세요.");
    if (!form.dtcName.trim()) return toast.error("고장코드명을 입력해 주세요.");
    if (!form.symptoms.trim()) return toast.error("차량 증상을 입력해 주세요.");
    onSubmit(form);
  };

  const fillDemo = () => {
    applyDtcEntry(DTC_CATALOG[0]);
    setForm((prev) => ({
      ...prev,
      manufacturer: "현대자동차",
      model: "아반떼",
      year: "2022",
      system: "ABS",
    }));
    toast.success("데모 데이터가 입력되었습니다.");
  };

  return (
    <Card className="surface-card border-0 shadow-none ring-0">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2">
              <ScanSearch className="size-4 shrink-0 text-primary" />
              차량 정보 입력
            </CardTitle>
            <CardDescription className="mt-1 break-keep">
              지원 데모 DTC {DTC_CATALOG.length}종 · 코드 입력 시 고장코드명 자동
              매칭
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full shrink-0 sm:w-auto"
            onClick={fillDemo}
            disabled={isLoading}
          >
            데모 데이터 입력
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="제조사">
              <Select
                value={form.manufacturer || null}
                onValueChange={(v) =>
                  update("manufacturer", (v ?? "") as Manufacturer | "")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="제조사 선택" />
                </SelectTrigger>
                <SelectContent>
                  {MANUFACTURERS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="차종">
              <Select
                value={form.model || null}
                onValueChange={(v) => update("model", v ?? "")}
                disabled={!form.manufacturer}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      form.manufacturer ? "차종 선택" : "제조사를 먼저 선택"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="연식">
              <Select
                value={form.year || null}
                onValueChange={(v) => update("year", v ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="연식 선택" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="섀시시스템">
              <Select
                value={form.system || null}
                onValueChange={(v) =>
                  update("system", (v ?? "") as ChassisSystem | "")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="예: ABS (Anti-lock Braking System)" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {CHASSIS_SYSTEMS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.abbr} ({s.fullEn})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="space-y-3">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="DTC 코드">
                <Input
                  placeholder="예: C0035"
                  value={form.dtcCode}
                  onChange={(e) => handleDtcChange(e.target.value)}
                  disabled={isLoading}
                  className="font-mono uppercase"
                />
              </Field>
              <Field label="고장코드명">
                <Input
                  placeholder="DTC 입력 시 자동 표시됩니다"
                  value={form.dtcName}
                  onChange={(e) => update("dtcName", e.target.value)}
                  disabled={isLoading}
                />
              </Field>
            </div>

            {matchedDtc ? (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-gradient-to-r from-blue-50 to-sky-50/80 px-3.5 py-3 text-sm shadow-sm">
                <BookOpenCheck className="size-4 shrink-0 text-primary" />
                <span className="font-mono font-semibold text-foreground">
                  {matchedDtc.code}
                </span>
                <Badge variant="outline" className="border-primary/20 bg-white font-mono">
                  {matchedDtc.abbr}
                </Badge>
                <span className="text-muted-foreground">·</span>
                <span className="text-foreground">{matchedDtc.name}</span>
                <span className="ml-auto flex items-center gap-1 text-[11px] text-primary/80">
                  <Sparkles className="size-3" />
                  카탈로그 자동 매칭
                </span>
              </div>
            ) : form.dtcCode.trim().length >= 2 ? (
              <div className="rounded-xl border border-dashed border-border bg-slate-50 px-3.5 py-2.5 text-xs text-muted-foreground">
                일치하는 DTC가 없습니다. 아래 추천 코드에서 선택하거나 데모
                카탈로그 코드를 입력해 주세요.
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  disabled={isLoading}
                  onClick={() => applyDtcEntry(item)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-white px-2.5 py-1.5 text-[11px] shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-all hover:border-primary/40 hover:bg-blue-50 hover:text-blue-900"
                >
                  <span className="font-mono font-semibold">{item.code}</span>
                  <span className="text-muted-foreground">{item.abbr}</span>
                </button>
              ))}
            </div>
          </div>

          <Field label="차량 증상">
            <Textarea
              placeholder="예: ABS 경고등 점등, 제동 시 진동 발생"
              value={form.symptoms}
              onChange={(e) => update("symptoms", e.target.value)}
              disabled={isLoading}
              className="min-h-24"
            />
          </Field>

          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-muted-foreground">
              AI 응답 시뮬레이션 · 교육용 데모
            </p>
            <Button
              type="submit"
              size="lg"
              className="h-10 w-full px-5 sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  분석 중...
                </>
              ) : (
                "AI 고장 분석 실행"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
