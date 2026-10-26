"use client";

import { useEffect, useState } from "react";
import { Cpu, Lock, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ACCESS_STORAGE_KEY,
  verifyAccessPassword,
} from "@/lib/access";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "locked" | "unlocked">(
    "loading"
  );
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const granted = sessionStorage.getItem(ACCESS_STORAGE_KEY) === "true";
    setStatus(granted ? "unlocked" : "locked");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!verifyAccessPassword(password)) {
      toast.error("비밀번호가 올바르지 않습니다.");
      setIsSubmitting(false);
      return;
    }

    sessionStorage.setItem(ACCESS_STORAGE_KEY, "true");
    setStatus("unlocked");
    setIsSubmitting(false);
    toast.success("접속이 허용되었습니다.");
  };

  const isUnlocked = status === "unlocked";

  return (
    <>
      <div
        aria-hidden={!isUnlocked}
        inert={!isUnlocked ? true : undefined}
        className={isUnlocked ? undefined : "pointer-events-none select-none"}
      >
        {children}
      </div>

      {!isUnlocked ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1220] px-4">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 top-10 size-72 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute -right-10 bottom-10 size-80 rounded-full bg-sky-500/10 blur-3xl" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(148 163 184 / 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.12) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          {status === "loading" ? (
            <Loader2 className="relative size-7 animate-spin text-blue-400" />
          ) : (
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-900/50">
                  <Cpu className="size-7" />
                </div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-white">
                  CHASSIS AI
                </h1>
                <p className="mt-1.5 text-sm text-slate-400">
                  교육용 프로토타입 · 접근 제한
                </p>
                <div className="mt-3 flex justify-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-white/10 bg-white/5 text-slate-300"
                  >
                    <ShieldCheck className="size-3" />
                    Secure Demo Gate
                  </Badge>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="access-password"
                    className="text-slate-300"
                  >
                    접속 비밀번호
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="access-password"
                      type="password"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="비밀번호 입력"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 border-white/10 bg-slate-950/60 pl-10 text-white placeholder:text-slate-500"
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full bg-blue-600 hover:bg-blue-500"
                  disabled={isSubmitting || !password.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      확인 중...
                    </>
                  ) : (
                    "입장하기"
                  )}
                </Button>
              </form>

              <p className="mt-5 text-center text-[11px] text-slate-500">
                Mock 인증 · 교육용 데모
              </p>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
