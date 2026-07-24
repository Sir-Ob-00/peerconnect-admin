import { useState } from 'react';
import { Search, Shield, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { useAuditLogs, useAuditLogStats } from '../hooks/useAuditLogs';
import type { AuditLogItem } from '../types/api';

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const { data: logs = [], isLoading, error, refetch } = useAuditLogs({
    search,
    action: actionFilter || undefined,
    page,
    limit: 10,
  });

  const { data: stats } = useAuditLogStats();

  const totalPages = 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Administrative Audit Logs</h1>
          <p className="text-slate-500 mt-1">Read-only security audit trail of administrative actions and system events.</p>
        </div>
      </div>

      {error ? (
        <Card className="p-12">
          <EmptyState
            icon={Shield}
            title="Unable to load audit logs"
            description={error instanceof Error ? error.message : 'Unable to load security logs.'}
            actionText="Retry"
            onAction={() => refetch()}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search audit trail..."
                  className="pl-9 bg-slate-50 border-slate-200"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <select
                className="h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 outline-none"
                value={actionFilter}
                onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              >
                <option value="">All Actions</option>
                <option value="APPROVE">Approve Student</option>
                <option value="REJECT">Reject Student</option>
                <option value="SUSPEND">Suspend Student</option>
                <option value="CREATE">Create Entity</option>
                <option value="DELETE">Delete Entity</option>
              </select>
            </div>
            <span className="text-xs text-slate-500 font-medium">{stats?.totalLogs ?? logs.length} Recorded Events</span>
          </div>

          <div className="bg-white">
            {isLoading ? (
              <div className="p-6"><TableSkeleton rows={6} /></div>
            ) : logs.length === 0 ? (
              <EmptyState
                icon={Shield}
                title="No audit logs recorded"
                description="Administrative security actions will be logged here automatically."
              />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Admin User</TableHead>
                      <TableHead>Action Executed</TableHead>
                      <TableHead>Target Entity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">{log.adminName}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 font-mono">
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-600">{log.targetEntity}</TableCell>
                        <TableCell className="text-slate-700 text-xs max-w-xs truncate">{log.description}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="border-t border-slate-100 bg-white p-4">
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Audit Log Inspector"
        footer={<Button variant="outline" onClick={() => setSelectedLog(null)}>Close</Button>}
      >
        {selectedLog && (
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <p className="text-xs text-slate-500">Event ID: <span className="font-mono text-slate-900">{selectedLog.id}</span></p>
              <p className="text-xs text-slate-500">Admin User: <span className="font-semibold text-slate-900">{selectedLog.adminName} ({selectedLog.adminId})</span></p>
              <p className="text-xs text-slate-500">Action: <span className="font-mono font-bold text-brand-600">{selectedLog.action}</span></p>
              <p className="text-xs text-slate-500">Target Entity: <span className="font-semibold text-slate-900">{selectedLog.targetEntity} (ID: {selectedLog.targetId || 'N/A'})</span></p>
              <p className="text-xs text-slate-500">Timestamp: <span className="text-slate-900">{new Date(selectedLog.createdAt).toLocaleString()}</span></p>
              {selectedLog.ipAddress && <p className="text-xs text-slate-500">IP Address: <span className="font-mono text-slate-900">{selectedLog.ipAddress}</span></p>}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1">Description:</p>
              <p className="text-xs text-slate-800 p-2 bg-white border rounded">{selectedLog.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
