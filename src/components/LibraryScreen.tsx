import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { BottomNavigation } from "./shared/BottomNavigation";
import { Search, ChevronRight, Heart } from "lucide-react";
import { techniques, categories, getTechniquesByCategory } from "../data/techniques";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface LibraryScreenProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onTechniqueSelect: (techniqueId: string) => void;
  navItems: Array<{
    id: string;
    label: string;
    icon: any;
  }>;
}

export function LibraryScreen({ activeTab, onTabChange, onTechniqueSelect, navItems }: LibraryScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { favorites } = useAuth();

  const filteredTechniques = searchQuery
    ? techniques.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : techniques;

  const displayByCategory = !searchQuery;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-accent/20 to-white">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-border">
        <h1 className="mb-4">Biblioteca de Técnicas</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar técnicas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-border bg-secondary/50 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6 pb-4">
        <div className="max-w-md mx-auto space-y-8">
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
                  <h3 className="text-muted-foreground mb-4">{category.name}</h3>
                  
                  <div className="space-y-3">
                    {categoryTechniques.map((technique, techIndex) => {
                      const Icon = technique.icon;
                      
                      return (
                        <motion.div
                          key={technique.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: categoryIndex * 0.1 + techIndex * 0.05 
                          }}
                        >
                          <Card
                            className="p-4 transition-all duration-200 cursor-pointer border-border rounded-xl active:border-primary/30 active:scale-[0.98] active:shadow-md touch-target no-select"
                            onClick={() => onTechniqueSelect(technique.id)}
                            style={{
                              transform: 'translateZ(0)',
                              WebkitTransform: 'translateZ(0)',
                            }}
                          >
                            <div className="flex items-start gap-4">
                              {/* Duo-tone Icon */}
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/50 flex items-center justify-center flex-shrink-0">
                                <div className="relative">
                                  <Icon className="w-6 h-6 text-primary" strokeWidth={2} />
                                  <Icon 
                                    className="w-6 h-6 absolute inset-0 text-primary opacity-20" 
                                    fill="currentColor"
                                    strokeWidth={0}
                                  />
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <h4 className="mb-1">{technique.name}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {technique.shortDescription}
                                </p>
                              </div>
                              
                              {/* Favorite indicator */}
                              {favorites.includes(technique.id) ? (
                                <Heart className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="currentColor" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })
          ) : (
            // Search results view
            <div className="space-y-3">
              {filteredTechniques.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Nenhuma técnica encontrada
                  </p>
                </div>
              ) : (
                filteredTechniques.map((technique, index) => {
                  const Icon = technique.icon;
                  
                  return (
                    <motion.div
                      key={technique.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-border rounded-xl hover:border-primary/30 active:scale-98"
                        onClick={() => onTechniqueSelect(technique.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/50 flex items-center justify-center flex-shrink-0">
                            <div className="relative">
                              <Icon className="w-6 h-6 text-primary" strokeWidth={2} />
                              <Icon 
                                className="w-6 h-6 absolute inset-0 text-primary opacity-20" 
                                fill="currentColor"
                                strokeWidth={0}
                              />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="mb-1">{technique.name}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {technique.shortDescription}
                            </p>
                          </div>
                          
                          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
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
