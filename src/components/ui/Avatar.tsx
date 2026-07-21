import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ src, fallback, size = 'md', className, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-24 h-24 text-2xl',
  };

  return (
    <div 
      className={cn("relative inline-flex items-center justify-center overflow-hidden bg-slate-100 rounded-full font-bold text-slate-500 shrink-0", sizeClasses[size], className)}
      {...props}
    >
      {src ? (
        <img src={src} alt={fallback} className="w-full h-full object-cover" />
      ) : (
        <span className="uppercase">{fallback.slice(0, 2)}</span>
      )}
    </div>
  );
}
