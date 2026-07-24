import { useState } from 'react';
import { Search, Plus, GraduationCap, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal, ConfirmationModal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { useProgrammes, useCreateProgramme, useUpdateProgramme, useDeleteProgramme, useDepartments } from '../hooks/useAcademic';
import type { ProgrammeItem } from '../types/api';

export default function Programmes() {
  const [search, setSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<ProgrammeItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [durationYears, setDurationYears] = useState(4);

  const { data: programmes = [], isLoading, error, refetch } = useProgrammes({ search, departmentId: selectedDeptFilter || undefined });
  const { data: departments = [] } = useDepartments();

  const createMutation = useCreateProgramme();
  const updateMutation = useUpdateProgramme();
  const deleteMutation = useDeleteProgramme();

  const handleCreate = async () => {
    if (!name.trim() || !departmentId) {
      toast.error('Programme name and parent department are required.');
      return;
    }
    try {
      await createMutation.mutateAsync({ name, code: code || undefined, departmentId, durationYears });
      toast.success('Programme created successfully!');
      setIsAddModalOpen(false);
      setName(''); setCode(''); setDepartmentId(''); setDurationYears(4);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create programme.');
    }
  };

  const handleUpdate = async () => {
    if (!editingProg || !name.trim() || !departmentId) return;
    try {
      await updateMutation.mutateAsync({
        id: editingProg.id,
        data: { name, code, departmentId, durationYears },
      });
      toast.success('Programme updated successfully!');
      setEditingProg(null);
      setName(''); setCode(''); setDepartmentId(''); setDurationYears(4);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update programme.');
    }
  };

  const handleToggleStatus = async (prog: ProgrammeItem) => {
    const newStatus = prog.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateMutation.mutateAsync({ id: prog.id, data: { status: newStatus } });
      toast.success(`Programme marked as ${newStatus}.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle status.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Programme deleted successfully.');
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete programme.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Programme Management</h1>
          <p className="text-slate-500 mt-1">Configure academic degrees and courses offered per department.</p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={() => { setName(''); setCode(''); setDepartmentId(departments[0]?.id || ''); setIsAddModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Programme
        </Button>
      </div>

      {error ? (
        <Card className="p-12">
          <EmptyState
            icon={GraduationCap}
            title="Unable to load programmes"
            description={error instanceof Error ? error.message : 'Unable to load programme data.'}
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
                  placeholder="Search programmes..."
                  className="pl-9 bg-slate-50 border-slate-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-slate-500 font-medium">{programmes.length} Total Programmes</span>
          </div>

          <div className="bg-white">
            {isLoading ? (
              <div className="p-6"><TableSkeleton rows={5} /></div>
            ) : programmes.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="No programmes found"
                description="Add degree programmes under departments for student selection."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Programme Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programmes.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-semibold text-slate-900">{p.name}</TableCell>
                      <TableCell className="text-slate-600">{p.code || '—'}</TableCell>
                      <TableCell className="text-slate-600">{p.departmentName || 'Department'}</TableCell>
                      <TableCell className="text-slate-600">{p.durationYears || 4} Years</TableCell>
                      <TableCell><StatusBadge status={p.status || 'ACTIVE'} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingProg(p); setName(p.name); setCode(p.code || ''); setDepartmentId(p.departmentId); setDurationYears(p.durationYears || 4); }}>
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(p)}>
                            {p.status === 'ACTIVE' ? <XCircle className="w-4 h-4 text-yellow-600" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeletingId(p.id)}>
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
        title="Add New Academic Programme"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button disabled={createMutation.isPending} onClick={handleCreate}>{createMutation.isPending ? 'Saving...' : 'Create Programme'}</Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Department *</label>
            <select
              className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Programme Name *</label>
            <Input placeholder="e.g. BSc Computer Science" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Code</label>
              <Input placeholder="e.g. BSCCS" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Years)</label>
              <Input type="number" min={1} max={7} value={durationYears} onChange={(e) => setDurationYears(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingProg}
        onClose={() => setEditingProg(null)}
        title="Edit Academic Programme"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditingProg(null)}>Cancel</Button>
            <Button disabled={updateMutation.isPending} onClick={handleUpdate}>{updateMutation.isPending ? 'Updating...' : 'Save Changes'}</Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Department *</label>
            <select
              className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Programme Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Code</label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Years)</label>
              <Input type="number" min={1} max={7} value={durationYears} onChange={(e) => setDurationYears(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Programme"
        message="Are you sure you want to delete this programme? Students enrolled under this programme will need re-assignment."
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
}
