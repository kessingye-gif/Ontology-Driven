export enum ModelType {
  OBJECT = 'object',
  BEHAVIOR = 'behavior',
  RULE = 'rule',
  EVENT = 'event',
  SCENE = 'scene',
}

export interface OntologyNode {
  id: string;
  name: string;
  type: ModelType;
  parentId?: string;
  properties?: Record<string, any>;
  metadata?: Record<string, any>;
  description?: string;
}

export interface OntologyEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface OntologyModel {
  nodes: OntologyNode[];
  edges: OntologyEdge[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  action?: {
    type: string;
    payload: any;
  };
}
