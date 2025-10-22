import { ArrowLeft, ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  children?: ReactNode;
  variant?: "default" | "minimal";
}

export function ScreenHeader({ title, onBack, children, variant = "default" }: ScreenHeaderProps) {
  const BackIcon = variant === "minimal" ? ChevronLeft : ArrowLeft;
  
  return (
    <div className="bg-white px-6 py-6 border-b">
      {onBack && (
        <button onClick={onBack} className="text-muted-foreground mb-4">
          <BackIcon className="w-6 h-6" />
        </button>
      )}
      {title && <h1>{title}</h1>}
      {children}
    </div>
  );
}
