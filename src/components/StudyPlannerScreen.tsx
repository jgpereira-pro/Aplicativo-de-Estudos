import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Plus, X, Clock, Book, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { useStudyPlanner, StudyBlock } from "../hooks/useStudyPlanner";

/**
 * StudyPlannerScreen - Tela de Planejamento Semanal de Estudos
 * 
 * Responsabilidades (reduzidas):
 * - Renderizar grade de calendário semanal
 * - Gerenciar UI do drawer de adição/edição
 * - Navegação entre semanas
 * 
 * Lógica de dados movida para:
 * - useStudyPlanner hook: localStorage, CRUD, validação
 * 
 * Melhorias de Performance:
 * - DAYS e HOURS em nível de módulo (criados 1x)
 * - weekDates memoizado (recalcula apenas quando semana muda)
 * - blocksByDayHour memoizado (filtra 1x em vez de 105x por render)
 */

// ====================================
// CONSTANTS (MODULE LEVEL)
// ====================================

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;
const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] as const;

const styles = {
  container: "min-h-screen bg-[#F5EFE6] pb-20",
  header: "bg-white border-b border-gray-200 sticky top-0 z-10",
  headerContent: "px-4 py-4",
  headerTop: "flex items-center justify-between mb-3",
  title: "text-[#20C997]",
  weekNav: "flex items-center justify-center gap-4",
  weekNavBtn: "h-12 w-12 touch-manipulation active:scale-95 transition-transform",
  weekLabel: "min-w-[140px] text-center text-sm text-gray-600",
  statsCard: "bg-white rounded-lg p-4 mx-4 mt-4 shadow-sm",
  statsGrid: "grid grid-cols-2 gap-4",
  statItem: "text-center",
  statValue: "text-2xl text-[#20C997] mb-1",
  statLabel: "text-xs text-gray-500",
  gridWrapper: "overflow-x-auto px-4 py-4",
  gridContainer: "min-w-[800px]",
  gridHeader: "grid grid-cols-8 gap-1 mb-2",
  dayCell: "text-center text-sm p-2 bg-white rounded-lg shadow-sm",
  gridBody: "space-y-1",
  hourRow: "grid grid-cols-8 gap-1",
  hourLabel: "text-xs text-gray-500 flex items-center justify-center bg-white rounded-lg p-1 shadow-sm",
  cellEmpty: "h-16 bg-white rounded-lg border border-gray-100 touch-manipulation active:bg-[#E6FAF4] transition-colors cursor-pointer",
  cellWithBlock: "h-16 bg-[#20C997] text-white rounded-lg p-2 touch-manipulation active:opacity-80 transition-opacity cursor-pointer shadow-sm",
  blockSubject: "text-xs truncate",
  blockTime: "text-[10px] opacity-80",
  fab: "fixed bottom-24 right-4 h-14 w-14 rounded-full bg-[#20C997] text-white shadow-lg touch-manipulation active:scale-95 transition-transform flex items-center justify-center z-20",
  drawer: "bg-[#F5EFE6]",
  drawerHeader: "border-b border-gray-200 pb-4",
  drawerForm: "space-y-4 pt-4",
  formGroup: "space-y-2",
  formLabel: "text-sm text-gray-700",
  deleteBtn: "w-full h-12 touch-manipulation mt-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white",
};

// ====================================
// MAIN COMPONENT
// ====================================

