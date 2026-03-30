import { OntologyNode, ModelType } from '../types/ontology';
import { LogicExpression } from '../core/logicEngine';

/**
 * Mock service for ontology management
 * Now enriched with "Skills" metadata (Logic DSL, Handlers)
 */
export const ontologyService = {
  async getInitialModel(): Promise<{ nodes: OntologyNode[] }> {
    return {
      nodes: [
        // --- 对象模型 ---
        { id: 'obj-root', name: '对象模型', type: ModelType.OBJECT },
        { 
          id: 'obj-contract', 
          name: '合同', 
          type: ModelType.OBJECT, 
          parentId: 'obj-root',
          description: '销售合同主体信息。',
          properties: {
            fields: [
              { name: 'contractId', label: '合同编号', type: 'String', required: '是' },
              { name: 'contractName', label: '合同名称', type: 'String', required: '是' },
              { name: 'totalAmount', label: '合同总金额', type: 'Decimal', required: '是' },
              { name: 'taxRate', label: '合同税率', type: 'Decimal', required: '是' },
              { name: 'status', label: '合同状态', type: 'Enum', required: '是' },
              { name: 'startDate', label: '开始日期', type: 'Date', required: '是' },
              { name: 'endDate', label: '结束日期', type: 'Date', required: '是' },
              { name: 'paymentTerms', label: '付款条款', type: 'String', required: '否' },
              { name: 'clauses', label: '合同条款', type: 'Textarea', required: '否' },
            ],
            // Logic DSL Skill: Rules defined as data, not code
            rules: [
              { field: 'totalAmount', operator: '>', value: 0, message: '金额必须大于0' },
              { field: 'taxRate', operator: '<', value: 1, message: '税率不能超过100%' },
              { field: 'taxRate', operator: '>', value: 0, message: '税率不能为负数' }
            ] as LogicExpression[]
          }
        },
        { id: 'obj-contract-prop', name: '属性', type: ModelType.OBJECT, parentId: 'obj-contract' },
        
        // --- 行为模型 ---
        { id: 'beh-root', name: '行为模型', type: ModelType.BEHAVIOR },
        { id: 'beh-contract-mgmt', name: '合同管理行为', type: ModelType.BEHAVIOR, parentId: 'beh-root' },
        { 
          id: 'beh-contract-entry', 
          name: '录入合同', 
          type: ModelType.BEHAVIOR, 
          parentId: 'beh-contract-mgmt',
          // Behavior Skill: Metadata-driven execution
          metadata: { handler: 'OPEN_FORM', target: 'obj-contract' }
        },
        { id: 'beh-contract-edit', name: '编辑合同', type: ModelType.BEHAVIOR, parentId: 'beh-contract-mgmt' },
        { id: 'beh-contract-delete', name: '删除合同', type: ModelType.BEHAVIOR, parentId: 'beh-contract-mgmt' },
        { id: 'beh-contract-list', name: '查询合同列表', type: ModelType.BEHAVIOR, parentId: 'beh-contract-mgmt' },
        
        // --- 规则模型 ---
        { id: 'rule-root', name: '规则模型', type: ModelType.RULE },
        { 
          id: 'rule-amount-check', 
          name: '合同金额合规性校验', 
          type: ModelType.RULE, 
          parentId: 'rule-root',
          // Logic DSL Skill: Rule logic as metadata
          metadata: { field: 'totalAmount', operator: '>', value: 0, message: '金额必须大于0' }
        },
        
        // --- 事件模型 ---
        { id: 'evt-root', name: '事件模型', type: ModelType.EVENT },
        { id: 'evt-contract-entered', name: '合同已录入', type: ModelType.EVENT, parentId: 'evt-root' },
        
        // --- 场景模型 ---
        { id: 'scene-root', name: '场景模型', type: ModelType.SCENE },
        { 
          id: 'scene-contract-entry', 
          name: '录入合同场景', 
          type: ModelType.SCENE, 
          parentId: 'scene-root',
          // Scene Skill: Context-aware configuration
          metadata: {
            allowedBehaviors: ['beh-contract-entry', 'beh-contract-list'],
            targetObjectId: 'obj-contract',
            template: 'form'
          }
        },
        { 
          id: 'scene-contract-list', 
          name: '合同查询场景', 
          type: ModelType.SCENE, 
          parentId: 'scene-root',
          metadata: {
            targetObjectId: 'obj-contract',
            template: 'table'
          }
        },
      ]
    };
  },

  async getContracts() {
    return [
      { 
        id: 'HT-2026-0341', 
        customer: '华远集团', 
        product: 'SaaS 平台', 
        owner: '李明', 
        amount: 500000, 
        date: '2026-03-10', 
        status: 'active',
        startDate: '2026-03-10',
        endDate: '2027-03-09',
        paymentTerms: '30% 预付, 70% 验收后支付',
        clauses: '本合同包含标准服务条款及数据安全协议。'
      },
      { 
        id: 'HT-2026-0338', 
        customer: '腾讯科技', 
        product: 'AI 引擎', 
        owner: '张晓红', 
        amount: 1200000, 
        date: '2026-03-05', 
        status: 'pending',
        startDate: '2026-04-01',
        endDate: '2028-03-31',
        paymentTerms: '分四期支付，每季度末支付 25%',
        clauses: '包含私有化部署及 24/7 技术支持。'
      },
    ];
  }
};
