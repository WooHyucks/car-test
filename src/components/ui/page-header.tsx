import { DemoBadge } from "@/components/ui/demo-badge";

export function PageHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description?: string;
  badge?: string;
}) {
  return (
    <div className="mb-7 sm:mb-9">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <DemoBadge>{badge ?? "CHASSIS AI"}</DemoBadge>
      </div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
