"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { getSupportedDtcs } from "@/lib/mock-diagnosis";

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
    setForm({
      manufacturer: "현대자동차",
      model: "아반떼",
      year: "2022",
      system: "ABS",
      dtcCode: "C0035",
      dtcName: "좌측 전륜 휠 속도센서 회로 이상",
      symptoms: "ABS 경고등 점등, 제동 시 진동 발생",
    });
    toast.success("데모 데이터가 입력되었습니다.");
  };

  return (
    <Card className="border-border bg-card shadow-none ring-1 ring-border">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ScanSearch className="size-4 text-primary" />
              차량 정보 입력
            </CardTitle>
            <CardDescription className="mt-1">
              지원 데모 DTC: {getSupportedDtcs().join(", ")}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillDemo}
            disabled={isLoading}
          >
            데모 데이터 입력
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
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
                  <SelectValue placeholder="시스템 선택" />
                </SelectTrigger>
                <SelectContent>
                  {CHASSIS_SYSTEMS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="DTC 코드">
              <Input
                placeholder="예: C0035"
                value={form.dtcCode}
                onChange={(e) => update("dtcCode", e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field label="고장코드명">
              <Input
                placeholder="예: 좌측 전륜 휠 속도센서 회로 이상"
                value={form.dtcName}
                onChange={(e) => update("dtcName", e.target.value)}
                disabled={isLoading}
              />
            </Field>
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

          <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
            <p className="text-[11px] text-muted-foreground">
              AI 응답 시뮬레이션 · 교육용 데모
            </p>
            <Button type="submit" size="lg" className="h-10 px-5" disabled={isLoading}>
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
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}
