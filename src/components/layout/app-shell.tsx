import { AuthGate } from "./auth-gate";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-60">
          <div className="mx-auto min-h-screen max-w-[1280px] px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGate>
  );
}
