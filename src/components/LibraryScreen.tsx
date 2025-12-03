import React, { useState, useMemo } from "react";
import { Search, Heart, ChevronRight } from "lucide-react";
import { ScreenHeader } from "./shared/ScreenHeader";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { techniques, categories, getTechniquesByCategory, type Technique } from "../data/techniques";
import { motion } from "motion/react";
import { useAppData } from "../hooks/useAppData";

/**
 * LibraryScreen - Biblioteca de Técnicas de Estudo
 * 
 * Features:
 * - Busca de técnicas com memoização
 * - Visualização por categoria
 * - Indicador de favoritos
 * - Navegação para detalhes
 * 
 * Otimizações:
 * - useMemo para filteredTechniques e displayByCategory
 * - Subcomponente TechniqueCardItem para evitar duplicação
 * - Constantes em nível de módulo
 */

interface LibraryScreenProps {
  onTechniqueSelect: (techniqueId: string) => void;
}

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const styles = {
  // Container principal
  container: "flex flex-col h-full bg-gradient-to-b from-accent/20 to-white",
  
  // Header
  header: "bg-white px-6 py-6 border-b border-border",
  title: "mb-4",
  
  // Search bar
  searchWrapper: "relative",
  searchIcon: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground",
  searchInput: "pl-10 rounded-xl border-border bg-secondary/50 focus:bg-white transition-colors",
  
  // Content area
  scrollArea: "flex-1 overflow-auto px-6 py-6 pb-4",
  contentWrapper: "max-w-md mx-auto space-y-8",
  
  // Category section
  categoryTitle: "text-muted-foreground mb-4",
  categoryTechniques: "space-y-3",
  
  // Technique card
  techniqueCard: "p-4 transition-all duration-200 cursor-pointer border-border rounded-xl active:border-primary/30 active:scale-[0.98] active:shadow-md touch-target no-select",
  techniqueContent: "flex items-start gap-4",
  
  // Icon container
  iconContainer: "w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/50 flex items-center justify-center flex-shrink-0",
  iconWrapper: "relative",
  icon: "w-6 h-6 text-primary",
  iconOverlay: "w-6 h-6 absolute inset-0 text-primary opacity-20",
  
  // Content
  textContent: "flex-1 min-w-0",
  techniqueName: "mb-1",
  techniqueDescription: "text-sm text-muted-foreground leading-relaxed",
  
  // Icons de ação
  favoriteIcon: "w-5 h-5 text-red-500 flex-shrink-0 mt-1",
  chevronIcon: "w-5 h-5 text-muted-foreground flex-shrink-0 mt-1",
  
  // Search results
  searchResults: "space-y-3",
  emptyState: "text-center py-12",
  emptyStateText: "text-muted-foreground",
} as const;

// ====================================
// SUBCOMPONENTE (DRY - Don't Repeat Yourself)
// ====================================

interface TechniqueCardItemProps {
  technique: Technique;
  isFavorite: boolean;
  onClick: () => void;
  delay?: number;
}

/**
 * TechniqueCardItem - Card de técnica reutilizável
 * 
 * Responsabilidades:
 * - Renderizar card de técnica com ícone duo-tone
 * - Mostrar favorito ou chevron
 * - Animação de entrada
 */
const TechniqueCardItem = React.memo(({ 
  technique, 
  isFavorite, 
  onClick, 
  delay = 0 
}: TechniqueCardItemProps) => {
  const Icon = technique.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
        className={styles.techniqueCard}
        onClick={onClick}
      >
        <div className={styles.techniqueContent}>
          {/* Duo-tone Icon */}
          <div className={styles.iconContainer}>
            <div className={styles.iconWrapper}>
              <Icon className={styles.icon} strokeWidth={2} />
              <Icon 
                className={styles.iconOverlay} 
                fill="currentColor"
                strokeWidth={0}
              />
            </div>
          </div>
          
          {/* Content */}
          <div className={styles.textContent}>
            <h4 className={styles.techniqueName}>{technique.name}</h4>
            <p className={styles.techniqueDescription}>
              {technique.shortDescription}
            </p>
          </div>
          
          {/* Favorite indicator or chevron */}
          {isFavorite ? (
            <Heart className={styles.favoriteIcon} fill="currentColor" />
          ) : (
            <ChevronRight className={styles.chevronIcon} />
          )}
        </div>
      </Card>
    </motion.div>
  );
});

TechniqueCardItem.displayName = "TechniqueCardItem";

// ====================================
// COMPONENT
// ====================================

export function LibraryScreen({ onTechniqueSelect }: LibraryScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { favorites } = useAppData();

  // ====================================
  // MEMOIZED COMPUTATIONS (PERFORMANCE)
  // ====================================

  /**
   * Filtra técnicas baseado na busca
   * Memoizado para evitar recálculo em cada renderização
   */
  const filteredTechniques = useMemo(() => {
    if (!searchQuery) {
      return techniques;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    return techniques.filter(t => 
      t.name.toLowerCase().includes(lowerQuery) ||
      t.shortDescription.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  /**
   * Define se deve mostrar por categoria ou lista de busca
   * Memoizado para evitar recálculo desnecessário
   */
  const displayByCategory = useMemo(() => !searchQuery, [searchQuery]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Biblioteca de Técnicas</h1>
        
        {/* Search Bar */}
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <Input
            type="text"
            placeholder="Buscar técnicas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Content */}
      <div className={styles.scrollArea}>
        <div className={styles.contentWrapper}>
          {displayByCategory ? (
            // Categorized view
            categories.map((category, categoryIndex) => {
              const categoryTechniques = getTechniquesByCategory(category.id);
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                >
                  <h3 className={styles.categoryTitle}>{category.name}</h3>
                  
                  <div className={styles.categoryTechniques}>
                    {categoryTechniques.map((technique, techIndex) => (
                      <TechniqueCardItem
                        key={technique.id}
                        technique={technique}
                        isFavorite={favorites.includes(technique.id)}
                        onClick={() => onTechniqueSelect(technique.id)}
                        delay={categoryIndex * 0.1 + techIndex * 0.05}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })
          ) : (
            // Search results view
            <div className={styles.searchResults}>
              {filteredTechniques.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyStateText}>
                    Nenhuma técnica encontrada
                  </p>
                </div>
              ) : (
                filteredTechniques.map((technique, index) => (
                  <TechniqueCardItem
                    key={technique.id}
                    technique={technique}
                    isFavorite={favorites.includes(technique.id)}
                    onClick={() => onTechniqueSelect(technique.id)}
                    delay={index * 0.05}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}