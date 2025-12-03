"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog@1.1.6";

import { cn } from "./utils";
import { buttonVariants } from "./button";

/**
 * AlertDialog - Componente raiz do alert dialog (Radix UI wrapper)
 * 
 * Modal que interrompe o usuário com conteúdo importante e espera uma resposta.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <AlertDialog>
 *   <AlertDialogTrigger>Abrir</AlertDialogTrigger>
 *   <AlertDialogPortal>
 *     <AlertDialogOverlay />
 *     <AlertDialogContent>...</AlertDialogContent>
 *   </AlertDialogPortal>
 * </AlertDialog>
 */
const AlertDialog = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>
>(({ ...props }, ref) => {
  return <AlertDialogPrimitive.Root ref={ref} data-slot="alert-dialog" {...props} />;
});
AlertDialog.displayName = "AlertDialog";

/**
 * AlertDialogTrigger - Botão que abre o alert dialog
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <AlertDialogTrigger asChild>
 *   <Button variant="outline">Deletar</Button>
 * </AlertDialogTrigger>
 */
const AlertDialogTrigger = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>
>(({ ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Trigger
      ref={ref}
      data-slot="alert-dialog-trigger"
      {...props}
    />
  );
});
AlertDialogTrigger.displayName = "AlertDialogTrigger";

/**
 * AlertDialogPortal - Renderiza o dialog em um portal (fora da árvore DOM)
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Permite customização com prop `container`.
 * 
 * @example
 * <AlertDialogPortal>
 *   <AlertDialogOverlay />
 *   <AlertDialogContent>...</AlertDialogContent>
 * </AlertDialogPortal>
 * 
 * @example
 * // Portal customizado
 * <AlertDialogPortal container={document.getElementById('portal-root')}>
 *   ...
 * </AlertDialogPortal>
 */
const AlertDialogPortal = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Portal>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>
>(({ ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Portal ref={ref} data-slot="alert-dialog-portal" {...props} />
  );
});
AlertDialogPortal.displayName = "AlertDialogPortal";

/**
 * AlertDialogOverlay - Overlay escuro atrás do dialog
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Inclui animações de fade-in/fade-out.
 * 
 * @example
 * <AlertDialogOverlay />
 * 
 * @example
 * // Overlay customizado
 * <AlertDialogOverlay className="bg-red-500/50" />
 */
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
});
AlertDialogOverlay.displayName = "AlertDialogOverlay";

/**
 * AlertDialogContent - Conteúdo principal do alert dialog
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Inclui animações de zoom-in/zoom-out e fade.
 * 
 * IMPORTANTE: Este componente foi refatorado para seguir o princípio de composição do Radix.
 * Agora você deve compor manualmente o Portal e Overlay:
 * 
 * @example
 * // ✅ CORRETO (composição manual)
 * <AlertDialog>
 *   <AlertDialogTrigger>Abrir</AlertDialogTrigger>
 *   <AlertDialogPortal>
 *     <AlertDialogOverlay />
 *     <AlertDialogContent>
 *       <AlertDialogHeader>...</AlertDialogHeader>
 *     </AlertDialogContent>
 *   </AlertDialogPortal>
 * </AlertDialog>
 * 
 * @example
 * // ✅ Dialog inline (sem portal)
 * <AlertDialog>
 *   <AlertDialogTrigger>Abrir</AlertDialogTrigger>
 *   <AlertDialogOverlay />
 *   <AlertDialogContent>...</AlertDialogContent>
 * </AlertDialog>
 * 
 * @example
 * // ✅ Sem overlay
 * <AlertDialog>
 *   <AlertDialogTrigger>Abrir</AlertDialogTrigger>
 *   <AlertDialogPortal>
 *     <AlertDialogContent>...</AlertDialogContent>
 *   </AlertDialogPortal>
 * </AlertDialog>
 */
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Content
      ref={ref}
      data-slot="alert-dialog-content"
      className={cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
        className,
      )}
      {...props}
    />
  );
});
AlertDialogContent.displayName = "AlertDialogContent";

/**
 * AlertDialogHeader - Container para título e descrição
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Layout em coluna, centralizado em mobile e alinhado à esquerda em desktop.
 * 
 * @example
 * <AlertDialogHeader>
 *   <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
 *   <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
 * </AlertDialogHeader>
 */
const AlertDialogHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
});
AlertDialogHeader.displayName = "AlertDialogHeader";

/**
 * AlertDialogFooter - Container para botões de ação
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Layout em coluna reversa em mobile, linha alinhada à direita em desktop.
 * 
 * @example
 * <AlertDialogFooter>
 *   <AlertDialogCancel>Cancelar</AlertDialogCancel>
 *   <AlertDialogAction>Confirmar</AlertDialogAction>
 * </AlertDialogFooter>
 */
const AlertDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
});
AlertDialogFooter.displayName = "AlertDialogFooter";

/**
 * AlertDialogTitle - Título do alert dialog
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Acessibilidade: automaticamente associado ao dialog como aria-labelledby.
 * 
 * @example
 * <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
 */
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
});
AlertDialogTitle.displayName = "AlertDialogTitle";

/**
 * AlertDialogDescription - Descrição do alert dialog
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Acessibilidade: automaticamente associado ao dialog como aria-describedby.
 * 
 * @example
 * <AlertDialogDescription>
 *   Esta ação não pode ser desfeita. Isso irá deletar permanentemente sua conta.
 * </AlertDialogDescription>
 */
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
});
AlertDialogDescription.displayName = "AlertDialogDescription";

/**
 * AlertDialogAction - Botão de ação principal
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Fecha o dialog automaticamente ao clicar.
 * Estilizado como botão primário por padrão.
 * 
 * @example
 * <AlertDialogAction>Continuar</AlertDialogAction>
 * 
 * @example
 * // Estilo customizado
 * <AlertDialogAction className="bg-red-500">Deletar</AlertDialogAction>
 */
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
});
AlertDialogAction.displayName = "AlertDialogAction";

/**
 * AlertDialogCancel - Botão de cancelar
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Fecha o dialog automaticamente ao clicar.
 * Estilizado como botão outline por padrão.
 * 
 * @example
 * <AlertDialogCancel>Cancelar</AlertDialogCancel>
 */
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  );
});
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
