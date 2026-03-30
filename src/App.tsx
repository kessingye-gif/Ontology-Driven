import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Share2, 
  X
} from 'lucide-react';
import { useOntology } from './hooks/useOntology';
import { cn } from './utils/cn';
import { GraphView } from './features/ontology/GraphView';
import { ChatAssistant } from './features/chat/ChatAssistant';
import { ontologyService } from './services/ontologyService';
import { eventBus } from './utils/eventBus';
import { behaviorEngine } from './core/behaviorEngine';
import { objectStore } from './core/objectStore';
import { UIRenderer } from './components/ui/UIRenderer';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { NodeDetails } from './features/ontology/NodeDetails';

type Tab = { 
  id: string; 
  title: string; 
  type: 'graph' | 'table' | 'form'; 
  nodeId?: string;
  initialData?: any;
};

export default function App() {
  const { nodes, selectedNodeId, selectNode } = useOntology();
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'knowledge-graph', title: '知识图谱', type: 'graph' }
  ]);
  const [activeTabId, setActiveTabId] = useState('knowledge-graph');
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Initialize Object Store with mock data
    ontologyService.getContracts().then(data => {
      objectStore.init('obj-contract', data);
    });
  }, []);

  useEffect(() => {
    // Listen for events
    const unsubscribeEnter = eventBus.on('evt-contract-entered', (data) => {
      setNotifications(prev => [`新合同录入成功: ${data.id}`, ...prev]);
    });

    const unsubscribeUpdate = eventBus.on('evt-contract-updated', (data) => {
      setNotifications(prev => [`合同更新成功: ${data.id}`, ...prev]);
    });

    const unsubscribeTab = eventBus.on('ui:open_tab', (data: any) => {
      addTab(data.id, data.title, data.type, data.nodeId || (data.type === 'table' ? 'scene-contract-list' : 'scene-contract-entry'), data.payload);
    });

    const unsubscribeDelete = eventBus.on('data:delete', (data: any) => {
      setNotifications(prev => [`数据已删除: ${data.id}`, ...prev]);
    });

    return () => {
      unsubscribeEnter();
      unsubscribeUpdate();
      unsubscribeTab();
      unsubscribeDelete();
    };
  }, [tabs]);

  const addTab = (id: string, title: string, type: Tab['type'], nodeId?: string, initialData?: any) => {
    if (!tabs.find(t => t.id === id)) {
      setTabs(prev => [...prev, { id, title, type, nodeId, initialData }]);
    }
    setActiveTabId(id);
  };

  const removeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const handleChatAction = (action: any) => {
    if (action.type === 'OPEN_TAB') {
      const behaviorId = action.payload === 'contract-query' ? 'beh-contract-list' : 'beh-contract-entry';
      behaviorEngine.execute(behaviorId, {});
    }
  };

  const handleTreeAction = (type: string, nodeId: string) => {
    const behaviorId = type === 'create' ? 'beh-contract-entry' : 'beh-contract-list';
    behaviorEngine.execute(behaviorId, { nodeId });
  };

  // Mock edges for graph
  const edges = [
    { id: 'e1', source: 'obj-contract', target: 'beh-contract-entry', label: '被录入' },
    { id: 'e2', source: 'obj-contract', target: 'obj-customer', label: '属于' },
    { id: 'e3', source: 'beh-contract-entry', target: 'rule-amount-check', label: '触发校验' },
    { id: 'e4', source: 'rule-amount-check', target: 'evt-contract-entered', label: '通过后触发' },
    { id: 'e5', source: 'evt-contract-entered', target: 'scene-contract-entry', label: '属于' },
    { id: 'e6', source: 'obj-contract', target: 'carrier-contract-list', label: '渲染于' },
    { id: 'e7', source: 'obj-contract', target: 'carrier-contract-form', label: '渲染于' },
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Header notificationsCount={notifications.length} />

      <main className="flex-1 flex overflow-hidden">
        <Sidebar 
          nodes={nodes} 
          selectedId={selectedNodeId} 
          onSelect={selectNode} 
          onAction={handleTreeAction} 
        />

        <aside className="w-80 shrink-0 hidden lg:block">
          <ChatAssistant onAction={handleChatAction} />
        </aside>

        <section className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Tabs Navigation */}
          <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-2 space-x-1 shrink-0">
            {tabs.map(tab => (
              <div 
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "h-8 px-3 flex items-center space-x-2 rounded-t-md cursor-pointer text-xs transition-all border-x border-t",
                  activeTabId === tab.id 
                    ? "bg-white border-slate-200 text-blue-600 font-bold -mb-px" 
                    : "bg-transparent border-transparent text-slate-500 hover:bg-slate-200/50"
                )}
              >
                {tab.type === 'graph' && <Share2 size={12} />}
                {tab.type === 'table' && <Search size={12} />}
                {tab.type === 'form' && <Plus size={12} />}
                <span>{tab.title}</span>
                {tabs.length > 1 && (
                  <X 
                    size={10} 
                    className="ml-1 hover:text-red-500 rounded-full hover:bg-slate-200 p-0.5" 
                    onClick={(e) => removeTab(tab.id, e)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Tab Content Rendering */}
          <div className="flex-1 overflow-hidden relative">
            {tabs.map(tab => (
              <div 
                key={tab.id} 
                className={cn(
                  "absolute inset-0 transition-opacity duration-200 overflow-auto",
                  activeTabId === tab.id ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                )}
              >
                {tab.type === 'graph' ? (
                  <div className="flex h-full">
                    <div className="flex-1 border-r border-slate-200">
                      <GraphView nodes={nodes} edges={edges} />
                    </div>
                    {selectedNode && (
                      <NodeDetails 
                        node={selectedNode} 
                        allNodes={nodes} 
                        onClose={() => selectNode('')} 
                      />
                    )}
                  </div>
                ) : tab.nodeId ? (
                  <UIRenderer 
                    nodeId={tab.nodeId} 
                    allNodes={nodes} 
                    initialData={tab.initialData}
                    onAction={(type, payload) => {
                      if (type === 'EDIT_RECORD') {
                        behaviorEngine.execute('beh-contract-edit', payload.record);
                      } else if (type === 'DELETE_RECORD') {
                        behaviorEngine.execute('beh-contract-delete', payload.record);
                      } else if (type === 'OPEN_FORM') {
                        behaviorEngine.execute('beh-contract-entry', payload);
                      } else if (type === 'CLOSE_TAB') {
                        setTabs(prev => prev.filter(t => t.id !== tab.id));
                        if (activeTabId === tab.id) setActiveTabId('knowledge-graph');
                      }
                    }}
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400">未指定渲染上下文</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
