"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu@2.2.6";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react@0.487.0";

import { cn } from "./utils";

/**
 * ContextMenu - Container raiz do menu de contexto
 * 
 * Wrapper do Radix UI ContextMenu Root.
 * Suporta ref forwarding para acesso ao componente.
 * Gerencia o estado e coordena todos os sub-componentes.
 * 
 * @example
 * // Menu de contexto básico
 * <ContextMenu>
 *   <ContextMenuTrigger>Right click me</ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem>Edit</ContextMenuItem>
 *     <ContextMenuItem>Delete</ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 * 
 * @example
 * // Controlado
 * const [open, setOpen] = useState(false);
 * 
 * <ContextMenu open={open} onOpenChange={setOpen}>
 *   <ContextMenuTrigger>Right click</ContextMenuTrigger>
 *   <ContextMenuContent>...</ContextMenuContent>
 * </ContextMenu>
 */
const ContextMenu = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root>
>((props, ref) => (
  <ContextMenuPrimitive.Root ref={ref} data-slot="context-menu" {...props} />
));
ContextMenu.displayName = ContextMenuPrimitive.Root.displayName;

/**
 * ContextMenuTrigger - Elemento que abre o menu no right-click
 * 
 * Wrapper que detecta right-click e abre o menu de contexto.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Trigger básico
 * <ContextMenuTrigger>Right click me</ContextMenuTrigger>
 * 
 * @example
 * // Com custom element
 * <ContextMenuTrigger asChild>
 *   <div className="border p-4">Custom trigger</div>
 * </ContextMenuTrigger>
 * 
 * @example
 * // Com ref
 * const triggerRef = useRef<HTMLSpanElement>(null);
 * 
 * <ContextMenuTrigger ref={triggerRef}>
 *   Right click
 * </ContextMenuTrigger>
 */
const ContextMenuTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger>
>((props, ref) => (
  <ContextMenuPrimitive.Trigger
    ref={ref}
    data-slot="context-menu-trigger"
    {...props}
  />
));
ContextMenuTrigger.displayName = ContextMenuPrimitive.Trigger.displayName;

/**
 * ContextMenuGroup - Agrupamento lógico de itens
 * 
 * Agrupa itens relacionados no menu.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Group de itens
 * <ContextMenuGroup>
 *   <ContextMenuItem>Edit</ContextMenuItem>
 *   <ContextMenuItem>Copy</ContextMenuItem>
 * </ContextMenuGroup>
 */
const ContextMenuGroup = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Group>
>((props, ref) => (
  <ContextMenuPrimitive.Group
    ref={ref}
    data-slot="context-menu-group"
    {...props}
  />
));
ContextMenuGroup.displayName = ContextMenuPrimitive.Group.displayName;

/**
 * ContextMenuPortal - Portal para renderizar menu fora da hierarquia
 * 
 * Renderiza o menu em um portal (fora do DOM tree).
 * Suporta ref forwarding para acesso ao componente.
 * 
 * @example
 * // Portal customizado
 * <ContextMenuPortal>
 *   <ContextMenuContent>...</ContextMenuContent>
 * </ContextMenuPortal>
 */
const ContextMenuPortal = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Portal>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Portal>
>((props, ref) => (
  <ContextMenuPrimitive.Portal
    ref={ref}
    data-slot="context-menu-portal"
    {...props}
  />
));
ContextMenuPortal.displayName = ContextMenuPrimitive.Portal.displayName;

/**
 * ContextMenuSub - Container raiz de submenu
 * 
 * Wrapper para criar submenus aninhados.
 * Suporta ref forwarding para acesso ao componente.
 * 
 * @example
 * // Submenu
 * <ContextMenuSub>
 *   <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
 *   <ContextMenuSubContent>
 *     <ContextMenuItem>Option 1</ContextMenuItem>
 *     <ContextMenuItem>Option 2</ContextMenuItem>
 *   </ContextMenuSubContent>
 * </ContextMenuSub>
 */
const ContextMenuSub = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Sub>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Sub>
>((props, ref) => (
  <ContextMenuPrimitive.Sub ref={ref} data-slot="context-menu-sub" {...props} />
));
ContextMenuSub.displayName = ContextMenuPrimitive.Sub.displayName;

