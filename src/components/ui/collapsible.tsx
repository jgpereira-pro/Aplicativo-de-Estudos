"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible@1.1.3";

import { cn } from "./utils";

/**
 * Collapsible - Componente de container expansível/colapsável
 * 
 * Container raiz do componente Collapsible (Radix UI).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Gerencia o estado open/closed e coordena Trigger + Content.
 * 
 * @example
 * // Collapsible básico (uncontrolled)
 * <Collapsible>
 *   <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *   <CollapsibleContent>
 *     This content can be expanded or collapsed.
 *   </CollapsibleContent>
 * </Collapsible>
 * 
 * @example
 * // Collapsible controlado
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Collapsible open={isOpen} onOpenChange={setIsOpen}>
 *   <CollapsibleTrigger>
 *     {isOpen ? "Hide" : "Show"} details
 *   </CollapsibleTrigger>
 *   <CollapsibleContent>
 *     Hidden content here...
 *   </CollapsibleContent>
 * </Collapsible>
 * 
 * @example
 * // Com ref
 * const collapsibleRef = useRef<HTMLDivElement>(null);
 * 
 * <Collapsible ref={collapsibleRef}>
 *   <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *   <CollapsibleContent>Content</CollapsibleContent>
 * </Collapsible>
 * 
 * @example
 * // Com custom styling
 * <Collapsible className="border rounded-lg p-4">
 *   <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *   <CollapsibleContent>Content</CollapsibleContent>
 * </Collapsible>
 * 
 * @example
 * // Default open
 * <Collapsible defaultOpen>
 *   <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *   <CollapsibleContent>
 *     This is open by default
 *   </CollapsibleContent>
 * </Collapsible>
 */
const Collapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    data-slot="collapsible"
    className={cn(className)}
    {...props}
  />
));
Collapsible.displayName = CollapsiblePrimitive.Root.displayName;

/**
 * CollapsibleTrigger - Botão para expandir/colapsar conteúdo
 * 
 * Botão que controla o estado open/closed do Collapsible.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Automaticamente gerencia aria-expanded e aria-controls.
 * 
 * @example
 * // Trigger básico
 * <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 * 
 * @example
 * // Com ícone (chevron)
 * import { ChevronDown } from "lucide-react";
 * 
 * <CollapsibleTrigger className="flex items-center gap-2">
 *   <span>Show more</span>
 *   <ChevronDown className="size-4 transition-transform data-[state=open]:rotate-180" />
 * </CollapsibleTrigger>
 * 
 * @example
 * // Com ref (focus programático)
 * const triggerRef = useRef<HTMLButtonElement>(null);
 * 
 * <CollapsibleTrigger ref={triggerRef}>
 *   Toggle
 * </CollapsibleTrigger>
 * 
 * // Focus no trigger
 * triggerRef.current?.focus();
 * 
 * @example
 * // Como Button customizado
 * <CollapsibleTrigger asChild>
 *   <Button variant="outline">
 *     Toggle details
 *   </Button>
 * </CollapsibleTrigger>
 * 
 * @example
 * // Com custom styling
 * <CollapsibleTrigger className="w-full justify-between p-4 hover:bg-accent">
 *   Toggle
 * </CollapsibleTrigger>
 * 
 * @example
 * // Disabled
 * <CollapsibleTrigger disabled>
 *   Cannot toggle
 * </CollapsibleTrigger>
 */
const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleTrigger
    ref={ref}
    data-slot="collapsible-trigger"
    className={cn(className)}
    {...props}
  />
));
CollapsibleTrigger.displayName =
  CollapsiblePrimitive.CollapsibleTrigger.displayName;

/**
 * CollapsibleContent - Conteúdo expansível/colapsável
 * 
 * Container do conteúdo que será expandido/colapsado.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Animado automaticamente pelo Radix UI.
 * 
 * @example
 * // Content básico
 * <CollapsibleContent>
 *   This content can be toggled.
 * </CollapsibleContent>
 * 
 * @example
 * // Com animação customizada
 * <CollapsibleContent className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
 *   Animated content
 * </CollapsibleContent>
 * 
 * @example
 * // Com ref (medir altura)
 * const contentRef = useRef<HTMLDivElement>(null);
 * 
 * <CollapsibleContent ref={contentRef}>
 *   Content here
 * </CollapsibleContent>
 * 
 * useEffect(() => {
 *   console.log('Content height:', contentRef.current?.scrollHeight);
 * }, []);
 * 
 * @example
 * // Com padding customizado
 * <CollapsibleContent className="px-4 py-2">
 *   Padded content
 * </CollapsibleContent>
 * 
 * @example
 * // Com scroll se muito conteúdo
 * <CollapsibleContent className="max-h-64 overflow-y-auto">
 *   Very long content...
 * </CollapsibleContent>
 * 
 * @example
 * // Animação suave (com CSS)
 * <CollapsibleContent className="transition-all duration-300 ease-in-out overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
 *   Smoothly animated content
 * </CollapsibleContent>
 */
const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    data-slot="collapsible-content"
    className={cn(className)}
    {...props}
  />
));
CollapsibleContent.displayName =
  CollapsiblePrimitive.CollapsibleContent.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
