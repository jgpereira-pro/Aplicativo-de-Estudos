import { Button } from "./ui/button";
import { Home, BookOpen, User } from "lucide-react";
import { BottomNavigation } from "./shared/BottomNavigation";

interface HomeScreenProps {
  onStartDiagnostic: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "biblioteca", label: "Biblioteca", icon: BookOpen },
  { id: "perfil", label: "Perfil", icon: User }
];

export function HomeScreen({ onStartDiagnostic, activeTab, onTabChange }: HomeScreenProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-accent/30 to-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Abstract Illustration */}
        <div className="mb-12 relative w-64 h-64">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Background circles */}
            <circle cx="100" cy="100" r="80" fill="#E6FAF4" opacity="0.6" />
            <circle cx="120" cy="90" r="60" fill="#F5EFE6" opacity="0.8" />
            
            {/* Organic shapes representing focus/flow */}
            <path
              d="M 80 60 Q 100 40, 120 60 T 140 80 Q 130 100, 110 110 T 80 100 Q 70 80, 80 60 Z"
              fill="#20C997"
              opacity="0.3"
            />
            <path
              d="M 90 80 Q 100 70, 110 80 T 120 95 Q 115 105, 100 108 T 90 100 Q 85 90, 90 80 Z"
              fill="#20C997"
              opacity="0.5"
            />
            
            {/* Center focal point */}
            <circle cx="100" cy="90" r="20" fill="#20C997" opacity="0.7" />
            <circle cx="100" cy="90" r="12" fill="#20C997" />
            
            {/* Accent dots */}
            <circle cx="140" cy="120" r="8" fill="#F5EFE6" />
            <circle cx="60" cy="110" r="6" fill="#E6FAF4" />
            <circle cx="130" cy="65" r="5" fill="#20C997" opacity="0.4" />
          </svg>
        </div>
        
        <h1 className="text-center mb-4">
          Encontre seu Foco Digital.
        </h1>
        
        <p className="text-center text-muted-foreground mb-12 max-w-sm">
          Descubra técnicas personalizadas para melhorar sua concentração e produtividade nos estudos.
        </p>
        
        <Button 
          onClick={onStartDiagnostic}
          size="lg"
          className="w-full max-w-xs h-14 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-sm hover:shadow-md bg-primary hover:bg-[#1ab386]"
        >
          Iniciar Diagnóstico Rápido
        </Button>
      </div>

      <BottomNavigation 
        items={navItems}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );
}
