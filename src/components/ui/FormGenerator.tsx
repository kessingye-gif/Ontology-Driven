import React, { useState } from 'react';
import { OntologyNode } from '../../types/ontology';
import { Button } from './Button';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { logicEngine, LogicExpression } from '../../core/logicEngine';
import { eventBus } from '../../utils/eventBus';

interface FormGeneratorProps {
  node: OntologyNode;
  allNodes: OntologyNode[];
  initialData?: any;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

export const FormGenerator = ({ node, allNodes, initialData, onSuccess, onCancel }: FormGeneratorProps) => {
  const fields = node.properties?.fields || [];
  const rules = (node.properties?.rules || []) as LogicExpression[];
  
  const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const isEdit = !!initialData?.id;

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    
    // 1. Basic required validation
    const newErrors: Record<string, string> = {};
    fields.forEach((f: any) => {
      if (f.required === '是' && !formData[f.name]) {
        newErrors[f.name] = `${f.label}是必填项`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    // 2. Logic Engine Skill: Metadata-driven validation (The "Skill" Fix)
    const validation = logicEngine.validate(rules, formData);
    
    if (!validation.success) {
      setErrors(validation.errors);
      setSubmitting(false);
      setStatus('error');
      return;
    }

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    setStatus('success');
    
    // 3. Event Trigger (The "Broken Loop" Fix)
    if (node.id === 'obj-contract') {
      eventBus.emit(isEdit ? 'evt-contract-updated' : 'evt-contract-entered', { 
        id: isEdit ? initialData.id : `HT-${Date.now().toString().slice(-4)}`,
        ...formData 
      });
    }

    setTimeout(() => {
      onSuccess?.(formData);
    }, 1000);
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">录入成功</h3>
        <p className="text-sm text-slate-500 mt-2">数据已成功保存至本体模型，并已触发后续流程。</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <span className="w-2 h-6 bg-blue-600 rounded-full mr-3" />
          {node.name}{isEdit ? '编辑' : '录入'}
        </h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">基于对象模型动态生成</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field: any) => (
            <div key={field.name} className={cn("space-y-1.5", field.type === 'Textarea' ? "md:col-span-2" : "")}>
              <label className="text-xs font-bold text-slate-500 flex items-center">
                {field.label}
                {field.required === '是' && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'Enum' || field.type === 'Reference' ? (
                <select
                  className={cn(
                    "w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm transition-all outline-none appearance-none",
                    errors[field.name] ? "border-red-300 bg-red-50/30" : "border-slate-200 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
                  )}
                  value={formData[field.name] || ''}
                  onChange={e => handleChange(field.name, e.target.value)}
                >
                  <option value="">请选择{field.label}...</option>
                  {field.type === 'Enum' ? (
                    ['草稿', '进行中', '待收款', '已完成'].map(opt => <option key={opt} value={opt}>{opt}</option>)
                  ) : (
                    ['示例数据 A', '示例数据 B', '示例数据 C'].map(opt => <option key={opt} value={opt}>{opt}</option>)
                  )}
                </select>
              ) : field.type === 'Date' ? (
                <input
                  type="date"
                  className={cn(
                    "w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm transition-all outline-none",
                    errors[field.name] ? "border-red-300 bg-red-50/30" : "border-slate-200 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
                  )}
                  value={formData[field.name] || ''}
                  onChange={e => handleChange(field.name, e.target.value)}
                />
              ) : field.type === 'Textarea' ? (
                <textarea
                  rows={4}
                  className={cn(
                    "w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm transition-all outline-none resize-none",
                    errors[field.name] ? "border-red-300 bg-red-50/30" : "border-slate-200 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
                  )}
                  placeholder={`请输入${field.label}...`}
                  value={formData[field.name] || ''}
                  onChange={e => handleChange(field.name, e.target.value)}
                />
              ) : (
                <input
                  type={field.type === 'Decimal' ? 'number' : 'text'}
                  step={field.type === 'Decimal' ? '0.01' : undefined}
                  className={cn(
                    "w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm transition-all outline-none",
                    errors[field.name] ? "border-red-300 bg-red-50/30" : "border-slate-200 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
                  )}
                  placeholder={`请输入${field.label}...`}
                  value={formData[field.name] || ''}
                  onChange={e => handleChange(field.name, e.target.value)}
                />
              )}
              
              {errors[field.name] && (
                <div className="flex items-center text-[10px] text-red-500 mt-1">
                  <AlertCircle size={10} className="mr-1" />
                  {errors[field.name]}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-6 flex items-center justify-end space-x-3 border-t border-slate-100">
          <Button variant="ghost" type="button" onClick={onCancel} disabled={submitting}>
            取消
          </Button>
          <Button type="submit" className="px-8 shadow-lg shadow-blue-100" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                正在校验并保存...
              </>
            ) : (
              '提交录入'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
