import { useEffect, useRef } from 'react';
import type { Node, Connection } from './useMindMapData';

/**
 * Hook customizado para renderizar conexões no canvas
 * 
 * Responsabilidades:
 * - Desenhar conexões entre nodes
 * - Aplicar transformações (pan/zoom)
 * - Otimizar performance com requestAnimationFrame
 * 
 * @param canvasRef - Ref do elemento canvas
 * @param containerRef - Ref do container (para tamanho)
 * @param nodes - Array de nodes
 * @param connections - Array de conexões
 * @param pan - Posição de pan {x, y}
 * @param zoom - Nível de zoom
 */
export function useCanvasRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  nodes: Node[],
  connections: Connection[],
  pan: { x: number; y: number },
  zoom: number
) {
  const rafIdRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Cancela animação anterior se existir
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Desenha no próximo frame (otimização de performance)
    rafIdRef.current = requestAnimationFrame(() => {
      // Set canvas size to match container
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Scale para device pixel ratio (telas high-DPI)
      ctx.scale(dpr, dpr);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply transforms
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw connections
      connections.forEach(conn => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);

        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x + 60, fromNode.y + 20); // center of node
          ctx.lineTo(toNode.x + 60, toNode.y + 20);
          ctx.strokeStyle = '#ADB5BD'; // neutral gray
          ctx.lineWidth = 2 / zoom; // Ajusta lineWidth baseado no zoom
          ctx.stroke();
        }
      });

      ctx.restore();
    });

    // Cleanup: cancela animação pendente
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [canvasRef, containerRef, nodes, connections, pan, zoom]);
}
