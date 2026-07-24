import { useState } from 'react';
import { Search, Trash2, Users, CheckCircle, XCircle, Ban, Eye, Edit3 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Avatar } from '../components/ui/Avatar';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmationModal, Modal } from '../components/ui/Modal';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStudents, useSuspendStudent, useActivateStudent, useDeleteStudent } from '../hooks/useStudents';
import { useApproveVerification, useRejectVerification } from '../hooks/useVerifications';
import type { StudentListItem } from '../types/api';

type StatusFilter = 'ALL' | 'ACTIVE' | 'SUSPENDED' | 'pending_approval' | 'approved' | 'rejected';

export default function Students() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [page, setPage] = useState(1);

  // Modals state
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'suspend' | 'activate' | 'delete' | 'approve' | 'reject';
    studentId: string | null;
    studentName?: string;
  }>({
    isOpen: false,
    type: 'suspend',
    studentId: null,
  });

  const [editModal, setEditModal] = useState<{ isOpen: boolean; student: StudentListItem | null }>({
    isOpen: false,
    student: null,
  });

  const isAccountStatus = statusFilter === 'ACTIVE' || statusFilter === 'SUSPENDED';
  const isVerificationStatus = statusFilter === 'pending_approval' || statusFilter === 'approved' || statusFilter === 'rejected';

  const { data, isLoading, error, refetch } = useStudents({
    search,
    accountStatus: isAccountStatus ? statusFilter : undefined,
    verificationStatus: isVerificationStatus ? statusFilter : undefined,
    page,
    limit: 10,
  });

  const suspendMutation = useSuspendStudent();
  const activateMutation = useActivateStudent();
  const deleteMutation = useDeleteStudent();
  const approveMutation = useApproveVerification();
  const rejectMutation = useRejectVerification();

  const studentsList: StudentListItem[] = data?.data || [];

  const handleAction = async () => {
    if (!actionModal.studentId) return;

    console.log('[Students] Executing action:', actionModal.type, 'on studentId:', actionModal.studentId);

    try {
      if (actionModal.type === 'suspend') {
        await suspendMutation.mutateAsync(actionModal.studentId);
        console.log('[Students] Suspend mutation successful');
        toast.success(`Student ${actionModal.studentName || ''} suspended.`);
      } else if (actionModal.type === 'activate') {
        await activateMutation.mutateAsync(actionModal.studentId);
        console.log('[Students] Activate mutation successful');
        toast.success(`Student ${actionModal.studentName || ''} activated.`);
      } else if (actionModal.type === 'delete') {
        await deleteMutation.mutateAsync(actionModal.studentId);
        console.log('[Students] Delete mutation successful');
        toast.success(`Student ${actionModal.studentName || ''} deleted.`);
      } else if (actionModal.type === 'approve') {
        await approveMutation.mutateAsync({ userId: actionModal.studentId });
        console.log('[Students] Approve verification mutation successful');
        toast.success(`Verification approved for ${actionModal.studentName || ''}.`);
      } else if (actionModal.type === 'reject') {
        await rejectMutation.mutateAsync({ userId: actionModal.studentId });
        console.log('[Students] Reject verification mutation successful');
        toast.success(`Verification rejected for ${actionModal.studentName || ''}.`);
      }
      refetch();
    } catch (err) {
      console.error('[Students] Action failed with error:', err);
      toast.error('Action failed. Please check backend response.');
    } finally {
      setActionModal({ isOpen: false, type: 'suspend', studentId: null, studentName: undefined });
    }
  };

  const totalPages = data?.pagination?.totalPages || 1;

  const filterTabs: Array<{ label: string; value: StatusFilter }> = [
    { label: 'All Students', value: 'ALL' },
    { label: 'Active Accounts', value: 'ACTIVE' },
    { label: 'Suspended Accounts', value: 'SUSPENDED' },
    { label: 'Pending Verification', value: 'pending_approval' },
    { label: 'Approved Verification', value: 'approved' },
    { label: 'Rejected Verification', value: 'rejected' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-slate-500 mt-1">Review, approve, suspend, or edit registered student accounts.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              statusFilter === tab.value
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <Card className="p-12">
          <EmptyState
            icon={Users}
            title="Unable to load students"
            description={error instanceof Error ? error.message : 'Unable to fetch student list.'}
            actionText="Retry"
            onAction={() => refetch()}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by student name, email, or ID..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing page {page} of {totalPages}
            </span>
          </div>

          <div className="bg-white overflow-x-auto">
            {isLoading ? (
              <div className="p-6"><TableSkeleton rows={6} /></div>
            ) : studentsList.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No students found"
                description="No student accounts match your filter criteria."
              />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>Student</TableHead>
                      <TableHead>University / Dept</TableHead>
                      <TableHead>Programme & Level</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Account Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsList.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar src={s.avatarUrl || undefined} fallback={s.fullName} size="sm" />
                            <div>
                              <p className="font-semibold text-slate-900">{s.fullName}</p>
                              <p className="text-xs text-slate-500">{s.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          <p className="font-medium text-slate-900">{s.academicProfile?.university || s.university || 'N/A'}</p>
                          <p className="text-slate-500">{s.academicProfile?.department || s.department || 'N/A'}</p>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          <p className="font-medium text-slate-900">{s.academicProfile?.programme || 'General'}</p>
                          <p className="text-slate-500">{s.academicProfile?.level || s.level || 'Level 100'}</p>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={s.verificationStatus || (s.studentVerified ? 'APPROVED' : 'PENDING')} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={s.accountStatus} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                            <Link to={`/students/${s.id}`}>
                              <Button variant="ghost" size="sm" title="View Profile" className="px-2">
                                <Eye className="w-4 h-4 text-slate-600" />
                              </Button>
                            </Link>

                            <Button
                              variant="ghost"
                              size="sm"
                              title="Edit Student"
                              className="px-2"
                              onClick={() => {
                                console.log('[Students] Edit clicked for student:', s.id, s.fullName);
                                setEditModal({ isOpen: true, student: s });
                              }}
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                            </Button>

                            {!s.studentVerified && s.verificationStatus !== 'APPROVED' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Approve Verification"
                                  className="text-green-600 px-2"
                                  onClick={() => {
                                    console.log('[Students] Approve verification clicked for student:', s.id, s.fullName);
                                    setActionModal({ isOpen: true, type: 'approve', studentId: s.id, studentName: s.fullName });
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Reject Verification"
                                  className="text-red-600 px-2"
                                  onClick={() => {
                                    console.log('[Students] Reject verification clicked for student:', s.id, s.fullName);
                                    setActionModal({ isOpen: true, type: 'reject', studentId: s.id, studentName: s.fullName });
                                  }}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}

                            {s.accountStatus === 'ACTIVE' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Suspend Account"
                                className="text-yellow-600 px-2"
                                onClick={() => {
                                  console.log('[Students] Suspend clicked for student:', s.id, s.fullName);
                                  setActionModal({ isOpen: true, type: 'suspend', studentId: s.id, studentName: s.fullName });
                                }}
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Activate Account"
                                className="text-green-600 px-2"
                                onClick={() => {
                                  console.log('[Students] Activate clicked for student:', s.id, s.fullName);
                                  setActionModal({ isOpen: true, type: 'activate', studentId: s.id, studentName: s.fullName });
                                }}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              title="Delete Account"
                              className="text-red-600 px-2"
                              onClick={() => {
                                console.log('[Students] Delete clicked for student:', s.id, s.fullName);
                                setActionModal({ isOpen: true, type: 'delete', studentId: s.id, studentName: s.fullName });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="border-t border-slate-100 bg-white p-4">
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Action Confirmation Modal */}
      <ConfirmationModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleAction}
        title={`${actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)} Student`}
        message={`Are you sure you want to ${actionModal.type} ${actionModal.studentName || 'this student'}? ${actionModal.type === 'delete' ? 'This action is permanent and cannot be undone.' : ''}`}
        variant={actionModal.type === 'delete' || actionModal.type === 'reject' ? 'danger' : actionModal.type === 'suspend' ? 'warning' : 'primary'}
        confirmText={actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)}
      />

      {/* Edit Student Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, student: null })}
        title="Edit Student Details"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditModal({ isOpen: false, student: null })}>Cancel</Button>
            <Button onClick={() => { toast.success('Student details updated.'); setEditModal({ isOpen: false, student: null }); }}>Save Changes</Button>
          </>
        }
      >
        {editModal.student && (
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <Input defaultValue={editModal.student.fullName} readOnly className="bg-slate-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <Input defaultValue={editModal.student.email} readOnly className="bg-slate-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University</label>
              <Input defaultValue={editModal.student.academicProfile?.university || editModal.student.university} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <Input defaultValue={editModal.student.academicProfile?.department || editModal.student.department} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
