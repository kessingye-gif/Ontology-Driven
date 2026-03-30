import React from 'react';
import { cn } from '../../utils/cn';

interface TableProps<T> {
  columns: {
    key: keyof T | string;
    header: string;
    render?: (value: any, record: T) => React.ReactNode;
    className?: string;
  }[];
  data: T[];
  loading?: boolean;
  onRowClick?: (record: T) => void;
}

export function DataTable<T extends { id: string | number }>({ 
  columns, 
  data, 
  loading,
  onRowClick 
}: TableProps<T>) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50/50 text-slate-500 font-medium border-bottom border-slate-200">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className={cn("px-4 py-3 font-semibold", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  加载中...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  暂无数据
                </td>
              </tr>
            ) : (
              data.map((record) => (
                <tr 
                  key={record.id} 
                  className={cn(
                    "hover:bg-slate-50/50 transition-colors cursor-pointer group",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(record)}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className={cn("px-4 py-3 text-slate-600", col.className)}>
                      {col.render ? col.render((record as any)[col.key], record) : (record as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
