import { useStats } from '../hooks/useStats';
import { Users, UserCheck, Calendar, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Skeleton, TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: stats, isLoading, error, refetch } = useStats();

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Here's what's happening on PeerConnect today.</p>
        </div>
        <Card className="p-12">
          <EmptyState
            icon={MessageSquare}
            title="Unable to load data"
            description={error instanceof Error ? error.message : 'Unable to load dashboard data. Please try again.'}
            actionText="Retry"
            onAction={() => refetch()}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Here's what's happening on PeerConnect today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
        ) : (
          <>
            <StatCard title="Total Students" value={stats?.totalStudents.toString() || '0'} icon={Users} color="brand-400" />
            <StatCard title="Learning Sessions" value={stats?.totalSessions.toString() || '0'} icon={Calendar} color="brand-500" />
            <StatCard title="Total Reviews" value={stats?.totalReviews.toString() || '0'} icon={Star} color="brand-600" />
            <StatCard title="Pending Verifications" value={stats?.pendingVerifications.toString() || '0'} icon={UserCheck} color="brand-700" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col lg:col-span-2 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="text-base font-semibold text-slate-900">Platform Activity</h2>
            <Link to="/reports" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex-1 bg-white p-6">
            {isLoading ? (
              <TableSkeleton rows={4} />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-500">New Students (30 days)</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.newStudentsLast30Days || 0}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-500">Average Rating</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.averageRating?.toFixed(1) || '0.0'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-white">
            <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
          </div>
          <div className="flex-1 bg-white p-6">
            {isLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="space-y-2 flex-1"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-2/3" /></div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={UserCheck}
                title="No recent activity"
                description="Recent platform activity will appear here."
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
