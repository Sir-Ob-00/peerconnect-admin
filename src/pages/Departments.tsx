import { useState } from 'react';
import { Search, Plus, BookOpen, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal, ConfirmationModal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment, useUniversities } from '../hooks/useAcademic';
import type { DepartmentItem } from '../types/api';

export default function Departments() {
  const [search, setSearch] = useState('');
  const [selectedUniFilter, setSelectedUniFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [universityId, setUniversityId] = useState('');

  const { data: departments = [], isLoading, error, refetch } = useDepartments({ search, universityId: selectedUniFilter || undefined });
  const { data: universities = [] } = useUniversities();

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const handleCreate = async () => {
    if (!name.trim() || !universityId) {
      toast.error('Department name and parent university are required.');
      return;
    }
    try {
      await createMutation.mutateAsync({ name, code: code || undefined, universityId });
      toast.success('Department created successfully!');
      setIsAddModalOpen(false);
      setName(''); setCode(''); setUniversityId('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create department.');
    }
  };

  const handleUpdate = async () => {
    if (!editingDept || !name.trim() || !universityId) return;
    try {
      await updateMutation.mutateAsync({
        id: editingDept.id,
        data: { name, code, universityId },
      });
      toast.success('Department updated successfully!');
      setEditingDept(null);
      setName(''); setCode(''); setUniversityId('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update department.');
    }
  };

  const handleToggleStatus = async (dept: DepartmentItem) => {
    const newStatus = dept.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateMutation.mutateAsync({ id: dept.id, data: { status: newStatus } });
      toast.success(`Department marked as ${newStatus}.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle status.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Department deleted successfully.');
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete department.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Department Management</h1>
          <p className="text-slate-500 mt-1">Manage academic departments associated with tertiary institutions.</p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={() => { setName(''); setCode(''); setUniversityId(universities[0]?.id || ''); setIsAddModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Department
        </Button>
      </div>

      {error ? (
        <Card className="p-12">
          <EmptyState
            icon={BookOpen}
            title="Unable to load departments"
            description={error instanceof Error ? error.message : 'Unable to load department data.'}
            actionText="Retry"
            onAction={() => refetch()}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search departments..."
                  className="pl-9 bg-slate-50 border-slate-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={selectedUniFilter}
                onChange={(e) => setSelectedUniFilter(e.target.value)}
              >
                <option value="">All Universities</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-slate-500 font-medium">{departments.length} Total Departments</span>
          </div>

          <div className="bg-white">
            {isLoading ? (
              <div className="p-6"><TableSkeleton rows={5} /></div>
            ) : departments.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No departments found"
                description="Add departments under universities to structure academic profiles."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Department Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Parent University</TableHead>
                    <TableHead>Programmes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-semibold text-slate-900">{d.name}</TableCell>
                      <TableCell className="text-slate-600">{d.code || '—'}</TableCell>
                      <TableCell className="text-slate-600">{d.universityName || 'University'}</TableCell>
                      <TableCell className="text-slate-600 font-medium">{d.programmesCount ?? 0}</TableCell>
                      <TableCell><StatusBadge status={d.status || 'ACTIVE'} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingDept(d); setName(d.name); setCode(d.code || ''); setUniversityId(d.universityId); }}>
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(d)}>
                            {d.status === 'ACTIVE' ? <XCircle className="w-4 h-4 text-yellow-600" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeletingId(d.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Department"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button disabled={createMutation.isPending} onClick={handleCreate}>{createMutation.isPending ? 'Saving...' : 'Create Department'}</Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Parent University *</label>
            <select
              className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none"
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
            >
              <option value="">Select University</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name *</label>
            <Input placeholder="e.g. Computer Science" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Abbreviation / Code</label>
            <Input placeholder="e.g. CS" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingDept}
        onClose={() => setEditingDept(null)}
        title="Edit Department"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditingDept(null)}>Cancel</Button>
            <Button disabled={updateMutation.isPending} onClick={handleUpdate}>{updateMutation.isPending ? 'Updating...' : 'Save Changes'}</Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Parent University *</label>
            <select
              className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none"
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
            >
              {universities.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Abbreviation / Code</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        message="Are you sure you want to delete this department? Associated programmes will be removed."
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
}
