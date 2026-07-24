import { useState } from 'react';
import { Send, Bell, Trash2, Megaphone } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal, ConfirmationModal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import {
  useAdminNotifications, useBroadcastNotification, useDeleteNotification,
  useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement
} from '../hooks/useNotifications';
import { useUniversities, useDepartments } from '../hooks/useAcademic';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'announcements'>('broadcast');

  // Modals
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Broadcast Form
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'UNIVERSITY' | 'DEPARTMENT' | 'LEVEL'>('ALL');
  const [targetValue, setTargetValue] = useState('');

  const { data: notifications = [], isLoading: notifsLoading } = useAdminNotifications();
  const { data: announcements = [], isLoading: annLoading } = useAnnouncements();
  const { data: universities = [] } = useUniversities();
  const { data: departments = [] } = useDepartments();

  const broadcastMutation = useBroadcastNotification();
  const deleteNotifMutation = useDeleteNotification();
  const createAnnMutation = useCreateAnnouncement();
  const deleteAnnMutation = useDeleteAnnouncement();

  const handleBroadcast = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required.');
      return;
    }
    try {
      await broadcastMutation.mutateAsync({
        title,
        message,
        targetAudience,
        targetValue: targetAudience !== 'ALL' ? targetValue : undefined,
      });
      toast.success('Push notification broadcasted to students!');
      setIsBroadcastModalOpen(false);
      setTitle(''); setMessage(''); setTargetAudience('ALL'); setTargetValue('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to broadcast notification.');
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Title and content are required.');
      return;
    }
    try {
      await createAnnMutation.mutateAsync({
        title,
        content: message,
        targetAudience,
        targetValue: targetAudience !== 'ALL' ? targetValue : undefined,
        status: 'PUBLISHED',
      });
      toast.success('System announcement published!');
      setIsAnnouncementModalOpen(false);
      setTitle(''); setMessage(''); setTargetAudience('ALL'); setTargetValue('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to publish announcement.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      if (activeTab === 'broadcast') {
        await deleteNotifMutation.mutateAsync(deletingId);
        toast.success('Notification log deleted.');
      } else {
        await deleteAnnMutation.mutateAsync(deletingId);
        toast.success('Announcement deleted.');
      }
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete item.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications & Announcements</h1>
          <p className="text-slate-500 mt-1">Broadcast targeted push notifications and system announcements to students.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={() => { setTitle(''); setMessage(''); setIsBroadcastModalOpen(true); }}>
            <Send className="w-4 h-4 mr-2" /> Broadcast Notification
          </Button>
          <Button variant="outline" onClick={() => { setTitle(''); setMessage(''); setIsAnnouncementModalOpen(true); }}>
            <Megaphone className="w-4 h-4 mr-2 text-brand-600" /> New Announcement
          </Button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'broadcast'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Push Notifications History
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'announcements'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          System Announcements ({announcements.length})
        </button>
      </div>

      {activeTab === 'broadcast' ? (
        <Card className="overflow-hidden">
          <div className="bg-white">
            {notifsLoading ? (
              <div className="p-6"><TableSkeleton rows={4} /></div>
            ) : notifications.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="No notification logs"
                description="Broadcasted push notifications will be logged here."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Notification Title</TableHead>
                    <TableHead>Message Snippet</TableHead>
                    <TableHead>Target Audience</TableHead>
                    <TableHead>Sent Timestamp</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((n) => (
                    <TableRow key={n.id}>
                      <TableCell className="font-semibold text-slate-900">{n.title}</TableCell>
                      <TableCell className="text-slate-600 max-w-xs truncate">{n.message}</TableCell>
                      <TableCell className="text-xs font-semibold text-slate-700">{n.targetType || 'ALL'}</TableCell>
                      <TableCell className="text-slate-500 text-xs">{new Date(n.sentAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeletingId(n.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="bg-white">
            {annLoading ? (
              <div className="p-6"><TableSkeleton rows={4} /></div>
            ) : announcements.length === 0 ? (
              <EmptyState
                icon={Megaphone}
                title="No system announcements"
                description="Create platform announcements to notify students."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Announcement Title</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-semibold text-slate-900">{a.title}</TableCell>
                      <TableCell className="text-xs font-semibold text-slate-700">{a.targetAudience}</TableCell>
                      <TableCell><StatusBadge status={a.status || 'PUBLISHED'} /></TableCell>
                      <TableCell className="text-slate-500 text-xs">{new Date(a.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeletingId(a.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      )}

      {/* Broadcast Modal */}
      <Modal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        title="Broadcast Push Notification"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsBroadcastModalOpen(false)}>Cancel</Button>
            <Button disabled={broadcastMutation.isPending} onClick={handleBroadcast}>
              {broadcastMutation.isPending ? 'Sending...' : 'Send Broadcast'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
            <select
              className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white outline-none focus:ring-2 focus:ring-brand-500"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
            >
              <option value="ALL">All Registered Students</option>
              <option value="UNIVERSITY">Specific University</option>
              <option value="DEPARTMENT">Specific Department</option>
              <option value="LEVEL">Specific Academic Level</option>
            </select>
          </div>

          {targetAudience === 'UNIVERSITY' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select University</label>
              <select className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm" value={targetValue} onChange={(e) => setTargetValue(e.target.value)}>
                <option value="">Select Institution</option>
                {universities.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
            </div>
          )}

          {targetAudience === 'DEPARTMENT' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Department</label>
              <select className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm" value={targetValue} onChange={(e) => setTargetValue(e.target.value)}>
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notification Title *</label>
            <Input placeholder="e.g. End of Semester Tutoring Schedule" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Message Content *</label>
            <textarea
              className="w-full h-24 p-3 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Type notification message to be sent to student mobile devices..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Announcement Modal */}
      <Modal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        title="Publish System Announcement"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAnnouncementModalOpen(false)}>Cancel</Button>
            <Button disabled={createAnnMutation.isPending} onClick={handleCreateAnnouncement}>
              {createAnnMutation.isPending ? 'Publishing...' : 'Publish Announcement'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Title *</label>
            <Input placeholder="e.g. Platform Maintenance Notice" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Body *</label>
            <textarea
              className="w-full h-28 p-3 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Write complete announcement details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this notification or announcement record?"
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
}
