import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Move, Link2, Trash2, Type } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { BottomNavigation } from './shared/BottomNavigation';
import { motion, AnimatePresence } from 'motion/react';

interface ConceptBoardScreenProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  navItems: Array<{ id: string; label: string; icon: any }>;
}

interface Node {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

type ToolMode = 'add' | 'move' | 'connect' | 'delete';

const NODE_COLORS = [
  '#20C997', // primary teal
  '#495057', // dark gray
  '#6C757D', // medium gray
  '#17a2b8', // info blue-teal
];

export function ConceptBoardScreen({ activeTab, onTabChange, navItems }: ConceptBoardScreenProps) {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', x: 120, y: 150, text: 'Conceito Principal', color: '#20C997' },
    { id: '2', x: 260, y: 100, text: 'Ideia A', color: '#495057' },
    { id: '3', x: 260, y: 200, text: 'Ideia B', color: '#6C757D' },
  ]);
  const [connections, setConnections] = useState<Connection[]>([
    { id: 'c1', from: '1', to: '2' },
    { id: 'c1', from: '1', to: '3' },
  ]);
  const [mode, setMode] = useState<ToolMode>('move');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Draw connections on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);

      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x + 60, fromNode.y + 20); // center of node
        ctx.lineTo(toNode.x + 60, toNode.y + 20);
        ctx.strokeStyle = '#ADB5BD'; // neutral gray
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, [nodes, connections]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'add') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: Node = {
      id: Date.now().toString(),
      x: x - 60, // center the node
      y: y - 20,
      text: 'Novo Conceito',
      color: NODE_COLORS[nodes.length % NODE_COLORS.length],
    };

    setNodes([...nodes, newNode]);
  };

  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    if (mode === 'move') {
      setDraggingNode(nodeId);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setDragOffset({
        x: clientX - node.x,
        y: clientY - node.y,
      });
    } else if (mode === 'connect') {
      if (!connectingFrom) {
        setConnectingFrom(nodeId);
        setSelectedNode(nodeId);
      } else {
        // Create connection
        if (connectingFrom !== nodeId) {
          const newConnection: Connection = {
            id: Date.now().toString(),
            from: connectingFrom,
            to: nodeId,
          };
          setConnections([...connections, newConnection]);
        }
        setConnectingFrom(null);
        setSelectedNode(null);
      }
    } else if (mode === 'delete') {
      // Delete node and its connections
      setNodes(nodes.filter(n => n.id !== nodeId));
      setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingNode || mode !== 'move') return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const newX = Math.max(0, Math.min(clientX - rect.left - dragOffset.x, rect.width - 120));
    const newY = Math.max(0, Math.min(clientY - rect.top - dragOffset.y, rect.height - 40));

    setNodes(nodes.map(n =>
      n.id === draggingNode ? { ...n, x: newX, y: newY } : n
    ));
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleNodeDoubleClick = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(nodeId);
      setEditText(node.text);
    }
  };

  const handleEditComplete = () => {
    if (editingNode && editText.trim()) {
      setNodes(nodes.map(n =>
        n.id === editingNode ? { ...n, text: editText.trim() } : n
      ));
    }
    setEditingNode(null);
    setEditText('');
  };

  const clearBoard = () => {
    setNodes([]);
    setConnections([]);
    setConnectingFrom(null);
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5EFE6]">
      {/* Header */}
      <div className="bg-white border-b border-[#E6FAF4] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTabChange('home')}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-[#495057]">Quadro de Conceitos</h1>
            <p className="text-xs text-[#495057]/60">Organize suas ideias visualmente</p>
          </div>
        </div>
        {nodes.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearBoard}
            className="text-[#495057]/60 hover:text-[#495057] rounded-xl"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-white"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{
          touchAction: 'none',
          cursor: mode === 'add' ? 'crosshair' : mode === 'move' ? 'grab' : 'pointer',
        }}
      >
        {/* Canvas for connections */}
        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Nodes */}
        {nodes.map(node => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
            }}
            onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
            onTouchStart={(e) => handleNodeMouseDown(node.id, e)}
            onDoubleClick={() => handleNodeDoubleClick(node.id)}
            className={`
              select-none touch-target
              ${draggingNode === node.id ? 'z-50' : 'z-10'}
              ${selectedNode === node.id ? 'ring-2 ring-[#20C997] ring-offset-2' : ''}
            `}
          >
            {editingNode === node.id ? (
              <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-[#20C997]">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={handleEditComplete}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditComplete();
                    if (e.key === 'Escape') {
                      setEditingNode(null);
                      setEditText('');
                    }
                  }}
                  autoFocus
                  className="w-[110px] h-8 text-sm rounded-lg"
                />
              </div>
            ) : (
              <Badge
                variant="outline"
                style={{
                  borderColor: node.color,
                  color: node.color,
                  backgroundColor: 'white',
                }}
                className="px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                {node.text}
              </Badge>
            )}
          </motion.div>
        ))}

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center max-w-xs px-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E6FAF4] flex items-center justify-center">
                <Type className="w-8 h-8 text-[#20C997]" />
              </div>
              <h3 className="text-[#495057] mb-2">Canvas Vazio</h3>
              <p className="text-sm text-[#495057]/60">
                Toque em <span className="text-[#20C997]">+</span> e clique no canvas para adicionar conceitos
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Toolbar */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40">
        <Card className="bg-white shadow-lg border-[#E6FAF4] rounded-2xl p-2 flex items-center gap-1">
          <Button
            variant={mode === 'add' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setMode('add')}
            className={`rounded-xl touch-target ${
              mode === 'add'
                ? 'bg-[#20C997] text-white hover:bg-[#1ab386]'
                : 'text-[#495057]/60 hover:text-[#495057] hover:bg-[#E6FAF4]'
            }`}
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </Button>

          <Button
            variant={mode === 'move' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => {
              setMode('move');
              setConnectingFrom(null);
              setSelectedNode(null);
            }}
            className={`rounded-xl touch-target ${
              mode === 'move'
                ? 'bg-[#20C997] text-white hover:bg-[#1ab386]'
                : 'text-[#495057]/60 hover:text-[#495057] hover:bg-[#E6FAF4]'
            }`}
          >
            <Move className="w-5 h-5" strokeWidth={2.5} />
          </Button>

          <Button
            variant={mode === 'connect' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => {
              setMode('connect');
              setConnectingFrom(null);
              setSelectedNode(null);
            }}
            className={`rounded-xl touch-target ${
              mode === 'connect'
                ? 'bg-[#20C997] text-white hover:bg-[#1ab386]'
                : 'text-[#495057]/60 hover:text-[#495057] hover:bg-[#E6FAF4]'
            }`}
          >
            <Link2 className="w-5 h-5" strokeWidth={2.5} />
          </Button>

          <Button
            variant={mode === 'delete' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => {
              setMode('delete');
              setConnectingFrom(null);
              setSelectedNode(null);
            }}
            className={`rounded-xl touch-target ${
              mode === 'delete'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'text-[#495057]/60 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Trash2 className="w-5 h-5" strokeWidth={2.5} />
          </Button>
        </Card>
      </div>

      {/* Mode Indicator */}
      <AnimatePresence>
        {mode !== 'move' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30"
          >
            <Badge className="bg-white text-[#495057] shadow-md rounded-xl px-4 py-2">
              {mode === 'add' && 'Toque no canvas para adicionar'}
              {mode === 'connect' && (connectingFrom ? 'Selecione o destino' : 'Selecione a origem')}
              {mode === 'delete' && 'Toque em um conceito para deletar'}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNavigation items={navItems} activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
