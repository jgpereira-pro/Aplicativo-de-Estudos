import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScreenHeader } from "./shared/ScreenHeader";
import { DuoToneIcon } from "./shared/DuoToneIcon";
import { StepNumber } from "./shared/StepNumber";
import { CheckCircle2, Heart } from "lucide-react";
import { getTechniqueById } from "../data/techniques";
import { categories, Technique } from "../data/techniques";
import { motion } from "motion/react";
import { useAppData } from "../hooks/useAppData";
import { toast } from "sonner@2.0.3";

/**
 * TechniqueDetailScreen - Tela de Detalhes de Técnica (componente "burro"/presentational)
 * 
 * Responsabilidades (reduzidas):
 * - Renderizar detalhes da técnica
 * - Renderizar ferramentas relacionadas (dados do techniques.ts)
 * - Gerenciar favoritos
 * 
 * Lógica de negócio movida para:
 * - techniques.ts: Mapeamento de ferramentas → ações (relatedTools com action, label, icon)
 * 
 * Melhorias:
 * - DuoToneIcon para ícones duo-tone (Header + Extra Tips)
 * - StepNumber para números de passos
 * - GPU acceleration removido (desnecessário)
 * - getToolAction removido (lógica no techniques.ts)
 */

interface TechniqueDetailScreenProps {
  techniqueId?: string | null;
  technique?: Technique;
  onBack: () => void;
  onNavigateToTool?: (tool: string) => void;
}

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const styles = {
  // Container
  container: "flex flex-col h-full bg-gradient-to-b from-accent/20 to-white",
  
  // Content
  content: "flex-1 overflow-auto px-6 py-6 pb-4",
  contentWrapper: "max-w-md mx-auto space-y-6",
  
  // Header Card
  headerCard: "p-6 bg-gradient-to-br from-secondary/60 to-accent/40 border-secondary shadow-sm rounded-2xl",
  headerContent: "flex flex-col items-center text-center gap-4",
  headerIconContainer: "w-20 h-20 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm",
  headerTextContainer: "space-y-2",
  headerBadge: "rounded-lg bg-primary/10 text-primary border-primary/20",
  
  // Description Section
  descriptionCard: "p-6 shadow-sm border-border rounded-2xl",
  sectionTitle: "mb-3",
  descriptionText: "text-muted-foreground leading-relaxed",
  
  // How to Apply Section
  howToApplyCard: "p-6 shadow-sm border-border rounded-2xl",
  howToApplyList: "space-y-3",
  howToApplyItem: "flex items-start gap-3",
  howToApplyText: "text-muted-foreground leading-relaxed flex-1",
  
  // Extra Tips Section
  tipsCard: "p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/60 shadow-sm rounded-2xl",
  tipsHeader: "flex items-center gap-2 mb-4",
  tipsTitle: "text-amber-900",
  tipsList: "space-y-2",
  tipsItem: "flex items-start gap-2",
  tipsIcon: "w-4 h-4 text-amber-600 flex-shrink-0 mt-1",
  tipsText: "text-sm text-amber-900 leading-relaxed flex-1",
  
  // Related Tools Section
  toolsCard: "p-6 shadow-sm border-border rounded-2xl",
  toolsList: "space-y-2",
  toolButton: "w-full min-h-[48px] justify-between rounded-xl bg-primary hover:bg-[#1ab386] active:bg-[#1ab386] active:scale-[0.98] transition-all duration-200 text-white touch-target no-select shadow-sm",
  toolIcon: "w-4 h-4 ml-2",
  
  // Bottom Action
  bottomAction: "pb-4",
  backButton: "w-full rounded-xl transition-all duration-200 hover:scale-103 active:scale-97 shadow-sm hover:shadow-md",
  
  // Favorite Button
  favoriteButton: (isFavorite: boolean) => `rounded-xl transition-all ${
    isFavorite 
      ? "text-red-500 hover:text-red-600" 
      : "text-[#495057]/40 hover:text-red-500"
  }`,
  
  // Not Found
  notFoundContainer: "flex flex-col h-full bg-white",
  notFoundContent: "flex-1 flex items-center justify-center",
  notFoundText: "text-muted-foreground",
} as const;

const animations = {
  header: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.4 },
  },
  description: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.1 },
  },
  howToApply: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.2 },
  },
  tips: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.3 },
  },
  tools: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.4 },
  },
  bottomAction: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.5 },
  },
} as const;

// ====================================
// COMPONENT
// ====================================

