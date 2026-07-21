import React, { useEffect, useState } from 'react';
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
                         <Link to={`/students/${student.id}`}>
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
