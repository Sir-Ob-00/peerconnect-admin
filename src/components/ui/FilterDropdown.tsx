import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface FilterDropdownProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}

export function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = value ? options.find(o => o.value === value)?.label : 'All';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 font-normal text-slate-600 bg-white"
      >
        <Filter className="w-4 h-4 text-slate-400" />
        {label}: <span className="font-medium text-slate-900">{selectedLabel}</span>
        <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
      </Button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => { onChange(''); setIsOpen(false); }}
              className={cn("w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors", !value ? "font-medium text-brand-600 bg-brand-50" : "text-slate-700")}
              role="menuitem"
            >
              All
              {!value && <Check className="w-4 h-4" />}
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className={cn("w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors", value === option.value ? "font-medium text-brand-600 bg-brand-50" : "text-slate-700")}
                role="menuitem"
              >
                {option.label}
                {value === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
