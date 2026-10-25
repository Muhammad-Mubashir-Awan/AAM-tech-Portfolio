import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// Site buttons, modelled on caymarkauctions.com: 10px corners, bold text, and on hover the
// colour simply moves one shade in 0.15s (Tailwind only applies hover: on mouse devices).
// A child with data-arrow nudges forward on hover.
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-transparent font-bold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,filter] duration-150 ease-snap outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pine-600 active:brightness-[0.92] disabled:pointer-events-none disabled:opacity-70 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_[data-arrow]]:transition-transform [&_[data-arrow]]:duration-200 hover:[&_[data-arrow]]:translate-x-[3px] motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-pine-600 hover:shadow-[0_8px_20px_-10px_rgba(5,31,32,0.55)]",
        outline: "border-border bg-transparent text-foreground hover:border-primary hover:bg-secondary hover:text-pine-800",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-6 py-3.5 text-[0.95rem]",
        sm: "px-[1.1rem] py-[0.55rem] text-sm",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
