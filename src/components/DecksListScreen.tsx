import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "./ui/drawer";
import { Badge } from "./ui/badge";
import { BottomNavigation } from "./shared/BottomNavigation";
import { Plus, Layers, X, Search, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { defaultDecks, Deck, Flashcard } from "../data/flashcards";

interface DecksListScreenProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  navItems: Array<{
    id: string;
    label: string;
    icon: any;
  }>;
  onSelectDeck: (deckId: string) => void;
}

export function DecksListScreen({ activeTab, onTabChange, navItems, onSelectDeck }: DecksListScreenProps) {
  const [decks, setDecks] = useState<Deck[]>(defaultDecks);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });

  // Load from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('studyflow_decks');
        if (stored) {
          const customDecks = JSON.parse(stored);
          setDecks([...defaultDecks, ...customDecks]);
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar decks:', error);
    }
  }, []);

  // Save custom decks to localStorage
  const saveCustomDecks = (allDecks: Deck[]) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const customDecks = allDecks.filter(deck => !defaultDecks.some(d => d.id === deck.id));
        localStorage.setItem('studyflow_decks', JSON.stringify(customDecks));
      }
    } catch (error) {
      console.warn('Erro ao salvar decks:', error);
    }
  };

  const handleCreateDeck = () => {
    if (!formData.name.trim()) {
      toast.error("Por favor, adicione um nome ao deck");
      return;
    }

    const newDeck: Deck = {
      id: `deck-custom-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category.trim() || "Geral",
      cards: [],
    };

    const updatedDecks = [...decks, newDeck];
    setDecks(updatedDecks);
    saveCustomDecks(updatedDecks);
    toast.success("Deck criado com sucesso!");
    closeDrawer();
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({ name: "", description: "", category: "" });
  };

  const filteredDecks = decks.filter(deck =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(decks.map(d => d.category)));

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
              <p className="text-2xl font-medium text-primary">{decks.length}</p>
            </Card>
            <Card className="p-4 rounded-2xl bg-white border-border">
              <p className="text-xs text-muted-foreground mb-1">Total de Cards</p>
              <p className="text-2xl font-medium text-primary">
                {decks.reduce((sum, deck) => sum + deck.cards.length, 0)}
              </p>
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
              filteredDecks.map((deck, index) => (
                <motion.div
                  key={deck.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="p-4 rounded-2xl border-border cursor-pointer transition-all duration-200 active:scale-[0.98] active:shadow-md touch-target no-select"
                    onClick={() => onSelectDeck(deck.id)}
                    style={{
                      transform: 'translateZ(0)',
                      WebkitTransform: 'translateZ(0)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
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
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FAB - Create Deck */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90 touch-target no-select z-20"
        style={{
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        }}
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </button>

      {/* Create Deck Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="touch-target">
          <DrawerHeader>
            <DrawerTitle>Criar Novo Deck</DrawerTitle>
            <DrawerClose asChild>
              <button
                className="absolute right-4 top-4 p-2 rounded-lg active:bg-accent transition-colors touch-target no-select"
                style={{ transform: 'translateZ(0)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Deck *</Label>
              <Input
                id="name"
                placeholder="Ex: Verbos em Francês"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                placeholder="Ex: Conjugação presente e passado"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria (opcional)</Label>
              <Input
                id="category"
                placeholder="Ex: Idiomas"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <Button
              onClick={handleCreateDeck}
              className="w-full min-h-[48px] rounded-xl bg-primary active:bg-[#1ab386] transition-all duration-200 active:scale-95 touch-target no-select"
              style={{ transform: 'translateZ(0)' }}
            >
              Criar Deck
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Bottom Navigation */}
      <BottomNavigation items={navItems} activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
