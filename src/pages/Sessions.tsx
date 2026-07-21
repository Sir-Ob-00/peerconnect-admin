import { useState, useEffect } from 'react';
import { Search, Calendar, Ban, Clock, CheckCircle, XCircle, CalendarRange } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { StatCard } from '../components/ui/StatCard';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { FilterDropdown } from '../components/ui/FilterDropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { ConfirmationModal } from '../components/ui/Modal';
import { MOCK_SESSIONS, MOCK_SESSION_STATS } from '../data/mock';
import toast from 'react-hot-toast';

export default function Sessions() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, page]);

  const filteredData = MOCK_SESSIONS.filter((s) => {
    const matchSearch = s.requester.toLowerCase().includes(search.toLowerCase()) || s.receiver.toLowerCase().includes(search.toLowerCase()) || s.skill.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const handleCancel = () => {
    toast.success('Session cancelled successfully.');
    setCancelModal({ isOpen: false, id: null });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Learning Sessions</h1>
          <p className="text-slate-500 mt-1">Monitor and manage all skill-sharing sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : (
          <>
            <StatCard title={MOCK_SESSION_STATS.total.label} value={MOCK_SESSION_STATS.total.value.toLocaleString()} icon={CalendarRange} />
            <StatCard title={MOCK_SESSION_STATS.pending.label} value={MOCK_SESSION_STATS.pending.value.toLocaleString()} icon={Clock} />
            <StatCard title={MOCK_SESSION_STATS.completed.label} value={MOCK_SESSION_STATS.completed.value.toLocaleString()} icon={CheckCircle} />
            <StatCard title={MOCK_SESSION_STATS.cancelled.label} value={MOCK_SESSION_STATS.cancelled.value.toLocaleString()} icon={XCircle} />
          </>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search users or skills..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterDropdown 
              label="Status"
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              options={[
                { label: 'Pending', value: 'Pending' },
                { label: 'Accepted', value: 'Accepted' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Cancelled', value: 'Cancelled' },
              ]}
            />
          </div>
        </div>
        
        <div className="bg-white">
          {loading ? (
            <div className="p-6"><TableSkeleton rows={5} /></div>
          ) : filteredData.length === 0 ? (
            <EmptyState 
              icon={Calendar} 
              title="No sessions found" 
              description="No learning sessions match your current filters."
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Requester</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-slate-900">{s.requester}</TableCell>
                      <TableCell className="font-medium text-slate-900">{s.receiver}</TableCell>
                      <TableCell className="text-slate-600">{s.skill}</TableCell>
                      <TableCell className="text-slate-600">{new Date(s.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                      <TableCell className="text-right">
                        {(s.status === 'Pending' || s.status === 'Accepted') && (
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2" onClick={() => setCancelModal({ isOpen: true, id: s.id })}>
                            <Ban className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t border-slate-100 bg-white">
                <Pagination currentPage={page} totalPages={Math.ceil(filteredData.length / 10)} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </Card>

      <ConfirmationModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, id: null })}
        onConfirm={handleCancel}
        title="Cancel Session"
        message="Are you sure you want to cancel this learning session? Both users will be notified."
        variant="danger"
        confirmText="Cancel Session"
      />
    </div>
  );
}
