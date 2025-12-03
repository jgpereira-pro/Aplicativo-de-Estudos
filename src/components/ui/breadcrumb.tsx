"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { ChevronRight, MoreHorizontal } from "lucide-react@0.487.0";

import { cn } from "./utils";

/**
 * Breadcrumb - Componente de navegação breadcrumb (raiz)
 * 
 * Container semântico (nav) para navegação breadcrumb.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Products</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 */
const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav">
>(({ ...props }, ref) => {
  return <nav ref={ref} aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
});
Breadcrumb.displayName = "Breadcrumb";

/**
 * BreadcrumbList - Lista ordenada de itens do breadcrumb
 * 
 * Container (ol) para os itens do breadcrumb.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <BreadcrumbList>
 *   <BreadcrumbItem>
 *     <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *   </BreadcrumbItem>
 *   <BreadcrumbSeparator />
 *   <BreadcrumbItem>
 *     <BreadcrumbPage>Current</BreadcrumbPage>
 *   </BreadcrumbItem>
 * </BreadcrumbList>
 */
const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => {
  return (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className,
      )}
      {...props}
    />
  );
});
BreadcrumbList.displayName = "BreadcrumbList";

/**
 * BreadcrumbItem - Item individual do breadcrumb
 * 
 * Container (li) para um item do breadcrumb (link ou página).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <BreadcrumbItem>
 *   <BreadcrumbLink href="/products">Products</BreadcrumbLink>
 * </BreadcrumbItem>
 * 
 * @example
 * <BreadcrumbItem>
 *   <BreadcrumbPage>Current Page</BreadcrumbPage>
 * </BreadcrumbItem>
 */
const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
});
BreadcrumbItem.displayName = "BreadcrumbItem";

/**
 * BreadcrumbLink - Link do breadcrumb
 * 
 * Link (a) clicável no breadcrumb.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Suporta composição via prop `asChild` (Radix Slot pattern).
 * 
 * @example
 * // Link padrão
 * <BreadcrumbLink href="/">Home</BreadcrumbLink>
 * 
 * @example
 * // Link customizado (Next.js Link)
 * <BreadcrumbLink asChild>
 *   <Link href="/">Home</Link>
 * </BreadcrumbLink>
 * 
 * @example
 * // Com ref para focus programático
 * const linkRef = useRef<HTMLAnchorElement>(null);
 * 
 * <BreadcrumbLink ref={linkRef} href="/products">
 *   Products
 * </BreadcrumbLink>
 * 
 * linkRef.current?.focus();
 */
const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

/**
 * BreadcrumbPage - Página atual do breadcrumb
 * 
 * Indica a página atual (não clicável).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <BreadcrumbPage>Current Page</BreadcrumbPage>
 * 
 * @example
 * // Com ref
 * const pageRef = useRef<HTMLSpanElement>(null);
 * 
 * <BreadcrumbPage ref={pageRef}>Current Page</BreadcrumbPage>
 */
const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  );
});
BreadcrumbPage.displayName = "BreadcrumbPage";

/**
 * BreadcrumbSeparator - Separador entre itens do breadcrumb
 * 
 * Separador visual entre itens (padrão: ChevronRight).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Separador padrão (ChevronRight)
 * <BreadcrumbSeparator />
 * 
 * @example
 * // Separador customizado
 * <BreadcrumbSeparator>
 *   <SlashIcon className="size-3.5" />
 * </BreadcrumbSeparator>
 * 
 * @example
 * // Separador com texto
 * <BreadcrumbSeparator>/</BreadcrumbSeparator>
 */
const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ children, className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

/**
 * BreadcrumbEllipsis - Reticências para itens colapsados
 * 
 * Indica que há itens ocultos no breadcrumb.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <BreadcrumbEllipsis />
 * 
 * @example
 * // Com Dropdown para mostrar itens ocultos
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <BreadcrumbEllipsis />
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Item 1</DropdownMenuItem>
 *     <DropdownMenuItem>Item 2</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 */
const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
});
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
