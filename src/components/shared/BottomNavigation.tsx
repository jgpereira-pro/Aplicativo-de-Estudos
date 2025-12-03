import { LucideIcon, Grid3x3, Clock, Layers, Calendar, Network } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "../ui/sheet";
import { Card } from "../ui/card";
import { motion, AnimatePresence } from "motion/react";
import { useNavigation } from "../../contexts/NavigationContext";
import { navItems as defaultNavItems } from "../../constants/navigation";

/**
 * BottomNavigation - Barra de navegação inferior simplificada (4 itens)
 * 
 * Redesign simplificado:
 * - 4 itens: Home, Biblioteca, Ferramentas (menu), Perfil
 * - Estado ativo: apenas cor (ícone duo-tone + texto em primary)
 * - Estado inativo: ícone outline + texto muted
 * - Sem pílula de fundo, sem linha superior
 * - Menu de ferramentas central para Foco, Decks, Planner e Quadro de Conceitos
 * - Usa NavigationContext para navegação automática (sem prop drilling)
 */

interface BottomNavigationProps {
  items?: Array<{
    id: string;
    label: string;
    icon: LucideIcon;
  }>;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

// ============================================
// CSS CLASSES - Seção de Estilos
// ============================================

const styles = {
  // Container principal
  container: "flex items-center justify-around bg-white border-t border-border py-2 px-4",
  
  // Item de navegação
  navItem: `
    flex flex-col items-center justify-center gap-1 
    min-w-[48px] min-h-[48px] 
    touch-target no-select 
    transition-all duration-150 ease-out 
    rounded-xl px-3 py-2
    hover:bg-primary/8 hover:scale-[1.05] hover:shadow-sm
    active:bg-primary/20 active:scale-[0.97] active:shadow-none
  `.trim().replace(/\s+/g, ' '),
  
  // Wrapper do ícone
  iconWrapper: "relative flex items-center justify-center w-6 h-6 transition-transform duration-150",
  iconMain: "w-6 h-6 transition-colors duration-150",
  iconOverlay: "w-6 h-6 absolute inset-0 opacity-20 transition-opacity duration-150",
  
  // Estados do ícone
  iconActive: "text-primary",
  iconInactive: "text-muted-foreground",
  
  // Label
  label: "text-xs transition-colors duration-150",
  labelActive: "text-primary",
  labelInactive: "text-muted-foreground",
  
  // Menu de ferramentas (Sheet)
  sheetContent: "bg-gradient-to-b from-[#F5EFE6] to-white",
  sheetHeader: "px-6 pt-6 pb-4",
  sheetTitle: "text-[#495057]",
  sheetDescription: "text-[#495057]/60",
  
  // Grid de ferramentas
  toolsGrid: "px-6 pb-6 space-y-3",
  
  // Card de ferramenta
  toolCard: `
    p-4 cursor-pointer 
    transition-all duration-150 ease-out 
    border-border rounded-xl 
    touch-target no-select shadow-sm
    hover:shadow-md hover:scale-[1.02] hover:border-primary/30
    active:scale-[0.97] active:shadow-sm active:bg-primary/8 active:border-primary/50
  `.trim().replace(/\s+/g, ' '),
  toolCardContent: "flex items-center gap-4",
  
  // Ícone da ferramenta
  toolIconContainer: "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150",
  toolIconWrapper: "relative",
  toolIcon: "w-6 h-6 text-primary transition-transform duration-150",
  toolIconOverlay: "w-6 h-6 absolute inset-0 text-primary opacity-20",
  
  // Conteúdo da ferramenta
  toolContent: "flex-1 text-left",
  toolLabel: "text-[#495057] mb-0.5 transition-colors duration-150",
  toolLabelActive: "text-primary",
  toolDescription: "text-xs text-[#495057]/60",
  
  // Indicador ativo
  activeIndicator: "w-2 h-2 rounded-full bg-primary flex-shrink-0",
};

// ============================================
// DADOS
// ============================================

const tools = [
  { 
    id: "focus",  // Mudado de "foco" para "focus" para corresponder à rota
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
  { 
    id: "concept-board", 
    label: "Quadro de Conceitos", 
    icon: Network,
    description: "Mapas mentais e conexões",
    gradient: "from-[#E6FAF4] to-white"
  },
];

// ============================================
// SUBCOMPONENTES
// ============================================

interface NavigationItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

function NavigationItem({ icon: Icon, label, isActive }: NavigationItemProps) {
  return (
    <>
      <div className={styles.iconWrapper}>
        <Icon 
          className={`${styles.iconMain} ${isActive ? styles.iconActive : styles.iconInactive}`}
          strokeWidth={2}
        />
        <Icon 
          className={`${styles.iconOverlay} ${isActive ? styles.iconActive : styles.iconInactive}`}
          fill="currentColor"
          strokeWidth={0}
        />
      </div>
      <span className={`${styles.label} ${isActive ? styles.labelActive : styles.labelInactive}`}>
        {label}
      </span>
    </>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function BottomNavigation({ items = defaultNavItems, activeTab, onTabChange }: BottomNavigationProps) {
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const navigation = useNavigation();
  
  // Use context values if props not provided
  const currentActiveTab = activeTab !== undefined ? activeTab : navigation.activeTab;
  const handleTabChange = onTabChange !== undefined ? onTabChange : navigation.navigateToTab;

  const handleItemClick = (itemId: string) => {
    if (itemId === "tools") {
      setToolsMenuOpen(true);
    } else {
      handleTabChange(itemId);
    }
  };

  const handleToolSelect = (toolId: string) => {
    // Ferramentas navegam diretamente para screens específicas
    navigation.navigate(toolId as any); // foco, decks, planner, concept-board
    setToolsMenuOpen(false);
  };

  return (
    <nav className={styles.container}>
      {items.map((item) => {
        const isActive = currentActiveTab === item.id;
        
        if (item.id === "tools") {
          return (
            <Sheet key={item.id} open={toolsMenuOpen} onOpenChange={setToolsMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className={styles.navItem}
                  onClick={() => handleItemClick(item.id)}
                  aria-label={item.label}
                >
                  <NavigationItem 
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive}
                  />
                </button>
              </SheetTrigger>
              
              <SheetContent side="bottom" className={styles.sheetContent}>
                <div className={styles.sheetHeader}>
                  <SheetTitle className={styles.sheetTitle}>Ferramentas</SheetTitle>
                  <SheetDescription className={styles.sheetDescription}>
                    Escolha uma ferramenta para começar
                  </SheetDescription>
                </div>
                
                <div className={styles.toolsGrid}>
                  {tools.map((tool, index) => {
                    const ToolIcon = tool.icon;
                    const isToolActive = currentActiveTab === tool.id;
                    
                    return (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card
                          className={styles.toolCard}
                          onClick={() => handleToolSelect(tool.id)}
                          role="button"
                          tabIndex={0}
                          aria-label={`${tool.label} - ${tool.description}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleToolSelect(tool.id);
                            }
                          }}
                        >
                          <div className={styles.toolCardContent}>
                            <div className={`${styles.toolIconContainer} bg-gradient-to-br ${tool.gradient}`}>
                              <div className={styles.toolIconWrapper}>
                                <ToolIcon className={styles.toolIcon} strokeWidth={2} />
                                <ToolIcon 
                                  className={styles.toolIconOverlay}
                                  fill="currentColor"
                                  strokeWidth={0}
                                />
                              </div>
                            </div>
                            
                            <div className={styles.toolContent}>
                              <h4 className={`${styles.toolLabel} ${isToolActive ? styles.toolLabelActive : ''}`}>
                                {tool.label}
                              </h4>
                              <p className={styles.toolDescription}>
                                {tool.description}
                              </p>
                            </div>
                            
                            {isToolActive && (
                              <div className={styles.activeIndicator} aria-label="Ativo" />
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          );
        }
        
        return (
          <button
            key={item.id}
            className={styles.navItem}
            onClick={() => handleItemClick(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <NavigationItem 
              icon={item.icon}
              label={item.label}
              isActive={isActive}
            />
          </button>
        );
      })}
    </nav>
  );
}