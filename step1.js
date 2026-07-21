import fs from 'fs';
import path from 'path';

const files = {
  'src/data/mock.ts': `
export const MOCK_STUDENTS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@uni.edu', department: 'Computer Science', skills: ['React', 'TypeScript'], status: 'Active', joinedDate: '2025-08-15', avatar: 'https://i.pravatar.cc/150?u=1', verified: true, academicLevel: 'Senior', learningInterests: ['Machine Learning', 'Python'], bio: 'Passionate about frontend development and building accessible UIs.', availability: 'Weekends' },
  { id: '2', name: 'Bob Smith', email: 'bob@uni.edu', department: 'Mechanical Engineering', skills: ['AutoCAD', 'SolidWorks'], status: 'Suspended', joinedDate: '2025-09-01', avatar: 'https://i.pravatar.cc/150?u=2', verified: true, academicLevel: 'Junior', learningInterests: ['Robotics'], bio: 'Looking to learn more about automation.', availability: 'Evenings' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@uni.edu', department: 'Mathematics', skills: ['Calculus', 'Statistics'], status: 'Pending', joinedDate: '2026-01-10', avatar: 'https://i.pravatar.cc/150?u=3', verified: false, academicLevel: 'Sophomore', learningInterests: ['Data Science', 'R'], bio: 'Math enthusiast trying to transition to data science.', availability: 'Weekdays' },
  { id: '4', name: 'Diana Prince', email: 'diana@uni.edu', department: 'Business', skills: ['Marketing', 'Public Speaking'], status: 'Active', joinedDate: '2025-11-20', avatar: 'https://i.pravatar.cc/150?u=4', verified: true, academicLevel: 'Senior', learningInterests: ['Leadership', 'Finance'], bio: 'Aspiring entrepreneur.', availability: 'Flexible' },
  { id: '5', name: 'Evan Wright', email: 'evan@uni.edu', department: 'Physics', skills: ['Quantum Mechanics'], status: 'Active', joinedDate: '2026-02-05', avatar: 'https://i.pravatar.cc/150?u=5', verified: true, academicLevel: 'Graduate', learningInterests: ['Programming'], bio: 'Researching particle physics.', availability: 'Weekends' },
];

export const MOCK_SESSIONS = [
  { id: '1', requester: 'Alice Johnson', receiver: 'Charlie Davis', skill: 'Statistics', date: '2026-07-21T14:00:00Z', status: 'Pending' },
  { id: '2', requester: 'Bob Smith', receiver: 'Alice Johnson', skill: 'React', date: '2026-07-19T10:00:00Z', status: 'Completed' },
  { id: '3', requester: 'Diana Prince', receiver: 'Evan Wright', skill: 'Programming', date: '2026-07-25T16:00:00Z', status: 'Accepted' },
  { id: '4', requester: 'Charlie Davis', receiver: 'Bob Smith', skill: 'AutoCAD', date: '2026-07-15T09:00:00Z', status: 'Cancelled' },
];

export const MOCK_REPORTS = [
  { id: '1', reporter: 'Alice Johnson', reportedUser: 'Bob Smith', reason: 'No-show for session', date: '2026-07-19', status: 'Pending', details: 'Bob never showed up for our scheduled React session.' },
  { id: '2', reporter: 'Diana Prince', reportedUser: 'Charlie Davis', reason: 'Inappropriate behavior', date: '2026-07-10', status: 'Resolved', details: 'Resolved after mediation.' },
];

export const MOCK_REVIEWS = [
  { id: '1', reviewer: 'Alice Johnson', recipient: 'Diana Prince', rating: 5, comment: 'Diana is an amazing mentor!', date: '2026-07-20' },
  { id: '2', reviewer: 'Bob Smith', recipient: 'Evan Wright', rating: 2, comment: 'Was somewhat helpful but arrived late.', date: '2026-07-18' },
  { id: '3', reviewer: 'Charlie Davis', recipient: 'Alice Johnson', rating: 4, comment: 'Great session, learned a lot.', date: '2026-07-15' },
];

export const MOCK_STATS = {
  totalStudents: { value: 14532, trend: { value: '12%', positive: true } },
  totalSessions: { value: 3840, trend: { value: '8%', positive: true } },
  totalReviews: { value: 8920, trend: { value: '5%', positive: true } },
  totalReports: { value: 42, trend: { value: '2%', positive: false } },
};
`,

  'src/components/ui/Avatar.tsx': `import React from 'react';
import { cn } from '../../utils/cn';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
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
`,

  'src/components/ui/Modal.tsx': `import React, { useEffect } from 'react';
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
`,

  'src/components/ui/EmptyState.tsx': `import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
}
`,

  'src/components/ui/LoadingSkeleton.tsx': `import React from 'react';
import { cn } from '../../utils/cn';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-slate-200", className)} {...props} />;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
`,

  'src/components/ui/Pagination.tsx': `import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">{totalPages * 10}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <Button
              variant="outline"
              className="rounded-r-none border-r-0 px-2"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={\`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors \${
                    currentPage === page
                      ? 'z-10 bg-brand-50 border-brand-500 text-brand-600'
                      : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                  }\`}
                >
                  {page}
                </button>
              );
            })}
            <Button
              variant="outline"
              className="rounded-l-none border-l-0 px-2"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
`
};

Object.entries(files).forEach(([filePath, content]) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
});
console.log('Step 1 complete');
