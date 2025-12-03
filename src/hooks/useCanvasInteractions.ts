import { useState, useCallback, useRef } from 'react';
import type { Node } from './useMindMapData';

export type ToolMode = 'add' | 'move' | 'connect' | 'delete' | 'pan';

/**
 * Hook customizado para gerenciar interações do canvas (pan, zoom, drag)
 * 
 * Responsabilidades:
 * - Gerenciar estado de pan/zoom
 * - Gerenciar dragging de nodes
 * - Handlers de eventos de mouse/touch
 * - Pinch-to-zoom (mobile)
 * 
 * @param mode - Modo atual da ferramenta
 * @param nodes - Array de nodes (para calcular posições)
 * @param onNodeUpdate - Callback quando node é movido
 * @returns Estado e handlers de interação
 */
export function useCanvasInteractions(
  mode: ToolMode,
  nodes: Node[],
  onNodeUpdate: (nodeId: string, x: number, y: number) => void
) {
  // Pan & Zoom State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Node Dragging State
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const nodeInitialPosRef = useRef({ x: 0, y: 0 });

  // Touch State (pinch zoom)
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

  // Touch distance calculation for pinch zoom
  const getTouchDistance = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  /**
   * Inicia drag de um node
   * Calcula offset corretamente para evitar "puxar para o canto"
   */
  const startNodeDrag = useCallback((nodeId: string, e: React.MouseEvent | React.TouchEvent) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggingNode(nodeId);
    
    // Armazena posição inicial do node
    nodeInitialPosRef.current = { x: node.x, y: node.y };
    
    // Offset será usado para calcular movimento relativo
    dragOffsetRef.current = { x: 0, y: 0 };
  }, [nodes]);

  /**
   * Manipula movimento do mouse/touch
   * Performance otimizada: usa movementX/Y quando disponível
   */
  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const touches = 'touches' in e ? e.touches : null;

    // Handle pinch zoom (mobile)
    if (touches && touches.length === 2) {
      const distance = getTouchDistance(touches);
      if (distance && lastTouchDistance) {
        const delta = distance / lastTouchDistance;
        const newZoom = Math.max(0.5, Math.min(3, zoom * delta));
        setZoom(newZoom);
        setLastTouchDistance(distance);
      }
      return;
    }

    const clientX = touches ? touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = touches ? touches[0].clientY : (e as React.MouseEvent).clientY;

    // Handle panning
    if (isPanning && mode === 'pan') {
      setPan({
        x: clientX - panStart.x,
        y: clientY - panStart.y,
      });
      return;
    }

    // Handle node dragging - FIX: usa movementX/Y quando disponível
    if (draggingNode && mode === 'move') {
      const mouseEvent = e as React.MouseEvent;
      
      if (mouseEvent.movementX !== undefined && mouseEvent.movementY !== undefined) {
        // Usa movement (mais preciso e simples)
        const deltaX = mouseEvent.movementX / zoom;
        const deltaY = mouseEvent.movementY / zoom;
        
        const node = nodes.find(n => n.id === draggingNode);
        if (node) {
          onNodeUpdate(draggingNode, node.x + deltaX, node.y + deltaY);
        }
      } else {
        // Fallback para touch ou navegadores antigos
        dragOffsetRef.current.x += clientX;
        dragOffsetRef.current.y += clientY;
        
        const newX = nodeInitialPosRef.current.x + (dragOffsetRef.current.x / zoom);
        const newY = nodeInitialPosRef.current.y + (dragOffsetRef.current.y / zoom);
        
        onNodeUpdate(draggingNode, newX, newY);
      }
    }
  }, [isPanning, mode, pan, panStart, draggingNode, zoom, nodes, onNodeUpdate, getTouchDistance, lastTouchDistance]);

  /**
   * Inicia panning/pinch zoom
   */
  const handleContainerMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (mode === 'pan' || (mode === 'move' && !draggingNode)) {
      const touches = 'touches' in e ? e.touches : null;
      
      // Check for pinch zoom gesture (2 fingers)
      if (touches && touches.length === 2) {
        const distance = getTouchDistance(touches);
        setLastTouchDistance(distance);
        return;
      }

      // Start panning
      setIsPanning(true);
      const clientX = touches ? touches[0].clientX : e.clientX;
      const clientY = touches ? touches[0].clientY : e.clientY;
      setPanStart({ x: clientX - pan.x, y: clientY - pan.y });
    }
  }, [mode, draggingNode, pan, getTouchDistance]);

  /**
   * Finaliza drag/pan
   */
  const handleMouseUp = useCallback(() => {
    setDraggingNode(null);
    setIsPanning(false);
    setLastTouchDistance(null);
    dragOffsetRef.current = { x: 0, y: 0 };
  }, []);

  /**
   * Zoom In
   */
  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(3, prev + 0.2));
  }, []);

  /**
   * Zoom Out
   */
  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(0.5, prev - 0.2));
  }, []);

  /**
   * Reseta view (pan = 0, zoom = 1)
   */
  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  return {
    // State
    pan,
    zoom,
    isPanning,
    draggingNode,

    // Setters (para reset quando muda de mapa)
    setPan,
    setZoom,

    // Handlers
    handleMouseMove,
    handleContainerMouseDown,
    handleMouseUp,
    startNodeDrag,

    // Utilities
    zoomIn,
    zoomOut,
    resetView,
  };
}
