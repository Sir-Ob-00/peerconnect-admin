import { useState } from 'react';
import { Search, Plus, Building2, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal, ConfirmationModal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { useUniversities, useCreateUniversity, useUpdateUniversity, useDeleteUniversity } from '../hooks/useAcademic';
import type { UniversityItem } from '../types/api';

export default function Universities() {
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUni, setEditingUni] = useState<UniversityItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');

  const { data: universities = [], isLoading, error, refetch } = useUniversities({ search });
  const createMutation = useCreateUniversity();
  const updateMutation = useUpdateUniversity();
  const deleteMutation = useDeleteUniversity();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('University name is required.');
      return;
    }
    try {
      await createMutation.mutateAsync({ name, code: code || undefined, location: location || undefined });
      toast.success('University created successfully!');
      setIsAddModalOpen(false);
      setName(''); setCode(''); setLocation('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create university.');
    }
  };

  const handleUpdate = async () => {
    if (!editingUni || !name.trim()) return;
    try {
      await updateMutation.mutateAsync({
        id: editingUni.id,
        data: { name, code, location },
      });
      toast.success('University updated successfully!');
      setEditingUni(null);
      setName(''); setCode(''); setLocation('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update university.');
    }
  };

  const handleToggleStatus = async (uni: UniversityItem) => {
    const newStatus = uni.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateMutation.mutateAsync({ id: uni.id, data: { status: newStatus } });
      toast.success(`University marked as ${newStatus}.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle status.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('University deleted successfully.');
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete university.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">University Management</h1>
          <p className="text-slate-500 mt-1">Configure tertiary institutions for student registration onboarding.</p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={() => { setName(''); setCode(''); setLocation(''); setIsAddModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add University
        </Button>
      </div>

      {error ? (
        <Card className="p-12">
          <EmptyState
            icon={Building2}
            title="Unable to load universities"
            description={error instanceof Error ? error.message : 'Unable to load university data.'}
            actionText="Retry"
            onAction={() => refetch()}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search universities..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">{universities.length} Total Universities</span>
          </div>

          <div className="bg-white">
            {isLoading ? (
              <div className="p-6"><TableSkeleton rows={5} /></div>
            ) : universities.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No universities added"
                description="Add tertiary institutions to enable student onboarding."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>University Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Departments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {universities.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-semibold text-slate-900">{u.name}</TableCell>
                      <TableCell className="text-slate-600">{u.code || '—'}</TableCell>
                      <TableCell className="text-slate-600">{u.location || 'Ghana'}</TableCell>
                      <TableCell className="text-slate-600 font-medium">{u.departmentsCount ?? 0}</TableCell>
                      <TableCell><StatusBadge status={u.status || 'ACTIVE'} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingUni(u); setName(u.name); setCode(u.code || ''); setLocation(u.location || ''); }}>
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(u)}>
                            {u.status === 'ACTIVE' ? <XCircle className="w-4 h-4 text-yellow-600" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeletingId(u.id)}>
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
        title="Add New University"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button disabled={createMutation.isPending} onClick={handleCreate}>{createMutation.isPending ? 'Saving...' : 'Create University'}</Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">University Name *</label>
            <Input placeholder="e.g. University of Ghana" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Abbreviation / Code</label>
            <Input placeholder="e.g. UG" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
            <Input placeholder="e.g. Legon, Accra" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingUni}
        onClose={() => setEditingUni(null)}
        title="Edit University"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditingUni(null)}>Cancel</Button>
            <Button disabled={updateMutation.isPending} onClick={handleUpdate}>{updateMutation.isPending ? 'Updating...' : 'Save Changes'}</Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">University Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Abbreviation / Code</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete University"
        message="Are you sure you want to delete this university? Associated departments and programmes may also be affected."
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
}
