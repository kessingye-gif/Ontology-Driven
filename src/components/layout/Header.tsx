import React from 'react';
import { Database, Bell, Plus, Save, CheckCircle2, Info } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  notificationsCount: number;
}

export const Header = ({ notificationsCount }: HeaderProps) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Database size={18} />
        </div>
        <h1 className="text-lg font-bold tracking-tight">本体模型编辑器</h1>
      </div>
      <div className="flex items-center space-x-2">
        {notificationsCount > 0 && (
          <div className="relative mr-2">
            <Button variant="ghost" size="sm" className="p-2 text-blue-600 bg-blue-50 rounded-full animate-bounce">
              <Bell size={18} />
            </Button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
              {notificationsCount}
            </span>
          </div>
        )}
        <Button variant="outline" size="sm" className="bg-white">
          <Plus size={14} className="mr-1.5" /> 打开工作区
        </Button>
        <Button variant="outline" size="sm" className="bg-white">
          <Save size={14} className="mr-1.5" /> 保存
        </Button>
        <Button variant="outline" size="sm" className="bg-white">
          <CheckCircle2 size={14} className="mr-1.5" /> 校验
        </Button>
        <div className="w-px h-4 bg-slate-200 mx-2" />
        <Button variant="ghost" size="sm" className="p-2">
          <Info size={18} />
        </Button>
      </div>
    </header>
  );
};
