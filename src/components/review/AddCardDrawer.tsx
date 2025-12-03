import { useState } from "react";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "../ui/drawer";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { X } from "lucide-react";

interface AddCardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (front: string, back: string) => boolean;
  deckName: string;
}

/**
 * Drawer para adicionar novo flashcard
 * 
 * Gerencia seu próprio estado de formulário e delega a adição para o hook useDeck.
 */
export function AddCardDrawer({ isOpen, onClose, onAddCard, deckName }: AddCardDrawerProps) {
  const [cardFormData, setCardFormData] = useState({
    front: "",
    back: "",
  });

  const handleSubmit = () => {
    const success = onAddCard(cardFormData.front, cardFormData.back);
    
    if (success) {
      // Reset form and close drawer
      setCardFormData({ front: "", back: "" });
      onClose();
    }
  };

  const handleClose = () => {
    setCardFormData({ front: "", back: "" });
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent className="touch-target">
        <DrawerHeader>
          <DrawerTitle>Adicionar Novo Flashcard</DrawerTitle>
          <DrawerDescription>
            Adicione um novo flashcard ao deck "{deckName}".
          </DrawerDescription>
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
            <Label htmlFor="front">Frente</Label>
            <Textarea
              id="front"
              placeholder="Digite a pergunta aqui..."
              className="rounded-xl min-h-[100px] resize-none"
              value={cardFormData.front}
              onChange={(e) => setCardFormData({ ...cardFormData, front: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="back">Verso</Label>
            <Textarea
              id="back"
              placeholder="Digite a resposta aqui..."
              className="rounded-xl min-h-[100px] resize-none"
              value={cardFormData.back}
              onChange={(e) => setCardFormData({ ...cardFormData, back: e.target.value })}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full min-h-[48px] rounded-xl bg-primary active:bg-[#1ab386] transition-all duration-200 active:scale-95 touch-target no-select"
            style={{ transform: 'translateZ(0)' }}
          >
            Salvar Flashcard
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
