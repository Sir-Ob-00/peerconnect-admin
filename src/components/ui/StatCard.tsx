import { Card } from './Card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  color?: 'brand-400' | 'brand-500' | 'brand-600' | 'brand-700';
}

const colorClasses: Record<string, string> = {
  'brand-400': 'border-t-[3px] border-t-brand-400',
  'brand-500': 'border-t-[3px] border-t-brand-500',
  'brand-600': 'border-t-[3px] border-t-brand-600',
  'brand-700': 'border-t-[3px] border-t-brand-700',
};

export function StatCard({ title, value, icon: Icon, trend, color = 'brand-500' }: StatCardProps) {
  return (
    <Card className={cn('p-5 flex flex-col gap-3', colorClasses[color])}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-200">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
        {value}
      </div>
      {trend && (
        <p className={cn("text-xs font-semibold", trend.positive ? "text-emerald-600" : "text-red-600")}>
          {trend.positive ? '+' : '-'}{trend.value} from last month
        </p>
      )}
    </Card>
  );
}