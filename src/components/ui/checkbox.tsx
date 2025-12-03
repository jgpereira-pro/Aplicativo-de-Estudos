"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox@1.1.4";
import { CheckIcon } from "lucide-react@0.487.0";

import { cn } from "./utils";

/**
 * Checkbox - Componente de checkbox acessível
 * 
 * Wrapper do Radix UI Checkbox com estilização customizada.
 * Suporta ref forwarding para integração com formulários (react-hook-form).
 * Totalmente acessível com suporte a teclado e screen readers.
 * 
 * @example
 * // Checkbox básico
 * <Checkbox />
 * 
 * @example
 * // Checkbox controlado
 * const [checked, setChecked] = useState(false);
 * 
 * <Checkbox 
 *   checked={checked} 
 *   onCheckedChange={setChecked} 
 * />
 * 
 * @example
 * // Com label
 * <div className="flex items-center space-x-2">
 *   <Checkbox id="terms" />
 *   <label 
 *     htmlFor="terms" 
 *     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
 *   >
 *     Accept terms and conditions
 *   </label>
 * </div>
 * 
 * @example
 * // Com react-hook-form
 * import { useForm } from "react-hook-form@7.55.0";
 * 
 * function FormExample() {
 *   const { register, handleSubmit } = useForm();
 *   
 *   const onSubmit = (data) => {
 *     console.log(data);  // { terms: true }
 *   };
 *   
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <div className="flex items-center space-x-2">
 *         <Checkbox id="terms" {...register("terms")} />
 *         <label htmlFor="terms">I agree to the terms</label>
 *       </div>
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 * 
 * @example
 * // Com react-hook-form (controlled)
 * import { useForm, Controller } from "react-hook-form@7.55.0";
 * 
 * function ControlledFormExample() {
 *   const { control, handleSubmit } = useForm({
 *     defaultValues: { terms: false }
 *   });
 *   
 *   return (
 *     <form onSubmit={handleSubmit(console.log)}>
 *       <Controller
 *         name="terms"
 *         control={control}
 *         render={({ field }) => (
 *           <Checkbox 
 *             checked={field.value} 
 *             onCheckedChange={field.onChange}
 *           />
 *         )}
 *       />
 *     </form>
 *   );
 * }
 * 
 * @example
 * // Com validação (required)
 * import { useForm } from "react-hook-form@7.55.0";
 * 
 * function ValidatedFormExample() {
 *   const { register, handleSubmit, formState: { errors } } = useForm();
 *   
 *   return (
 *     <form onSubmit={handleSubmit(console.log)}>
 *       <div className="space-y-2">
 *         <div className="flex items-center space-x-2">
 *           <Checkbox 
 *             id="terms" 
 *             {...register("terms", { required: true })}
 *             aria-invalid={errors.terms ? "true" : "false"}
 *           />
 *           <label htmlFor="terms">Accept terms*</label>
 *         </div>
 *         {errors.terms && (
 *           <p className="text-sm text-destructive">
 *             You must accept the terms
 *           </p>
 *         )}
 *       </div>
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 * 
 * @example
 * // Com ref (programmatic control)
 * const checkboxRef = useRef<HTMLButtonElement>(null);
 * 
 * <Checkbox ref={checkboxRef} />
 * 
 * // Focus programaticamente
 * checkboxRef.current?.focus();
 * 
 * @example
 * // Disabled
 * <Checkbox disabled />
 * 
 * @example
 * // Indeterminate state (tri-state)
 * <Checkbox checked="indeterminate" />
 * 
 * @example
 * // Custom styling
 * <Checkbox className="size-6" />
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      "peer border bg-input-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className="flex items-center justify-center text-current transition-none"
    >
      <CheckIcon className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
