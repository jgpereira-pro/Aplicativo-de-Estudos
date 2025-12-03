"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk@1.1.1";
import { SearchIcon } from "lucide-react@0.487.0";

import { cn } from "./utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "./dialog";

/**
 * Command - Componente de command palette / menu de comandos
 * 
 * Container principal do Command Menu (cmdk).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Wrapper do cmdk com estilização customizada.
 * 
 * @example
 * // Command básico
 * <Command>
 *   <CommandInput placeholder="Type a command..." />
 *   <CommandList>
 *     <CommandEmpty>No results found.</CommandEmpty>
 *     <CommandGroup heading="Suggestions">
 *       <CommandItem>Calendar</CommandItem>
 *       <CommandItem>Search Emoji</CommandItem>
 *       <CommandItem>Calculator</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 * 
 * @example
 * // Com ref
 * const commandRef = useRef<HTMLDivElement>(null);
 * 
 * <Command ref={commandRef}>
 *   <CommandInput />
 *   <CommandList>...</CommandList>
 * </Command>
 * 
 * @example
 * // Custom styling
 * <Command className="rounded-lg border shadow-md">
 *   <CommandInput />
 *   <CommandList>...</CommandList>
 * </Command>
 */
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    data-slot="command"
    className={cn(
      "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

/**
 * CommandDialog - Dialog wrapper para Command (Cmd+K style)
 * 
 * Wrapper de Dialog que contém um Command.
 * Suporta ref forwarding para acesso ao Dialog.
 * Ideal para command palettes estilo Cmd+K.
 * 
 * @example
 * // Command Dialog (Cmd+K)
 * const [open, setOpen] = useState(false);
 * 
 * useEffect(() => {
 *   const down = (e: KeyboardEvent) => {
 *     if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
 *       e.preventDefault();
 *       setOpen((open) => !open);
 *     }
 *   };
 *   document.addEventListener("keydown", down);
 *   return () => document.removeEventListener("keydown", down);
 * }, []);
 * 
 * <CommandDialog open={open} onOpenChange={setOpen}>
 *   <CommandInput placeholder="Type a command..." />
 *   <CommandList>
 *     <CommandEmpty>No results found.</CommandEmpty>
 *     <CommandGroup heading="Suggestions">
 *       <CommandItem>Calendar</CommandItem>
 *       <CommandItem>Search Emoji</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </CommandDialog>
 * 
 * @example
 * // Com custom title/description
 * <CommandDialog 
 *   open={open} 
 *   onOpenChange={setOpen}
 *   title="Quick Actions"
 *   description="Search for actions and commands"
 * >
 *   <CommandInput />
 *   <CommandList>...</CommandList>
 * </CommandDialog>
 * 
 * @example
 * // Com ref
 * const dialogRef = useRef<HTMLDivElement>(null);
 * 
 * <CommandDialog ref={dialogRef} open={open} onOpenChange={setOpen}>
 *   <CommandInput />
 *   <CommandList>...</CommandList>
 * </CommandDialog>
 */
const CommandDialog = React.forwardRef<
  React.ElementRef<typeof Dialog>,
  React.ComponentPropsWithoutRef<typeof Dialog> & {
    title?: string;
    description?: string;
  }
>(({ title = "Command Palette", description = "Search for a command to run...", children, ...props }, ref) => (
  <Dialog ref={ref} {...props}>
    <DialogHeader className="sr-only">
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </DialogPortal>
  </Dialog>
));
CommandDialog.displayName = "CommandDialog";

/**
 * CommandInput - Input de busca do Command
 * 
 * Input com ícone de busca para filtrar comandos.
 * Suporta ref forwarding para acesso ao input (para auto-focus).
 * 
 * @example
 * // Input básico
 * <CommandInput placeholder="Type a command..." />
 * 
 * @example
 * // Com auto-focus (CommandDialog)
 * const inputRef = useRef<HTMLInputElement>(null);
 * 
 * <CommandDialog 
 *   open={open} 
 *   onOpenChange={(open) => {
 *     setOpen(open);
 *     if (open) {
 *       // Auto-focus no input quando dialog abre
 *       setTimeout(() => inputRef.current?.focus(), 0);
 *     }
 *   }}
 * >
 *   <CommandInput ref={inputRef} placeholder="Type a command..." />
 *   <CommandList>...</CommandList>
 * </CommandDialog>
 * 
 * @example
 * // Controlled input
 * const [search, setSearch] = useState("");
 * 
 * <CommandInput 
 *   value={search} 
 *   onValueChange={setSearch} 
 *   placeholder="Search..." 
 * />
 */
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    data-slot="command-input-wrapper"
    className="flex h-9 items-center gap-2 border-b px-3"
  >
    <SearchIcon className="size-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      data-slot="command-input"
      className={cn(
        "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

/**
 * CommandList - Lista de itens do Command
 * 
 * Container scrollável para CommandGroups e CommandItems.
 * Suporta ref forwarding para controle de scroll.
 * 
 * @example
 * // Lista básica
 * <CommandList>
 *   <CommandEmpty>No results found.</CommandEmpty>
 *   <CommandGroup heading="Suggestions">
 *     <CommandItem>Calendar</CommandItem>
 *     <CommandItem>Search Emoji</CommandItem>
 *   </CommandGroup>
 * </CommandList>
 * 
 * @example
 * // Com ref (scroll control)
 * const listRef = useRef<HTMLDivElement>(null);
 * 
 * <CommandList ref={listRef}>
 *   <CommandGroup>...</CommandGroup>
 * </CommandList>
 * 
 * // Scroll to top
 * listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
 * 
 * @example
 * // Custom max height
 * <CommandList className="max-h-[500px]">
 *   <CommandGroup>...</CommandGroup>
 * </CommandList>
 */
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    data-slot="command-list"
    className={cn(
      "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
      className,
    )}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

/**
 * CommandEmpty - Mensagem de "sem resultados"
 * 
 * Exibido quando nenhum item corresponde à busca.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Empty state básico
 * <CommandEmpty>No results found.</CommandEmpty>
 * 
 * @example
 * // Com custom content
 * <CommandEmpty>
 *   <div className="flex flex-col items-center gap-2 py-6">
 *     <SearchIcon className="size-8 opacity-50" />
 *     <p>No commands found.</p>
 *     <p className="text-xs text-muted-foreground">
 *       Try searching for something else
 *     </p>
 *   </div>
 * </CommandEmpty>
 * 
 * @example
 * // Com ref
 * const emptyRef = useRef<HTMLDivElement>(null);
 * 
 * <CommandEmpty ref={emptyRef}>
 *   No results found.
 * </CommandEmpty>
 */
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-slot="command-empty"
    className="py-6 text-center text-sm"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

/**
 * CommandGroup - Grupo de comandos com heading
 * 
 * Agrupa CommandItems relacionados com heading opcional.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Group com heading
 * <CommandGroup heading="Suggestions">
 *   <CommandItem>Calendar</CommandItem>
 *   <CommandItem>Search Emoji</CommandItem>
 *   <CommandItem>Calculator</CommandItem>
 * </CommandGroup>
 * 
 * @example
 * // Múltiplos groups
 * <CommandList>
 *   <CommandGroup heading="Navigation">
 *     <CommandItem>Home</CommandItem>
 *     <CommandItem>Settings</CommandItem>
 *   </CommandGroup>
 *   <CommandGroup heading="Actions">
 *     <CommandItem>Create</CommandItem>
 *     <CommandItem>Delete</CommandItem>
 *   </CommandGroup>
 * </CommandList>
 * 
 * @example
 * // Sem heading
 * <CommandGroup>
 *   <CommandItem>Item 1</CommandItem>
 *   <CommandItem>Item 2</CommandItem>
 * </CommandGroup>
 */
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    data-slot="command-group"
    className={cn(
      "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
      className,
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

/**
 * CommandSeparator - Separador visual entre groups
 * 
 * Linha horizontal para separar grupos de comandos.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Separator entre groups
 * <CommandList>
 *   <CommandGroup heading="Navigation">
 *     <CommandItem>Home</CommandItem>
 *   </CommandGroup>
 *   <CommandSeparator />
 *   <CommandGroup heading="Actions">
 *     <CommandItem>Create</CommandItem>
 *   </CommandGroup>
 * </CommandList>
 * 
 * @example
 * // Custom styling
 * <CommandSeparator className="my-2" />
 */
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    data-slot="command-separator"
    className={cn("bg-border -mx-1 h-px", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

/**
 * CommandItem - Item individual do Command
 * 
 * Item clicável no menu de comandos.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Automaticamente gerencia seleção com teclado.
 * 
 * @example
 * // Item básico
 * <CommandItem>Calendar</CommandItem>
 * 
 * @example
 * // Com ícone
 * import { Calendar } from "lucide-react";
 * 
 * <CommandItem>
 *   <Calendar />
 *   <span>Calendar</span>
 * </CommandItem>
 * 
 * @example
 * // Com shortcut
 * <CommandItem>
 *   <Calendar />
 *   <span>Calendar</span>
 *   <CommandShortcut>⌘K</CommandShortcut>
 * </CommandItem>
 * 
 * @example
 * // Com onSelect
 * <CommandItem onSelect={() => console.log("Selected!")}>
 *   Calendar
 * </CommandItem>
 * 
 * @example
 * // Disabled
 * <CommandItem disabled>
 *   Disabled item
 * </CommandItem>
 * 
 * @example
 * // Com ref (focus programático)
 * const itemRef = useRef<HTMLDivElement>(null);
 * 
 * <CommandItem ref={itemRef}>
 *   Calendar
 * </CommandItem>
 * 
 * // Focus no item
 * itemRef.current?.focus();
 */
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    data-slot="command-item"
    className={cn(
      "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

/**
 * CommandShortcut - Atalho de teclado (visual)
 * 
 * Exibe atalho de teclado no lado direito do CommandItem.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Apenas visual - não implementa a funcionalidade.
 * 
 * @example
 * // Shortcut básico
 * <CommandItem>
 *   <span>Copy</span>
 *   <CommandShortcut>⌘C</CommandShortcut>
 * </CommandItem>
 * 
 * @example
 * // Com ícone
 * import { Copy } from "lucide-react";
 * 
 * <CommandItem>
 *   <Copy />
 *   <span>Copy</span>
 *   <CommandShortcut>⌘C</CommandShortcut>
 * </CommandItem>
 * 
 * @example
 * // Custom styling
 * <CommandShortcut className="text-xs opacity-60">
 *   Ctrl+K
 * </CommandShortcut>
 */
const CommandShortcut = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="command-shortcut"
    className={cn(
      "text-muted-foreground ml-auto text-xs tracking-widest",
      className,
    )}
    {...props}
  />
));
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};