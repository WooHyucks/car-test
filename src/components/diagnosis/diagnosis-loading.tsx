"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  Sparkles,
  FileText,
  Database,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ANALYSIS_STAGES } from "@/lib/mock-diagnosis";
import { cn } from "@/lib/utils";

const ICONS = {
  search: Search,
  globe: Globe,
  sparkles: Sparkles,
  file: FileText,
};

export function DiagnosisLoading({ dtcCode }: { dtcCode?: string }) {
  const [stage, setStage] = useState(0);
  const [searchHits, setSearchHits] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStage((s) => Math.min(s + 1, ANALYSIS_STAGES.length - 1));
    }, 900);
    return () => clearInterval(stageTimer);
  }, []);

  useEffect(() => {
    const hitTimer = setInterval(() => {
      setSearchHits((h) => Math.min(h + 1, 12));
    }, 280);
    return () => clearInterval(hitTimer);
  }, []);

  const current = ANALYSIS_STAGES[stage];
  const CurrentIcon = ICONS[current.icon];

  return (
    <Card className="border-border bg-card shadow-none ring-1 ring-border">
      <CardContent className="py-10 sm:py-14">
        <div className="mx-auto max-w-xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BrainCircuit className="size-8" />
              <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-card ring-1 ring-border">
                <CurrentIcon className="size-3.5 animate-pulse text-primary" />
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              AI 진단 엔진 시뮬레이션
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {dtcCode
                ? `DTC ${dtcCode.toUpperCase()} 분석 파이프라인 실행 중`
                : "교육용 Mock 분석 파이프라인 실행 중"}
            </p>
          </div>

          <div className="mb-6 space-y-2">
            {ANALYSIS_STAGES.map((item, i) => {
              const Icon = ICONS[item.icon];
              const done = i < stage;
              const active = i === stage;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                    active
                      ? "border-primary/30 bg-accent/50"
                      : done
                        ? "border-border bg-muted/40"
                        : "border-transparent bg-transparent opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
                      active
                        ? "bg-primary text-primary-foreground"
                        : done
                          ? "bg-success/15 text-success"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <Icon className={cn("size-3.5", active && "animate-pulse")} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <AnimatePresence mode="wait">
                      {active ? (
                        <motion.p
                          key={item.detail}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-0.5 text-xs text-muted-foreground"
                        >
                          {item.detail}
                        </motion.p>
                      ) : done ? (
                        <p className="mt-0.5 text-xs text-success">완료</p>
                      ) : (
                        <p className="mt-0.5 text-xs text-muted-foreground">대기</p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-foreground">
              <Database className="size-3.5 text-primary" />
              Mock 검색 결과 스트림
            </div>
            <ul className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
              {[
                `query: DTC ${dtcCode?.toUpperCase() || "****"} chassis diagnostic`,
                "source: OEM service info · educational mirror",
                `matched_docs: ${searchHits}`,
                "ai_mode: reasoning_over_retrieved_context (simulated)",
              ]
                .slice(0, Math.min(4, 1 + Math.floor(searchHits / 3)))
                .map((line) => (
                  <li key={line} className="truncate">
                    › {line}
                  </li>
                ))}
            </ul>
          </div>

          <p className="mt-5 text-center text-[11px] text-muted-foreground">
            실제 웹 검색·LLM API는 연결되지 않습니다 · AI 응답 시뮬레이션 ·
            교육용 데모
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
