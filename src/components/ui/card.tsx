"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";

import { cn } from "./utils";

/**
 * Card - Container principal do card
 * 
 * Componente raiz que agrupa header, content e footer.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 * </Card>
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className,
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

/**
 * CardHeader - Cabeçalho do card
 * 
 * Container para título, descrição e ações do card.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <CardHeader>
 *   <CardTitle>Title</CardTitle>
 *   <CardDescription>Description</CardDescription>
 *   <CardAction>
 *     <Button variant="ghost" size="sm">Action</Button>
 *   </CardAction>
 * </CardHeader>
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

/**
 * CardTitle - Título do card
 * 
 * Título principal do card (padrão: h4).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Suporta composição via prop `asChild` para flexibilidade semântica.
 * 
 * @example
 * // Padrão (h4)
 * <CardTitle>My Card Title</CardTitle>
 * 
 * @example
 * // Customizado (h2 para SEO)
 * <CardTitle asChild>
 *   <h2>Main Page Title</h2>
 * </CardTitle>
 * 
 * @example
 * // Customizado (h3)
 * <CardTitle asChild>
 *   <h3>Section Title</h3>
 * </CardTitle>
 */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h4"> & {
    asChild?: boolean;
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "h4";

  return (
    <Comp
      ref={ref}
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

/**
 * CardDescription - Descrição do card
 * 
 * Texto descritivo do card (padrão: p).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Suporta composição via prop `asChild` para flexibilidade semântica.
 * 
 * @example
 * // Padrão (p)
 * <CardDescription>This is a card description</CardDescription>
 * 
 * @example
 * // Customizado (div)
 * <CardDescription asChild>
 *   <div className="flex gap-2">
 *     <span>Multiple</span>
 *     <span>elements</span>
 *   </div>
 * </CardDescription>
 * 
 * @example
 * // Customizado (span)
 * <CardDescription asChild>
 *   <span>Inline description</span>
 * </CardDescription>
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p"> & {
    asChild?: boolean;
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "p";

  return (
    <Comp
      ref={ref}
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

/**
 * CardAction - Ação do card
 * 
 * Container para ações (botões, menus) no header do card.
 * Posicionado automaticamente no canto superior direito.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <CardHeader>
 *   <CardTitle>Title</CardTitle>
 *   <CardDescription>Description</CardDescription>
 *   <CardAction>
 *     <Button variant="ghost" size="sm">Edit</Button>
 *   </CardAction>
 * </CardHeader>
 */
const CardAction = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
});
CardAction.displayName = "CardAction";

/**
 * CardContent - Conteúdo do card
 * 
 * Container principal para o conteúdo do card.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <CardContent>
 *   <p>Main content goes here</p>
 * </CardContent>
 * 
 * @example
 * // Com formulário
 * <CardContent>
 *   <form>
 *     <Input placeholder="Name" />
 *     <Button>Submit</Button>
 *   </form>
 * </CardContent>
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
});
CardContent.displayName = "CardContent";

/**
 * CardFooter - Rodapé do card
 * 
 * Container para ações ou informações adicionais no rodapé.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <CardFooter>
 *   <Button variant="ghost">Cancel</Button>
 *   <Button>Submit</Button>
 * </CardFooter>
 * 
 * @example
 * // Com informação
 * <CardFooter>
 *   <p className="text-sm text-muted-foreground">
 *     Last updated 2 hours ago
 *   </p>
 * </CardFooter>
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
