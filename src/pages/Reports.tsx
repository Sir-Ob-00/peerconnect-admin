import { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, Clock, XCircle, Eye, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal, ConfirmationModal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { useReports, useUpdateReportStatus, useDeleteReport } from '../hooks/useReports';
import type { ReportItem } from '../types/api';

type StatusFilter = 'ALL' | 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';

export default function Reports() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: reports = [], isLoading, error, refetch } = useReports({
    search,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
  });

  const updateStatusMutation = useUpdateReportStatus();
  const deleteMutation = useDeleteReport();

  const handleUpdateStatus = async (status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED') => {
    if (!selectedReport) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: selectedReport.id,
        data: { status, adminNotes: adminNotes || undefined },
      });
      toast.success(`Report status updated to ${status}.`);
      setSelectedReport(null);
      setAdminNotes('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update report status.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Report deleted.');
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete report.');
    }
  };

  const statusTabs: Array<{ label: string; value: StatusFilter }> = [
    { label: 'All Complaints', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Investigating', value: 'INVESTIGATING' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Dismissed', value: 'DISMISSED' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Complaints Moderation</h1>
          <p className="text-slate-500 mt-1">Review student complaints, harassment reports, and policy violations.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              statusFilter === tab.value
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <Card className="p-12">
          <EmptyState
            icon={ShieldAlert}
            title="Unable to load reports"
            description={error instanceof Error ? error.message : 'Unable to load report complaints data.'}
            actionText="Retry"
            onAction={() => refetch()}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by reporter or reason..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">{reports.length} Total Complaints</span>
          </div>

          <div className="bg-white">
            {isLoading ? (
              <div className="p-6"><TableSkeleton rows={5} /></div>
            ) : reports.length === 0 ? (
              <EmptyState
                icon={ShieldAlert}
                title="No reports found"
                description="No reports or complaints match your filter."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Reporter</TableHead>
                    <TableHead>Target Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {r.reporterName}
                        <p className="text-xs text-slate-400 font-normal">{r.reporterEmail}</p>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-700">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{r.targetType}</span>
                      </TableCell>
                      <TableCell className="text-slate-700 max-w-xs truncate">{r.reason}</TableCell>
                      <TableCell className="text-slate-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedReport(r); setAdminNotes(r.adminNotes || ''); }}>
                            <Eye className="w-4 h-4 text-blue-600 mr-1" /> Review
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeletingId(r.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      )}

      {/* Review Complaint Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Review Complaint & Take Moderation Action"
        footer={
          <Button variant="outline" onClick={() => setSelectedReport(null)}>Close</Button>
        }
      >
        {selectedReport && (
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <p className="text-xs text-slate-500">Reporter: <span className="font-semibold text-slate-900">{selectedReport.reporterName} ({selectedReport.reporterEmail})</span></p>
              <p className="text-xs text-slate-500">Reported Target: <span className="font-semibold text-slate-900">{selectedReport.reportedUserName || selectedReport.targetId} ({selectedReport.targetType})</span></p>
              <p className="text-xs text-slate-500">Reason: <span className="font-semibold text-red-600">{selectedReport.reason}</span></p>
              {selectedReport.details && <p className="text-xs text-slate-700 mt-2 bg-white p-2 border rounded">{selectedReport.details}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Administrative Notes</label>
              <textarea
                className="w-full h-20 p-2 border border-slate-300 rounded text-xs outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter investigation notes or resolution summary..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => handleUpdateStatus('INVESTIGATING')}>
                <Clock className="w-3.5 h-3.5 mr-1" /> Mark Investigating
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleUpdateStatus('RESOLVED')}>
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark Resolved
              </Button>
              <Button size="sm" variant="outline" className="text-slate-600" onClick={() => handleUpdateStatus('DISMISSED')}>
                <XCircle className="w-3.5 h-3.5 mr-1" /> Dismiss
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Report"
        message="Are you sure you want to delete this report complaint?"
        variant="danger"
        confirmText="Delete Report"
      />
    </div>
  );
}
