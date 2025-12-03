import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ReactNode } from "react";

/**
 * SolutionCard - Componente presentacional (stateless) para exibir soluções
 * 
 * Características:
 * - Stateless: sem estado interno, apenas props
 * - Performance: estilos em nível de módulo
 * - Feedback visual: CSS puro (active states)
 * - Acessibilidade: botão desabilitado quando sem ação
 * 
 * Usage:
 * ```tsx
 * <SolutionCard
 *   title="Técnicas de Foco"
 *   description="Aprenda métodos comprovados para melhorar sua concentração."
 *   badge="Recomendado"
 *   buttonText="Explorar Técnicas"
 *   buttonVariant="default"
 *   onButtonClick={() => navigate('/techniques')}
 * />
 * ```
 */

interface SolutionCardProps {
  title: string;
  description: string;
  badge: string;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  buttonIcon?: ReactNode;
  onButtonClick?: () => void;
}

// ============================================
// CSS CLASSES - Seção de Estilos (Nível de Módulo)
// ============================================

const styles = {
  // Card principal
  card: "p-6 shadow-sm border-border rounded-2xl transition-shadow duration-200",
  
  // Header
  header: "flex items-center justify-between mb-3",
  badge: "rounded-lg px-3 py-1",
  
  // Content
  title: "text-[#495057]",
  description: "text-muted-foreground mb-6 leading-relaxed",
  
  // Button base (comum a todas as variantes)
  buttonBase: `
    w-full rounded-xl 
    transition-all duration-200 
    min-h-[44px] 
    touch-target no-select
    disabled:opacity-50 disabled:cursor-not-allowed
  `.trim().replace(/\s+/g, ' '),
  
  // Variante default (primary)
  buttonDefault: `
    shadow-sm bg-primary
    active:scale-[0.98] active:bg-[#1ab386]
    active:ring-2 active:ring-primary active:ring-offset-2
  `.trim().replace(/\s+/g, ' '),
  
  // Variante outline
  buttonOutline: `
    border-primary text-primary
    active:scale-[0.98] active:bg-accent
    active:ring-2 active:ring-primary active:ring-offset-2
  `.trim().replace(/\s+/g, ' '),
};

// ============================================
// COMPONENTE
// ============================================

export function SolutionCard({
  title,
  description,
  badge,
  buttonText,
  buttonVariant = "default",
  buttonIcon,
  onButtonClick
}: SolutionCardProps) {
  // Construir className do botão baseado na variante
  const buttonClassName = `${styles.buttonBase} ${
    buttonVariant === "default" ? styles.buttonDefault : styles.buttonOutline
  }`;

  return (
    <Card className={styles.card}>
      {/* Header com título e badge */}
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <Badge variant="secondary" className={styles.badge}>
          {badge}
        </Badge>
      </div>
      
      {/* Descrição */}
      <p className={styles.description}>{description}</p>
      
      {/* Botão de ação */}
      <Button 
        variant={buttonVariant} 
        className={buttonClassName}
        onClick={onButtonClick}
        disabled={!onButtonClick}
        aria-label={buttonText}
      >
        {buttonText}
        {buttonIcon}
      </Button>
    </Card>
  );
}
