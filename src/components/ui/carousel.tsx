"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react@8.6.0";
import { ArrowLeft, ArrowRight } from "lucide-react@0.487.0";

import { cn } from "./utils";
import { Button } from "./button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

/**
 * Carousel - Componente de carrossel (container principal)
 * 
 * Container raiz do carrossel baseado em Embla Carousel.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * Gerencia navegação (prev/next), keyboard events e estado do carrossel.
 * 
 * @example
 * // Carrossel básico
 * <Carousel>
 *   <CarouselContent>
 *     <CarouselItem>Slide 1</CarouselItem>
 *     <CarouselItem>Slide 2</CarouselItem>
 *     <CarouselItem>Slide 3</CarouselItem>
 *   </CarouselContent>
 *   <CarouselPrevious />
 *   <CarouselNext />
 * </Carousel>
 * 
 * @example
 * // Com opções (loop, autoplay)
 * <Carousel opts={{ loop: true }}>
 *   <CarouselContent>
 *     <CarouselItem>Slide 1</CarouselItem>
 *     <CarouselItem>Slide 2</CarouselItem>
 *   </CarouselContent>
 * </Carousel>
 * 
 * @example
 * // Com ref e API
 * const carouselRef = useRef<HTMLDivElement>(null);
 * const [api, setApi] = useState<CarouselApi>();
 * 
 * <Carousel ref={carouselRef} setApi={setApi}>
 *   <CarouselContent>...</CarouselContent>
 * </Carousel>
 * 
 * // Controle programático
 * api?.scrollTo(2);
 * 
 * @example
 * // Vertical
 * <Carousel orientation="vertical">
 *   <CarouselContent>...</CarouselContent>
 * </Carousel>
 */
const Carousel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          data-slot="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

/**
 * CarouselContent - Container dos slides do carrossel
 * 
 * Wrapper que contém os CarouselItems.
 * Suporta ref forwarding para acesso ao elemento DOM interno.
 * 
 * @example
 * <CarouselContent>
 *   <CarouselItem>Slide 1</CarouselItem>
 *   <CarouselItem>Slide 2</CarouselItem>
 *   <CarouselItem>Slide 3</CarouselItem>
 * </CarouselContent>
 * 
 * @example
 * // Com ref
 * const contentRef = useRef<HTMLDivElement>(null);
 * 
 * <CarouselContent ref={contentRef}>
 *   <CarouselItem>Slide 1</CarouselItem>
 * </CarouselContent>
 */
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

/**
 * CarouselItem - Item individual do carrossel (slide)
 * 
 * Representa um slide no carrossel.
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <CarouselItem>
 *   <Card>
 *     <CardContent>Slide content</CardContent>
 *   </Card>
 * </CarouselItem>
 * 
 * @example
 * // Com ref
 * const itemRef = useRef<HTMLDivElement>(null);
 * 
 * <CarouselItem ref={itemRef}>
 *   <img src="..." alt="..." />
 * </CarouselItem>
 * 
 * @example
 * // Múltiplos slides por view (basis)
 * <CarouselItem className="basis-1/2">Slide 1</CarouselItem>
 * <CarouselItem className="basis-1/2">Slide 2</CarouselItem>
 */
const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

/**
 * CarouselPrevious - Botão para navegar ao slide anterior
 * 
 * Botão de navegação que avança para o slide anterior.
 * Automaticamente desabilitado quando não há mais slides anteriores (se loop: false).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <CarouselPrevious />
 * 
 * @example
 * // Customizado
 * <CarouselPrevious className="left-0" variant="ghost" />
 * 
 * @example
 * // Com ref
 * const prevRef = useRef<HTMLButtonElement>(null);
 * 
 * <CarouselPrevious ref={prevRef} />
 * 
 * // Focar programaticamente
 * prevRef.current?.focus();
 */
const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

/**
 * CarouselNext - Botão para navegar ao próximo slide
 * 
 * Botão de navegação que avança para o próximo slide.
 * Automaticamente desabilitado quando não há mais slides (se loop: false).
 * Suporta ref forwarding para acesso ao elemento DOM.
 * 
 * @example
 * <CarouselNext />
 * 
 * @example
 * // Customizado
 * <CarouselNext className="right-0" variant="ghost" />
 * 
 * @example
 * // Com ref
 * const nextRef = useRef<HTMLButtonElement>(null);
 * 
 * <CarouselNext ref={nextRef} />
 * 
 * // Focar programaticamente
 * nextRef.current?.focus();
 */
const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
