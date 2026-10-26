import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, Geist_Mono, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
      className={`${ibmPlexSansKr.variable} ${outfit.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased">
        <AppShell>{children}</AppShell>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            className: "text-sm",
          }}
        />
      </body>
    </html>
  );
}
