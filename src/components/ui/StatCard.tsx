import React from 'react';
import { Card } from './Card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="p-2 bg-brand-50 rounded-lg">
          <Icon className="w-5 h-5 text-brand-600" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1 font-medium", trend.positive ? "text-green-600" : "text-red-600")}>
            {trend.positive ? '+' : '-'}{trend.value} from last month
          </p>
        )}
      </div>
    </Card>
  );
}