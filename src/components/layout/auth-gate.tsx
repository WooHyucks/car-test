"use client";

import { useEffect, useState } from "react";
import { Cpu, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      {/* children은 항상 렌더하여 Instant navigation 세그먼트 검증을 유지합니다 */}
      <div
        aria-hidden={!isUnlocked}
        inert={!isUnlocked ? true : undefined}
        className={isUnlocked ? undefined : "pointer-events-none select-none"}
      >
        {children}
      </div>

      {!isUnlocked ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-4">
          {status === "loading" ? (
            <Loader2 className="size-6 animate-spin text-primary" />
          ) : (
            <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm ring-1 ring-border">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Cpu className="size-6" />
                </div>
                <h1 className="text-lg font-semibold tracking-tight">
                  CHASSIS AI
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  교육용 프로토타입 · 접근 제한
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="access-password">접속 비밀번호</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="access-password"
                      type="password"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="비밀번호 입력"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-9 w-full"
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

              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                Mock 인증 · 교육용 데모
              </p>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
