/**
 * Behavior Engine Skill: Implements "Command Pattern" and "Behavior Orchestration".
 * Decouples behavior definition from execution logic.
 */

import { eventBus } from '../utils/eventBus';
import { objectStore } from './objectStore';

export interface Command {
  type: string;
  payload: any;
}

export interface BehaviorHandler {
  id: string;
  execute: (payload: any, context?: any) => void;
}

class BehaviorEngine {
  private handlers: Record<string, BehaviorHandler> = {};

  constructor() {
    // Register core handlers (Command Pattern Skill)
    this.register({
      id: 'OPEN_FORM',
      execute: (payload) => {
        eventBus.emit('ui:open_tab', { 
          id: `form-${payload.targetObjectId}-${Date.now()}`, 
          title: `录入 ${payload.targetObjectId}`, 
          type: 'form', 
          nodeId: payload.nodeId || 'scene-contract-entry',
          payload 
        });
      }
    });

    this.register({
      id: 'OPEN_LIST',
      execute: (payload) => {
        eventBus.emit('ui:open_tab', { 
          id: `list-${payload.targetObjectId}`, 
          title: `查询 ${payload.targetObjectId}`, 
          type: 'table', 
          nodeId: payload.nodeId || 'scene-contract-list',
          payload 
        });
      }
    });
  }

  register(handler: BehaviorHandler) {
    this.handlers[handler.id] = handler;
  }

  /**
   * Executes a behavior based on its metadata definition
   */
  execute(behaviorId: string, payload?: any, context?: any) {
    console.log(`[BehaviorEngine] Executing: ${behaviorId}`, payload);
    
    // 1. Emit event for EDA (Event-Driven Architecture Skill)
    eventBus.emit(`behavior:${behaviorId}:start`, { payload, context });

    // 2. Execute specific handler if registered
    const handler = this.handlers[behaviorId];
    if (handler) {
      handler.execute(payload, context);
    } else {
      // Default generic behaviors (The "Skill" Fix)
      this.handleGenericBehavior(behaviorId, payload, context);
    }

    // 3. Emit finish event
    eventBus.emit(`behavior:${behaviorId}:finish`, { payload, context });
  }

  private handleGenericBehavior(id: string, payload: any, context: any) {
    // Logic to map behavior ID to core handlers if not explicitly registered
    if (id.includes('entry') || id.includes('create')) {
      this.execute('OPEN_FORM', { targetObjectId: payload.nodeId || 'obj-contract' });
    } else if (id.includes('list') || id.includes('query')) {
      this.execute('OPEN_LIST', { targetObjectId: payload.nodeId || 'obj-contract' });
    } else if (id.includes('delete')) {
      if (window.confirm('确定要执行此删除操作吗？')) {
        objectStore.delete(payload.objectId || 'obj-contract', payload.id);
      }
    } else if (id.includes('edit')) {
      eventBus.emit('ui:open_tab', { 
        id: `edit-${payload.id}`, 
        title: `编辑 ${payload.id}`, 
        type: 'form', 
        payload 
      });
    }
  }
}

export const behaviorEngine = new BehaviorEngine();
