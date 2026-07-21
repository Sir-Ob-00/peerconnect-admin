import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, ShieldAlert, CheckCircle, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FilterDropdown } from '../components/ui/FilterDropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Avatar } from '../components/ui/Avatar';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmationModal } from '../components/ui/Modal';
import { MOCK_STUDENTS } from '../data/mock';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Students() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; type: 'suspend' | 'activate' | 'delete'; studentId: string | null }>({
    isOpen: false,
    type: 'suspend',
    studentId: null,
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [search, deptFilter, statusFilter, page]);

  const filteredData = MOCK_STUDENTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter ? s.department === deptFilter : true;
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    return matchSearch && matchDept && matchStatus;
  });

  const handleAction = () => {
    const s = MOCK_STUDENTS.find(s => s.id === actionModal.studentId);
    if (!s) return;
    toast.success(`Student ${s.name} ${actionModal.type}d successfully.`);
    setActionModal({ ...actionModal, isOpen: false });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Students Management</h1>
          <p className="text-slate-500 mt-1">View and manage all registered students.</p>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterDropdown 
              label="Department"
              value={deptFilter}
              onChange={(v) => { setDeptFilter(v); setPage(1); }}
              options={[
                { label: 'Computer Science', value: 'Computer Science' },
                { label: 'Mathematics', value: 'Mathematics' },
                { label: 'Business', value: 'Business' },
              ]}
            />
            <FilterDropdown 
              label="Status"
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Suspended', value: 'Suspended' },
              ]}
            />
          </div>
        </div>
        
        <div className="bg-white">
          {loading ? (
            <div className="p-6"><TableSkeleton rows={5} /></div>
          ) : filteredData.length === 0 ? (
            <EmptyState 
              icon={Search} 
              title="No students found" 
              description="Try adjusting your search or filters to find what you're looking for."
              actionText="Clear Filters"
              onAction={() => { setSearch(''); setDeptFilter(''); setStatusFilter(''); }}
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Student</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                         <div className="flex items-center gap-3">
                           <Avatar src={s.avatar} fallback={s.name} size="sm" />
                           <div>
                             <p className="font-medium text-slate-900">{s.name}</p>
                             <p className="text-xs text-slate-500">{s.email}</p>
                           </div>
                         </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{s.department}</TableCell>
                      <TableCell className="text-slate-600">{new Date(s.joinedDate).toLocaleDateString()}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/students/${s.id}`}>
                            <Button variant="outline" size="sm">Profile</Button>
                          </Link>
                          {s.status === 'Active' ? (
                            <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50" onClick={() => setActionModal({ isOpen: true, type: 'suspend', studentId: s.id })}>
                              Suspend
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => setActionModal({ isOpen: true, type: 'activate', studentId: s.id })}>
                              Activate
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2" onClick={() => setActionModal({ isOpen: true, type: 'delete', studentId: s.id })}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleAction}
        title={actionModal.type === 'delete' ? 'Delete Student' : actionModal.type === 'suspend' ? 'Suspend Student' : 'Activate Student'}
        message={`Are you sure you want to ${actionModal.type} this student? ${actionModal.type === 'delete' ? 'This action cannot be undone.' : ''}`}
        variant={actionModal.type === 'delete' ? 'danger' : actionModal.type === 'suspend' ? 'warning' : 'primary'}
        confirmText={actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)}
      />
    </div>
  );
}
