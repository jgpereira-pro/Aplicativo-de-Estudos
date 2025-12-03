"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar@1.1.3";

import { cn } from "./utils";

/**
 * Avatar - Componente raiz do avatar
 * 
 * Container circular para imagem de avatar com fallback automático.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Avatar básico
 * <Avatar>
 *   <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
 *   <AvatarFallback>CN</AvatarFallback>
 * </Avatar>
 * 
 * @example
 * // Avatar customizado
 * <Avatar className="size-16">
 *   <AvatarImage src="avatar.jpg" alt="User" />
 *   <AvatarFallback>AB</AvatarFallback>
 * </Avatar>
 * 
 * @example
 * // Com ref para medir tamanho
 * const avatarRef = useRef<HTMLSpanElement>(null);
 * 
 * <Avatar ref={avatarRef}>
 *   <AvatarImage src="avatar.jpg" />
 *   <AvatarFallback>AB</AvatarFallback>
 * </Avatar>
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

/**
 * AvatarImage - Imagem do avatar
 * 
 * Exibe a imagem do avatar. Se a imagem falhar ao carregar,
 * o AvatarFallback será exibido automaticamente.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
 * 
 * @example
 * // Com ref para detectar quando a imagem carrega
 * const imageRef = useRef<HTMLImageElement>(null);
 * 
 * <AvatarImage 
 *   ref={imageRef}
 *   src="avatar.jpg" 
 *   alt="User"
 *   onLoadingStatusChange={(status) => {
 *     console.log('Status:', status); // "loading" | "loaded" | "error"
 *   }}
 * />
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/**
 * AvatarFallback - Fallback do avatar
 * 
 * Exibido quando a imagem não carrega ou enquanto está carregando.
 * Normalmente contém iniciais do usuário.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <AvatarFallback>CN</AvatarFallback>
 * 
 * @example
 * // Com ícone
 * <AvatarFallback>
 *   <UserIcon className="size-4" />
 * </AvatarFallback>
 * 
 * @example
 * // Customizado
 * <AvatarFallback className="bg-blue-500 text-white">
 *   AB
 * </AvatarFallback>
 * 
 * @example
 * // Com ref para medir
 * const fallbackRef = useRef<HTMLSpanElement>(null);
 * 
 * <AvatarFallback ref={fallbackRef}>CN</AvatarFallback>
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
