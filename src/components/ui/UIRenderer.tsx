/**
 * Carrier Renderer Skill: Implements "Metadata-First" and "Carrier Diversity".
 * Dynamically renders UI based on Carrier model definitions.
 */

import React, { useState, useEffect } from 'react';
import { OntologyNode, ModelType } from '../../types/ontology';
import { DataTable } from './DataTable';
import { FormGenerator } from './FormGenerator';
import { objectStore } from '../../core/objectStore';
import { eventBus } from '../../utils/eventBus';
import { StatusTag } from './StatusTag';

interface UIRendererProps {
  nodeId: string;
  allNodes: OntologyNode[];
  initialData?: any;
  onAction?: (type: string, payload: any) => void;
}

export const UIRenderer = ({ nodeId, allNodes, initialData, onAction }: UIRendererProps) => {
  const node = allNodes.find(n => n.id === nodeId);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Metadata-First Skill: Get rendering info from node metadata
  const targetObjectId = node?.metadata?.targetObjectId || node?.properties?.targetObjectId;
  const template = node?.metadata?.template || node?.properties?.template || 'table';
  const targetObject = allNodes.find(n => n.id === targetObjectId);

  useEffect(() => {
    if (targetObjectId) {
      // 1. Initial data fetch
      setData(objectStore.get(targetObjectId));

      // 2. Listen for data changes (EDA Skill)
      const unsubscribe = eventBus.on('data:changed', (change: any) => {
        if (change.objectId === targetObjectId) {
          setData(objectStore.get(targetObjectId));
        }
      });

      return () => unsubscribe();
    }
  }, [targetObjectId]);

  if (!node || !targetObject) {
    return <div className="p-8 text-center text-slate-400">未找到渲染上下文或目标对象模型</div>;
  }

  // Render based on template metadata
  if (template === 'form') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <FormGenerator 
          node={targetObject} 
          allNodes={allNodes} 
          initialData={initialData}
          onSuccess={(formData) => {
            if (initialData?.id) {
              objectStore.update(targetObjectId, initialData.id, formData);
            } else {
              objectStore.create(targetObjectId, formData);
            }
            onAction?.('CLOSE_TAB', { id: nodeId });
          }}
        />
      </div>
    );
  }

  if (template === 'table') {
    // Generate columns from object properties (Metadata-First Skill)
    const columns = (targetObject.properties?.fields || []).map((f: any) => ({
      key: f.name,
      header: f.label,
      render: (val: any) => {
        if (f.name === 'status') return <StatusTag status={val} />;
        if (f.type === 'Decimal') return `¥${Number(val).toLocaleString()}`;
        return val;
      }
    }));

    // Add generic actions column
    columns.push({
      key: 'actions',
      header: '操作',
      className: 'text-right',
      render: (_, record) => (
        <div className="flex items-center justify-end space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onAction?.('EDIT_RECORD', { nodeId, record }); }}
            className="text-blue-600 hover:text-blue-700 text-xs font-medium"
          >
            编辑
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onAction?.('DELETE_RECORD', { nodeId, record }); }}
            className="text-red-600 hover:text-red-700 text-xs font-medium"
          >
            删除
          </button>
        </div>
      )
    });

    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">{node.name}</h2>
          <button 
            onClick={() => onAction?.('OPEN_FORM', { targetObjectId })}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            新增数据
          </button>
        </div>
        <DataTable 
          columns={columns} 
          data={data} 
          loading={loading} 
          onRowClick={(record) => onAction?.('VIEW_DETAILS', { nodeId, record })}
        />
      </div>
    );
  }

  return <div className="p-8 text-center text-slate-400">不支持的渲染模板: {template}</div>;
};
