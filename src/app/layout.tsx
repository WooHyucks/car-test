import type { Metadata } from "next";
import { Noto_Sans_KR, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHASSIS AI | 차량 통합제어 및 미래 섀시시스템 학습 플랫폼",
  description:
    "AI 기반 고장 진단 분석과 시뮬레이션 실습을 통한 차량 제어 시스템 교육 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased">
        <AppShell>{children}</AppShell>
        <Toaster
          position="top-right"
          toastOptions={{
            className: "text-sm",
          }}
        />
      </body>
    </html>
  );
}
