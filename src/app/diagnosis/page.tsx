"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { DiagnosisForm } from "@/components/diagnosis/diagnosis-form";
import { DiagnosisLoading } from "@/components/diagnosis/diagnosis-loading";
import { DiagnosisResultView } from "@/components/diagnosis/diagnosis-result";
import { analyzeDiagnosis } from "@/lib/mock-diagnosis";
import { delay } from "@/lib/mock-ai";
import type { DiagnosisInput, DiagnosisResult } from "@/lib/types";

type ViewState = "form" | "loading" | "result";

export default function DiagnosisPage() {
  const [view, setView] = useState<ViewState>("form");
  const [input, setInput] = useState<DiagnosisInput | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleSubmit = async (formInput: DiagnosisInput) => {
    setInput(formInput);
    setView("loading");
    await delay(1700);
    const analysis = analyzeDiagnosis(formInput);
    setResult(analysis);
    setView("result");
    if (analysis.supported) {
      toast.success("AI 분석이 완료되었습니다.");
    } else {
      toast.message("지원하지 않는 DTC 코드입니다.");
    }
  };

  const handleReset = () => {
    setView("form");
    setInput(null);
    setResult(null);
  };

  return (
    <div>
      <PageHeader
        title="AI 고장 진단 분석"
        description="차량 정보와 고장코드를 입력하여 섀시시스템의 이상 원인과 점검 절차를 분석합니다."
      />

      {view === "form" ? (
        <DiagnosisForm onSubmit={handleSubmit} isLoading={false} />
      ) : null}

      {view === "loading" ? <DiagnosisLoading /> : null}

      {view === "result" && input && result ? (
        <DiagnosisResultView
          input={input}
          result={result}
          onReset={handleReset}
        />
      ) : null}
    </div>
  );
}
