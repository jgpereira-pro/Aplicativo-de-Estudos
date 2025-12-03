import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Node {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

export interface MindMap {
  id: string;
  name: string;
  nodes: Node[];
  connections: Connection[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Hook customizado para gerenciar estado e persistência de Mapas Mentais
 * 
 * Responsabilidades:
 * - Carregar/salvar mapas no localStorage
 * - Gerenciar lista de mapas (criar, deletar, renomear)
 * - Gerenciar mapa atual (nodes, connections)
 * - Auto-save quando nodes/connections mudam
 * 
 * @param initialMapId - ID inicial do mapa (opcional)
 * @returns Estado e funções de manipulação de mapas
 */
export function useMindMapData(initialMapId?: string) {
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [currentMapId, setCurrentMapId] = useState<string | null>(initialMapId || null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  // Load maps from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedMaps = localStorage.getItem('studyflow_mindmaps');
        if (storedMaps) {
          const maps = JSON.parse(storedMaps);
          setMindMaps(maps);
          if (maps.length > 0 && !currentMapId) {
            loadMap(maps[0].id, maps);
          }
        } else if (mindMaps.length === 0) {
          // Create default map if none exists
          createNewMap('Meu Primeiro Mapa');
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar mapas:', error);
    }
  }, []);

  // Save maps to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && mindMaps.length > 0) {
        localStorage.setItem('studyflow_mindmaps', JSON.stringify(mindMaps));
      }
    } catch (error) {
      console.warn('Erro ao salvar mapas:', error);
    }
  }, [mindMaps]);

  // Auto-save current map when nodes/connections change
  useEffect(() => {
    if (currentMapId) {
      saveCurrentMap();
    }
  }, [nodes, connections]);

  const getCurrentMap = useCallback(() => {
    return mindMaps.find(m => m.id === currentMapId);
  }, [mindMaps, currentMapId]);

  const saveCurrentMap = useCallback(() => {
    if (!currentMapId) return;

    setMindMaps(maps =>
      maps.map(map =>
        map.id === currentMapId
          ? { ...map, nodes, connections, updatedAt: Date.now() }
          : map
      )
    );
  }, [currentMapId, nodes, connections]);

  const loadMap = useCallback((mapId: string, mapsArray?: MindMap[]) => {
    const maps = mapsArray || mindMaps;
    const map = maps.find(m => m.id === mapId);
    if (map) {
      setCurrentMapId(mapId);
      setNodes(map.nodes);
      setConnections(map.connections);
      toast.success(`Mapa "${map.name}" carregado`);
    }
  }, [mindMaps]);

  const createNewMap = useCallback((name: string) => {
    const mapName = name.trim() || 'Novo Mapa Mental';
    const newMap: MindMap = {
      id: Date.now().toString(),
      name: mapName,
      nodes: [],
      connections: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setMindMaps(prev => [...prev, newMap]);
    setCurrentMapId(newMap.id);
    setNodes([]);
    setConnections([]);
    toast.success(`Mapa "${mapName}" criado!`);

    return newMap.id;
  }, []);

  const deleteMap = useCallback((mapId: string) => {
    const map = mindMaps.find(m => m.id === mapId);
    if (!map) return;

    const updatedMaps = mindMaps.filter(m => m.id !== mapId);
    setMindMaps(updatedMaps);

    if (currentMapId === mapId) {
      if (updatedMaps.length > 0) {
        loadMap(updatedMaps[0].id, updatedMaps);
      } else {
        setCurrentMapId(null);
        setNodes([]);
        setConnections([]);
      }
    }

    toast.success(`Mapa "${map.name}" deletado`);
  }, [mindMaps, currentMapId, loadMap]);

  const renameCurrentMap = useCallback((newName: string) => {
    if (!currentMapId || !newName.trim()) return;

    setMindMaps(maps =>
      maps.map(map =>
        map.id === currentMapId
          ? { ...map, name: newName.trim(), updatedAt: Date.now() }
          : map
      )
    );
    toast.success('Mapa renomeado!');
  }, [currentMapId]);

  const updateNode = useCallback((nodeId: string, updates: Partial<Node>) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...updates } : n));
  }, []);

  const addNode = useCallback((node: Node) => {
    setNodes(prev => [...prev, node]);
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
  }, []);

  const addConnection = useCallback((connection: Connection) => {
    setConnections(prev => [...prev, connection]);
  }, []);

  const clearBoard = useCallback(() => {
    setNodes([]);
    setConnections([]);
  }, []);

  return {
    // State
    mindMaps,
    currentMapId,
    nodes,
    connections,
    currentMap: getCurrentMap(),

    // Map management
    loadMap,
    createNewMap,
    deleteMap,
    renameCurrentMap,
    saveCurrentMap,

    // Node management
    updateNode,
    addNode,
    removeNode,
    setNodes,

    // Connection management
    addConnection,
    setConnections,

    // Utilities
    clearBoard,
  };
}
