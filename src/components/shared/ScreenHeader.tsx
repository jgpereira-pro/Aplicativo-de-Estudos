import { ArrowLeft, ChevronLeft } from "lucide-react";
import { ReactNode } from "react";
import { DuoToneIcon } from "./DuoToneIcon";

/**
 * ScreenHeader - Cabeçalho de tela com botão de voltar e ação opcional
 * 
 * Features:
 * - Botão de voltar com ícone duo-tone
 * - Título de seção (h2)
 * - Slot para conteúdo customizado (children)
 * - Ação opcional no canto direito
 * - Variante minimal (ChevronLeft) ou default (ArrowLeft)
 * 
 * Usage:
 * ```tsx
 * <ScreenHeader 
 *   title="Técnicas de Estudo"
 *   onBack={() => navigate(-1)}
 *   action={<Button>Salvar</Button>}
 * />
 * ```
 */

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  children?: ReactNode;
  variant?: "default" | "minimal";
  action?: ReactNode;
}

// ============================================
// CSS CLASSES - Seção de Estilos (Nível de Módulo)
// ============================================

const styles = {
  // Container principal
  container: "bg-white px-6 py-6 border-b border-border",
  innerWrapper: "flex items-center justify-between",
  contentWrapper: "flex-1",
  
  // Botão de voltar
  backButton: `
    text-muted-foreground 
    active:text-primary active:bg-accent
    transition-colors duration-200
    mb-4 p-2 
    min-w-[48px] min-h-[48px] 
    rounded-lg 
    touch-target no-select
  `.trim().replace(/\s+/g, ' '),
  
  // Título
  title: "text-[#495057]",
  
  // Action wrapper
  actionWrapper: "ml-4",
};

// ============================================
// COMPONENTE
// ============================================

export function ScreenHeader({ 
  title, 
  onBack, 
  children, 
  variant = "default", 
  action 
}: ScreenHeaderProps) {
  const BackIcon = variant === "minimal" ? ChevronLeft : ArrowLeft;
  
  return (
    <header className={styles.container}>
      <div className={styles.innerWrapper}>
        <div className={styles.contentWrapper}>
          {onBack && (
            <button 
              onClick={onBack} 
              className={styles.backButton}
              aria-label="Voltar"
            >
              <DuoToneIcon 
                icon={BackIcon}
                className="w-6 h-6"
                strokeWidth={2}
              />
            </button>
          )}
          
          {title && (
            <h2 className={styles.title}>
              {title}
            </h2>
          )}
          
          {children}
        </div>
        
        {action && (
          <div className={styles.actionWrapper}>
            {action}
          </div>
        )}
      </div>
    </header>
  );
}
