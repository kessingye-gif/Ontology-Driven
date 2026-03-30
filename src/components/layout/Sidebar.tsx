import React from 'react';
import { ModelTree } from '../../features/ontology/ModelTree';
import { OntologyNode } from '../../types/ontology';

interface SidebarProps {
  nodes: OntologyNode[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAction: (type: string, nodeId: string) => void;
}

export const Sidebar = ({ nodes, selectedId, onSelect, onAction }: SidebarProps) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="flex-1 overflow-y-auto">
        <ModelTree 
          nodes={nodes} 
          selectedId={selectedId} 
          onSelect={onSelect} 
          onAction={onAction}
        />
      </div>
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
            <img src="https://picsum.photos/seed/user/100/100" alt="User" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold truncate">系统管理员</div>
            <div className="text-[10px] text-slate-400 truncate">pycodegame@gmail.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
