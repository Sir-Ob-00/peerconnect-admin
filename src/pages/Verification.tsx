import React, { useState } from 'react';
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
                    <img src={`https://images.unsplash.com/photo-1605553556002-c9a8db42187f?w=400&q=80`} alt="ID Document" className="w-full h-full object-cover opacity-75" />
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
