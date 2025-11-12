import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { BottomNavigation } from "./shared/BottomNavigation";
import { Plus, X, Clock, Book, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface StudyBlock {
  id: string;
  day: number; // 0-6 (Dom-Sáb)
  startHour: number;
  duration: number; // em horas
  subject: string;
  description?: string;
}

interface StudyPlannerScreenProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  navItems: Array<{
    id: string;
    label: string;
    icon: any;
  }>;
}

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6h às 20h

export function StudyPlannerScreen({ activeTab, onTabChange, navItems }: StudyPlannerScreenProps) {
  const [studyBlocks, setStudyBlocks] = useState<StudyBlock[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<StudyBlock | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    day: 1,
    startHour: 9,
    duration: 1,
    subject: "",
    description: "",
  });

  // Load from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('studyflow_planner');
        if (stored) {
          setStudyBlocks(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar planejamento:', error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('studyflow_planner', JSON.stringify(studyBlocks));
      }
    } catch (error) {
      console.warn('Erro ao salvar planejamento:', error);
    }
  }, [studyBlocks]);

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay + (currentWeekOffset * 7));
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      return date;
    });
  };

  const weekDates = getCurrentWeekDates();
  const isCurrentWeek = currentWeekOffset === 0;

  const handleAddBlock = () => {
    if (!formData.subject.trim()) {
      toast.error("Por favor, adicione uma matéria");
      return;
    }

    if (editingBlock) {
      // Update existing block
      setStudyBlocks(blocks =>
        blocks.map(block =>
          block.id === editingBlock.id
            ? { ...editingBlock, ...formData, subject: formData.subject.trim() }
            : block
        )
      );
      toast.success("Bloco de estudo atualizado!");
    } else {
      // Add new block
      const newBlock: StudyBlock = {
        id: Date.now().toString(),
        day: formData.day,
        startHour: formData.startHour,
        duration: formData.duration,
        subject: formData.subject.trim(),
        description: formData.description.trim(),
      };
      setStudyBlocks([...studyBlocks, newBlock]);
      toast.success("Bloco de estudo adicionado!");
    }

    closeDrawer();
  };

  const handleDeleteBlock = (blockId: string) => {
    setStudyBlocks(blocks => blocks.filter(b => b.id !== blockId));
    toast.success("Bloco removido");
    closeDrawer();
  };

  const openDrawer = (block?: StudyBlock) => {
    if (block) {
      setEditingBlock(block);
      setFormData({
        day: block.day,
        startHour: block.startHour,
        duration: block.duration,
        subject: block.subject,
        description: block.description || "",
      });
    } else {
      setEditingBlock(null);
      setFormData({
        day: new Date().getDay(),
        startHour: 9,
        duration: 1,
        subject: "",
        description: "",
      });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingBlock(null);
    setFormData({
      day: 1,
      startHour: 9,
      duration: 1,
      subject: "",
      description: "",
    });
  };

  const getBlocksForDayAndHour = (day: number, hour: number) => {
    return studyBlocks.filter(
      block =>
        block.day === day &&
        hour >= block.startHour &&
        hour < block.startHour + block.duration
    );
  };

  const isBlockStart = (block: StudyBlock, hour: number) => {
    return hour === block.startHour;
  };

  // Get intensity based on block position
  const getBlockIntensity = (blockIndex: number) => {
    const intensities = ["bg-primary/20", "bg-primary/30", "bg-primary/15"];
    return intensities[blockIndex % intensities.length];
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#F5EFE6" }}>
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-border">
        <h1 className="mb-4">Planejador Semanal</h1>
        
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentWeekOffset(prev => prev - 1)}
            className="p-2 min-w-[44px] min-h-[44px] rounded-lg active:bg-accent transition-colors touch-target no-select"
            style={{ transform: 'translateZ(0)' }}
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {weekDates[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {weekDates[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </p>
            {isCurrentWeek && (
              <p className="text-xs text-primary font-medium">Semana Atual</p>
            )}
          </div>
          
          <button
            onClick={() => setCurrentWeekOffset(prev => prev + 1)}
            className="p-2 min-w-[44px] min-h-[44px] rounded-lg active:bg-accent transition-colors touch-target no-select"
            style={{ transform: 'translateZ(0)' }}
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto smooth-scroll">
        <div className="p-4">
          <Card className="rounded-2xl overflow-hidden border-border shadow-sm">
            {/* Days Header */}
            <div className="grid grid-cols-8 bg-white sticky top-0 z-10 border-b border-border">
              <div className="p-2 text-xs text-muted-foreground"></div>
              {DAYS.map((day, index) => {
                const date = weekDates[index];
                const isToday = isCurrentWeek && date.getDate() === new Date().getDate();
                
                return (
                  <div
                    key={day}
                    className={`p-2 text-center ${
                      isToday ? "bg-primary/10" : ""
                    }`}
                  >
                    <p className={`text-xs font-medium ${
                      isToday ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {day}
                    </p>
                    <p className={`text-xs ${
                      isToday ? "text-primary font-medium" : "text-muted-foreground"
                    }`}>
                      {date.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            {HOURS.map((hour, hourIndex) => (
              <div key={hour} className="grid grid-cols-8">
                {/* Hour Label */}
                <div className="p-2 text-xs text-muted-foreground text-right pr-3 bg-white border-r border-border">
                  {hour}:00
                </div>

                {/* Day Cells */}
                {DAYS.map((_, dayIndex) => {
                  const blocks = getBlocksForDayAndHour(dayIndex, hour);
                  const hasBlock = blocks.length > 0;

                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className="relative border-r border-b border-border min-h-[60px]"
                      style={{ backgroundColor: "#F5EFE6" }}
                    >
                      {hasBlock &&
                        blocks.map((block, blockIndex) => {
                          if (isBlockStart(block, hour)) {
                            const heightInCells = block.duration;
                            const blockIntensity = getBlockIntensity(blockIndex);

                            return (
                              <motion.button
                                key={block.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => openDrawer(block)}
                                className={`
                                  absolute inset-x-0 top-0 m-1 rounded-xl p-2
                                  ${blockIntensity}
                                  border-2 border-primary/30
                                  text-left transition-all duration-200
                                  active:scale-95 active:shadow-md
                                  touch-target no-select
                                `}
                                style={{
                                  height: `calc(${heightInCells * 60}px - 8px)`,
                                  transform: 'translateZ(0)',
                                  WebkitTransform: 'translateZ(0)',
                                }}
                              >
                                <p className="text-xs font-medium text-primary line-clamp-1">
                                  {block.subject}
                                </p>
                                <p className="text-xs text-primary/70 mt-1">
                                  {block.startHour}:00 - {block.startHour + block.duration}:00
                                </p>
                              </motion.button>
                            );
                          }
                          return null;
                        })}
                    </div>
                  );
                })}
              </div>
            ))}
          </Card>

          {/* Stats Card */}
          <Card className="mt-4 p-4 rounded-2xl bg-white border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Book className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Esta semana</p>
                  <p className="font-medium text-primary">
                    {studyBlocks.reduce((acc, block) => acc + block.duration, 0)}h de estudo
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* FAB - Add Button */}
      <button
        onClick={() => openDrawer()}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90 touch-target no-select z-20"
        style={{
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        }}
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </button>

      {/* Bottom Sheet Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="touch-target">
          <DrawerHeader>
            <DrawerTitle>
              {editingBlock ? "Editar Bloco de Estudo" : "Adicionar Bloco de Estudo"}
            </DrawerTitle>
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
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Matéria *</Label>
              <Input
                id="subject"
                placeholder="Ex: Matemática, Inglês..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="rounded-xl"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                placeholder="Ex: Capítulo 3 - Funções"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <Separator />

            {/* Day */}
            <div className="space-y-2">
              <Label htmlFor="day">Dia da Semana</Label>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => setFormData({ ...formData, day: index })}
                    className={`
                      p-2 rounded-lg text-xs font-medium transition-all duration-200
                      touch-target no-select
                      ${formData.day === index
                        ? "bg-primary text-white shadow-sm"
                        : "bg-accent/50 text-muted-foreground active:bg-accent"
                      }
                    `}
                    style={{ transform: 'translateZ(0)' }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Hour */}
            <div className="space-y-2">
              <Label htmlFor="startHour">Horário de Início</Label>
              <select
                id="startHour"
                value={formData.startHour}
                onChange={(e) => setFormData({ ...formData, startHour: parseInt(e.target.value) })}
                className="w-full p-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {HOURS.map(hour => (
                  <option key={hour} value={hour}>
                    {hour}:00
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duração</Label>
              <select
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full p-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {[1, 2, 3, 4].map(hours => (
                  <option key={hours} value={hours}>
                    {hours}h
                  </option>
                ))}
              </select>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={handleAddBlock}
                className="w-full min-h-[48px] rounded-xl bg-primary active:bg-[#1ab386] transition-all duration-200 active:scale-95 touch-target no-select"
                style={{ transform: 'translateZ(0)' }}
              >
                {editingBlock ? "Salvar Alterações" : "Adicionar Bloco"}
              </Button>

              {editingBlock && (
                <Button
                  onClick={() => handleDeleteBlock(editingBlock.id)}
                  variant="outline"
                  className="w-full min-h-[48px] rounded-xl border-destructive text-destructive active:bg-destructive/10 transition-all duration-200 active:scale-95 touch-target no-select"
                  style={{ transform: 'translateZ(0)' }}
                >
                  Remover Bloco
                </Button>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Bottom Navigation */}
      <BottomNavigation items={navItems} activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
