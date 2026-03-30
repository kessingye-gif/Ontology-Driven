/**
 * Object Store Skill: Centralized data management for all ontology objects.
 * Implements "Flexible Schema" and "Single Source of Truth".
 */

import { eventBus } from '../utils/eventBus';

class ObjectStore {
  private data: Record<string, any[]> = {};

  /**
   * Initialize data for an object type
   */
  async init(objectId: string, initialData?: any[]) {
    if (!this.data[objectId]) {
      this.data[objectId] = initialData || [];
      eventBus.emit(`store:${objectId}:init`, this.data[objectId]);
    }
  }

  /**
   * Get all records for an object type
   */
  get(objectId: string): any[] {
    return this.data[objectId] || [];
  }

  /**
   * Create a new record
   */
  async create(objectId: string, record: any) {
    const newRecord = { ...record, id: record.id || `ID-${Date.now()}` };
    this.data[objectId] = [newRecord, ...(this.data[objectId] || [])];
    
    eventBus.emit(`store:${objectId}:created`, newRecord);
    eventBus.emit(`data:changed`, { objectId, type: 'create', record: newRecord });
    return newRecord;
  }

  /**
   * Update an existing record
   */
  async update(objectId: string, id: string, updates: any) {
    const records = this.data[objectId] || [];
    const index = records.findIndex(r => r.id === id);
    
    if (index !== -1) {
      const updatedRecord = { ...records[index], ...updates };
      this.data[objectId][index] = updatedRecord;
      
      eventBus.emit(`store:${objectId}:updated`, updatedRecord);
      eventBus.emit(`data:changed`, { objectId, type: 'update', record: updatedRecord });
      return updatedRecord;
    }
    throw new Error(`Record ${id} not found in ${objectId}`);
  }

  /**
   * Delete a record
   */
  async delete(objectId: string, id: string) {
    const records = this.data[objectId] || [];
    this.data[objectId] = records.filter(r => r.id !== id);
    
    eventBus.emit(`store:${objectId}:deleted`, id);
    eventBus.emit(`data:changed`, { objectId, type: 'delete', id });
  }
}

export const objectStore = new ObjectStore();
