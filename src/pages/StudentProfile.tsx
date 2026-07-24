import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Trash2,
  CheckCircle,
  Image as ImageIcon,
  Check,
  X,
  BookOpen,
  Users,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { ConfirmationModal, Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { useStudentById, useDeleteStudent } from '../hooks/useStudents';
import { useApproveVerification, useRejectVerification } from '../hooks/useVerifications';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');

  const { data: studentDetail, isLoading, error, refetch } = useStudentById(id || '');
  const deleteMutation = useDeleteStudent();
  const approveMutation = useApproveVerification();
  const rejectMutation = useRejectVerification();

  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Student deleted successfully.');
        navigate('/students');
      },
    });
  };

  const s = studentDetail?.student;
  const academic = studentDetail?.academicProfile;
  const idVer = studentDetail?.idVerification;

  const handleApprove = (notes?: string) => {
    if (!s) return;
    approveMutation.mutate(
      { userId: s.id, notes },
      {
        onSuccess: () => {
          toast.success('Student verified successfully!');
          refetch();
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Failed to approve verification.');
        },
      }
    );
  };

  const handleReject = (notes?: string) => {
    if (!s) return;
    rejectMutation.mutate(
      { userId: s.id, notes },
      {
        onSuccess: () => {
          toast.success('Verification rejected.');
          refetch();
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Failed to reject verification.');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-72" />
                </div>
              </div>
            </Card>
            <Card className="p-6 md:p-8">
              <Skeleton className="h-6 w-40 mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          </div>
          <div>
            <Card className="p-6 space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </button>
        <Card className="p-12">
          <EmptyState
            icon={Users}
            title="Unable to load student profile"
            description={error instanceof Error ? error.message : 'Unable to load student profile. Please try again.'}
            actionText="Retry"
            onAction={refetch}
          />
        </Card>
      </div>
    );
  }

  if (!studentDetail) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </button>
        <Card className="p-12">
          <EmptyState
            icon={Users}
            title="Student not found"
            description="This student profile does not exist or has been removed."
          />
        </Card>
      </div>
    );
  }

  const statusLabel = s?.verificationStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '';
  const idVerified = idVer?.status === 'approved';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </button>

      <Card className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar src={s?.profileImage || undefined} fallback={s?.fullName || ''} size="xl" className="ring-4 ring-white shadow-md" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{s?.fullName}</h1>
              {idVerified && <CheckCircle className="w-5 h-5 text-brand-500" />}
              <StatusBadge status={statusLabel} />
            </div>
            <p className="text-slate-500 mb-3">
              {academic?.department} • {academic?.level} • {academic?.university}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {s?.email}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Joined {s?.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}</div>
            </div>
          </div>

          {s?.verificationStatus === 'pending_approval' && (
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setRejectModal(true)}>
                <X className="w-4 h-4 mr-2" /> Reject
              </Button>
              <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={() => handleApprove()}>
                <Check className="w-4 h-4 mr-2" /> Approve
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" /> About
            </h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{studentDetail?.bio || 'No bio provided.'}</p>
          </Card>

          {studentDetail?.learningGoals && (studentDetail.learningGoals.courses.length > 0 || studentDetail.learningGoals.skills.length > 0) && (
            <Card className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Learning Goals</h2>
              {studentDetail.learningGoals.courses.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Courses</h3>
                  <div className="flex flex-wrap gap-2">
                    {studentDetail.learningGoals.courses.map((c) => (
                      <span key={c.id} className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {c.name}{c.code ? ` (${c.code})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {studentDetail.learningGoals.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {studentDetail.learningGoals.skills.map((sk) => (
                      <span key={sk.id} className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {studentDetail?.canHelpWith && (studentDetail.canHelpWith.courses.length > 0 || studentDetail.canHelpWith.skills.length > 0) && (
            <Card className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Can Help With</h2>
              {studentDetail.canHelpWith.courses.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Courses</h3>
                  <div className="flex flex-wrap gap-2">
                    {studentDetail.canHelpWith.courses.map((c) => (
                      <span key={c.id} className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                        {c.name}{c.code ? ` (${c.code})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {studentDetail.canHelpWith.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {studentDetail.canHelpWith.skills.map((sk) => (
                      <span key={sk.id} className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {studentDetail?.learningInterests && studentDetail.learningInterests.length > 0 && (
            <Card className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Learning Interests</h2>
              <div className="flex flex-wrap gap-2">
                {studentDetail.learningInterests.map((interest) => (
                  <span key={interest.id} className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700">
                    {interest.name}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {idVer?.idPhotoUrl && (
            <Card className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-600" /> Verification Photo
              </h2>
              <div
                className="rounded-lg border border-slate-200 overflow-hidden cursor-zoom-in"
                onClick={() => setPhotoModal(true)}
              >
                <img
                  src={idVer.idPhotoUrl}
                  alt="ID Photo"
                  className="w-full object-cover max-h-[400px]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4 uppercase tracking-wider">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={statusLabel} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Setup Progress</span>
                <span className="font-medium text-slate-900 capitalize">{s?.setupProgress.replace(/_/g, ' ') || '—'}</span>
              </div>
              {studentDetail?.availability && studentDetail.availability.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Availability</span>
                  <span className="font-medium text-slate-900 text-right">
                    {studentDetail.availability.map((a) => `${a.dayOfWeek} ${a.startTime}-${a.endTime}`).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4 uppercase tracking-wider">Verification</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">ID Status</span>
                <span className="font-medium text-slate-900 capitalize">{idVer?.status.replace(/_/g, ' ') || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Submitted</span>
                <span className="text-sm text-slate-600">{idVer?.submittedAt ? new Date(idVer.submittedAt).toLocaleDateString() : '—'}</span>
              </div>
              {idVer?.rejectionReason && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rejection Reason</span>
                  <span className="text-sm text-red-600 text-right">{idVer.rejectionReason}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4 uppercase tracking-wider">Account</h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 mb-6">
              <span className="text-sm font-medium text-slate-700">Verification Status</span>
              <StatusBadge status={statusLabel} />
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => setDeleteModal(true)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {idVer?.idPhotoUrl && (
        <Modal isOpen={photoModal} onClose={() => setPhotoModal(false)} title="ID Photo">
          <div className="rounded-lg overflow-hidden border border-slate-200">
            <img src={idVer.idPhotoUrl} alt="ID Photo full" className="w-full object-cover max-h-[500px]" />
          </div>
        </Modal>
      )}

      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        message={`Are you sure you want to delete ${s?.fullName}? This action is permanent.`}
        variant="danger"
        confirmText="Delete"
      />

      <Modal
        isOpen={rejectModal}
        onClose={() => { setRejectModal(false); setRejectNotes(''); }}
        title="Reject Verification"
        footer={
          <>
            <Button variant="outline" onClick={() => { setRejectModal(false); setRejectNotes(''); }}>Cancel</Button>
            <Button variant="danger" disabled={!rejectNotes.trim() || rejectMutation.isPending} onClick={() => { handleReject(rejectNotes); setRejectModal(false); setRejectNotes(''); }}>
              {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Please provide a reason for rejecting this verification. This will be sent to the student.</p>
          <textarea
            className="w-full h-32 p-3 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
            placeholder="e.g., The image is too blurry to read the student ID number..."
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
