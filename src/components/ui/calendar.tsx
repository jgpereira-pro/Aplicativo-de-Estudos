"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react@0.487.0";
import { DayPicker, type DayPickerProps } from "react-day-picker@8.10.1";

import { cn } from "./utils";
import { buttonVariants } from "./button";

/**
 * Componentes customizados para os ícones do Calendar
 * Definidos em nível de módulo para evitar recriação a cada render
 */
const calendarComponents: DayPickerProps["components"] = {
  IconLeft: ({ className, ...props }) => (
    <ChevronLeft className={cn("size-4", className)} {...props} />
  ),
  IconRight: ({ className, ...props }) => (
    <ChevronRight className={cn("size-4", className)} {...props} />
  ),
};

/**
 * Classes base do Calendar
 * Definidas em nível de módulo para evitar recriação a cada render
 */
const baseCalendarClassNames: Partial<DayPickerProps["classNames"]> = {
  months: "flex flex-col sm:flex-row gap-2",
  month: "flex flex-col gap-4",
  caption: "flex justify-center pt-1 relative items-center w-full",
  caption_label: "text-sm font-medium",
  nav: "flex items-center gap-1",
  nav_button: cn(
    buttonVariants({ variant: "outline" }),
    "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
  ),
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-x-1",
  head_row: "flex",
  head_cell:
    "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
  row: "flex w-full mt-2",
  day: cn(
    buttonVariants({ variant: "ghost" }),
    "size-8 p-0 font-normal aria-selected:opacity-100",
  ),
  day_range_start:
    "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
  day_range_end:
    "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
  day_selected:
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
  day_today: "bg-accent text-accent-foreground",
  day_outside:
    "day-outside text-muted-foreground aria-selected:text-muted-foreground",
  day_disabled: "text-muted-foreground opacity-50",
  day_range_middle:
    "aria-selected:bg-accent aria-selected:text-accent-foreground",
  day_hidden: "invisible",
};

/**
 * Helper: Gera a className da célula baseado no modo (single/range)
 * Esta é a única parte dinâmica que depende de props
 */
function getCellClassName(mode: DayPickerProps["mode"]): string {
  return cn(
    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
    mode === "range"
      ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
      : "[&:has([aria-selected])]:rounded-md",
  );
}

/**
 * Helper: Mescla as classNames base com as customizadas
 * Mantido em função para encapsular a lógica de merge
 */
function getCalendarClassNames(
  mode: DayPickerProps["mode"],
  customClassNames?: DayPickerProps["classNames"],
): DayPickerProps["classNames"] {
  return {
    ...baseCalendarClassNames,
    cell: getCellClassName(mode),
    ...customClassNames,
  };
}

export type CalendarProps = React.ComponentPropsWithoutRef<typeof DayPicker>;

/**
 * Calendar - Componente de seleção de data
 * 
 * Wrapper robusto e performático sobre react-day-picker.
 * Suporta ref forwarding para controle programático do calendário.
 * 
 * Performance:
 * - classNames e components são definidos em nível de módulo (evita recriação)
 * - Apenas a className da célula é computada dinamicamente (depende do mode)
 * 
 * @example
 * // Seleção de data única
 * const [date, setDate] = useState<Date>();
 * 
 * <Calendar
 *   mode="single"
 *   selected={date}
 *   onSelect={setDate}
 * />
 * 
 * @example
 * // Seleção de range de datas
 * const [dateRange, setDateRange] = useState<DateRange>();
 * 
 * <Calendar
 *   mode="range"
 *   selected={dateRange}
 *   onSelect={setDateRange}
 * />
 * 
 * @example
 * // Com ref para controle programático
 * const calendarRef = useRef<HTMLDivElement>(null);
 * 
 * <Calendar
 *   ref={calendarRef}
 *   mode="single"
 *   selected={date}
 *   onSelect={setDate}
 * />
 * 
 * // Focar no calendário
 * calendarRef.current?.focus();
 * 
 * @example
 * // Data inicial e desabilitação
 * <Calendar
 *   mode="single"
 *   selected={date}
 *   onSelect={setDate}
 *   defaultMonth={new Date(2024, 0)}
 *   disabled={(date) => date < new Date()}
 * />
 * 
 * @example
 * // Customização de classNames
 * <Calendar
 *   mode="single"
 *   selected={date}
 *   onSelect={setDate}
 *   classNames={{
 *     day_selected: "bg-blue-500 text-white",
 *   }}
 * />
 */
const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, classNames, showOutsideDays = true, ...props }, ref) => {
    return (
      <DayPicker
        ref={ref}
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={getCalendarClassNames(props.mode, classNames)}
        components={calendarComponents}
        {...props}
      />
    );
  },
);
Calendar.displayName = "Calendar";

export { Calendar };
