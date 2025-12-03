import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Plus, Move, Link2, Trash2, Type, Save, FileText, MoreVertical, ZoomIn, ZoomOut, FolderOpen, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogPortal, AlertDialogOverlay } from './ui/alert-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { useMindMapData, type Node, type Connection } from '../hooks/useMindMapData';
import { useCanvasInteractions, type ToolMode } from '../hooks/useCanvasInteractions';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';

interface ConceptBoardScreenProps {
  onBack: () => void;
}

const NODE_COLORS = [
  '#F5EFE6', // Areia (Padrão)
  '#20C997', // Verde Água (Primária)
  '#E6FAF4', // Verde Água Claro (Acento)
  '#ADB5BD', // Cinza Suave (Muted)
  '#FFFFFF', // Branco
];

const DEFAULT_NODE_COLOR = '#F5EFE6'; // Cor padrão para novos nós

export function ConceptBoardScreen({ onBack }: ConceptBoardScreenProps) {
  // ====================================
  // LOCAL STATE (UI-SPECIFIC) - Definido primeiro!
  // ====================================
  
  const [mode, setMode] = useState<ToolMode>('move');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Drawer/Dialog State
  const [isMapDrawerOpen, setIsMapDrawerOpen] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [isMapsManagerOpen, setIsMapsManagerOpen] = useState(false);
  const [mapToDelete, setMapToDelete] = useState<{ id: string; name: string } | null>(null);

  // ====================================
  // HOOKS CUSTOMIZADOS (LÓGICA ISOLADA)
  // ====================================
  
  const {
    mindMaps,
    currentMapId,
    nodes,
    connections,
    currentMap,
    loadMap,
    createNewMap,
    deleteMap,
    renameCurrentMap,
    saveCurrentMap,
    updateNode,
    addNode,
    removeNode,
    setNodes,
    addConnection,
    setConnections,
    clearBoard,
  } = useMindMapData();

  const {
    pan,
    zoom,
    isPanning,
    draggingNode,
    setPan,
    setZoom,
    handleMouseMove,
    handleContainerMouseDown,
    handleMouseUp,
    startNodeDrag,
    zoomIn,
    zoomOut,
    resetView,
  } = useCanvasInteractions(
    mode,
    nodes,
    useCallback((nodeId: string, x: number, y: number) => {
      updateNode(nodeId, { x, y });
    }, [updateNode])
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Renderiza conexões no canvas
  useCanvasRenderer(canvasRef, containerRef, nodes, connections, pan, zoom);

  // ====================================
  // MEMOIZED CALLBACKS (PERFORMANCE)
  // ====================================

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'add') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const newNode: Node = {
      id: Date.now().toString(),
      x: x - 60, // center the node
      y: y - 20,
      text: 'Novo Conceito',
      color: DEFAULT_NODE_COLOR,
    };

    addNode(newNode);
  }, [mode, pan, zoom, addNode]);

  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    if (mode === 'move') {
      // Select node for color picker
      setSelectedNode(nodeId);
      startNodeDrag(nodeId, e);
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
          addConnection(newConnection);
        }
        setConnectingFrom(null);
        setSelectedNode(null);
      }
    } else if (mode === 'delete') {
      removeNode(nodeId);
      setSelectedNode(null);
    }
  }, [mode, connectingFrom, startNodeDrag, addConnection, removeNode]);

  const handleNodeClick = useCallback((nodeId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    if (mode === 'move' && !draggingNode) {
      // Select node for color customization
      setSelectedNode(selectedNode === nodeId ? null : nodeId);
    }
  }, [mode, draggingNode, selectedNode]);

  const handleChangeNodeColor = useCallback((nodeId: string, newColor: string) => {
    updateNode(nodeId, { color: newColor });
  }, [updateNode]);

  const handleNodeDoubleClick = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(nodeId);
      setEditText(node.text);
    }
  }, [nodes]);

  const handleEditComplete = useCallback(() => {
    if (editingNode && editText.trim()) {
      updateNode(editingNode, { text: editText.trim() });
    }
    setEditingNode(null);
    setEditText('');
  }, [editingNode, editText, updateNode]);

  const handleCreateMap = useCallback(() => {
    const mapName = newMapName.trim() || 'Novo Mapa Mental';
    createNewMap(mapName);
    setNewMapName('');
    setIsMapDrawerOpen(false);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, [newMapName, createNewMap, setPan, setZoom]);

  const handleLoadMap = useCallback((mapId: string) => {
    loadMap(mapId);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, [loadMap, setPan, setZoom]);

  const handleDeleteMap = useCallback(() => {
    if (mapToDelete) {
      deleteMap(mapToDelete.id);
      setMapToDelete(null);
    }
  }, [mapToDelete, deleteMap]);

  // ====================================
  // RENDER (FOCADO EM JSX)
  // ====================================

  return (
    <div className="flex flex-col h-full bg-[#F5EFE6]">
      {/* Header */}
      <div className="bg-white border-b border-[#E6FAF4] px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-[#495057]">{currentMap?.name || 'Mapa Mental'}</h1>
              <p className="text-xs text-[#495057]/60">Organize suas ideias visualmente</p>
            </div>
          </div>

          {/* Maps Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsMapDrawerOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Novo Mapa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsMapsManagerOpen(true)}>
                <FolderOpen className="w-4 h-4 mr-2" />
                Gerenciar Mapas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={saveCurrentMap}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Mapa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {mindMaps.slice(0, 3).map(map => (
                <DropdownMenuItem
                  key={map.id}
                  onClick={() => handleLoadMap(map.id)}
                  className={currentMapId === map.id ? 'bg-[#E6FAF4]' : ''}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {map.name}
                </DropdownMenuItem>
              ))}
              {mindMaps.length > 3 && (
                <DropdownMenuItem onClick={() => setIsMapsManagerOpen(true)} className="text-[#20C997]">
                  Ver todos ({mindMaps.length})
                </DropdownMenuItem>
              )}
              {nodes.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearBoard} className="text-red-500">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar Quadro
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-white"
        onMouseDown={handleContainerMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleContainerMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{
          touchAction: 'none',
          cursor: mode === 'add' ? 'crosshair' : mode === 'pan' ? (isPanning ? 'grabbing' : 'grab') : mode === 'move' ? 'grab' : 'pointer',
        }}
      >
        {/* Canvas for connections */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Content with pan/zoom transform */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            width: '100%',
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
          }}
        >
          {/* Nodes */}
          {nodes.map(node => (
            <div key={node.id} style={{ position: 'relative' }}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)',
                  pointerEvents: 'auto',
                }}
                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                onTouchStart={(e) => handleNodeMouseDown(node.id, e)}
                onDoubleClick={() => handleNodeDoubleClick(node.id)}
                onClick={mode === 'add' ? handleCanvasClick : undefined}
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
                      borderColor: node.color === '#FFFFFF' ? '#E6FAF4' : node.color,
                      color: '#495057',
                      backgroundColor: node.color,
                    }}
                    className="px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {node.text}
                  </Badge>
                )}
              </motion.div>

              {/* Color Picker Menu - Only show for selected node in move mode */}
              {selectedNode === node.id && mode === 'move' && !editingNode && !draggingNode && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  style={{
                    position: 'absolute',
                    left: node.x + 60,
                    top: node.y - 50,
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)',
                    pointerEvents: 'auto',
                  }}
                  className="z-50"
                >
                  <Card className="bg-white shadow-lg border-[#E6FAF4] rounded-2xl p-2 flex items-center gap-2">
                    {NODE_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChangeNodeColor(node.id, color);
                        }}
                        className={`
                          w-8 h-8 rounded-full border-2 transition-all duration-200
                          active:scale-90 touch-target
                          ${node.color === color ? 'border-[#20C997] ring-2 ring-[#20C997]/30' : 'border-[#E6FAF4] hover:border-[#20C997]/50'}
                        `}
                        style={{
                          backgroundColor: color,
                          transform: 'translateZ(0)',
                        }}
                        title={
                          color === '#F5EFE6' ? 'Areia (Padrão)' :
                          color === '#20C997' ? 'Verde Água' :
                          color === '#E6FAF4' ? 'Verde Claro' :
                          color === '#ADB5BD' ? 'Cinza Suave' :
                          'Branco'
                        }
                      />
                    ))}
                  </Card>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Add node on click in add mode */}
        {mode === 'add' && (
          <div
            className="absolute inset-0"
            onClick={handleCanvasClick}
            style={{ pointerEvents: 'auto' }}
          />
        )}

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

      {/* Zoom Controls */}
      <div className="absolute top-24 right-4 z-40">
        <Card className="bg-white shadow-lg border-[#E6FAF4] rounded-2xl p-1 flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomIn}
            className="rounded-xl touch-target text-[#495057]/60 hover:text-[#495057] hover:bg-[#E6FAF4]"
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomOut}
            className="rounded-xl touch-target text-[#495057]/60 hover:text-[#495057] hover:bg-[#E6FAF4]"
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
          <div className="px-2 py-1 text-xs text-center text-[#495057]/60">
            {Math.round(zoom * 100)}%
          </div>
        </Card>
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
              {mode === 'pan' && 'Arraste para navegar pelo mapa'}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Map Drawer */}
      <Drawer open={isMapDrawerOpen} onOpenChange={setIsMapDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Criar Novo Mapa Mental</DrawerTitle>
            <DrawerDescription>
              Dê um nome para o seu novo mapa mental
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mapName">Nome do Mapa *</Label>
              <Input
                id="mapName"
                placeholder="Ex: Mapa de Estudos, Projeto X..."
                value={newMapName}
                onChange={(e) => setNewMapName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newMapName.trim()) {
                    handleCreateMap();
                  }
                }}
                className="rounded-xl"
              />
            </div>
            <Button
              onClick={handleCreateMap}
              disabled={!newMapName.trim()}
              className="w-full min-h-[48px] rounded-xl bg-[#20C997] hover:bg-[#1ab386] text-white"
            >
              Criar Mapa
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Maps Manager Drawer */}
      <Drawer open={isMapsManagerOpen} onOpenChange={setIsMapsManagerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Gerenciar Mapas Mentais</DrawerTitle>
            <DrawerDescription>
              {mindMaps.length === 0 
                ? 'Nenhum mapa criado ainda'
                : `${mindMaps.length} ${mindMaps.length === 1 ? 'mapa salvo' : 'mapas salvos'}`
              }
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8 max-h-[60vh] overflow-y-auto">
            {mindMaps.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E6FAF4] flex items-center justify-center">
                  <FileText className="w-8 h-8 text-[#20C997]" />
                </div>
                <p className="text-[#495057]/60 mb-4">Nenhum mapa mental criado ainda</p>
                <Button
                  onClick={() => {
                    setIsMapsManagerOpen(false);
                    setIsMapDrawerOpen(true);
                  }}
                  className="rounded-xl bg-[#20C997] hover:bg-[#1ab386] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Mapa
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {mindMaps.map((map) => {
                    const nodeCount = map.nodes.length;
                    const connectionCount = map.connections.length;
                    const lastUpdated = new Date(map.updatedAt);
                    const formattedDate = lastUpdated.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <motion.div
                        key={map.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        <Card className={`
                          p-4 rounded-2xl border-2 transition-all duration-200
                          ${currentMapId === map.id 
                            ? 'border-[#20C997] bg-[#E6FAF4]/30' 
                            : 'border-[#E6FAF4] bg-white'
                          }
                        `}>
                          <div className="flex items-start justify-between gap-3">
                            {/* Map Info */}
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => {
                                handleLoadMap(map.id);
                                setIsMapsManagerOpen(false);
                              }}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-[#20C997]" />
                                <h3 className="text-[#495057]">{map.name}</h3>
                                {currentMapId === map.id && (
                                  <Badge className="bg-[#20C997] text-white text-xs px-2 py-0 rounded-lg">
                                    Atual
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-[#495057]/60 mt-2">
                                <span className="flex items-center gap-1">
                                  <Type className="w-3 h-3" />
                                  {nodeCount} {nodeCount === 1 ? 'nó' : 'nós'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Link2 className="w-3 h-3" />
                                  {connectionCount} {connectionCount === 1 ? 'conexão' : 'conexões'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-[#495057]/60 mt-1">
                                <Calendar className="w-3 h-3" />
                                {formattedDate}
                              </div>
                            </div>

                            {/* Actions Menu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-xl h-10 w-10 flex-shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="w-4 h-4 text-[#495057]/60" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() => {
                                    handleLoadMap(map.id);
                                    setIsMapsManagerOpen(false);
                                  }}
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  Abrir Mapa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setMapToDelete({ id: map.id, name: map.name });
                                  }}
                                  className="text-red-500 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Deletar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={!!mapToDelete} onOpenChange={(open) => !open && setMapToDelete(null)}>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent className="max-w-[90%] rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#495057]">
                Deletar Mapa Mental?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#495057]/70">
                Você tem certeza que deseja deletar <span className="font-semibold text-[#495057]">'{mapToDelete?.name}'</span>? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel 
                onClick={() => setMapToDelete(null)}
                className="rounded-xl min-h-[48px]"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteMap}
                className="rounded-xl min-h-[48px] bg-red-500 hover:bg-red-600 text-white"
              >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}