export function StudyPlannerScreen() {
  const {
    studyBlocks,
    isLoading,
    addBlock,
    updateBlock,
    deleteBlock,
    getBlocksForDayAndHour,
    getTotalHours,
  } = useStudyPlanner();

  // UI State
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: number; hour: number } | null>(null);
  const [editingBlock, setEditingBlock] = useState<StudyBlock | null>(null);

  // Form State
  const [formSubject, setFormSubject] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStartHour, setFormStartHour] = useState(8);
  const [formEndHour, setFormEndHour] = useState(10);

  // ====================================
  // COMPUTED VALUES (MEMOIZED)
  // ====================================

  // Calculate current week dates
  const weekDates = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + currentWeekOffset * 7);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, [currentWeekOffset]);

  // Memoize block lookup for performance
  const blocksByDayHour = useMemo(() => {
    const map = new Map<string, StudyBlock[]>();
    DAYS.forEach((_, day) => {
      HOURS.forEach(hour => {
        const key = `${day}-${hour}`;
        map.set(key, getBlocksForDayAndHour(day, hour));
      });
    });
    return map;
  }, [studyBlocks, getBlocksForDayAndHour]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const totalHours = getTotalHours();
    const studyDays = new Set(studyBlocks.map(b => b.day)).size;
    const subjects = new Set(studyBlocks.map(b => b.subject)).size;
    
    return {
      totalHours,
      studyDays,
      subjects,
      avgHoursPerDay: studyDays > 0 ? (totalHours / studyDays).toFixed(1) : "0",
    };
  }, [studyBlocks, getTotalHours]);

  // ====================================
  // EVENT HANDLERS
  // ====================================

  const handleCellClick = (day: number, hour: number) => {
    const blocks = blocksByDayHour.get(`${day}-${hour}`) || [];
    
    if (blocks.length > 0) {
      // Edit existing block
      const block = blocks[0];
      setEditingBlock(block);
      setFormSubject(block.subject);
      setFormDescription(block.description || "");
      setFormStartHour(block.startHour);
      setFormEndHour(block.startHour + block.duration);
      setSelectedCell({ day, hour });
    } else {
      // Add new block
      setEditingBlock(null);
      setFormSubject("");
      setFormDescription("");
      setFormStartHour(hour);
      setFormEndHour(Math.min(hour + 2, 23));
      setSelectedCell({ day, hour });
    }
    
    setDrawerOpen(true);
  };

  const handleAddClick = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = Math.max(6, Math.min(now.getHours(), 20));
    
    setEditingBlock(null);
    setFormSubject("");
    setFormDescription("");
    setFormStartHour(currentHour);
    setFormEndHour(Math.min(currentHour + 2, 23));
    setSelectedCell({ day: currentDay, hour: currentHour });
    setDrawerOpen(true);
  };

  const handleSaveBlock = () => {
    if (!selectedCell) return;

    const success = editingBlock
      ? updateBlock(editingBlock.id, {
          day: selectedCell.day,
          startHour: formStartHour,
          endHour: formEndHour,
          subject: formSubject,
          description: formDescription,
        })
      : addBlock({
          day: selectedCell.day,
          startHour: formStartHour,
          endHour: formEndHour,
          subject: formSubject,
          description: formDescription,
        });

    if (success) {
      setDrawerOpen(false);
      resetForm();
    }
  };

  const handleDeleteBlock = () => {
    if (!editingBlock) return;
    deleteBlock(editingBlock.id);
    setDrawerOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCell(null);
    setEditingBlock(null);
    setFormSubject("");
    setFormDescription("");
    setFormStartHour(8);
    setFormEndHour(10);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    resetForm();
  };

  // ====================================
  // RENDER
  // ====================================

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-500">Carregando planejamento...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>
              <Calendar className="inline-block mr-2 h-5 w-5" />
              Planejador Semanal
            </h1>
          </div>
          
          {/* Week Navigation */}
          <div className={styles.weekNav}>
            <Button
              variant="outline"
              size="icon"
              className={styles.weekNavBtn}
              onClick={() => setCurrentWeekOffset(prev => prev - 1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className={styles.weekLabel}>
              {weekDates[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              {' - '}
              {weekDates[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className={styles.weekNavBtn}
              onClick={() => setCurrentWeekOffset(prev => prev + 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <Card className={styles.statsCard}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{weeklyStats.totalHours}h</div>
            <div className={styles.statLabel}>Total Semanal</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{weeklyStats.studyDays}</div>
            <div className={styles.statLabel}>Dias de Estudo</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{weeklyStats.subjects}</div>
            <div className={styles.statLabel}>Matérias</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{weeklyStats.avgHoursPerDay}h</div>
            <div className={styles.statLabel}>Média/Dia</div>
          </div>
        </div>
      </Card>

      {/* Calendar Grid */}
      <div className={styles.gridWrapper}>
        <div className={styles.gridContainer}>
          {/* Grid Header - Days */}
          <div className={styles.gridHeader}>
            <div className="text-center text-xs text-gray-500 p-2"></div>
            {DAYS.map((day, index) => (
              <div key={day} className={styles.dayCell}>
                <div className="text-xs text-gray-600">{day}</div>
                <div className="text-[10px] text-gray-400">
                  {weekDates[index].getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Grid Body - Hours & Blocks */}
          <div className={styles.gridBody}>
            {HOURS.map(hour => (
              <div key={hour} className={styles.hourRow}>
                {/* Hour Label */}
                <div className={styles.hourLabel}>
                  <Clock className="h-3 w-3 mr-1" />
                  {hour}h
                </div>

                {/* Day Cells */}
                {DAYS.map((_, dayIndex) => {
                  const blocks = blocksByDayHour.get(`${dayIndex}-${hour}`) || [];
                  const block = blocks[0];

                  return (
                    <motion.div
                      key={`${dayIndex}-${hour}`}
                      className={block ? styles.cellWithBlock : styles.cellEmpty}
                      onClick={() => handleCellClick(dayIndex, hour)}
                      whileTap={{ scale: 0.98 }}
                    >
                      {block && (
                        <>
                          <div className={styles.blockSubject}>
                            <Book className="inline-block h-3 w-3 mr-1" />
                            {block.subject}
                          </div>
                          <div className={styles.blockTime}>
                            {block.startHour}h - {block.startHour + block.duration}h
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAB - Add Button */}
      <motion.button
        className={styles.fab}
        onClick={handleAddClick}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      {/* Drawer - Add/Edit Block */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className={styles.drawer}>
          <DrawerHeader className={styles.drawerHeader}>
            <DrawerTitle>
              {editingBlock ? 'Editar Bloco de Estudo' : 'Novo Bloco de Estudo'}
            </DrawerTitle>
            <DrawerDescription>
              {selectedCell && `${DAYS[selectedCell.day]} - ${selectedCell.hour}h`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4">
            <div className={styles.drawerForm}>
              {/* Subject */}
              <div className={styles.formGroup}>
                <Label htmlFor="subject" className={styles.formLabel}>
                  Matéria *
                </Label>
                <Input
                  id="subject"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Ex: Matemática, Português..."
                  className="h-12"
                />
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <Label htmlFor="description" className={styles.formLabel}>
                  Descrição (opcional)
                </Label>
                <Input
                  id="description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ex: Álgebra Linear, cap. 3"
                  className="h-12"
                />
              </div>

              <Separator />

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className={styles.formGroup}>
                  <Label htmlFor="start-hour" className={styles.formLabel}>
                    Início
                  </Label>
                  <select
                    id="start-hour"
                    value={formStartHour}
                    onChange={(e) => setFormStartHour(Number(e.target.value))}
                    className="h-12 w-full rounded-md border border-gray-300 px-3 bg-white touch-manipulation"
                  >
                    {HOURS.map(h => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <Label htmlFor="end-hour" className={styles.formLabel}>
                    Término
                  </Label>
                  <select
                    id="end-hour"
                    value={formEndHour}
                    onChange={(e) => setFormEndHour(Number(e.target.value))}
                    className="h-12 w-full rounded-md border border-gray-300 px-3 bg-white touch-manipulation"
                  >
                    {HOURS.filter(h => h > formStartHour).map(h => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                    <option value={23}>23:00</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12 touch-manipulation"
                  onClick={handleCloseDrawer}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 h-12 bg-[#20C997] hover:bg-[#1bb086] active:bg-[#189976] touch-manipulation"
                  onClick={handleSaveBlock}
                >
                  {editingBlock ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>

              {/* Delete Button (only for editing) */}
              {editingBlock && (
                <Button
                  variant="destructive"
                  className={styles.deleteBtn}
                  onClick={handleDeleteBlock}
                >
                  <X className="h-5 w-5 mr-2" />
                  Remover Bloco
                </Button>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
