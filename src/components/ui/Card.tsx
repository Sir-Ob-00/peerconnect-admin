import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl border border-white/50 bg-white/70 backdrop-blur-sm text-slate-950 shadow-sm', className)}
      {...props}
    />
  );
}