import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    
    const variants = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500 border border-transparent',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500 border border-transparent',
      outline: 'bg-transparent text-slate-700 hover:bg-slate-50 border border-slate-300 focus-visible:ring-brand-500',
      ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent focus-visible:ring-slate-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 border border-transparent',
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';