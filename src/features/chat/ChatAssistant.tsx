import { Send, User, Bot, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types/ontology';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';

interface ChatAssistantProps {
  onAction?: (action: any) => void;
}

export const ChatAssistant = ({ onAction }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好，我是 AI 助手。我可以帮你管理合同、查询数据或录入信息。',
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      let aiMsg: ChatMessage;
      if (input.includes('合同') && input.includes('查询')) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '好的，已为你打开合同查询页面，你可以在右侧设置查询条件。',
          timestamp: Date.now(),
          action: { type: 'OPEN_TAB', payload: 'contract-query' }
        };
      } else if (input.includes('录入')) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '好的，已为你打开合同录入表单，请在右侧填写合同信息。',
          timestamp: Date.now(),
          action: { type: 'OPEN_TAB', payload: 'contract-entry' }
        };
      } else {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '我理解了你的需求。你可以尝试说“查询合同”或“录入合同”。',
          timestamp: Date.now(),
        };
      }
      setMessages(prev => [...prev, aiMsg]);
      if (aiMsg.action) onAction?.(aiMsg.action);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-4 border-b border-slate-100 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Bot size={18} />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800">AI 助理</div>
          <div className="text-[10px] text-emerald-500 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
            在线
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map(msg => (
          <div key={msg.id} className={cn(
            "flex flex-col max-w-[85%]",
            msg.role === 'user' ? "ml-auto items-end" : "items-start"
          )}>
            <div className={cn(
              "px-4 py-2 rounded-2xl text-sm shadow-sm",
              msg.role === 'user' 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200"
            )}>
              {msg.content}
              {msg.action && (
                <div className="mt-2 pt-2 border-t border-slate-200/30">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-[10px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    onClick={() => onAction?.(msg.action)}
                  >
                    在右侧打开 <ExternalLink size={10} className="ml-1" />
                  </Button>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center space-x-2 bg-slate-50 rounded-lg p-1 border border-slate-200 focus-within:border-blue-400 transition-colors">
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 py-1.5 placeholder:text-slate-400"
            placeholder="输入自然语言指令..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button size="sm" className="h-8 w-8 p-0 rounded-md" onClick={handleSend}>
            <Send size={14} />
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['查询合同', '新建合同', '查负责人'].map(tag => (
            <button 
              key={tag}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] rounded transition-colors"
              onClick={() => setInput(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
