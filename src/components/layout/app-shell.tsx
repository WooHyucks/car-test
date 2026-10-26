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
      <div className="app-canvas min-h-screen">
        <header className="no-print sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/80 bg-card/80 px-4 backdrop-blur-md lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(true)}
            aria-label="메뉴 열기"
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <Cpu className="size-3.5" />
            </div>
            <span className="font-heading text-sm font-semibold tracking-tight">
              CHASSIS AI
            </span>
          </div>
        </header>

        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="lg:pl-64">
          <div className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-[1280px] px-4 py-5 sm:px-6 sm:py-7 lg:min-h-screen lg:px-8 lg:py-9">
            {children}
          </div>
        </main>
      </div>
    </AuthGate>
  );
}
