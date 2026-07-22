import { useState } from 'react';
import { UserCheck, Check, X, FileText, Users, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Avatar } from '../components/ui/Avatar';
import toast from 'react-hot-toast';
import { usePendingVerifications, useApproveVerification, useRejectVerification, useInReviewVerification } from '../hooks/useVerifications';

export default function Verification() {
  const { data: verifications = [], isLoading, error, refetch } = usePendingVerifications();
  const approveMutation = useApproveVerification();
  const rejectMutation = useRejectVerification();
  const inReviewMutation = useInReviewVerification();

  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; userId: string | null }>({ isOpen: false, userId: null });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; userId: string | null }>({ isOpen: false, userId: null });
  const [inReviewModal, setInReviewModal] = useState<{ isOpen: boolean; userId: string | null }>({ isOpen: false, userId: null });
  const [notes, setNotes] = useState('');

  const handleAction = async (type: 'approve' | 'reject' | 'in-review') => {
    const userId = type === 'approve' ? approveModal.userId : type === 'reject' ? rejectModal.userId : inReviewModal.userId;
    if (!userId) {
      toast.error('No user selected.');
      return;
    }

    const setModal = type === 'approve' ? setApproveModal : type === 'reject' ? setRejectModal : setInReviewModal;
    const mutation = type === 'approve' ? approveMutation : type === 'reject' ? rejectMutation : inReviewMutation;
    const label = type === 'approve' ? 'approve' : type === 'reject' ? 'reject' : 'move to review';

    setModal({ isOpen: false, userId: null });
    setNotes('');

    try {
      await mutation.mutateAsync({ userId, notes: notes || undefined });
      toast.success(`Verification ${label}d successfully!`);
    } catch (err) {
      console.error(`Failed to ${label} verification:`, err);
      toast.error(`Failed to ${label} verification.`);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Identity Verification</h1>
        <p className="text-slate-500 mt-1">Review and approve student identity documents.</p>
      </div>

      {error ? (
        <Card className="p-12">
          <EmptyState
            icon={Users}
            title="Unable to load verification requests"
            description={error instanceof Error ? error.message : 'Unable to load verification requests. Please try again.'}
            actionText="Retry"
            onAction={handleRetry}
          />
        </Card>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-3 w-32" />
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </Card>
          ))}
        </div>
      ) : verifications.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={UserCheck}
            title="All caught up!"
            description="There are no pending student verifications at this time."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifications.map((v) => (
            <Card key={v.userId} className="flex flex-col overflow-hidden">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar src={v.profileImage || undefined} fallback={v.fullName} size="lg" />
                  <div>
                    <h3 className="font-bold text-slate-900">{v.fullName}</h3>
                    <p className="text-xs text-slate-500">{v.profile?.university || 'University'}</p>
                    <p className="text-xs text-slate-400">{v.profile?.department} • {v.profile?.level}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-sm text-slate-700">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Student ID</span>
                  </div>
                  <div className="aspect-video bg-slate-200 rounded-md flex items-center justify-center overflow-hidden border border-slate-300">
                    {v.idPhotoUrl?.startsWith('http') ? (
                      <img
                        src={v.idPhotoUrl}
                        alt="Student ID"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="text-slate-400 text-sm">ID Document Preview</div>
                    )}
                  </div>
                </div>

                {v.adminNotes && (
                  <div className="mb-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      <span className="font-semibold">Admin Note:</span> {v.adminNotes}
                    </p>
                  </div>
                )}

                <p className="text-xs text-slate-500">Submitted: {new Date(v.submittedAt).toLocaleDateString()}</p>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => setRejectModal({ isOpen: true, userId: v.userId })}>
                  <X className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button variant="outline" className="flex-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200" onClick={() => setInReviewModal({ isOpen: true, userId: v.userId })}>
                  <Clock className="w-4 h-4 mr-2" /> In Review
                </Button>
                <Button className="flex-1 bg-brand-600 hover:bg-brand-700 text-white" onClick={() => setApproveModal({ isOpen: true, userId: v.userId })}>
                  <Check className="w-4 h-4 mr-2" /> Approve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={approveModal.isOpen}
        onClose={() => { setApproveModal({ isOpen: false, userId: null }); setNotes(''); }}
        title="Approve Verification"
        footer={
          <>
            <Button variant="outline" onClick={() => { setApproveModal({ isOpen: false, userId: null }); setNotes(''); }}>Cancel</Button>
            <Button disabled={approveMutation.isPending} onClick={() => handleAction('approve')}>{approveMutation.isPending ? 'Approving...' : 'Confirm Approval'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Please provide a note for approving this verification.</p>
          <textarea
            className="w-full h-32 p-3 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
            placeholder="e.g., All documents verified and approved."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => { setRejectModal({ isOpen: false, userId: null }); setNotes(''); }}
        title="Reject Verification"
        footer={
          <>
            <Button variant="outline" onClick={() => { setRejectModal({ isOpen: false, userId: null }); setNotes(''); }}>Cancel</Button>
            <Button variant="danger" disabled={rejectMutation.isPending} onClick={() => handleAction('reject')}>{rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Please provide a note for rejecting this verification. This will be sent to the student.</p>
          <textarea
            className="w-full h-32 p-3 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
            placeholder="e.g., The image is too blurry to read the student ID number..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={inReviewModal.isOpen}
        onClose={() => { setInReviewModal({ isOpen: false, userId: null }); setNotes(''); }}
        title="Move to In Review"
        footer={
          <>
            <Button variant="outline" onClick={() => { setInReviewModal({ isOpen: false, userId: null }); setNotes(''); }}>Cancel</Button>
            <Button disabled={inReviewMutation.isPending} onClick={() => handleAction('in-review')}>{inReviewMutation.isPending ? 'Moving...' : 'Confirm'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Please provide a note for moving this verification back to the review queue.</p>
          <textarea
            className="w-full h-32 p-3 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
            placeholder="e.g., Need additional verification of student ID..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