export function TechniqueDetailScreen({ techniqueId, technique: passedTechnique, onBack, onNavigateToTool }: TechniqueDetailScreenProps) {
  const { isAuthenticated, favorites, toggleFavorite } = useAppData();
  const technique = passedTechnique || (techniqueId ? getTechniqueById(techniqueId) : null);
  
  const isFavorite = technique ? favorites.includes(technique.id) : false;

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error("Faça login para salvar técnicas favoritas");
      return;
    }
    if (technique) {
      toggleFavorite(technique.id);
      if (isFavorite) {
        toast.success("Removido dos favoritos");
      } else {
        toast.success("Adicionado aos favoritos!");
      }
    }
  };

  if (!technique) {
    return (
      <div className={styles.notFoundContainer}>
        <ScreenHeader title="Técnica não encontrada" onBack={onBack} />
        <div className={styles.notFoundContent}>
          <p className={styles.notFoundText}>Técnica não encontrada</p>
        </div>
      </div>
    );
  }

  const Icon = technique.icon;
  const category = categories.find(c => c.id === technique.category);

  return (
    <div className={styles.container}>
      <ScreenHeader 
        onBack={onBack}
        action={
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={styles.favoriteButton(isFavorite)}
          >
            <Heart 
              className="w-5 h-5" 
              fill={isFavorite ? "currentColor" : "none"}
            />
          </Button>
        }
      />

      <div className={styles.content}>
        <div className={styles.contentWrapper}>
          
          {/* Header Card */}
          <motion.div {...animations.header}>
            <Card className={styles.headerCard}>
              <div className={styles.headerContent}>
                {/* Large Duo-tone Icon */}
                <div className={styles.headerIconContainer}>
                  <DuoToneIcon 
                    icon={Icon}
                    className="w-10 h-10"
                  />
                </div>
                
                {/* Title and Badge */}
                <div className={styles.headerTextContainer}>
                  <h1>{technique.name}</h1>
                  {category && (
                    <Badge className={styles.headerBadge}>
                      {category.name}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Description Section */}
          <motion.div {...animations.description}>
            <Card className={styles.descriptionCard}>
              <h3 className={styles.sectionTitle}>Descrição</h3>
              <p className={styles.descriptionText}>
                {technique.fullDescription}
              </p>
            </Card>
          </motion.div>

          {/* How to Apply Section */}
          <motion.div {...animations.howToApply}>
            <Card className={styles.howToApplyCard}>
              <h3 className={styles.sectionTitle}>Como Aplicar</h3>
              <div className={styles.howToApplyList}>
                {technique.howToApply.map((step, index) => (
                  <div key={index} className={styles.howToApplyItem}>
                    <StepNumber number={index + 1} />
                    <p className={styles.howToApplyText}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Extra Tips Section */}
          {technique.extraTips && technique.extraTips.length > 0 && (
            <motion.div {...animations.tips}>
              <Card className={styles.tipsCard}>
                <div className={styles.tipsHeader}>
                  <DuoToneIcon 
                    icon={CheckCircle2}
                    className="w-5 h-5 text-amber-600"
                  />
                  <h3 className={styles.tipsTitle}>Dicas Extras</h3>
                </div>
                <div className={styles.tipsList}>
                  {technique.extraTips.map((tip, index) => (
                    <div key={index} className={styles.tipsItem}>
                      <CheckCircle2 className={styles.tipsIcon} />
                      <p className={styles.tipsText}>
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Related Tools Section */}
          {technique.relatedTools && technique.relatedTools.length > 0 && (
            <motion.div {...animations.tools}>
              <Card className={styles.toolsCard}>
                <h3 className={styles.sectionTitle}>Ferramentas Relacionadas</h3>
                <div className={styles.toolsList}>
                  {technique.relatedTools.map((tool, index) => {
                    const ToolIcon = tool.icon;

                    return (
                      <Button
                        key={index}
                        className={styles.toolButton}
                        onClick={() => {
                          toast.success(`${tool.label}...`);
                          if (onNavigateToTool) {
                            onNavigateToTool(tool.action);
                          }
                        }}
                      >
                        <span>{tool.label}</span>
                        <ToolIcon className={styles.toolIcon} />
                      </Button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Bottom Action */}
          <motion.div {...animations.bottomAction} className={styles.bottomAction}>
            <Button
              className={styles.backButton}
              onClick={onBack}
            >
              Voltar para Biblioteca
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}