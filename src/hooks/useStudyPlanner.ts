import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';

/**
 * useStudyPlanner - Hook customizado para gerenciar planejamento de estudos
 * 
 * Responsabilidades:
 * - Gerenciar estado de blocos de estudo
 * - Persistir dados em localStorage
 * - Prover funções CRUD (addBlock, updateBlock, deleteBlock)
 * - Validar dados antes de salvar
 * 
 * Benefícios:
 * - Separação de responsabilidades (lógica de dados isolada)
 * - Reutilizável em outros componentes
 * - Testável independentemente
 * - Componente de UI mais limpo
 */

export interface StudyBlock {
  id: string;
  day: number; // 0-6 (Dom-Sáb)
  startHour: number;
  duration: number; // em horas
  subject: string;
  description?: string;
}

interface AddBlockParams {
  day: number;
  startHour: number;
  endHour: number;
  subject: string;
  description?: string;
}

const STORAGE_KEY = 'studyflow_planner';

export function useStudyPlanner() {
  const [studyBlocks, setStudyBlocks] = useState<StudyBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setStudyBlocks(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar planejamento:', error);
      toast.error('Erro ao carregar planejamento salvo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever studyBlocks changes
  useEffect(() => {
    // Skip saving on initial load
    if (isLoading) return;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(studyBlocks));
      }
    } catch (error) {
      console.warn('Erro ao salvar planejamento:', error);
      toast.error('Erro ao salvar planejamento');
    }
  }, [studyBlocks, isLoading]);

  /**
   * Add a new study block
   */
  const addBlock = useCallback((params: AddBlockParams): boolean => {
    const { day, startHour, endHour, subject, description } = params;

    // Validation
    if (!subject.trim()) {
      toast.error('Por favor, adicione uma matéria');
      return false;
    }

    if (endHour <= startHour) {
      toast.error('O horário de término deve ser posterior ao horário de início');
      return false;
    }

    // Create new block
    const newBlock: StudyBlock = {
      id: Date.now().toString(),
      day,
      startHour,
      duration: endHour - startHour,
      subject: subject.trim(),
      description: description?.trim() || '',
    };

    setStudyBlocks(prev => [...prev, newBlock]);
    toast.success('Bloco de estudo adicionado!');
    return true;
  }, []);

  /**
   * Update an existing study block
   */
  const updateBlock = useCallback((blockId: string, params: AddBlockParams): boolean => {
    const { day, startHour, endHour, subject, description } = params;

    // Validation
    if (!subject.trim()) {
      toast.error('Por favor, adicione uma matéria');
      return false;
    }

    if (endHour <= startHour) {
      toast.error('O horário de término deve ser posterior ao horário de início');
      return false;
    }

    setStudyBlocks(prev =>
      prev.map(block =>
        block.id === blockId
          ? {
              ...block,
              day,
              startHour,
              duration: endHour - startHour,
              subject: subject.trim(),
              description: description?.trim() || '',
            }
          : block
      )
    );

    toast.success('Bloco de estudo atualizado!');
    return true;
  }, []);

  /**
   * Delete a study block
   */
  const deleteBlock = useCallback((blockId: string) => {
    setStudyBlocks(prev => prev.filter(block => block.id !== blockId));
    toast.success('Bloco removido');
  }, []);

  /**
   * Get blocks for a specific day and hour
   */
  const getBlocksForDayAndHour = useCallback((day: number, hour: number): StudyBlock[] => {
    return studyBlocks.filter(
      block =>
        block.day === day &&
        hour >= block.startHour &&
        hour < block.startHour + block.duration
    );
  }, [studyBlocks]);

  /**
   * Get total hours for the current week
   */
  const getTotalHours = useCallback((): number => {
    return studyBlocks.reduce((acc, block) => acc + block.duration, 0);
  }, [studyBlocks]);

  return {
    studyBlocks,
    isLoading,
    addBlock,
    updateBlock,
    deleteBlock,
    getBlocksForDayAndHour,
    getTotalHours,
  };
}
