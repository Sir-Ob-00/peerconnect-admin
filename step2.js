import fs from 'fs';
import path from 'path';

const files = {
  'src/components/ui/FilterDropdown.tsx': `import React, { useState, useRef, useEffect } from 'react';
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
`,

  'src/pages/Login.tsx': `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (email !== 'admin@peerconnect.com' || password !== 'password') {
      setError('Invalid email or password. Hint: admin@peerconnect.com / password');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    localStorage.setItem('token', 'mock-token');
    toast.success('Logged in successfully');
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-sm mx-auto p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 text-brand-600 rounded-xl mb-6">
          {/* Logo Placeholder */}
          <span className="font-bold text-xl">PC</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
        <p className="text-slate-500 mt-2 text-sm">Enter your credentials to access the dashboard</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        <Input 
          label="Email Address" 
          type="email" 
          placeholder="admin@peerconnect.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        
        <div className="space-y-1">
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" disabled={loading} />
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700">Forgot password?</a>
          </div>
        </div>
        
        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </div>
  );
}
`,

  'src/pages/Dashboard.tsx': `import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Calendar, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Skeleton, TableSkeleton } from '../components/ui/LoadingSkeleton';
import { MOCK_STATS, MOCK_STUDENTS } from '../data/mock';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Here's what's happening on PeerConnect today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
        ) : (
          <>
            <StatCard title="Total Students" value={MOCK_STATS.totalStudents.value.toLocaleString()} icon={Users} trend={MOCK_STATS.totalStudents.trend} />
            <StatCard title="Learning Sessions" value={MOCK_STATS.totalSessions.value.toLocaleString()} icon={Calendar} trend={MOCK_STATS.totalSessions.trend} />
            <StatCard title="Total Reviews" value={MOCK_STATS.totalReviews.value.toLocaleString()} icon={Star} trend={MOCK_STATS.totalReviews.trend} />
            <StatCard title="Total Reports" value={MOCK_STATS.totalReports.value} icon={MessageSquare} trend={MOCK_STATS.totalReports.trend} />
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col lg:col-span-2 overflow-hidden">
           <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
             <h2 className="text-base font-semibold text-slate-900">Recently Registered Students</h2>
             <Link to="/students" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
               View all <ArrowRight className="w-4 h-4" />
             </Link>
           </div>
           
           <div className="flex-1 bg-white">
             {loading ? (
               <div className="p-6"><TableSkeleton rows={4} /></div>
             ) : (
               <Table>
                 <TableHeader>
                   <TableRow className="bg-slate-50/50">
                     <TableHead>Student</TableHead>
                     <TableHead>Department</TableHead>
                     <TableHead>Registered</TableHead>
                     <TableHead className="text-right">Action</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {MOCK_STUDENTS.slice(0, 4).map((student) => (
                     <TableRow key={student.id}>
                       <TableCell>
                         <div className="flex items-center gap-3">
                           <Avatar src={student.avatar} fallback={student.name} size="sm" />
                           <div>
                             <p className="font-medium text-slate-900">{student.name}</p>
                           </div>
                         </div>
                       </TableCell>
                       <TableCell className="text-slate-500">{student.department}</TableCell>
                       <TableCell className="text-slate-500">{new Date(student.joinedDate).toLocaleDateString()}</TableCell>
                       <TableCell className="text-right">
                         <Link to={\`/students/\${student.id}\`}>
                           <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50">Profile</Button>
                         </Link>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             )}
           </div>
        </Card>
        
        <Card className="flex flex-col overflow-hidden">
           <div className="px-6 py-5 border-b border-slate-100 bg-white">
             <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
           </div>
           <div className="flex-1 bg-white p-6">
             {loading ? (
               <div className="space-y-6">
                 {Array.from({ length: 4 }).map((_, i) => (
                   <div key={i} className="flex gap-4">
                     <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                     <div className="space-y-2 flex-1"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-2/3" /></div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="space-y-6">
                 {/* Mock Activity Feed */}
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><Users className="w-4 h-4" /></div>
                   <div>
                     <p className="text-sm text-slate-900"><span className="font-medium">Evan Wright</span> created an account.</p>
                     <p className="text-xs text-slate-500 mt-0.5">2 hours ago</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0"><Calendar className="w-4 h-4" /></div>
                   <div>
                     <p className="text-sm text-slate-900">Session completed between <span className="font-medium">Bob</span> & <span className="font-medium">Alice</span>.</p>
                     <p className="text-xs text-slate-500 mt-0.5">4 hours ago</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0"><UserCheck className="w-4 h-4" /></div>
                   <div>
                     <p className="text-sm text-slate-900"><span className="font-medium">Charlie Davis</span> submitted ID for verification.</p>
                     <p className="text-xs text-slate-500 mt-0.5">Yesterday</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0"><MessageSquare className="w-4 h-4" /></div>
                   <div>
                     <p className="text-sm text-slate-900">New report filed by <span className="font-medium">Diana Prince</span>.</p>
                     <p className="text-xs text-slate-500 mt-0.5">Yesterday</p>
                   </div>
                 </div>
               </div>
             )}
           </div>
        </Card>
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
console.log('Step 2 complete');
