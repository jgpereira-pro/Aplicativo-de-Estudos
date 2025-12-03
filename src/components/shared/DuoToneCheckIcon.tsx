import { Check } from "lucide-react";
import { DuoToneIcon } from "./DuoToneIcon";

/**
 * DuoToneCheckIcon - Ícone de check com efeito duo-tone
 * 
 * Atalho conveniente para <DuoToneIcon icon={Check} />.
 * Mantido para compatibilidade com código existente.
 * 
 * Usage:
 * ```tsx
 * <DuoToneCheckIcon />
 * <DuoToneCheckIcon className="w-6 h-6" />
 * ```
 */

interface DuoToneCheckIconProps {
  className?: string;
  strokeWidth?: number;
  overlayOpacity?: string;
}

export function DuoToneCheckIcon({ 
  className = "w-5 h-5",
  strokeWidth = 2.5,
  overlayOpacity = "opacity-20"
}: DuoToneCheckIconProps) {
  return (
    <DuoToneIcon 
      icon={Check}
      className={className}
      strokeWidth={strokeWidth}
      overlayOpacity={overlayOpacity}
    />
  );
}
