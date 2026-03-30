import { ChevronRight, ChevronDown, Folder, FileText, Box, Zap, ShieldCheck, Bell, Layout, Monitor, Plus, Edit3, Trash2, Search } from 'lucide-react';
import React, { useState } from 'react';
import { OntologyNode, ModelType } from '../../types/ontology';
import { cn } from '../../utils/cn';

interface ModelTreeProps {
  nodes: OntologyNode[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onAction?: (type: 'create' | 'edit' | 'delete' | 'list', nodeId: string) => void;
}

const IconMap = {
  [ModelType.OBJECT]: Box,
  [ModelType.BEHAVIOR]: Zap,
  [ModelType.RULE]: ShieldCheck,
  [ModelType.EVENT]: Bell,
  [ModelType.SCENE]: Layout,
};

export const ModelTree = ({ nodes, selectedId, onSelect, onAction }: ModelTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 
    'obj-root': true, 
    'beh-root': true, 
    'rule-root': true, 
    'evt-root': true, 
    'scene-root': true,
    'obj-contract': true
  });

  const toggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (parentId: string | undefined = undefined, level = 0) => {
    const children = nodes.filter(n => n.parentId === parentId);
    
    return children.map(node => {
      const hasChildren = nodes.some(n => n.parentId === node.id);
      const isExpanded = expanded[node.id];
      const Icon = IconMap[node.type] || Folder;
      const isSelected = selectedId === node.id;

      return (
        <div key={node.id} className="select-none">
          <div 
            className={cn(
              "flex items-center py-1 px-2 rounded-md cursor-pointer text-sm group transition-colors",
              isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-slate-100 text-slate-600"
            )}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => onSelect(node.id)}
          >
            <span className="w-4 h-4 mr-1 flex items-center justify-center">
              {hasChildren && (
                <button onClick={(e) => toggle(node.id, e)} className="hover:bg-slate-200 rounded">
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
              )}
            </span>
            <Icon size={14} className={cn("mr-2", isSelected ? "text-blue-500" : "text-slate-400")} />
            <span className="truncate flex-1">{node.name}</span>
            
            {(node.type === ModelType.OBJECT && node.parentId === 'obj-root') && (
              <div className="hidden group-hover:flex items-center space-x-1 ml-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onAction?.('create', node.id); }}
                  className="p-1 hover:bg-blue-100 text-blue-500 rounded"
                  title="录入"
                >
                  <Plus size={12} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onAction?.('list', node.id); }}
                  className="p-1 hover:bg-emerald-100 text-emerald-500 rounded"
                  title="查询"
                >
                  <Search size={12} />
                </button>
              </div>
            )}
          </div>
          {hasChildren && isExpanded && (
            <div className="mt-0.5">
              {renderNode(node.id, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-2 space-y-1">
      <div className="px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">模型树</div>
      {renderNode()}
    </div>
  );
};
