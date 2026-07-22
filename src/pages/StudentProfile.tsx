import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Users,
  Image as ImageIcon,
  Check,
  X,
  BookOpen,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { ConfirmationModal, Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { useStudentById, useSuspendStudent, useActivateStudent, useDeleteStudent } from '../hooks/useStudents';
import { useApproveVerification, useRejectVerification } from '../hooks/useVerifications';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modal, setModal] = useState<{ isOpen: boolean; type: 'suspend' | 'activate' | 'delete' }>({
    isOpen: false,
    type: 'suspend',
  });
  const [photoModal, setPhotoModal] = useState(false);

  const { data: studentDetail, isLoading, error, refetch } = useStudentById(id || '');
  const suspendMutation = useSuspendStudent();
  const activateMutation = useActivateStudent();
  const deleteMutation = useDeleteStudent();
  const approveMutation = useApproveVerification();
  const rejectMutation = useRejectVerification();

  const handleAction = () => {
    if (!id || !studentDetail) return;
    if (modal.type === 'delete') {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Student deleted successfully.');
          navigate('/students');
        },
      });
    } else if (modal.type === 'suspend') {
      suspendMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Student suspended successfully.');
          setModal({ ...modal, isOpen: false });
        },
      });
    } else if (modal.type === 'activate') {
      activateMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Student activated successfully.');
          setModal({ ...modal, isOpen: false });
        },
      });
    }
  };

  const handleApprove = (notes?: string) => {
    if (!studentDetail) return;
    approveMutation.mutate(
      { userId: studentDetail.id, notes },
      {
        onSuccess: () => {
          toast.success('Student verified successfully!');
          refetch();
        },
      }
    );
  };

  const handleReject = (notes?: string) => {
    if (!studentDetail) return;
    rejectMutation.mutate(
      { userId: studentDetail.id, notes },
      {
        onSuccess: () => {
          toast.success('Verification rejected.');
          refetch();
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

  const statusLabel = studentDetail.verificationStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </button>

      <Card className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar src={studentDetail.avatarUrl || undefined} fallback={studentDetail.fullName} size="xl" className="ring-4 ring-white shadow-md" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{studentDetail.fullName}</h1>
              {studentDetail.isVerified && <CheckCircle className="w-5 h-5 text-brand-500" />}
              <StatusBadge status={statusLabel} />
            </div>
            <p className="text-slate-500 mb-3">
              {studentDetail.department} • {studentDetail.level} • {studentDetail.university}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {studentDetail.email}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Joined {new Date(studentDetail.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {studentDetail.verificationStatus === 'pending_approval' && (
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => {
                const notes = prompt('Rejection reason (required):');
                if (notes) handleReject(notes);
              }}>
                <X className="w-4 h-4 mr-2" /> Reject
              </Button>
              <Button className="bg-brand-600 hover:bg-brand-700 text-white" onClick={() => {
                const notes = prompt('Approval note (optional):') || undefined;
                handleApprove(notes);
              }}>
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
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{studentDetail.bio || 'No bio provided.'}</p>
          </Card>

          {studentDetail.skills?.length > 0 && (
            <Card className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {studentDetail.skills.map((s) => (
                  <span key={s.id} className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100">
                    {s.name} <span className="ml-1 text-brand-400">• {s.proficiency}</span>
                  </span>
                ))}
              </div>
            </Card>
          )}

          {studentDetail.learningInterests?.length > 0 && (
            <Card className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Learning Interests</h2>
              <div className="flex flex-wrap gap-2">
                {studentDetail.learningInterests.map((interest) => (
                  <span key={interest} className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700">
                    {interest}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {studentDetail.idPhotoUrl && (
            <Card className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-600" /> Verification Photo
              </h2>
              <div
                className="rounded-lg border border-slate-200 overflow-hidden cursor-zoom-in"
                onClick={() => setPhotoModal(true)}
              >
                <img
                  src={studentDetail.idPhotoUrl}
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
                <span className="font-medium text-slate-900 capitalize">{studentDetail.setupProgress.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Availability</span>
                <span className="font-medium text-slate-900">{studentDetail.availability || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Is Online</span>
                <span className="font-medium text-slate-900">{studentDetail.isOnline ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4 uppercase tracking-wider">Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600"><Star className="w-4 h-4 text-yellow-500" /> Rating</span>
                <span className="font-semibold text-slate-900">{studentDetail.rating?.toFixed(1) || '0.0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600"><Calendar className="w-4 h-4 text-slate-400" /> Sessions</span>
                <span className="font-semibold text-slate-900">{studentDetail.sessionsCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600"><Users className="w-4 h-4 text-slate-400" /> Helped</span>
                <span className="font-semibold text-slate-900">{studentDetail.studentsHelped}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4 uppercase tracking-wider">Verification</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email Verified</span>
                {studentDetail.emailVerified ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">ID Verified</span>
                {studentDetail.studentVerified ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Account Verified</span>
                {studentDetail.isVerified ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4 uppercase tracking-wider">Account Status</h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 mb-6">
              <span className="text-sm font-medium text-slate-700">Current Status</span>
              <StatusBadge status={studentDetail.accountStatus} />
            </div>
            <div className="space-y-3">
              {studentDetail.accountStatus === 'ACTIVE' ? (
                <Button variant="outline" className="w-full justify-start text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200" onClick={() => setModal({ isOpen: true, type: 'suspend' })}>
                  <ShieldAlert className="w-4 h-4 mr-2" /> Suspend Account
                </Button>
              ) : (
                <Button variant="outline" className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200" onClick={() => setModal({ isOpen: true, type: 'activate' })}>
                  <ShieldCheck className="w-4 h-4 mr-2" /> Activate Account
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => setModal({ isOpen: true, type: 'delete' })}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {studentDetail.idPhotoUrl && (
        <Modal isOpen={photoModal} onClose={() => setPhotoModal(false)} title="ID Photo">
          <div className="rounded-lg overflow-hidden border border-slate-200">
            <img src={studentDetail.idPhotoUrl} alt="ID Photo full" className="w-full object-cover max-h-[500px]" />
          </div>
        </Modal>
      )}

      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={handleAction}
        title={modal.type === 'delete' ? 'Delete Account' : modal.type === 'suspend' ? 'Suspend Account' : 'Activate Account'}
        message={`Are you sure you want to ${modal.type} ${studentDetail.fullName}? ${modal.type === 'delete' ? 'This action is permanent.' : ''}`}
        variant={modal.type === 'delete' ? 'danger' : modal.type === 'suspend' ? 'warning' : 'primary'}
      />
    </div>
  );
}
