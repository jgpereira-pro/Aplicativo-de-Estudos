import { ArrowLeft, ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  children?: ReactNode;
  variant?: "default" | "minimal";
  action?: ReactNode;
}

export function ScreenHeader({ title, onBack, children, variant = "default", action }: ScreenHeaderProps) {
  const BackIcon = variant === "minimal" ? ChevronLeft : ArrowLeft;
  
  return (
    <div className="bg-white px-6 py-6 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {onBack && (
            <button 
              onClick={onBack} 
              className="text-muted-foreground hover:text-primary transition-colors duration-200 mb-4 p-1 rounded-lg hover:bg-accent"
            >
              {/* Duo-tone back icon */}
              <div className="relative">
                <BackIcon className="w-6 h-6" strokeWidth={2} />
                <BackIcon 
                  className="w-6 h-6 absolute inset-0 opacity-20" 
                  fill="currentColor"
                  strokeWidth={0}
                />
              </div>
            </button>
          )}
          {title && <h1>{title}</h1>}
          {children}
        </div>
        {action && (
          <div className="ml-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
