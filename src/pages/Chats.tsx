import { useState } from 'react';
import { Search, MessageSquare, AlertTriangle, Trash2, Eye, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal, ConfirmationModal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { useChats, useChatMessages, useDeleteChatMessage, useFlaggedChats } from '../hooks/useChats';
import type { ChatConversationItem } from '../types/api';

export default function Chats() {
  const [activeTab, setActiveTab] = useState<'conversations' | 'flagged'>('conversations');
  const [search, setSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatConversationItem | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

  const { data: conversations = [], isLoading: chatsLoading } = useChats({ search });
  const { data: flaggedMessages = [], isLoading: flaggedLoading } = useFlaggedChats();
  const { data: messages = [], isLoading: messagesLoading } = useChatMessages(selectedChat?.id || null);

  const deleteMessageMutation = useDeleteChatMessage();

  const handleDeleteMessage = async () => {
    if (!deletingMessageId) return;
    try {
      await deleteMessageMutation.mutateAsync(deletingMessageId);
      toast.success('Message removed for safety violation.');
      setDeletingMessageId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove message.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chat & Messaging Moderation</h1>
          <p className="text-slate-500 mt-1">Review flagged communication logs and protect student platform safety.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('conversations')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'conversations'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Conversations ({conversations.length})
        </button>
        <button
          onClick={() => setActiveTab('flagged')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'flagged'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-500" />
          Flagged Content ({flaggedMessages.length})
        </button>
      </div>

      {activeTab === 'conversations' ? (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">Privacy Protected Mode</span>
          </div>

          <div className="bg-white">
            {chatsLoading ? (
              <div className="p-6"><TableSkeleton rows={5} /></div>
            ) : conversations.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No active conversations"
                description="Student chat conversations will appear here."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Type & Name</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversations.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {c.name || (c.type === 'DIRECT' ? 'Direct Message' : 'Group Chat')}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {c.participants.map((p) => p.fullName).join(', ') || 'Students'}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleString() : 'Recent'}
                      </TableCell>
                      <TableCell>
                        {c.isFlagged ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                            Flagged
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                            Normal
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedChat(c)}>
                          <Eye className="w-4 h-4 text-blue-600 mr-1" /> View Logs
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
            {flaggedLoading ? (
              <div className="p-6"><TableSkeleton rows={4} /></div>
            ) : flaggedMessages.length === 0 ? (
              <EmptyState
                icon={Shield}
                title="No flagged messages"
                description="No inappropriate or reported messages found."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Sender</TableHead>
                    <TableHead>Flagged Message Snippet</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedMessages.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-semibold text-slate-900">{m.senderName}</TableCell>
                      <TableCell className="text-slate-700 font-mono text-xs max-w-xs truncate">{m.content}</TableCell>
                      <TableCell className="text-slate-500 text-xs">{new Date(m.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeletingMessageId(m.id)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
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

      {/* View Conversation Messages Modal */}
      <Modal
        isOpen={!!selectedChat}
        onClose={() => setSelectedChat(null)}
        title={`Message Logs: ${selectedChat?.name || 'Chat Conversation'}`}
        footer={
          <Button variant="outline" onClick={() => setSelectedChat(null)}>Close</Button>
        }
      >
        {selectedChat && (
          <div className="space-y-3 max-h-96 overflow-y-auto p-2 border border-slate-100 rounded-lg">
            {messagesLoading ? (
              <div className="text-xs text-slate-400 py-4 text-center">Loading message log...</div>
            ) : messages.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">No messages in conversation.</div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-lg flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{m.senderName}</span>
                    <span className="text-[10px] text-slate-400 ml-2">{new Date(m.createdAt).toLocaleTimeString()}</span>
                    <p className="text-xs text-slate-700 mt-1">{m.content}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 px-1" title="Delete Message" onClick={() => setDeletingMessageId(m.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingMessageId}
        onClose={() => setDeletingMessageId(null)}
        onConfirm={handleDeleteMessage}
        title="Delete Flagged Message"
        message="Are you sure you want to permanently remove this message for community policy violations?"
        variant="danger"
        confirmText="Delete Message"
      />
    </div>
  );
}
