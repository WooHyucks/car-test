"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LOADING_MESSAGES } from "@/lib/mock-diagnosis";

export function DiagnosisLoading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="border-border bg-card shadow-none ring-1 ring-border">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Loader2 className="size-7 animate-spin" />
        </div>
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-sm font-medium text-foreground"
        >
          {LOADING_MESSAGES[index]}
        </motion.p>
        <p className="mt-2 text-xs text-muted-foreground">
          AI 응답 시뮬레이션 · 교육용 데모
        </p>
      </CardContent>
    </Card>
  );
}
