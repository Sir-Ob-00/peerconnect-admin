import React, { useState, useEffect } from 'react';
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
    toast.success(`Report ${action}d successfully.`);
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
