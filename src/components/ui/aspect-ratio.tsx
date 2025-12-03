"use client";

import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio@1.1.2";

import { cn } from "./utils";

/**
 * AspectRatio - Componente para exibir conteúdo dentro de uma proporção desejada
 * 
 * Componente robusto e flexível baseado no Radix UI AspectRatio.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * // Proporção 16:9 (padrão para vídeos)
 * <AspectRatio ratio={16 / 9}>
 *   <img src="photo.jpg" alt="Photo" className="object-cover w-full h-full" />
 * </AspectRatio>
 * 
 * @example
 * // Proporção 1:1 (quadrado)
 * <AspectRatio ratio={1 / 1}>
 *   <div className="bg-gradient-to-br from-blue-500 to-purple-500" />
 * </AspectRatio>
 * 
 * @example
 * // Proporção 4:3 (clássica)
 * <AspectRatio ratio={4 / 3}>
 *   <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" />
 * </AspectRatio>
 * 
 * @example
 * // Com className customizado
 * <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden border">
 *   <img src="thumbnail.jpg" alt="Thumbnail" className="object-cover w-full h-full" />
 * </AspectRatio>
 * 
 * @example
 * // Com ref para medir tamanho
 * const aspectRef = useRef<HTMLDivElement>(null);
 * 
 * <AspectRatio ratio={16 / 9} ref={aspectRef}>
 *   <img src="photo.jpg" alt="Photo" />
 * </AspectRatio>
 * 
 * useEffect(() => {
 *   console.log('Largura:', aspectRef.current?.clientWidth);
 *   console.log('Altura:', aspectRef.current?.clientHeight);
 * }, []);
 */
const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <AspectRatioPrimitive.Root
      ref={ref}
      data-slot="aspect-ratio"
      className={cn("w-full", className)}
      {...props}
    />
  );
});
AspectRatio.displayName = AspectRatioPrimitive.Root.displayName;

export { AspectRatio };
