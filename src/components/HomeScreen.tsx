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
  { id: "biblioteca", label: "Biblioteca de Técnicas", icon: BookOpen },
  { id: "perfil", label: "Perfil", icon: User }
];

export function HomeScreen({ onStartDiagnostic, activeTab, onTabChange }: HomeScreenProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-center mb-12">
          Encontre seu Foco Digital.
        </h1>
        
        <Button 
          onClick={onStartDiagnostic}
          size="lg"
          className="w-full max-w-xs h-14"
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
