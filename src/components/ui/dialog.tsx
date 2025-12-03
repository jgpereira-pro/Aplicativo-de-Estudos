"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog@1.1.6";
import { XIcon } from "lucide-react@0.487.0";

import { cn } from "./utils";

/**
 * Dialog - Container raiz do dialog modal
 * 
 * Wrapper do Radix UI Dialog Root.
 * Suporta ref forwarding para acesso ao componente.
 * Gerencia o estado e coordena todos os sub-componentes.
 * 
 * @example
 * // Dialog básico
 * <Dialog>
 *   <DialogTrigger>Open Dialog</DialogTrigger>
 *   <DialogPortal>
 *     <DialogOverlay />
 *     <DialogContent>
 *       <DialogHeader>
 *         <DialogTitle>Dialog Title</DialogTitle>
 *         <DialogDescription>Dialog description</DialogDescription>
 *       </DialogHeader>
 *     </DialogContent>
 *   </DialogPortal>
 * </Dialog>
 * 
 * @example
 * // Controlado
 * const [open, setOpen] = useState(false);
 * 
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogTrigger>Open</DialogTrigger>
 *   <DialogPortal>
 *     <DialogOverlay />
 *     <DialogContent>...</DialogContent>
 *   </DialogPortal>
 * </Dialog>
 */
const Dialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
>((props, ref) => <DialogPrimitive.Root ref={ref} data-slot="dialog" {...props} />);
Dialog.displayName = DialogPrimitive.Root.displayName;

/**
 * DialogTrigger - Botão que abre o dialog
 * 
 * Wrapper que detecta clique e abre o dialog.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Trigger básico
 * <DialogTrigger>Open Dialog</DialogTrigger>
 * 
 * @example
 * // Com custom element (Button)
 * import { Button } from "./button";
 * 
 * <DialogTrigger asChild>
 *   <Button variant="outline">Open Dialog</Button>
 * </DialogTrigger>
 * 
 * @example
 * // Com ref
 * const triggerRef = useRef<HTMLButtonElement>(null);
 * 
 * <DialogTrigger ref={triggerRef}>
 *   Open Dialog
 * </DialogTrigger>
 * 
 * // Focus no trigger
 * triggerRef.current?.focus();
 */
const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>((props, ref) => (
  <DialogPrimitive.Trigger ref={ref} data-slot="dialog-trigger" {...props} />
));
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

/**
 * DialogPortal - Portal para renderizar dialog fora da hierarquia
 * 
 * Renderiza o dialog em um portal (fora do DOM tree).
 * Suporta ref forwarding para acesso ao componente.
 * 
 * @example
 * // Portal padrão (body)
 * <DialogPortal>
 *   <DialogOverlay />
 *   <DialogContent>...</DialogContent>
 * </DialogPortal>
 * 
 * @example
 * // Portal customizado (container específico)
 * const containerRef = useRef<HTMLDivElement>(null);
 * 
 * <DialogPortal container={containerRef.current}>
 *   <DialogOverlay />
 *   <DialogContent>...</DialogContent>
 * </DialogPortal>
 */
const DialogPortal = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Portal>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>
>((props, ref) => (
  <DialogPrimitive.Portal ref={ref} data-slot="dialog-portal" {...props} />
));
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

/**
 * DialogClose - Botão para fechar o dialog
 * 
 * Botão que fecha o dialog quando clicado.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Close básico (botão texto)
 * <DialogClose>Cancel</DialogClose>
 * 
 * @example
 * // Com custom element (Button)
 * import { Button } from "./button";
 * 
 * <DialogClose asChild>
 *   <Button variant="outline">Cancel</Button>
 * </DialogClose>
 * 
 * @example
 * // Botão X no canto (common pattern)
 * <DialogContent>
 *   <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
 *     <XIcon className="size-4" />
 *     <span className="sr-only">Close</span>
 *   </DialogClose>
 *   <DialogHeader>
 *     <DialogTitle>Title</DialogTitle>
 *   </DialogHeader>
 * </DialogContent>
 * 
 * @example
 * // No footer (common pattern)
 * <DialogFooter>
 *   <DialogClose asChild>
 *     <Button variant="outline">Cancel</Button>
 *   </DialogClose>
 *   <Button onClick={handleSave}>Save</Button>
 * </DialogFooter>
 */
const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>((props, ref) => (
  <DialogPrimitive.Close ref={ref} data-slot="dialog-close" {...props} />
));
DialogClose.displayName = DialogPrimitive.Close.displayName;

