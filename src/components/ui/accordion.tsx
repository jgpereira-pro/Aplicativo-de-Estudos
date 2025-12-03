"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion@1.2.3";
import { ChevronDownIcon } from "lucide-react@0.487.0";

import { cn } from "./utils";

/**
 * Accordion - Componente raiz do accordion (Radix UI wrapper)
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">...</AccordionItem>
 * </Accordion>
 */
const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ ...props }, ref) => {
  return <AccordionPrimitive.Root ref={ref} data-slot="accordion" {...props} />;
});
Accordion.displayName = "Accordion";

/**
 * AccordionItem - Item individual do accordion
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <AccordionItem value="item-1">
 *   <AccordionTrigger>Clique aqui</AccordionTrigger>
 *   <AccordionContent>Conteúdo revelado</AccordionContent>
 * </AccordionItem>
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
});
AccordionItem.displayName = "AccordionItem";

/**
 * AccordionTrigger - Botão que expande/colapsa o accordion
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Inclui ícone ChevronDown por padrão, pode ser desabilitado com hideIcon.
 * 
 * @param hideIcon - Se true, oculta o ícone ChevronDown (padrão: false)
 * 
 * @example
 * // Com ícone (padrão)
 * <AccordionTrigger>Clique aqui</AccordionTrigger>
 * 
 * // Sem ícone
 * <AccordionTrigger hideIcon>Clique aqui</AccordionTrigger>
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    hideIcon?: boolean;
  }
>(({ className, children, hideIcon = false, ...props }, ref) => {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        {!hideIcon && (
          <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

/**
 * AccordionContent - Conteúdo colapsável do accordion
 * 
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Inclui animações de abertura/fechamento e padding vertical.
 * 
 * @example
 * <AccordionContent>
 *   <p>Este é o conteúdo revelado.</p>
 * </AccordionContent>
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      data-slot="accordion-content"
      className={cn(
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm pt-0 pb-4",
        className
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
