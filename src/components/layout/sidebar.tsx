"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanSearch,
  GraduationCap,
  BarChart3,
  BookMarked,
  Cpu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
  { href: "/", label: "대시보드", icon: LayoutDashboard, hint: "Overview" },
  { href: "/diagnosis", label: "AI 고장 진단", icon: ScanSearch, hint: "Diagnose" },
  { href: "/simulation", label: "AI 진단 실습", icon: GraduationCap, hint: "Practice" },
  { href: "/analytics", label: "학습 분석", icon: BarChart3, hint: "Analytics" },
  { href: "/cases", label: "활용 사례", icon: BookMarked, hint: "Cases" },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "no-print fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "no-print fixed inset-y-0 left-0 z-50 flex w-[min(100%,16rem)] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:w-64 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative overflow-hidden border-b border-sidebar-border px-5 py-5">
          <div className="pointer-events-none absolute -right-6 -top-8 size-28 rounded-full bg-blue-500/20 blur-2xl" />
          <div className="relative flex items-start justify-between gap-2">
            <Link href="/" className="block" onClick={onClose}>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-900/40">
                  <Cpu className="size-5" />
                </div>
                <div>
                  <p className="font-heading text-base font-semibold tracking-tight text-white">
                    CHASSIS AI
                  </p>
                  <p className="mt-0.5 text-[10px] tracking-[0.14em] text-slate-400 uppercase">
                    Education Platform
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                차량 통합제어 · 미래 섀시시스템
                <br />
                AI 기반 학습 플랫폼
              </p>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
              onClick={onClose}
              aria-label="메뉴 닫기"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
            Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-sidebar-accent text-white shadow-inner ring-1 ring-white/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-colors",
                    active
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-white/5 text-slate-400 group-hover:text-slate-200"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="flex-1">{item.label}</span>
                <span className="hidden text-[10px] text-slate-500 xl:inline">
                  {item.hint}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-600/20 to-slate-800/80 p-3 ring-1 ring-white/10">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-blue-200">
              <Sparkles className="size-3.5" />
              Demo Mode
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              교육용 프로토타입 · Mock AI Engine
            </p>
            <Separator className="my-2.5 bg-white/10" />
            <p className="text-[10px] text-slate-500">
              AI는 정답을 대신하지 않습니다
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
