import { StatusTag } from '../components/ui/StatusTag';

export const CONTRACT_TABLE_SCHEMA = [
  { key: 'id', header: '合同编号', className: 'text-blue-500 font-mono text-xs' },
  { key: 'customer', header: '客户名称' },
  { key: 'product', header: '产品' },
  { key: 'owner', header: '负责人' },
  { 
    key: 'amount', 
    header: '金额', 
    render: (val: number) => `¥${val.toLocaleString()}`,
    className: 'font-medium'
  },
  { key: 'date', header: '签订日期' },
  { key: 'startDate', header: '开始日期' },
  { key: 'endDate', header: '结束日期' },
  { key: 'paymentTerms', header: '付款条款' },
  { 
    key: 'status', 
    header: '状态', 
    render: (val: any) => <StatusTag status={val} /> 
  },
];

export const CONTRACT_SEARCH_SCHEMA = [
  { key: 'keyword', label: '合同名称/客户', type: 'input', placeholder: '模糊搜索...' },
  { key: 'product', label: '所属产品', type: 'select', options: ['全部产品', 'SaaS 平台', 'AI 引擎', '数据中台'] },
  { key: 'status', label: '状态', type: 'select', options: ['全部', '进行中', '待收款', '已完成', '逾期'] },
  { key: 'startDate', label: '开始日期', type: 'date' },
  { key: 'endDate', label: '结束日期', type: 'date' },
];
