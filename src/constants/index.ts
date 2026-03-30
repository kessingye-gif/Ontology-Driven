import { ModelType } from '../types/ontology';

export const MODEL_TYPE_CONFIG = {
  [ModelType.OBJECT]: {
    label: '对象模型',
    color: '#6366f1', // Indigo
    icon: 'Box',
  },
  [ModelType.BEHAVIOR]: {
    label: '行为模型',
    color: '#10b981', // Emerald
    icon: 'Zap',
  },
  [ModelType.RULE]: {
    label: '规则模型',
    color: '#f59e0b', // Amber
    icon: 'ShieldCheck',
  },
  [ModelType.EVENT]: {
    label: '事件模型',
    color: '#ef4444', // Red
    icon: 'Bell',
  },
  [ModelType.SCENE]: {
    label: '场景模型',
    color: '#8b5cf6', // Violet
    icon: 'Layout',
  },
};

export const STATUS_MAP = {
  active: { label: '进行中', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  pending: { label: '待收款', color: 'text-amber-600 bg-amber-50 border-amber-100' },
  completed: { label: '已完成', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  expired: { label: '逾期', color: 'text-rose-600 bg-rose-50 border-rose-100' },
};
