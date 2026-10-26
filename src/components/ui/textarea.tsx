import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-xl border border-border/80 bg-white px-3.5 py-2.5 text-sm text-foreground shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-all outline-none",
        "placeholder:text-slate-400",
        "hover:border-slate-300",
        "focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15",
        "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
