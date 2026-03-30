type Handler = (data?: any) => void;

class EventBus {
  private events: Record<string, Handler[]> = {};

  on(event: string, handler: Handler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: Handler) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(h => h !== handler);
  }

  emit(event: string, data?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(handler => handler(data));
  }
}

export const eventBus = new EventBus();
