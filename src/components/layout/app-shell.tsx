"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Cpu } from "lucide-react";
import { AuthGate } from "./auth-gate";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        <header className="no-print sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(true)}
            aria-label="메뉴 열기"
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Cpu className="size-3.5" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              CHASSIS AI
            </span>
          </div>
        </header>

        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="lg:pl-60">
          <div className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-[1280px] px-4 py-5 sm:px-6 sm:py-6 lg:min-h-screen lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGate>
  );
}
