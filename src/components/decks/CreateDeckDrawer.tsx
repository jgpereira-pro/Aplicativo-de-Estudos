import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "../ui/drawer";
import { X } from "lucide-react";

interface CreateDeckDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDeck: (name: string, description?: string, category?: string) => boolean;
}

/**
 * Drawer para criar novo deck
 * 
 * Gerencia seu próprio estado de formulário e delega a criação para o hook useDecks.
 */
export function CreateDeckDrawer({ isOpen, onClose, onCreateDeck }: CreateDeckDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });

  const handleSubmit = () => {
    const success = onCreateDeck(
      formData.name,
      formData.description,
      formData.category
    );
    
    if (success) {
      // Reset form and close drawer
      setFormData({ name: "", description: "", category: "" });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", category: "" });
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent className="touch-target">
        <DrawerHeader>
          <DrawerTitle>Criar Novo Deck</DrawerTitle>
          <DrawerDescription>Adicione um novo deck para estudar.</DrawerDescription>
          <DrawerClose asChild>
            <button
              className="absolute right-4 top-4 p-2 rounded-lg active:bg-accent transition-colors touch-target no-select"
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
            onClick={handleSubmit}
            className="w-full min-h-[48px] rounded-xl bg-primary active:bg-[#1ab386] transition-all duration-200 active:scale-95 touch-target no-select"
          >
            Criar Deck
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
