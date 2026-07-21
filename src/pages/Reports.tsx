import { useStats } from '../hooks/useStats';
import { Users, Calendar, MessageSquare, UserCheck, ArrowUpRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export default function Reports() {
  const { data: stats, isLoading, error, refetch } = useStats();

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Insights</h1>
          <p className="text-slate-500 mt-1">Platform analytics and reports.</p>
        </div>
        <Card className="p-12">
          <EmptyState
            icon={MessageSquare}
            title="Unable to load stats"
            description={error instanceof Error ? error.message : 'Unable to load reports. Please try again.'}
            actionText="Retry"
            onAction={() => refetch()}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Insights</h1>
        <p className="text-slate-500 mt-1">Platform analytics and reports.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Students" value={stats?.totalStudents.toString() || '0'} icon={Users} />
            <StatCard title="Total Sessions" value={stats?.totalSessions.toString() || '0'} icon={Calendar} />
            <StatCard title="Total Reviews" value={stats?.totalReviews.toString() || '0'} icon={MessageSquare} />
            <StatCard title="Pending Verifications" value={stats?.pendingVerifications.toString() || '0'} icon={UserCheck} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Sessions by Status</h2>
              <div className="space-y-3">
                {stats?.sessionsByStatus && Object.entries(stats.sessionsByStatus).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{key.toLowerCase()}</span>
                    <span className="text-sm font-medium text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Platform Growth</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">New Students (30d)</span>
                  <span className="text-sm font-medium text-slate-900">{stats?.newStudentsLast30Days || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Average Rating</span>
                  <span className="text-sm font-medium text-slate-900">{stats?.averageRating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-between">
                  Export Student Data
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Export Session Logs
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Generate Report
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
