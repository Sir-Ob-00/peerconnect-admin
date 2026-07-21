import fs from 'fs';
import path from 'path';

const files = {
  'src/pages/Sessions.tsx': `import React, { useState, useEffect } from 'react';
import { Search, Calendar, Ban } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { FilterDropdown } from '../components/ui/FilterDropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { ConfirmationModal } from '../components/ui/Modal';
import { MOCK_SESSIONS } from '../data/mock';
import toast from 'react-hot-toast';

export default function Sessions() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, page]);

  const filteredData = MOCK_SESSIONS.filter((s) => {
    const matchSearch = s.requester.toLowerCase().includes(search.toLowerCase()) || s.receiver.toLowerCase().includes(search.toLowerCase()) || s.skill.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const handleCancel = () => {
    toast.success('Session cancelled successfully.');
    setCancelModal({ isOpen: false, id: null });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Learning Sessions</h1>
          <p className="text-slate-500 mt-1">Monitor and manage all skill-sharing sessions.</p>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search users or skills..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterDropdown 
              label="Status"
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              options={[
                { label: 'Pending', value: 'Pending' },
                { label: 'Accepted', value: 'Accepted' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Cancelled', value: 'Cancelled' },
              ]}
            />
          </div>
        </div>
        
        <div className="bg-white">
          {loading ? (
            <div className="p-6"><TableSkeleton rows={5} /></div>
          ) : filteredData.length === 0 ? (
            <EmptyState 
              icon={Calendar} 
              title="No sessions found" 
              description="No learning sessions match your current filters."
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Requester</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-slate-900">{s.requester}</TableCell>
                      <TableCell className="font-medium text-slate-900">{s.receiver}</TableCell>
                      <TableCell className="text-slate-600">{s.skill}</TableCell>
                      <TableCell className="text-slate-600">{new Date(s.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                      <TableCell className="text-right">
                        {(s.status === 'Pending' || s.status === 'Accepted') && (
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2" onClick={() => setCancelModal({ isOpen: true, id: s.id })}>
                            <Ban className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                        )}
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
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, id: null })}
        onConfirm={handleCancel}
        title="Cancel Session"
        message="Are you sure you want to cancel this learning session? Both users will be notified."
        variant="danger"
        confirmText="Cancel Session"
      />
    </div>
  );
}
`,

  'src/pages/Reports.tsx': `import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Check, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { FilterDropdown } from '../components/ui/FilterDropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { MOCK_REPORTS } from '../data/mock';
import toast from 'react-hot-toast';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, page]);

  const filteredData = MOCK_REPORTS.filter((r) => {
    const matchSearch = r.reporter.toLowerCase().includes(search.toLowerCase()) || r.reportedUser.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? r.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const handleAction = (action: 'resolve' | 'dismiss') => {
    toast.success(\`Report \${action}d successfully.\`);
    setModalOpen(false);
  };

  const openDetails = (report: any) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Reports</h1>
          <p className="text-slate-500 mt-1">Review and manage reported users and content.</p>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search users..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterDropdown 
              label="Status"
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              options={[
                { label: 'Pending', value: 'Pending' },
                { label: 'Resolved', value: 'Resolved' },
                { label: 'Dismissed', value: 'Dismissed' },
              ]}
            />
          </div>
        </div>
        
        <div className="bg-white">
          {loading ? (
            <div className="p-6"><TableSkeleton rows={5} /></div>
          ) : filteredData.length === 0 ? (
            <EmptyState 
              icon={MessageSquare} 
              title="No reports found" 
              description="There are no user reports matching your current criteria."
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Reporter</TableHead>
                    <TableHead>Reported User</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-slate-900">{r.reporter}</TableCell>
                      <TableCell className="font-medium text-slate-900">{r.reportedUser}</TableCell>
                      <TableCell className="text-slate-600">{r.reason}</TableCell>
                      <TableCell className="text-slate-600">{new Date(r.date).toLocaleDateString()}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openDetails(r)}>View Details</Button>
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Report Details"
        footer={
          selectedReport?.status === 'Pending' ? (
            <>
              <Button variant="outline" onClick={() => handleAction('dismiss')} className="text-slate-600">Dismiss</Button>
              <Button onClick={() => handleAction('resolve')}>Resolve Issue</Button>
            </>
          ) : (
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          )
        }
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="block text-xs font-medium text-slate-500 mb-1">Reporter</span>
                <span className="block font-semibold text-slate-900">{selectedReport.reporter}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="block text-xs font-medium text-slate-500 mb-1">Reported User</span>
                <span className="block font-semibold text-slate-900">{selectedReport.reportedUser}</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Reason</h4>
              <p className="text-slate-700 bg-white border border-slate-200 rounded-md p-3 text-sm">{selectedReport.reason}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Details</h4>
              <p className="text-slate-700 bg-white border border-slate-200 rounded-md p-3 text-sm min-h-[100px] whitespace-pre-wrap">{selectedReport.details}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
`,

  'src/pages/Reviews.tsx': `import React, { useState, useEffect } from 'react';
import { Search, Star, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { ConfirmationModal } from '../components/ui/Modal';
import { MOCK_REVIEWS } from '../data/mock';
import toast from 'react-hot-toast';

export default function Reviews() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, page]);

  const filteredData = MOCK_REVIEWS.filter((r) => {
    const matchSearch = r.reviewer.toLowerCase().includes(search.toLowerCase()) || r.recipient.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleDelete = () => {
    toast.success('Review deleted successfully.');
    setDeleteModal({ isOpen: false, id: null });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={\`w-4 h-4 \${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}\`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Reviews</h1>
          <p className="text-slate-500 mt-1">Monitor feedback and reviews left by students.</p>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search reviews..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        
        <div className="bg-white">
          {loading ? (
            <div className="p-6"><TableSkeleton rows={5} /></div>
          ) : filteredData.length === 0 ? (
            <EmptyState 
              icon={Star} 
              title="No reviews found" 
              description="There are no reviews matching your search."
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-slate-900">{r.reviewer}</TableCell>
                      <TableCell className="font-medium text-slate-900">{r.recipient}</TableCell>
                      <TableCell>{renderStars(r.rating)}</TableCell>
                      <TableCell className="text-slate-600 max-w-xs truncate">{r.comment}</TableCell>
                      <TableCell className="text-slate-600">{new Date(r.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2" onClick={() => setDeleteModal({ isOpen: true, id: r.id })}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
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
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? It will be permanently removed from the recipient's profile."
        variant="danger"
        confirmText="Delete Review"
      />
    </div>
  );
}
`
};

Object.entries(files).forEach(([filePath, content]) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
});
console.log('Step 4 complete');
