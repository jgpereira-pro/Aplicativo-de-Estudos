import { LucideIcon, Grid3x3, Clock, Layers, Calendar } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Card } from "../ui/card";
import { motion, AnimatePresence } from "motion/react";

/**
 * BottomNavigation - Barra de navegação inferior simplificada (4 itens)
 * 
 * Redesign simplificado:
 * - 4 itens: Home, Biblioteca, Ferramentas (menu), Perfil
 * - Estado ativo: apenas cor (ícone duo-tone + texto em primary)
 * - Estado inativo: ícone outline + texto muted
 * - Sem pílula de fundo, sem linha superior
 * - Menu de ferramentas central para Foco, Decks e Planner
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
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);

  const tools = [
    { 
      id: "foco", 
      label: "Sessão de Foco", 
      icon: Clock,
      description: "Timer Pomodoro e Deep Work",
      gradient: "from-[#E6FAF4] to-white"
    },
    { 
      id: "decks", 
      label: "Decks", 
      icon: Layers,
      description: "Flashcards e revisão",
      gradient: "from-[#E6FAF4] to-white"
    },
    { 
      id: "planner", 
      label: "Planner", 
      icon: Calendar,
      description: "Planejador semanal",
      gradient: "from-[#E6FAF4] to-white"
    },
  ];

  const handleToolSelect = (toolId: string) => {
    setToolsMenuOpen(false);
    onTabChange(toolId);
  };

  return (
    <nav className="border-t border-border bg-white">
      <div className="flex justify-around items-center py-2 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          // Special handling for tools menu item
          if (item.id === "tools") {
            return (
              <Sheet key={item.id} open={toolsMenuOpen} onOpenChange={setToolsMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className={`
                      relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                      min-w-[64px] min-h-[44px]
                      transition-all duration-200 ease-out
                      touch-target no-select
                      ${isActive ? 'text-primary' : 'text-[#495057]/60'}
                      active:scale-95
                    `}
                    style={{
                      transform: 'translateZ(0)',
                      WebkitTransform: 'translateZ(0)',
                    }}
                  >
                    {/* Icon with duo-tone effect when active */}
                    <div className="relative">
                      <Icon 
                        className="w-6 h-6 transition-all duration-200" 
                        strokeWidth={isActive ? 2.5 : 2} 
                      />
                      {isActive && (
                        <Icon 
                          className="w-6 h-6 absolute inset-0 opacity-20" 
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
                  </button>
                </SheetTrigger>
                <SheetContent 
                  side="bottom" 
                  className="bg-[#F5EFE6] rounded-t-3xl border-t-2 border-[#E6FAF4]"
                >
                  <div className="pb-6 pt-2">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="w-12 h-1 bg-[#495057]/20 rounded-full mx-auto mb-4" />
                      <h3 className="text-[#495057] mb-1">Ferramentas de Estudo</h3>
                      <p className="text-sm text-[#495057]/60">Escolha uma ferramenta</p>
                    </div>

                    {/* Tools Grid */}
                    <div className="space-y-3 max-w-md mx-auto">
                      {tools.map((tool, index) => {
                        const ToolIcon = tool.icon;
                        const isToolActive = activeTab === tool.id;
                        
                        return (
                          <motion.button
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleToolSelect(tool.id)}
                            className="w-full"
                          >
                            <Card 
                              className={`
                                p-4 rounded-2xl transition-all duration-200
                                bg-gradient-to-br ${tool.gradient}
                                active:scale-[0.98] touch-target no-select
                                ${isToolActive ? 'border-2 border-primary shadow-md' : 'border-border shadow-sm'}
                              `}
                              style={{
                                transform: 'translateZ(0)',
                                WebkitTransform: 'translateZ(0)',
                              }}
                            >
                              <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div className={`
                                  w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
                                  ${isToolActive ? 'bg-primary' : 'bg-primary/10'}
                                `}>
                                  <ToolIcon 
                                    className={`w-7 h-7 ${isToolActive ? 'text-white' : 'text-primary'}`}
                                    strokeWidth={2.5}
                                  />
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 text-left">
                                  <h4 className={`text-[#495057] mb-0.5 ${
                                    isToolActive ? 'text-primary' : ''
                                  }`}>
                                    {tool.label}
                                  </h4>
                                  <p className="text-xs text-[#495057]/60">
                                    {tool.description}
                                  </p>
                                </div>

                                {/* Active indicator */}
                                {isToolActive && (
                                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                )}
                              </div>
                            </Card>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            );
          }

          // Regular nav items
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                min-w-[64px] min-h-[44px]
                transition-all duration-200 ease-out
                touch-target no-select
                ${isActive ? 'text-primary' : 'text-[#495057]/60'}
                active:scale-95
              `}
              style={{
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
              }}
            >
              {/* Icon with duo-tone effect when active */}
              <div className="relative">
                <Icon 
                  className="w-6 h-6 transition-all duration-200" 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                {isActive && (
                  <Icon 
                    className="w-6 h-6 absolute inset-0 opacity-20" 
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
            </button>
          );
        })}
      </div>
    </nav>
  );
}