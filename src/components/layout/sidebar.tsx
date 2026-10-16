"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanSearch,
  GraduationCap,
  BarChart3,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/diagnosis", label: "AI 고장 진단", icon: ScanSearch },
  { href: "/simulation", label: "AI 진단 실습", icon: GraduationCap },
  { href: "/analytics", label: "학습 분석", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="no-print fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border px-5 py-5">
        <Link href="/" className="block">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cpu className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight text-foreground">
                CHASSIS AI
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            AI 기반 차량 통합제어 및
            <br />
            섀시시스템 학습 플랫폼
          </p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
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
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-5 py-4">
        <p className="text-xs font-medium text-foreground">교육용 프로토타입</p>
        <p className="mt-1 text-[11px] text-muted-foreground">Mock AI Engine</p>
      </div>
    </aside>
  );
}
