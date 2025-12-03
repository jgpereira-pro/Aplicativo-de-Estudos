import { motion } from "motion/react";
import { Heart, BookmarkPlus } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { Technique } from "../../data/techniques";

/**
 * FavoriteTechniques - Seção de técnicas favoritas (componente "burro"/presentational)
 * 
 * Responsabilidades:
 * - Renderizar lista de técnicas favoritas
 * - Mostrar estado vazio com CTA para biblioteca
 * - Delegar navegação para o parent
 */

interface FavoriteTechniquesProps {
  favorites: Technique[];
  onNavigate: (screen: string, params?: any) => void;
}

export function FavoriteTechniques({ favorites, onNavigate }: FavoriteTechniquesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <Card className="bg-white border-none shadow-lg rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-[#20C997]" />
          <h2 className="text-[#495057]">Minhas Técnicas Favoritas</h2>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <BookmarkPlus className="w-12 h-12 text-[#495057]/20 mx-auto mb-3" />
            <p className="text-[#495057]/60 text-sm mb-4">
              Explore a Biblioteca e salve suas técnicas favoritas aqui
            </p>
            <Button
              onClick={() => onNavigate("library")}
              variant="outline"
              className="border-[#20C997] text-[#20C997] hover:bg-[#E6FAF4] rounded-xl"
            >
              Ir para Biblioteca
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {favorites.map((technique, index) => {
              const Icon = technique.icon;
              return (
                <motion.button
                  key={technique.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => onNavigate("technique-detail", { technique })}
                  className="flex items-center gap-3 p-3 bg-[#E6FAF4] hover:bg-[#d0f4e8] rounded-xl transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-[#20C997] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#495057] truncate">{technique.name}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {technique.category}
                    </Badge>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
