import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border border-border/80 bg-white px-3.5 py-2 text-sm text-foreground shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-all outline-none",
        "placeholder:text-slate-400",
        "hover:border-slate-300",
        "focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
