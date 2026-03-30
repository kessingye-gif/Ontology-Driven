import React from 'react';
import { X, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { OntologyNode, ModelType } from '../../types/ontology';
import { behaviorEngine } from '../../core/behaviorEngine';
import { cn } from '../../utils/cn';

interface NodeDetailsProps {
  node: OntologyNode;
  allNodes: OntologyNode[];
  onClose: () => void;
}

export const NodeDetails = ({ node, allNodes, onClose }: NodeDetailsProps) => {
  return (
    <div className="w-96 bg-white overflow-y-auto p-6 animate-in slide-in-from-right duration-300 border-l border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <span className="w-2 h-6 bg-blue-600 rounded-full mr-3" />
          {node.name}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>
      
      {node.description && (
        <div className="mb-8">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">描述</div>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
            {node.description}
          </p>
        </div>
      )}

      {node.properties?.fields && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">属性列表</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-[10px] text-pink-600 hover:bg-pink-50"
              onClick={() => {
                behaviorEngine.execute('beh-contract-list', { nodeId: node.id });
              }}
            >
              <Eye size={10} className="mr-1" /> 预览数据
            </Button>
          </div>
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">属性名</th>
                  <th className="px-3 py-2 font-semibold">标签</th>
                  <th className="px-3 py-2 font-semibold">类型</th>
                  <th className="px-3 py-2 font-semibold text-center">必填</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {node.properties.fields.map((f: any) => (
                  <tr key={f.name} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2 font-mono text-blue-600">{f.name}</td>
                    <td className="px-3 py-2 text-slate-600">{f.label}</td>
                    <td className="px-3 py-2 text-slate-400">{f.type}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[10px]",
                        f.required === '是' ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-400"
                      )}>
                        {f.required}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
