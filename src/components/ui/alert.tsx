"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

/**
 * Alert Variants - Define os estilos base para cada variante
 * 
 * Variantes:
 * - default: Estilo neutro (bg-card)
 * - destructive: Estilo de erro/aviso (text-destructive)
 */
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm flex items-start gap-3 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current [&_[data-slot=alert-description]]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Alert - Componente de alerta/notificação
 * 
 * Componente verdadeiramente composável que usa layout flex.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * IMPORTANTE: Este componente foi refatorado para remover a lógica de layout implícita.
 * Agora você deve compor manualmente o layout usando flex:
 * 
 * @example
 * // ✅ CORRETO (composição manual)
 * <Alert>
 *   <AlertCircleIcon className="size-4" />
 *   <div>
 *     <AlertTitle>Atenção</AlertTitle>
 *     <AlertDescription>Confira sua caixa de entrada.</AlertDescription>
 *   </div>
 * </Alert>
 * 
 * @example
 * // ✅ Sem ícone
 * <Alert>
 *   <div>
 *     <AlertTitle>Notificação</AlertTitle>
 *     <AlertDescription>Operação concluída com sucesso.</AlertDescription>
 *   </div>
 * </Alert>
 * 
 * @example
 * // ✅ Apenas descrição
 * <Alert>
 *   <InfoIcon className="size-4" />
 *   <AlertDescription>Esta é uma mensagem informativa.</AlertDescription>
 * </Alert>
 * 
 * @example
 * // ✅ Com conteúdo customizado
 * <Alert>
 *   <CheckIcon className="size-4" />
 *   <div className="flex-1">
 *     <AlertTitle>Sucesso!</AlertTitle>
 *     <AlertDescription>
 *       <p>Seu arquivo foi enviado.</p>
 *       <Button size="sm" variant="link">Ver detalhes</Button>
 *     </AlertDescription>
 *   </div>
 * </Alert>
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

/**
 * AlertTitle - Título do alerta
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Deve ser usado dentro de um Alert.
 * 
 * @example
 * <AlertTitle>Atenção</AlertTitle>
 */
const AlertTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="alert-title"
      className={cn(
        "line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
});
AlertTitle.displayName = "AlertTitle";

/**
 * AlertDescription - Descrição do alerta
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Deve ser usado dentro de um Alert.
 * 
 * @example
 * <AlertDescription>
 *   Esta é uma mensagem informativa importante.
 * </AlertDescription>
 * 
 * @example
 * // Com múltiplos parágrafos
 * <AlertDescription>
 *   <p>Primeira linha de informação.</p>
 *   <p>Segunda linha com mais detalhes.</p>
 * </AlertDescription>
 */
const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
