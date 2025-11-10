"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer hover:cursor-pointer",
  {
    variants: {
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

type AsTag = keyof JSX.IntrinsicElements;

type ButtonOwnProps = {
  asChild?: boolean;
  /**
   * Renderizar como otro tag (por ejemplo "span" o "a") para evitar anidar <button>
   * cuando el padre ya es un elemento interactivo.
   */
  as?: AsTag;
};

type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> &
  ButtonOwnProps;

/**
 * Button component
 * - `asChild`: usar Slot (Radix pattern) para que el padre/trigger controle el elemento real.
 * - `as`: alternativa para renderizar como otro tag (por ejemplo `as="span"`).
 */
const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  { className, size, asChild = false, as = "button", ...props },
  ref
) {
  const Comp: any = asChild ? Slot : as;

  return (
    <Comp
      ref={ref as any}
      data-slot="button"
      className={cn(buttonVariants({ size, className }))}
      {...(props as any)}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
