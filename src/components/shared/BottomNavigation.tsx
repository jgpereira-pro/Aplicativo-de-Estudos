import { LucideIcon } from "lucide-react";
import { useState } from "react";

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
                relative flex flex-col items-center gap-1 px-6 py-2 rounded-2xl
                transition-all duration-200 ease-out
                /* Base colors: primary when active, muted when inactive */
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
                /* Hover effects: color change, subtle background, slight scale up */
                ${!isActive && 'hover:text-primary/70 hover:bg-accent/50 hover:shadow-sm'}
                hover:scale-105
                /* Active/Press effects: scale down, accent background */
                active:scale-95 active:bg-accent
                /* Active tab background */
                ${isActive ? 'bg-accent/30 shadow-inner' : ''}
                /* Pressed effect */
                ${isPressed && !isActive ? 'ring-2 ring-primary/20 ring-offset-2' : ''}
              `}
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

              {/* Hover glow effect for inactive tabs */}
              {!isActive && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/8 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              )}

              {/* Press ripple effect */}
              {isPressed && (
                <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-in fade-in zoom-in-95 duration-200" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