/**
 * ContextMenuRadioGroup - Grupo de radio items
 * 
 * Agrupa ContextMenuRadioItems para seleção única.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Radio group
 * const [value, setValue] = useState("option1");
 * 
 * <ContextMenuRadioGroup value={value} onValueChange={setValue}>
 *   <ContextMenuRadioItem value="option1">Option 1</ContextMenuRadioItem>
 *   <ContextMenuRadioItem value="option2">Option 2</ContextMenuRadioItem>
 * </ContextMenuRadioGroup>
 */
const ContextMenuRadioGroup = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioGroup>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioGroup>
>((props, ref) => (
  <ContextMenuPrimitive.RadioGroup
    ref={ref}
    data-slot="context-menu-radio-group"
    {...props}
  />
));
ContextMenuRadioGroup.displayName =
  ContextMenuPrimitive.RadioGroup.displayName;

/**
 * ContextMenuSubTrigger - Trigger para abrir submenu
 * 
 * Item que abre um submenu aninhado.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Automaticamente adiciona ícone de chevron.
 * 
 * @example
 * // Submenu trigger
 * <ContextMenuSub>
 *   <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
 *   <ContextMenuSubContent>...</ContextMenuSubContent>
 * </ContextMenuSub>
 * 
 * @example
 * // Com inset (indentação)
 * <ContextMenuSubTrigger inset>
 *   More options
 * </ContextMenuSubTrigger>
 * 
 * @example
 * // Com ícone
 * import { Settings } from "lucide-react";
 * 
 * <ContextMenuSubTrigger>
 *   <Settings />
 *   <span>Settings</span>
 * </ContextMenuSubTrigger>
 */
const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    data-slot="context-menu-sub-trigger"
    data-inset={inset}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName =
  ContextMenuPrimitive.SubTrigger.displayName;

/**
 * ContextMenuSubContent - Conteúdo do submenu
 * 
 * Container do submenu aninhado.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Submenu content
 * <ContextMenuSub>
 *   <ContextMenuSubTrigger>More</ContextMenuSubTrigger>
 *   <ContextMenuSubContent>
 *     <ContextMenuItem>Option 1</ContextMenuItem>
 *     <ContextMenuItem>Option 2</ContextMenuItem>
 *   </ContextMenuSubContent>
 * </ContextMenuSub>
 */
const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    data-slot="context-menu-sub-content"
    className={cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
      className,
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName =
  ContextMenuPrimitive.SubContent.displayName;

/**
 * ContextMenuContent - Conteúdo principal do menu
 * 
 * Container do menu de contexto (popup).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Automaticamente renderizado em Portal.
 * 
 * @example
 * // Content básico
 * <ContextMenuContent>
 *   <ContextMenuItem>Edit</ContextMenuItem>
 *   <ContextMenuItem>Delete</ContextMenuItem>
 * </ContextMenuContent>
 * 
 * @example
 * // Com ref (medir tamanho)
 * const contentRef = useRef<HTMLDivElement>(null);
 * 
 * <ContextMenuContent ref={contentRef}>
 *   <ContextMenuItem>Edit</ContextMenuItem>
 * </ContextMenuContent>
 * 
 * useEffect(() => {
 *   console.log('Menu height:', contentRef.current?.clientHeight);
 * }, []);
 * 
 * @example
 * // Com grupos
 * <ContextMenuContent>
 *   <ContextMenuGroup>
 *     <ContextMenuItem>Edit</ContextMenuItem>
 *     <ContextMenuItem>Copy</ContextMenuItem>
 *   </ContextMenuGroup>
 *   <ContextMenuSeparator />
 *   <ContextMenuGroup>
 *     <ContextMenuItem>Delete</ContextMenuItem>
 *   </ContextMenuGroup>
 * </ContextMenuContent>
 */
const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      data-slot="context-menu-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

/**
 * ContextMenuItem - Item clicável do menu
 * 
 * Item individual no menu de contexto.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Suporta variante destructive para ações perigosas.
 * 
 * @example
 * // Item básico
 * <ContextMenuItem>Edit</ContextMenuItem>
 * 
 * @example
 * // Com ícone
 * import { Pencil } from "lucide-react";
 * 
 * <ContextMenuItem>
 *   <Pencil />
 *   <span>Edit</span>
 * </ContextMenuItem>
 * 
 * @example
 * // Com shortcut
 * <ContextMenuItem>
 *   <Pencil />
 *   <span>Edit</span>
 *   <ContextMenuShortcut>⌘E</ContextMenuShortcut>
 * </ContextMenuItem>
 * 
 * @example
 * // Destructive (deletar, etc)
 * <ContextMenuItem variant="destructive">
 *   <Trash />
 *   <span>Delete</span>
 * </ContextMenuItem>
 * 
 * @example
 * // Com inset (indentação)
 * <ContextMenuItem inset>
 *   Indented item
 * </ContextMenuItem>
 * 
 * @example
 * // Com onSelect
 * <ContextMenuItem onSelect={() => console.log("Clicked!")}>
 *   Click me
 * </ContextMenuItem>
 * 
 * @example
 * // Disabled
 * <ContextMenuItem disabled>
 *   Disabled item
 * </ContextMenuItem>
 * 
 * @example
 * // Com ref (focus programático)
 * const itemRef = useRef<HTMLDivElement>(null);
 * 
 * <ContextMenuItem ref={itemRef}>
 *   Edit
 * </ContextMenuItem>
 * 
 * itemRef.current?.focus();
 */
const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
  }
