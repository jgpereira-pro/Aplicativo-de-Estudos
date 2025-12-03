import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Plus, Layers, Search, ChevronRight, MoreVertical, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useDecks } from "../hooks/useDecks";
import { CreateDeckDrawer } from "./decks/CreateDeckDrawer";

interface DecksListScreenProps {
  onSelectDeck: (deckId: string) => void;
}

/**
 * Tela de listagem de decks (componente "burro"/presentational)
 * 
 * Responsabilidades (reduzidas):
 * - Renderizar lista de decks
 * - Gerenciar estado de busca e drawer (UI apenas)
 * - Coordenar CreateDeckDrawer
 * 
 * Lógica complexa foi movida para hooks customizados:
 * - useDecks: gerencia dados dos decks + localStorage
 */
export function DecksListScreen({ onSelectDeck }: DecksListScreenProps) {
  // ====================================
  // HOOKS CUSTOMIZADOS (LÓGICA ISOLADA)
  // ====================================
  
  const { decks, stats, categories, createDeck, deleteDeck } = useDecks();

  // ====================================
  // LOCAL STATE (UI-SPECIFIC)
  // ====================================
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ====================================
  // DERIVED STATE (MEMOIZED)
  // ====================================

  const filteredDecks = useMemo(() => {
    return decks.filter(deck =>
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [decks, searchQuery]);

  // ====================================
  // RENDER (FOCADO EM JSX)
  // ====================================

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-accent/30 to-white">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-border">
        <h1 className="mb-4">Decks Rápidos</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto smooth-scroll px-6 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 rounded-2xl bg-white border-border">
              <p className="text-xs text-muted-foreground mb-1">Total de Decks</p>
              <p className="text-2xl font-medium text-primary">{stats.totalDecks}</p>
            </Card>
            <Card className="p-4 rounded-2xl bg-white border-border">
              <p className="text-xs text-muted-foreground mb-1">Total de Cards</p>
              <p className="text-2xl font-medium text-primary">{stats.totalCards}</p>
            </Card>
          </div>

          {/* Categories Filter */}
          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 smooth-scroll">
              {categories.map(category => {
                const count = decks.filter(d => d.category === category).length;
                return (
                  <Badge
                    key={category}
                    variant="outline"
                    className="whitespace-nowrap rounded-xl px-3 py-1.5 border-primary/20"
                  >
                    {category} ({count})
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Decks List */}
          <div className="space-y-3">
            {filteredDecks.length === 0 ? (
              <Card className="p-8 rounded-2xl text-center border-border">
                <Layers className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Nenhum deck encontrado" : "Crie seu primeiro deck"}
                </p>
              </Card>
            ) : (
              filteredDecks.map((deck, index) => {
                return (
                  <motion.div
                    key={deck.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 rounded-2xl border-border relative transition-all duration-200 touch-target no-select">
                      <div className="flex items-center gap-3">
                        {/* Main clickable area */}
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => onSelectDeck(deck.id)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium truncate">{deck.name}</h3>
                            <Badge
                              variant="secondary"
                              className="rounded-lg text-xs bg-primary/10 text-primary border-0"
                            >
                              {deck.cards.length}
                            </Badge>
                          </div>
                          {deck.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                              {deck.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs text-primary">{deck.category}</span>
                          </div>
                        </div>

                        {/* Actions menu */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="p-2 rounded-lg active:bg-accent transition-all duration-150 touch-target no-select"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-5 h-5 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteDeck(deck.id, deck.name);
                                }}
                                className="text-destructive focus:text-destructive cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Deletar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <ChevronRight 
                            className="w-5 h-5 text-muted-foreground cursor-pointer" 
                            onClick={() => onSelectDeck(deck.id)}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* FAB - Create Deck */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90 touch-target no-select z-20"
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </button>

      {/* Create Deck Drawer */}
      <CreateDeckDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCreateDeck={createDeck}
      />
    </div>
  );
}