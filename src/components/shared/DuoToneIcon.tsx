import { LucideIcon } from "lucide-react";

/**
 * DuoToneIcon - Wrapper genérico para ícones com efeito duo-tone
 * 
 * Renderiza qualquer ícone lucide com efeito duo-tone (stroke + fill overlay).
 * Pode ser usado para criar hierarquia visual e destaque em ícones.
 * 
 * Usage:
 * ```tsx
 * import { Check, ArrowLeft, Star } from "lucide-react";
 * 
 * <DuoToneIcon icon={Check} />
 * <DuoToneIcon icon={ArrowLeft} className="w-6 h-6" />
 * <DuoToneIcon icon={Star} strokeWidth={2.5} overlayOpacity="opacity-30" />
 * ```
 */

interface DuoToneIconProps {
  icon: LucideIcon;
  className?: string;
  strokeWidth?: number;
  overlayOpacity?: string;
}

export function DuoToneIcon({ 
  icon: Icon,
  className = "w-5 h-5",
  strokeWidth = 2,
  overlayOpacity = "opacity-20"
}: DuoToneIconProps) {
  return (
    <div className="relative shrink-0">
      {/* Ícone principal (stroke) */}
      <Icon 
        className={className} 
        strokeWidth={strokeWidth} 
      />
      
      {/* Ícone overlay (fill) */}
      <Icon 
        className={`${className} absolute inset-0 ${overlayOpacity}`}
        fill="currentColor"
        strokeWidth={0}
      />
    </div>
  );
}
