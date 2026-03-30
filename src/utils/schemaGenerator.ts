import { OntologyNode } from '../types/ontology';

/**
 * 将本体对象的属性定义转换为 DataTable 所需的列配置
 */
export const generateTableColumns = (node: OntologyNode) => {
  if (!node.properties?.fields) return [];

  return node.properties.fields.map((field: any) => ({
    header: field.label,
    accessorKey: field.name,
    cell: (value: any) => {
      if (field.type === 'status') {
        return value; // 可以在这里包装 StatusTag
      }
      if (field.type === 'amount') {
        return typeof value === 'number' ? `¥${value.toLocaleString()}` : value;
      }
      return value;
    }
  }));
};

/**
 * 将本体对象的属性定义转换为搜索表单配置
 */
export const generateSearchSchema = (node: OntologyNode) => {
  if (!node.properties?.fields) return [];

  // 默认选取前 4 个字段作为搜索项
  return node.properties.fields.slice(0, 4).map((field: any) => ({
    label: field.label,
    name: field.name,
    type: field.type === 'status' ? 'select' : 'text',
    placeholder: `请输入${field.label}...`,
    options: field.type === 'status' ? [
      { label: '全部', value: '' },
      { label: '待处理', value: 'pending' },
      { label: '进行中', value: 'processing' },
      { label: '已完成', value: 'completed' },
    ] : undefined
  }));
};
