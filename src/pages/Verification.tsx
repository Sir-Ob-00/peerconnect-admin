import { useState } from 'react';
import { UserCheck, Check, X, FileText, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { usePendingVerifications, useApproveVerification, useRejectVerification } from '../hooks/useVerifications';

export default function Verification() {
  const { data: verifications = [], isLoading, error, refetch } = usePendingVerifications();
  const approveMutation = useApproveVerification();
  const rejectMutation = useRejectVerification();

  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; userId: string | null }>({ isOpen: false, userId: null });
  const [reason, setReason] = useState('');

  const handleApprove = (userId: string) => {
    approveMutation.mutate(userId, {
      onSuccess: () => {
        toast.success('Student verified successfully!');
      },
    });
  };

  const handleReject = () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection.');
      return;
    }
    if (!rejectModal.userId) return;

    rejectMutation.mutate(
      { userId: rejectModal.userId, reason },
      {
        onSuccess: () => {
          toast.success('Verification rejected.');
          setRejectModal({ isOpen: false, userId: null });
          setReason('');
        },
        onError: () => {
          toast.error('Failed to reject verification.');
        },
      }
    );
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
                  <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
                    {v.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{v.fullName}</h3>
                    <p className="text-xs text-slate-500">{v.department}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-sm text-slate-700">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Student ID</span>
                  </div>
                  <div className="aspect-video bg-slate-200 rounded-md flex items-center justify-center overflow-hidden border border-slate-300">
                    <img
                      src={v.idPhotoUrl}
                      alt="Student ID"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500">Submitted: {new Date(v.submittedAt).toLocaleDateString()}</p>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <Button className="flex-1" onClick={() => handleApprove(v.userId)}>
                  <Check className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => setRejectModal({ isOpen: true, userId: v.userId })}>
                  <X className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, userId: null })}
        title="Reject Verification"
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectModal({ isOpen: false, userId: null })}>Cancel</Button>
            <Button variant="danger" onClick={handleReject}>Confirm Rejection</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Please provide a reason for rejecting this verification document. This will be sent to the student.</p>
          <textarea
            className="w-full h-32 p-3 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
            placeholder="e.g., The image is too blurry to read the student ID number..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
