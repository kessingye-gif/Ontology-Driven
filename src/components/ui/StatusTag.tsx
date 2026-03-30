import { STATUS_MAP } from '../../constants';
import { cn } from '../../utils/cn';

interface StatusTagProps {
  status: keyof typeof STATUS_MAP;
}

export const StatusTag = ({ status }: StatusTagProps) => {
  const config = STATUS_MAP[status] || { label: status, color: 'bg-slate-100 text-slate-600' };
  
  return (
    <span className={cn(
      'px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider',
      config.color
    )}>
      {config.label}
    </span>
  );
};
