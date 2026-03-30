/**
 * Logic Engine Skill: Implements "Logic DSL" and "Metadata-First" principles.
 * Evaluates JSON-based logic expressions instead of hardcoded if-else.
 */

export type Operator = '>' | '<' | '==' | '!=' | 'contains' | 'matches';

export interface LogicExpression {
  field: string;
  operator: Operator;
  value: any;
  message: string;
}

export const logicEngine = {
  evaluate(expression: LogicExpression, data: any): { success: boolean; message?: string } {
    const fieldValue = data[expression.field];
    let success = true;

    switch (expression.operator) {
      case '>':
        success = Number(fieldValue) > Number(expression.value);
        break;
      case '<':
        success = Number(fieldValue) < Number(expression.value);
        break;
      case '==':
        success = fieldValue == expression.value;
        break;
      case '!=':
        success = fieldValue != expression.value;
        break;
      case 'contains':
        success = String(fieldValue).includes(String(expression.value));
        break;
      case 'matches':
        success = new RegExp(String(expression.value)).test(String(fieldValue));
        break;
    }

    return {
      success,
      message: success ? undefined : expression.message
    };
  },

  validate(rules: LogicExpression[], data: any): { success: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    let allSuccess = true;

    for (const rule of rules) {
      const result = this.evaluate(rule, data);
      if (!result.success) {
        errors[rule.field] = result.message || '校验失败';
        allSuccess = false;
      }
    }

    return { success: allSuccess, errors };
  }
};