/**
 * DialogOverlay - Backdrop escuro atrás do dialog
 * 
 * Overlay semi-transparente que escurece o fundo.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Overlay padrão (bg-black/50)
 * <DialogPortal>
 *   <DialogOverlay />
 *   <DialogContent>...</DialogContent>
 * </DialogPortal>
 * 
 * @example
 * // Overlay customizado (mais escuro)
 * <DialogOverlay className="bg-black/80" />
 * 
 * @example
 * // Sem overlay (inline dialog)
 * <DialogPortal>
 *   {/* Sem DialogOverlay - dialog sem backdrop */}
 *   <DialogContent>...</DialogContent>
 * </DialogPortal>
 * 
 * @example
 * // Com ref
 * const overlayRef = useRef<HTMLDivElement>(null);
 * 
 * <DialogOverlay ref={overlayRef} />
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * DialogContent - Conteúdo principal do dialog
 * 
 * Container do dialog modal (card centralizado).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * IMPORTANTE: Você deve compor DialogPortal e DialogOverlay manualmente.
 * Isso garante flexibilidade total (ex: dialog inline sem overlay).
 * 
 * @example
 * // Dialog padrão (com Portal e Overlay)
 * <Dialog>
 *   <DialogTrigger>Open</DialogTrigger>
 *   <DialogPortal>
 *     <DialogOverlay />
 *     <DialogContent>
 *       <DialogHeader>
 *         <DialogTitle>Title</DialogTitle>
 *         <DialogDescription>Description</DialogDescription>
 *       </DialogHeader>
 *       <div>Content here</div>
 *       <DialogFooter>
 *         <DialogClose asChild>
 *           <Button variant="outline">Cancel</Button>
 *         </DialogClose>
 *         <Button>Save</Button>
 *       </DialogFooter>
 *     </DialogContent>
 *   </DialogPortal>
 * </Dialog>
 * 
 * @example
 * // Dialog com botão X no canto
 * <DialogContent>
 *   <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
 *     <XIcon className="size-4" />
 *     <span className="sr-only">Close</span>
 *   </DialogClose>
 *   <DialogHeader>
 *     <DialogTitle>Title</DialogTitle>
 *   </DialogHeader>
 * </DialogContent>
 * 
 * @example
 * // Dialog inline (sem Portal/Overlay)
 * <Dialog>
 *   <DialogTrigger>Open</DialogTrigger>
 *   <DialogContent className="relative">
 *     {/* Dialog inline - não renderizado em Portal */}
 *     <DialogHeader>
 *       <DialogTitle>Inline Dialog</DialogTitle>
 *     </DialogHeader>
 *   </DialogContent>
 * </Dialog>
 * 
 * @example
 * // Com ref (medir tamanho)
 * const contentRef = useRef<HTMLDivElement>(null);
 * 
 * <DialogContent ref={contentRef}>
 *   <DialogHeader>
 *     <DialogTitle>Title</DialogTitle>
 *   </DialogHeader>
 * </DialogContent>
 * 
 * useEffect(() => {
 *   console.log('Dialog height:', contentRef.current?.clientHeight);
 * }, []);
 * 
 * @example
 * // Custom size
 * <DialogContent className="max-w-4xl">
 *   {/* Large dialog */}
 * </DialogContent>
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    data-slot="dialog-content"
    className={cn(
      "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
      className,
    )}
    {...props}
  />
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * DialogHeader - Cabeçalho do dialog (title + description)
 * 
 * Container para DialogTitle e DialogDescription.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Header básico
 * <DialogHeader>
 *   <DialogTitle>Dialog Title</DialogTitle>
 *   <DialogDescription>Dialog description</DialogDescription>
 * </DialogHeader>
 * 
 * @example
 * // Sem description
 * <DialogHeader>
 *   <DialogTitle>Dialog Title</DialogTitle>
 * </DialogHeader>
 * 
 * @example
 * // Custom alignment
 * <DialogHeader className="text-center">
 *   <DialogTitle>Centered Title</DialogTitle>
 * </DialogHeader>
 */
const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="dialog-header"
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

/**
 * DialogFooter - Rodapé do dialog (botões de ação)
 * 
 * Container para botões de ação (Cancel, Save, etc).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Footer com Cancel e Save
 * <DialogFooter>
 *   <DialogClose asChild>
 *     <Button variant="outline">Cancel</Button>
 *   </DialogClose>
 *   <Button onClick={handleSave}>Save</Button>
 * </DialogFooter>
 * 
 * @example
 * // Footer com apenas Close
 * <DialogFooter>
 *   <DialogClose asChild>
 *     <Button>OK</Button>
 *   </DialogClose>
 * </DialogFooter>
 * 
 * @example
 * // Custom alignment
 * <DialogFooter className="justify-start">
 *   <Button>Action</Button>
 * </DialogFooter>
 */
const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="dialog-footer"
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

/**
 * DialogTitle - Título do dialog
 * 
 * Título principal do dialog.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * IMPORTANTE: Obrigatório para acessibilidade (Radix exige).
 * 
 * @example
 * // Title básico
 * <DialogTitle>Dialog Title</DialogTitle>
 * 
 * @example
 * // Com custom styling
 * <DialogTitle className="text-2xl">
 *   Large Title
 * </DialogTitle>
 * 
 * @example
 * // Dentro de Header
 * <DialogHeader>
 *   <DialogTitle>Title</DialogTitle>
 *   <DialogDescription>Description</DialogDescription>
 * </DialogHeader>
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn("text-lg leading-none font-semibold", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * DialogDescription - Descrição do dialog
 * 
 * Descrição/subtítulo do dialog.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Description básico
 * <DialogDescription>
 *   This is a description of the dialog.
 * </DialogDescription>
 * 
 * @example
 * // Dentro de Header
 * <DialogHeader>
 *   <DialogTitle>Delete Account</DialogTitle>
 *   <DialogDescription>
 *     This action cannot be undone. This will permanently delete your account.
 *   </DialogDescription>
 * </DialogHeader>
 * 
 * @example
 * // Com custom styling
 * <DialogDescription className="text-destructive">
 *   Warning: Destructive action
 * </DialogDescription>
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