>(({ className, inset, variant = "default", ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    data-slot="context-menu-item"
    data-inset={inset}
    data-variant={variant}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

/**
 * ContextMenuCheckboxItem - Item com checkbox
 * 
 * Item com checkbox para seleção múltipla.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Automaticamente mostra/esconde check icon baseado no estado.
 * 
 * @example
 * // Checkbox item (uncontrolled)
 * <ContextMenuCheckboxItem>
 *   Show toolbar
 * </ContextMenuCheckboxItem>
 * 
 * @example
 * // Checkbox item (controlled)
 * const [checked, setChecked] = useState(false);
 * 
 * <ContextMenuCheckboxItem 
 *   checked={checked} 
 *   onCheckedChange={setChecked}
 * >
 *   Show toolbar
 * </ContextMenuCheckboxItem>
 * 
 * @example
 * // Múltiplos checkboxes
 * const [showToolbar, setShowToolbar] = useState(true);
 * const [showSidebar, setShowSidebar] = useState(false);
 * 
 * <ContextMenuContent>
 *   <ContextMenuCheckboxItem 
 *     checked={showToolbar} 
 *     onCheckedChange={setShowToolbar}
 *   >
 *     Show toolbar
 *   </ContextMenuCheckboxItem>
 *   <ContextMenuCheckboxItem 
 *     checked={showSidebar} 
 *     onCheckedChange={setShowSidebar}
 *   >
 *     Show sidebar
 *   </ContextMenuCheckboxItem>
 * </ContextMenuContent>
 */
const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    data-slot="context-menu-checkbox-item"
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName;

/**
 * ContextMenuRadioItem - Item com radio button
 * 
 * Item com radio button para seleção única (usado com ContextMenuRadioGroup).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Automaticamente mostra/esconde radio indicator baseado no estado.
 * 
 * @example
 * // Radio items
 * const [value, setValue] = useState("option1");
 * 
 * <ContextMenuRadioGroup value={value} onValueChange={setValue}>
 *   <ContextMenuRadioItem value="option1">
 *     Option 1
 *   </ContextMenuRadioItem>
 *   <ContextMenuRadioItem value="option2">
 *     Option 2
 *   </ContextMenuRadioItem>
 *   <ContextMenuRadioItem value="option3">
 *     Option 3
 *   </ContextMenuRadioItem>
 * </ContextMenuRadioGroup>
 * 
 * @example
 * // Com label group
 * <ContextMenuContent>
 *   <ContextMenuLabel>View mode</ContextMenuLabel>
 *   <ContextMenuRadioGroup value={viewMode} onValueChange={setViewMode}>
 *     <ContextMenuRadioItem value="grid">Grid</ContextMenuRadioItem>
 *     <ContextMenuRadioItem value="list">List</ContextMenuRadioItem>
 *   </ContextMenuRadioGroup>
 * </ContextMenuContent>
 */
const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    data-slot="context-menu-radio-item"
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  >
    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <CircleIcon className="size-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

/**
 * ContextMenuLabel - Label de seção
 * 
 * Label não-interativo para identificar seções do menu.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Label básico
 * <ContextMenuLabel>Actions</ContextMenuLabel>
 * 
 * @example
 * // Com grupo
 * <ContextMenuContent>
 *   <ContextMenuLabel>Edit</ContextMenuLabel>
 *   <ContextMenuGroup>
 *     <ContextMenuItem>Cut</ContextMenuItem>
 *     <ContextMenuItem>Copy</ContextMenuItem>
 *     <ContextMenuItem>Paste</ContextMenuItem>
 *   </ContextMenuGroup>
 *   <ContextMenuSeparator />
 *   <ContextMenuLabel>View</ContextMenuLabel>
 *   <ContextMenuGroup>
 *     <ContextMenuItem>Zoom in</ContextMenuItem>
 *     <ContextMenuItem>Zoom out</ContextMenuItem>
 *   </ContextMenuGroup>
 * </ContextMenuContent>
 * 
 * @example
 * // Com inset (indentação)
 * <ContextMenuLabel inset>
 *   Options
 * </ContextMenuLabel>
 */
const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    data-slot="context-menu-label"
    data-inset={inset}
    className={cn(
      "text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

/**
 * ContextMenuSeparator - Separador visual
 * 
 * Linha horizontal para separar grupos de itens.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Separator entre grupos
 * <ContextMenuContent>
 *   <ContextMenuItem>Edit</ContextMenuItem>
 *   <ContextMenuItem>Copy</ContextMenuItem>
 *   <ContextMenuSeparator />
 *   <ContextMenuItem>Delete</ContextMenuItem>
 * </ContextMenuContent>
 * 
 * @example
 * // Com grupos e labels
 * <ContextMenuContent>
 *   <ContextMenuLabel>Edit</ContextMenuLabel>
 *   <ContextMenuGroup>
 *     <ContextMenuItem>Cut</ContextMenuItem>
 *     <ContextMenuItem>Copy</ContextMenuItem>
 *   </ContextMenuGroup>
 *   <ContextMenuSeparator />
 *   <ContextMenuLabel>View</ContextMenuLabel>
 *   <ContextMenuGroup>
 *     <ContextMenuItem>Zoom</ContextMenuItem>
 *   </ContextMenuGroup>
 * </ContextMenuContent>
 */
const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    data-slot="context-menu-separator"
    className={cn("bg-border -mx-1 my-1 h-px", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

/**
 * ContextMenuShortcut - Atalho de teclado (visual)
 * 
 * Exibe atalho de teclado no lado direito do item.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Apenas visual - não implementa a funcionalidade.
 * 
 * @example
 * // Shortcut básico
 * <ContextMenuItem>
 *   <span>Copy</span>
 *   <ContextMenuShortcut>⌘C</ContextMenuShortcut>
 * </ContextMenuItem>
 * 
 * @example
 * // Com ícone
 * import { Copy } from "lucide-react";
 * 
 * <ContextMenuItem>
 *   <Copy />
 *   <span>Copy</span>
 *   <ContextMenuShortcut>⌘C</ContextMenuShortcut>
 * </ContextMenuItem>
 * 
 * @example
 * // Múltiplos shortcuts
 * <ContextMenuContent>
 *   <ContextMenuItem>
 *     <span>Cut</span>
 *     <ContextMenuShortcut>⌘X</ContextMenuShortcut>
 *   </ContextMenuItem>
 *   <ContextMenuItem>
 *     <span>Copy</span>
 *     <ContextMenuShortcut>⌘C</ContextMenuShortcut>
 *   </ContextMenuItem>
 *   <ContextMenuItem>
 *     <span>Paste</span>
 *     <ContextMenuShortcut>⌘V</ContextMenuShortcut>
 *   </ContextMenuItem>
 * </ContextMenuContent>
 */
const ContextMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="context-menu-shortcut"
    className={cn(
      "text-muted-foreground ml-auto text-xs tracking-widest",
      className,
    )}
    {...props}
  />
));
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
