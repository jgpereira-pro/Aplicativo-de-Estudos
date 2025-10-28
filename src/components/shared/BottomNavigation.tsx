import { LucideIcon } from "lucide-react";

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
  return (
    <nav className="border-t border-border bg-white">
      <div className="flex justify-around items-center py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center gap-1 px-6 py-2 transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              } ${isActive ? 'animate-bounce-subtle' : ''}`}
            >
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 rounded-full bg-primary" />
              )}
              
              {/* Duo-tone icon effect */}
              <div className="relative">
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <Icon 
                    className="w-6 h-6 absolute inset-0 opacity-20" 
                    fill="currentColor"
                    strokeWidth={0}
                  />
                )}
              </div>
              
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
