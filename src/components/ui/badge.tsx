"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

/**
 * Badge Variants - Define os estilos para cada variante
 * 
 * Variantes:
 * - default: Estilo primário (bg-primary)
 * - secondary: Estilo secundário (bg-secondary)
 * - destructive: Estilo de erro/perigo (bg-destructive)
 * - outline: Estilo com borda (border)
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Badge - Componente de etiqueta/distintivo
 * 
 * Componente robusto para exibir etiquetas, tags, status, contadores, etc.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Suporta composição via prop `asChild` (Radix Slot pattern).
 * 
 * @example
 * // Badge básico
 * <Badge>New</Badge>
 * 
 * @example
 * // Badge com variantes
 * <Badge variant="default">Default</Badge>
 * <Badge variant="secondary">Secondary</Badge>
 * <Badge variant="destructive">Destructive</Badge>
 * <Badge variant="outline">Outline</Badge>
 * 
 * @example
 * // Badge com ícone
 * <Badge>
 *   <StarIcon className="size-3" />
 *   Featured
 * </Badge>
 * 
 * @example
 * // Badge como link (asChild)
 * <Badge asChild>
 *   <a href="/notifications">5 Notificações</a>
 * </Badge>
 * 
 * @example
 * // Badge como botão (asChild)
 * <Badge asChild variant="destructive">
 *   <button onClick={handleDelete}>Deletar</button>
 * </Badge>
 * 
 * @example
 * // Com ref para medir tamanho
 * const badgeRef = useRef<HTMLSpanElement>(null);
 * 
 * <Badge ref={badgeRef}>Active</Badge>
 * 
 * useEffect(() => {
 *   console.log('Largura:', badgeRef.current?.clientWidth);
 * }, []);
 * 
 * @example
 * // Badge customizado
 * <Badge className="bg-blue-500 text-white">Custom</Badge>
 */
const Badge = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }
>(({ className, variant, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      ref={ref}
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge, badgeVariants };
