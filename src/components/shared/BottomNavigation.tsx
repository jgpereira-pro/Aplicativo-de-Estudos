import { LucideIcon } from "lucide-react";
import { useState } from "react";

/**
 * BottomNavigation - Barra de navegação inferior com feedback visual rico
 * 
 * Efeitos visuais implementados:
 * - Touch/Press: escala 0.95x, background accent, ring effect com animação ripple
 * - Estado ativo: background accent/30, barra superior primary, ícone duo-tone, fonte medium
 * - Transições suaves de 200ms com ease-out para todos os estados
 * - Otimizado para dispositivos touch (Android/iOS)
 * - Áreas de toque adequadas (44x44px mínimo)
 */

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavigationProps {
  items: NavItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function BottomNavigation({ items, activeTab, onTabChange }: BottomNavigationProps) {
  const [pressedTab, setPressedTab] = useState<string | null>(null);

  const handlePress = (itemId: string) => {
    setPressedTab(itemId);
    onTabChange(itemId);
    // Reset pressed state after animation
    setTimeout(() => setPressedTab(null), 200);
  };

  return (
    <nav className="border-t border-border bg-white">
      <div className="flex justify-around items-center py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isPressed = pressedTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handlePress(item.id)}
              className={`
                relative flex flex-col items-center gap-1 px-6 py-3 rounded-2xl
                min-w-[64px] min-h-[56px]
                transition-all duration-200 ease-out
                touch-target no-select
                /* Base colors: primary when active, muted when inactive */
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
                /* Touch/Press effects: scale down, accent background - funciona em Android */
                active:scale-95 active:bg-accent
                /* Active tab background */
                ${isActive ? 'bg-accent/30 shadow-inner' : ''}
                /* Pressed effect - visual feedback para Android */
                ${isPressed && !isActive ? 'ring-2 ring-primary/20 ring-offset-2' : ''}
                /* Desktop hover (não afeta Android) */
                @media (hover: hover) {
                  ${!isActive && 'hover:text-primary/70 hover:bg-accent/50 hover:shadow-sm hover:scale-105'}
                }
              `}
              style={{
                /* Android: Forçar GPU acceleration para animações suaves */
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
              }}
            >
              {/* Active indicator - top bar with animation */}
              {isActive && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary shadow-sm animate-in fade-in slide-in-from-top-2 duration-300" />
              )}
              
              {/* Duo-tone icon effect with enhanced styling */}
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-all duration-200 ${
                    isActive ? 'drop-shadow-sm' : ''
                  } ${isPressed && !isActive ? 'scale-90' : ''}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                {isActive && (
                  <Icon 
                    className="w-6 h-6 absolute inset-0 opacity-20 animate-in fade-in duration-300" 
                    fill="currentColor"
                    strokeWidth={0}
                  />
                )}
              </div>
              
              <span className={`text-xs transition-all duration-200 ${
                isActive ? 'font-medium' : 'font-normal'
              }`}>
                {item.label}
              </span>

              {/* Press ripple effect - otimizado para Android */}
              {isPressed && (
                <div 
                  className="absolute inset-0 rounded-2xl bg-primary/10 animate-in fade-in zoom-in-95 duration-200"
                  style={{
                    /* Android: GPU acceleration */
                    transform: 'translateZ(0)',
                    willChange: 'transform, opacity'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
