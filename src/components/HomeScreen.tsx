import { Button } from "./ui/button";
import { Home, BookOpen, User } from "lucide-react";

interface HomeScreenProps {
  onStartDiagnostic: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function HomeScreen({ onStartDiagnostic, activeTab, onTabChange }: HomeScreenProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
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

      {/* Bottom Navigation */}
      <nav className="border-t bg-white">
        <div className="flex justify-around items-center py-4">
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
              activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => onTabChange('biblioteca')}
            className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
              activeTab === 'biblioteca' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Biblioteca de Técnicas</span>
          </button>
          
          <button
            onClick={() => onTabChange('perfil')}
            className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
              activeTab === 'perfil' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
