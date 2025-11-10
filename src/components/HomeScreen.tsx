import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Home, BookOpen, User, Clock, ArrowRight } from "lucide-react";
import { BottomNavigation } from "./shared/BottomNavigation";

interface HomeScreenProps {
  onStartDiagnostic: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "foco", label: "Foco", icon: Clock },
  { id: "biblioteca", label: "Biblioteca", icon: BookOpen },
  { id: "perfil", label: "Perfil", icon: User }
];

export function HomeScreen({ onStartDiagnostic, activeTab, onTabChange }: HomeScreenProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-accent/30 to-white">
      <div className="flex-1 overflow-y-auto smooth-scroll">
        <div className="flex flex-col items-center justify-center px-6 py-12 min-h-full">
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
        
        <div className="w-full max-w-sm space-y-4">
          <Button 
            onClick={onStartDiagnostic}
            size="lg"
            className="w-full min-h-[56px] rounded-xl transition-all duration-200 active:scale-[0.97] shadow-sm bg-primary active:bg-[#1ab386] touch-target no-select"
            style={{
              /* Android: GPU acceleration para animações suaves */
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
            }}
          >
            Iniciar Diagnóstico Rápido
          </Button>

          {/* Quick Access Card - Focus Session */}
          <Card 
            className="p-4 rounded-2xl border-primary/20 bg-gradient-to-br from-accent/50 to-white cursor-pointer transition-all duration-200 active:scale-[0.98] active:shadow-md touch-target no-select"
            onClick={() => onTabChange("foco")}
            style={{
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-sm mb-0.5">Sessão de Foco</h4>
                  <p className="text-xs text-muted-foreground">Timer Pomodoro integrado</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
          </Card>
        </div>
        </div>
      </div>

      <BottomNavigation 
        items={navItems}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );
}
