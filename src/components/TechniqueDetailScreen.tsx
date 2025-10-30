import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScreenHeader } from "./shared/ScreenHeader";
import { ExternalLink, CheckCircle2, Lightbulb, Heart } from "lucide-react";
import { getTechniqueById } from "../data/techniques";
import { categories, Technique } from "../data/techniques";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

interface TechniqueDetailScreenProps {
  techniqueId?: string | null;
  technique?: Technique;
  onBack: () => void;
}

export function TechniqueDetailScreen({ techniqueId, technique: passedTechnique, onBack }: TechniqueDetailScreenProps) {
  const { isAuthenticated, favorites, toggleFavorite } = useAuth();
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
      <div className="flex flex-col h-full bg-white">
        <ScreenHeader title="Técnica não encontrada" onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Técnica não encontrada</p>
        </div>
      </div>
    );
  }

  const Icon = technique.icon;
  const category = categories.find(c => c.id === technique.category);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-accent/20 to-white">
      <ScreenHeader 
        onBack={onBack}
        action={
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={`rounded-xl transition-all ${
              isFavorite 
                ? "text-red-500 hover:text-red-600" 
                : "text-[#495057]/40 hover:text-red-500"
            }`}
          >
            <Heart 
              className="w-5 h-5" 
              fill={isFavorite ? "currentColor" : "none"}
            />
          </Button>
        }
      />

      <div className="flex-1 overflow-auto px-6 py-6 pb-4">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-secondary/60 to-accent/40 border-secondary shadow-sm rounded-2xl">
              <div className="flex flex-col items-center text-center gap-4">
                {/* Large Duo-tone Icon */}
                <div className="w-20 h-20 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
                  <div className="relative">
                    <Icon className="w-10 h-10 text-primary" strokeWidth={2} />
                    <Icon 
                      className="w-10 h-10 absolute inset-0 text-primary opacity-20" 
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  </div>
                </div>
                
                {/* Title and Badge */}
                <div className="space-y-2">
                  <h1>{technique.name}</h1>
                  {category && (
                    <Badge className="rounded-lg bg-primary/10 text-primary border-primary/20">
                      {category.name}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="p-6 shadow-sm border-border rounded-2xl">
              <h3 className="mb-3">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">
                {technique.fullDescription}
              </p>
            </Card>
          </motion.div>

          {/* How to Apply Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-6 shadow-sm border-border rounded-2xl">
              <h3 className="mb-4">Como Aplicar</h3>
              <div className="space-y-3">
                {technique.howToApply.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {/* Step number with duo-tone effect */}
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm text-primary">{index + 1}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed flex-1">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Extra Tips Section */}
          {technique.extraTips && technique.extraTips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/60 shadow-sm rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative">
                    <Lightbulb className="w-5 h-5 text-amber-600" strokeWidth={2} />
                    <Lightbulb 
                      className="w-5 h-5 absolute inset-0 text-amber-600 opacity-20" 
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  </div>
                  <h3 className="text-amber-900">Dicas Extras</h3>
                </div>
                <div className="space-y-2">
                  {technique.extraTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-1" />
                      <p className="text-sm text-amber-900 leading-relaxed flex-1">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="p-6 shadow-sm border-border rounded-2xl">
                <h3 className="mb-4">Ferramentas Relacionadas</h3>
                <div className="space-y-2">
                  {technique.relatedTools.map((tool, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-between rounded-xl hover:bg-accent active:scale-98 transition-all duration-200"
                      onClick={() => {
                        // In a real app, this would open the URL
                        console.log("Opening:", tool.url);
                      }}
                    >
                      <span>{tool.name}</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Bottom Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="pb-4"
          >
            <Button
              className="w-full rounded-xl transition-all duration-200 hover:scale-103 active:scale-97 shadow-sm hover:shadow-md"
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
