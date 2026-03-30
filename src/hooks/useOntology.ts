import { useState, useEffect, useCallback } from 'react';
import { ontologyService } from '../services/ontologyService';
import { OntologyNode } from '../types/ontology';

/**
 * Hook for managing ontology state
 */
export function useOntology() {
  const [nodes, setNodes] = useState<OntologyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    ontologyService.getInitialModel().then(data => {
      setNodes(data.nodes);
      setLoading(false);
    });
  }, []);

  const selectNode = useCallback((id: string) => {
    setSelectedNodeId(id);
  }, []);

  return {
    nodes,
    loading,
    selectedNodeId,
    selectNode,
  };
}
