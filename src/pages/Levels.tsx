import { useState } from 'react';
import { Plus, Layers, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal, ConfirmationModal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { useLevels, useCreateLevel, useUpdateLevel, useDeleteLevel } from '../hooks/useAcademic';
import type { LevelItem } from '../types/api';

export default function Levels() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [sortOrder, setSortOrder] = useState(100);

  const { data: levels = [], isLoading, error, refetch } = useLevels();
  const createMutation = useCreateLevel();
  const updateMutation = useUpdateLevel();
  const deleteMutation = useDeleteLevel();

  const handleCreate = async () => {
    if (!name.trim() || !code.trim()) {
      toast.error('Level name and code are required.');
      return;
    }
    try {
      await createMutation.mutateAsync({ name, code, sortOrder });
      toast.success('Level created successfully!');
      setIsAddModalOpen(false);
      setName(''); setCode(''); setSortOrder(100);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create level.');
    }
  };

  const handleUpdate = async () => {
    if (!editingLevel || !name.trim() || !code.trim()) return;
    try {
      await updateMutation.mutateAsync({
        id: editingLevel.id,
        data: { name, code, sortOrder },
      });
      toast.success('Level updated successfully!');
      setEditingLevel(null);
      setName(''); setCode(''); setSortOrder(100);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update level.');
    }
  };

  const handleToggleStatus = async (level: LevelItem) => {
    const newStatus = level.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateMutation.mutateAsync({ id: level.id, data: { status: newStatus } });
      toast.success(`Level marked as ${newStatus}.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle status.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Level deleted successfully.');
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete level.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Levels</h1>
          <p className="text-slate-500 mt-1">Configure student year levels (Level 100, 200, 300, 400, 500, etc.).</p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={() => { setName(''); setCode(''); setSortOrder(100); setIsAddModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Level
        </Button>
      </div>

      {error ? (
        <Card className="p-12">
          <EmptyState
            icon={Layers}
            title="Unable to load academic levels"
            description={error instanceof Error ? error.message : 'Unable to fetch levels data.'}
            actionText="Retry"
            onAction={() => refetch()}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Academic Hierarchy Sequence</span>
            <span className="text-xs text-slate-500 font-medium">{levels.length} Total Levels</span>
          </div>

          <div className="bg-white">
            {isLoading ? (
              <div className="p-6"><TableSkeleton rows={5} /></div>
            ) : levels.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No levels configured"
                description="Add academic levels (e.g. Level 100) for student registration."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Level Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Sort Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levels.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-semibold text-slate-900">{l.name}</TableCell>
                      <TableCell className="text-slate-600">{l.code}</TableCell>
                      <TableCell className="text-slate-600 font-medium">{l.sortOrder}</TableCell>
                      <TableCell><StatusBadge status={l.status || 'ACTIVE'} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingLevel(l); setName(l.name); setCode(l.code); setSortOrder(l.sortOrder); }}>
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(l)}>
                            {l.status === 'ACTIVE' ? <XCircle className="w-4 h-4 text-yellow-600" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeletingId(l.id)}>
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
        title="Add Academic Level"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button disabled={createMutation.isPending} onClick={handleCreate}>{createMutation.isPending ? 'Saving...' : 'Create Level'}</Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Level Name *</label>
            <Input placeholder="e.g. Level 100" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Code *</label>
              <Input placeholder="e.g. L100" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sort Order</label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingLevel}
        onClose={() => setEditingLevel(null)}
        title="Edit Academic Level"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditingLevel(null)}>Cancel</Button>
            <Button disabled={updateMutation.isPending} onClick={handleUpdate}>{updateMutation.isPending ? 'Updating...' : 'Save Changes'}</Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Level Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Code *</label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sort Order</label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Level"
        message="Are you sure you want to delete this level?"
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
}
