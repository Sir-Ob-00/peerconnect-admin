import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, BookOpen, ShieldAlert, Trash2, CheckCircle, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { ConfirmationModal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { useStudentById, useSuspendStudent, useActivateStudent, useDeleteStudent } from '../hooks/useStudents';

type Student = {
  id: string;
  name: string;
  email: string;
  department: string;
  status: string;
  joinedDate: string;
  avatar?: string;
  verified: boolean;
  academicLevel: string;
  bio: string;
  skills: string[];
  learningInterests: string[];
  availability: string;
};

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modal, setModal] = useState<{ isOpen: boolean; type: 'suspend' | 'activate' | 'delete' }>({
    isOpen: false,
    type: 'suspend',
  });

  const { data: studentDetail, isLoading, error, refetch } = useStudentById(id || '');
  const suspendMutation = useSuspendStudent();
  const activateMutation = useActivateStudent();
  const deleteMutation = useDeleteStudent();

  const student: Student | null = studentDetail
    ? {
        id: studentDetail.id,
        name: `${studentDetail.firstName} ${studentDetail.lastName}`,
        email: studentDetail.email,
        department: studentDetail.profile.department,
        status: studentDetail.accountStatus,
        joinedDate: studentDetail.createdAt,
        avatar: studentDetail.profileImage || undefined,
        verified: studentDetail.studentVerified,
        academicLevel: studentDetail.profile.level,
        bio: studentDetail.profile.bio,
        skills: studentDetail.profile.skills,
        learningInterests: studentDetail.profile.learningInterests,
        availability: studentDetail.profile.availability,
      }
    : null;

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

  const handleRetry = () => {
    refetch();
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
            onAction={handleRetry}
          />
        </Card>
      </div>
    );
  }

  if (!student) {
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar src={student.avatar} fallback={student.name} size="xl" className="ring-4 ring-white shadow-md" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
                {student.verified && <CheckCircle className="w-5 h-5 text-brand-500" />}
              </div>
              <p className="text-slate-500 mb-4">{student.department} • {student.academicLevel}</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {student.email}</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Joined {new Date(student.joinedDate).toLocaleDateString()}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" /> Academic & Skills
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Bio</h3>
                <p className="text-slate-700 leading-relaxed">{student.bio || 'No bio provided.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-3">Skills to Share</h3>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map(s => <Badge key={s} variant="info">{s}</Badge>)}
                    {student.skills.length === 0 && <span className="text-slate-400 text-sm">No skills listed</span>}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-3">Learning Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {student.learningInterests.map(s => <Badge key={s} variant="default">{s}</Badge>)}
                    {student.learningInterests.length === 0 && <span className="text-slate-400 text-sm">No interests listed</span>}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4 uppercase tracking-wider">Account Status</h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 mb-6">
              <span className="text-sm font-medium text-slate-700">Current Status</span>
              <StatusBadge status={student.status} />
            </div>

            <div className="space-y-3">
              {student.status === 'ACTIVE' ? (
                <Button
                  variant="outline"
                  className="w-full justify-start text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                  onClick={() => setModal({ isOpen: true, type: 'suspend' })}
                >
                  <ShieldAlert className="w-4 h-4 mr-2" /> Suspend Account
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                  onClick={() => setModal({ isOpen: true, type: 'activate' })}
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Activate Account
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={() => setModal({ isOpen: true, type: 'delete' })}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={handleAction}
        title={modal.type === 'delete' ? 'Delete Account' : modal.type === 'suspend' ? 'Suspend Account' : 'Activate Account'}
        message={`Are you sure you want to ${modal.type} ${student.name}? ${modal.type === 'delete' ? 'This action is permanent.' : ''}`}
        variant={modal.type === 'delete' ? 'danger' : modal.type === 'suspend' ? 'warning' : 'primary'}
      />
    </div>
  );
}
