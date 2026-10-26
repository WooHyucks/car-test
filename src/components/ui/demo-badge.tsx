import { cn } from "@/lib/utils";

export function DemoBadge({
  children = "교육용 데모",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}
