"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  ArrowLeft,
  Wrench,
  MessageSquare,
  Car,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SensorChart } from "./sensor-chart";
import { SubmitModal } from "./submit-modal";
import { getMockChatResponse, delay } from "@/lib/mock-ai";
import { saveSimulationSession } from "@/lib/session";
import { getChassisSystemLabel } from "@/lib/vehicles";
import type { ChatMessage, Scenario, ToolAction } from "@/lib/types";

const TOOLS: { id: ToolAction; label: string }[] = [
  { id: "dtc", label: "DTC 상세 확인" },
  { id: "sensor", label: "실시간 센서 데이터" },
  { id: "wiring", label: "배선 점검" },
  { id: "sensor_status", label: "센서 상태 점검" },
  { id: "system_map", label: "제어 시스템 구조도" },
];

interface SimulationWorkspaceProps {
  scenario: Scenario;
  onBack: () => void;
}

export function SimulationWorkspace({
  scenario,
  onBack,
}: SimulationWorkspaceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [checkedTools, setCheckedTools] = useState<ToolAction[]>([]);
  const [activeTool, setActiveTool] = useState<ToolAction | null>(null);
  const [chatKeywords, setChatKeywords] = useState<string[]>([]);
  const [submitOpen, setSubmitOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: "init",
        role: "ai",
        content: scenario.initialAiMessage,
        timestamp: Date.now(),
      },
    ]);
  }, [scenario]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const progress = Math.min(100, (checkedTools.length / TOOLS.length) * 100);

  const handleTool = (tool: ToolAction) => {
    setActiveTool(tool);
    if (!checkedTools.includes(tool)) {
      setCheckedTools((prev) => [...prev, tool]);
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const studentMsg: ChatMessage = {
      id: `s-${Date.now()}`,
      role: "student",
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, studentMsg]);
    setInput("");
    setIsTyping(true);

    await delay(900 + Math.min(trimmed.length * 10, 800));

    const { response, matchedTag } = getMockChatResponse(trimmed, {
      scenarioId: scenario.id,
      checkedTools,
      previousKeywords: chatKeywords,
    });

    if (matchedTag) {
      setChatKeywords((prev) =>
        prev.includes(matchedTag) ? prev : [...prev, matchedTag]
      );
    }

    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "ai",
      content: response,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleSubmitDiagnosis = (data: {
    finalCause: string;
    reasoning: string;
    repairMethod: string;
  }) => {
    const session = {
      scenarioId: scenario.id,
      checkedTools,
      messages,
      chatKeywords,
      ...data,
    };
    saveSimulationSession(session);
    toast.success("진단이 제출되었습니다. 평가 결과로 이동합니다.");
    router.push("/simulation/result");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft />
          시나리오 선택
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{scenario.difficulty}</Badge>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            {scenario.title}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[240px_minmax(0,1fr)_280px]">
        {/* Left: Vehicle panel */}
        <Card className="h-fit border-border bg-card shadow-none ring-1 ring-border lg:order-1 xl:order-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Car className="size-4 text-primary" />
              차량 상태
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-1 xl:gap-3">
              {[
                ["제조사", scenario.vehicle.manufacturer],
                ["차종", scenario.vehicle.model],
                ["연식", scenario.vehicle.year],
                ["시스템", getChassisSystemLabel(scenario.vehicle.system)],
                ["현재 증상", scenario.symptom],
                ["DTC 코드", scenario.dtcCode],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-0.5 font-medium">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs font-medium text-foreground">실습 목표</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {scenario.learningGoal}
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground">
              교육용 가상 사례입니다.
            </p>
          </CardContent>
        </Card>

        {/* Center: Chat */}
        <Card className="flex min-h-[420px] flex-col border-border bg-card shadow-none ring-1 ring-border sm:min-h-[480px] lg:order-3 lg:col-span-2 xl:order-none xl:col-span-1 xl:min-h-[560px]">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MessageSquare className="size-4 text-primary" />
              AI 진단 어시스턴트
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              AI 응답 시뮬레이션 · 교육용 데모 · 정답을 바로 알려주지 않습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-0 p-0">
            <div className="max-h-[50vh] flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:max-h-none sm:px-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={
                      msg.role === "student"
                        ? "ml-4 flex justify-end sm:ml-8"
                        : "mr-4 flex justify-start sm:mr-8"
                    }
                  >
                    <div
                      className={
                        msg.role === "student"
                          ? "rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                          : "rounded-2xl rounded-bl-md border border-border bg-muted/60 px-3.5 py-2.5 text-sm text-foreground"
                      }
                    >
                      <p className="whitespace-pre-line leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping ? (
                <div className="mr-4 flex items-center gap-2 text-xs text-muted-foreground sm:mr-8">
                  <Loader2 className="size-3.5 animate-spin" />
                  AI가 응답을 준비하는 중...
                </div>
              ) : null}
              <div ref={chatEndRef} />
            </div>
            <form
              className="flex gap-2 border-t border-border p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage(input);
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="예: 휠 속도센서 데이터를 확인하겠습니다."
                disabled={isTyping}
                className="min-w-0"
              />
              <Button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="shrink-0"
              >
                <Send />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right: Tools */}
        <div className="space-y-4 lg:order-2 xl:order-none">
          <Card className="border-border bg-card shadow-none ring-1 ring-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wrench className="size-4 text-primary" />
                진단 도구
              </CardTitle>
              <CardDescription>
                점검 진행률 {Math.round(progress)}%
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={progress} className="h-1.5" />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
                {TOOLS.map((tool) => {
                  const done = checkedTools.includes(tool.id);
                  return (
                    <Button
                      key={tool.id}
                      variant={activeTool === tool.id ? "default" : "outline"}
                      className="h-9 w-full justify-start"
                      onClick={() => handleTool(tool.id)}
                    >
                      <span
                        className={
                          done
                            ? "mr-1 size-1.5 rounded-full bg-success"
                            : "mr-1 size-1.5 rounded-full bg-border"
                        }
                      />
                      {tool.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {activeTool ? (
            <Card className="border-border bg-card shadow-none ring-1 ring-border">
              <CardHeader>
                <CardTitle className="text-sm">
                  {TOOLS.find((t) => t.id === activeTool)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeTool === "sensor" && scenario.id === "abs-wheel-speed" ? (
                  <div className="space-y-3">
                    <SensorChart />
                    <p className="whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                      {scenario.toolResults.sensor}
                    </p>
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                    {scenario.toolResults[activeTool]}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border bg-card shadow-none ring-1 ring-border">
              <CardContent className="py-8 text-center text-xs text-muted-foreground">
                진단 도구를 선택하면
                <br />
                Mock 점검 결과가 표시됩니다.
              </CardContent>
            </Card>
          )}

          <Button
            className="h-10 w-full"
            size="lg"
            onClick={() => {
              if (checkedTools.length === 0) {
                toast.error("최소 한 개 이상의 진단 도구를 사용해 주세요.");
                return;
              }
              setSubmitOpen(true);
            }}
          >
            최종 진단 제출
          </Button>
        </div>
      </div>

      <SubmitModal
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        scenario={scenario}
        onSubmit={handleSubmitDiagnosis}
      />
    </div>
  );
}
