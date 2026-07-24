import { useState } from 'react';
import { Search, Users, Trash2, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal, ConfirmationModal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { useStudyGroups, useDeleteStudyGroup, useStudyGroupMembers, useRemoveStudyGroupMember } from '../hooks/useStudyGroups';
import type { StudyGroupItem } from '../types/api';

export default function StudyGroups() {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<StudyGroupItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: studyGroups = [], isLoading, error, refetch } = useStudyGroups({ search });
  const deleteMutation = useDeleteStudyGroup();
  const { data: members = [], isLoading: membersLoading } = useStudyGroupMembers(selectedGroup?.id || null);
  const removeMemberMutation = useRemoveStudyGroupMember();

  const handleDeleteGroup = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Study group deleted.');
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete study group.');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedGroup) return;
    try {
      await removeMemberMutation.mutateAsync({ chatRoomId: selectedGroup.id, userId });
      toast.success('Member removed from study group.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove member.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Study Groups Moderation</h1>
          <p className="text-slate-500 mt-1">Monitor peer study groups, inspect active members, and moderate activity.</p>
        </div>
      </div>

      {error ? (
        <Card className="p-12">
          <EmptyState
            icon={Users}
            title="Unable to load study groups"
            description={error instanceof Error ? error.message : 'Unable to fetch study groups data.'}
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
                placeholder="Search study groups..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">{studyGroups.length} Active Groups</span>
          </div>

          <div className="bg-white">
            {isLoading ? (
              <div className="p-6"><TableSkeleton rows={5} /></div>
            ) : studyGroups.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No study groups found"
                description="No active study groups match your search criteria."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Group Name</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Institution / Dept</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studyGroups.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell className="font-semibold text-slate-900">{g.name}</TableCell>
                      <TableCell className="text-slate-600">{g.creatorName || 'Student'}</TableCell>
                      <TableCell className="text-xs text-slate-600">
                        <p className="font-medium text-slate-900">{g.university || 'All Institutions'}</p>
                        <p className="text-slate-500">{g.department || 'General'}</p>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">{g.membersCount || 1}</TableCell>
                      <TableCell className="text-slate-600">{new Date(g.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell><StatusBadge status={g.status || 'ACTIVE'} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedGroup(g)}>
                            <Eye className="w-4 h-4 text-blue-600 mr-1" /> Inspect
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeletingId(g.id)}>
                            <Trash2 className="w-4 h-4" />
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

      {/* Inspect Group Modal */}
      <Modal
        isOpen={!!selectedGroup}
        onClose={() => setSelectedGroup(null)}
        title={`Inspect Study Group: ${selectedGroup?.name || ''}`}
        footer={
          <Button variant="outline" onClick={() => setSelectedGroup(null)}>Close</Button>
        }
      >
        {selectedGroup && (
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <p className="text-xs text-slate-500">Description:</p>
              <p className="text-slate-800 font-medium">{selectedGroup.description || 'No description provided.'}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600" /> Group Members ({members.length})
              </h4>
              {membersLoading ? (
                <div className="text-slate-400 text-xs py-2">Loading members...</div>
              ) : members.length === 0 ? (
                <div className="text-slate-400 text-xs py-2">No members registered in room.</div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-100 rounded-lg p-2">
                  {members.map((m) => (
                    <div key={m.userId} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded text-xs">
                      <div>
                        <p className="font-semibold text-slate-900">{m.fullName}</p>
                        <p className="text-slate-400">{m.email} • {m.role}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleRemoveMember(m.userId)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteGroup}
        title="Delete Study Group"
        message="Are you sure you want to delete or suspend this study group? Group members will be notified."
        variant="danger"
        confirmText="Delete Group"
      />
    </div>
  );
}
