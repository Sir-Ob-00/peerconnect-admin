import fs from 'fs';
import path from 'path';

const files = {
  'src/pages/Students.tsx': `import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, ShieldAlert, CheckCircle, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FilterDropdown } from '../components/ui/FilterDropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Avatar } from '../components/ui/Avatar';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmationModal } from '../components/ui/Modal';
import { MOCK_STUDENTS } from '../data/mock';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Students() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; type: 'suspend' | 'activate' | 'delete'; studentId: string | null }>({
    isOpen: false,
    type: 'suspend',
    studentId: null,
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [search, deptFilter, statusFilter, page]);

  const filteredData = MOCK_STUDENTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter ? s.department === deptFilter : true;
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    return matchSearch && matchDept && matchStatus;
  });

  const handleAction = () => {
    const s = MOCK_STUDENTS.find(s => s.id === actionModal.studentId);
    if (!s) return;
    toast.success(\`Student \${s.name} \${actionModal.type}d successfully.\`);
    setActionModal({ ...actionModal, isOpen: false });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Students Management</h1>
          <p className="text-slate-500 mt-1">View and manage all registered students.</p>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterDropdown 
              label="Department"
              value={deptFilter}
              onChange={(v) => { setDeptFilter(v); setPage(1); }}
              options={[
                { label: 'Computer Science', value: 'Computer Science' },
                { label: 'Mathematics', value: 'Mathematics' },
                { label: 'Business', value: 'Business' },
              ]}
            />
            <FilterDropdown 
              label="Status"
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Suspended', value: 'Suspended' },
              ]}
            />
          </div>
        </div>
        
        <div className="bg-white">
          {loading ? (
            <div className="p-6"><TableSkeleton rows={5} /></div>
          ) : filteredData.length === 0 ? (
            <EmptyState 
              icon={Search} 
              title="No students found" 
              description="Try adjusting your search or filters to find what you're looking for."
              actionText="Clear Filters"
              onAction={() => { setSearch(''); setDeptFilter(''); setStatusFilter(''); }}
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Student</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                         <div className="flex items-center gap-3">
                           <Avatar src={s.avatar} fallback={s.name} size="sm" />
                           <div>
                             <p className="font-medium text-slate-900">{s.name}</p>
                             <p className="text-xs text-slate-500">{s.email}</p>
                           </div>
                         </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{s.department}</TableCell>
                      <TableCell className="text-slate-600">{new Date(s.joinedDate).toLocaleDateString()}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={\`/students/\${s.id}\`}>
                            <Button variant="outline" size="sm">Profile</Button>
                          </Link>
                          {s.status === 'Active' ? (
                            <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50" onClick={() => setActionModal({ isOpen: true, type: 'suspend', studentId: s.id })}>
                              Suspend
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => setActionModal({ isOpen: true, type: 'activate', studentId: s.id })}>
                              Activate
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2" onClick={() => setActionModal({ isOpen: true, type: 'delete', studentId: s.id })}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t border-slate-100 bg-white">
                <Pagination currentPage={page} totalPages={Math.ceil(filteredData.length / 10)} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </Card>

      <ConfirmationModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleAction}
        title={actionModal.type === 'delete' ? 'Delete Student' : actionModal.type === 'suspend' ? 'Suspend Student' : 'Activate Student'}
        message={\`Are you sure you want to \${actionModal.type} this student? \${actionModal.type === 'delete' ? 'This action cannot be undone.' : ''}\`}
        variant={actionModal.type === 'delete' ? 'danger' : actionModal.type === 'suspend' ? 'warning' : 'primary'}
        confirmText={actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)}
      />
    </div>
  );
}
`,

  'src/pages/StudentProfile.tsx': `import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, BookOpen, ShieldAlert, Trash2, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { ConfirmationModal } from '../components/ui/Modal';
import { MOCK_STUDENTS } from '../data/mock';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = MOCK_STUDENTS.find(s => s.id === id) || MOCK_STUDENTS[0];
  
  const [modal, setModal] = useState<{ isOpen: boolean; type: 'suspend' | 'activate' | 'delete' }>({
    isOpen: false,
    type: 'suspend',
  });

  const handleAction = () => {
    toast.success(\`Student \${modal.type}d successfully.\`);
    setModal({ ...modal, isOpen: false });
    if (modal.type === 'delete') navigate('/students');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
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
                <p className="text-slate-700 leading-relaxed">{student.bio}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-3">Skills to Share</h3>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map(s => <Badge key={s} variant="info">{s}</Badge>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-3">Learning Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {student.learningInterests.map(s => <Badge key={s} variant="default">{s}</Badge>)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4 uppercase tracking-wider">Account Status</h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 mb-6">
              <span className="text-sm font-medium text-slate-700">Current Status</span>
              <StatusBadge status={student.status} />
            </div>
            
            <div className="space-y-3">
              {student.status === 'Active' ? (
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
        message={\`Are you sure you want to \${modal.type} \${student.name}? \${modal.type === 'delete' ? 'This action is permanent.' : ''}\`}
        variant={modal.type === 'delete' ? 'danger' : modal.type === 'suspend' ? 'warning' : 'primary'}
      />
    </div>
  );
}
`,

  'src/pages/Verification.tsx': `import React, { useState } from 'react';
import { UserCheck, Check, X, Search, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { MOCK_STUDENTS } from '../data/mock';
import toast from 'react-hot-toast';

export default function Verification() {
  const pendingStudents = MOCK_STUDENTS.filter(s => s.status === 'Pending' || !s.verified);
  const [list, setList] = useState(pendingStudents);
  
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [reason, setReason] = useState('');

  const handleApprove = (id: string) => {
    setList(list.filter(s => s.id !== id));
    toast.success('Student verified successfully!');
  };

  const handleReject = () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection.');
      return;
    }
    setList(list.filter(s => s.id !== rejectModal.id));
    toast.success('Verification rejected.');
    setRejectModal({ isOpen: false, id: null });
    setReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Identity Verification</h1>
        <p className="text-slate-500 mt-1">Review and approve student identity documents.</p>
      </div>

      {list.length === 0 ? (
        <Card className="p-12">
          <EmptyState 
            icon={UserCheck} 
            title="All caught up!" 
            description="There are no pending student verifications at this time." 
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(s => (
            <Card key={s.id} className="flex flex-col overflow-hidden">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{s.name}</h3>
                    <p className="text-xs text-slate-500">{s.department}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-sm text-slate-700">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">student_id_front.jpg</span>
                  </div>
                  <div className="aspect-video bg-slate-200 rounded-md flex items-center justify-center overflow-hidden border border-slate-300">
                    <img src={\`https://images.unsplash.com/photo-1605553556002-c9a8db42187f?w=400&q=80\`} alt="ID Document" className="w-full h-full object-cover opacity-75" />
                  </div>
                </div>
                <p className="text-xs text-slate-500">Submitted: {new Date(s.joinedDate).toLocaleDateString()}</p>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <Button className="flex-1" onClick={() => handleApprove(s.id)}>
                  <Check className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => setRejectModal({ isOpen: true, id: s.id })}>
                  <X className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, id: null })}
        title="Reject Verification"
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectModal({ isOpen: false, id: null })}>Cancel</Button>
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
`
};

Object.entries(files).forEach(([filePath, content]) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
});
console.log('Step 3 complete');
