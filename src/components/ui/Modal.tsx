import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, footer, maxWidth = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={cn("relative bg-white rounded-xl shadow-xl w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200", maxWidthClasses[maxWidth])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'primary' }: ConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>{cancelText}</Button>
          <Button onClick={onConfirm} className={cn(variant === 'danger' && "bg-red-600 hover:bg-red-700")}>{confirmText}</Button>
        </>
      }
    >
      <p className="text-slate-600">{message}</p>
    </Modal>
  );
}
