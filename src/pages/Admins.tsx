import { useState } from 'react';
import { Search, Shield, Plus, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal, ConfirmationModal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { useAdmins, useCreateAdmin, useUpdateAdmin, useDeleteAdmin } from '../hooks/useAdmins';
import type { AdminUser } from '../types/api';

export default function Admins() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');

  const { data: admins = [], isLoading, error, refetch } = useAdmins({ search, role: roleFilter || undefined });
  const createMutation = useCreateAdmin();
  const updateMutation = useUpdateAdmin();
  const deleteMutation = useDeleteAdmin();

  const handleCreate = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error('First name, last name, and email are required.');
      return;
    }
    try {
      await createMutation.mutateAsync({ firstName, lastName, email, password: password || undefined, role });
      toast.success('Admin account created successfully!');
      setIsAddModalOpen(false);
      setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setRole('ADMIN');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create admin user.');
    }
  };

  const handleUpdate = async () => {
    if (!editingAdmin) return;
    try {
      await updateMutation.mutateAsync({
        id: editingAdmin.id,
        data: { firstName, lastName, role },
      });
      toast.success('Admin updated successfully!');
      setEditingAdmin(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update admin user.');
    }
  };

  const handleToggleStatus = async (adm: AdminUser) => {
    const newStatus = adm.accountStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateMutation.mutateAsync({ id: adm.id, data: { accountStatus: newStatus } });
      toast.success(`Admin account marked as ${newStatus}.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update account status.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Admin account removed.');
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove admin.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Team Management</h1>
          <p className="text-slate-500 mt-1">Manage platform administrators, roles, permissions, and security access.</p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={() => { setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setIsAddModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Administrator
        </Button>
      </div>

      {error ? (
        <Card className="p-12">
          <EmptyState
            icon={Shield}
            title="Unable to load admins"
            description={error instanceof Error ? error.message : 'Unable to fetch admin users data.'}
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
                  placeholder="Search administrators..."
                  className="pl-9 bg-slate-50 border-slate-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 outline-none"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="MODERATOR">Moderator</option>
              </select>
            </div>
            <span className="text-xs text-slate-500 font-medium">{admins.length} Total Administrators</span>
          </div>

          <div className="bg-white">
            {isLoading ? (
              <div className="p-6"><TableSkeleton rows={4} /></div>
            ) : admins.length === 0 ? (
              <EmptyState
                icon={Shield}
                title="No admin users found"
                description="Administrative accounts will appear here."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Administrator</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((adm) => (
                    <TableRow key={adm.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {adm.firstName} {adm.lastName}
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs">{adm.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100">
                          {adm.role}
                        </span>
                      </TableCell>
                      <TableCell><StatusBadge status={adm.accountStatus} /></TableCell>
                      <TableCell className="text-slate-500 text-xs">{new Date(adm.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingAdmin(adm); setFirstName(adm.firstName); setLastName(adm.lastName); setRole(adm.role); }}>
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(adm)}>
                            {adm.accountStatus === 'ACTIVE' ? <XCircle className="w-4 h-4 text-yellow-600" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeletingId(adm.id)}>
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
        title="Add New Administrator"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button disabled={createMutation.isPending} onClick={handleCreate}>{createMutation.isPending ? 'Saving...' : 'Create Admin'}</Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Temporary Password</label>
            <Input type="password" placeholder="Leave blank for auto-generated password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role & Permissions</label>
            <select className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="MODERATOR">Moderator</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingAdmin}
        onClose={() => setEditingAdmin(null)}
        title="Edit Administrator"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditingAdmin(null)}>Cancel</Button>
            <Button disabled={updateMutation.isPending} onClick={handleUpdate}>{updateMutation.isPending ? 'Updating...' : 'Save Changes'}</Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
            <select className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="MODERATOR">Moderator</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Admin Account"
        message="Are you sure you want to remove this administrator account?"
        variant="danger"
        confirmText="Remove Account"
      />
    </div>
  );
}
