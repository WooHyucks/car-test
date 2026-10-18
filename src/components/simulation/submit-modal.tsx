"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Scenario } from "@/lib/types";

interface SubmitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenario: Scenario;
  onSubmit: (data: {
    finalCause: string;
    reasoning: string;
    repairMethod: string;
  }) => void;
}

export function SubmitModal({
  open,
  onOpenChange,
  scenario,
  onSubmit,
}: SubmitModalProps) {
  const [finalCause, setFinalCause] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [repairMethod, setRepairMethod] = useState("");

  const handleSubmit = () => {
    if (!finalCause) return toast.error("최종 고장 원인을 선택해 주세요.");
    if (!reasoning.trim()) return toast.error("판단 근거를 입력해 주세요.");
    if (!repairMethod.trim())
      return toast.error("권장 정비 방법을 입력해 주세요.");
    onSubmit({ finalCause, reasoning, repairMethod });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>최종 진단 제출</DialogTitle>
          <DialogDescription>
            점검 결과를 바탕으로 고장 원인과 근거를 제출합니다. AI가 정답을 대신
            알려주지 않으며, 제출 후 학습 평가가 진행됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>최종 고장 원인</Label>
            <Select
              value={finalCause || null}
              onValueChange={(v) => setFinalCause(v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="원인 선택" />
              </SelectTrigger>
              <SelectContent>
                {scenario.causeOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>판단 근거</Label>
            <Textarea
              placeholder="어떤 점검 결과를 근거로 판단했는지 설명해 주세요."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              className="min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label>권장 정비 방법</Label>
            <Textarea
              placeholder="권장하는 정비 또는 후속 조치를 입력해 주세요."
              value={repairMethod}
              onChange={(e) => setRepairMethod(e.target.value)}
              className="min-h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit}>제출하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
