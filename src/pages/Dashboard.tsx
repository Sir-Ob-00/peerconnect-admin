import { useStats } from '../hooks/useStats';
import { useAnalyticsOverview, useRegistrationsTrend, useUniversityDistribution } from '../hooks/useAnalytics';
import {
  Users, UserCheck, MessageSquare, Star, ArrowRight,
  UserX, ShieldAlert, GraduationCap, Network, Activity, PlusCircle
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Skeleton, TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { BarChart, DonutChart, ProgressDistribution } from '../components/ui/SimpleChart';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch } = useStats();
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsOverview();
  const { data: registrationsData } = useRegistrationsTrend();
  const { data: universityData } = useUniversityDistribution();

  const isLoading = statsLoading || analyticsLoading;

  if (statsError) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">High-level platform activity and operational status for PeerConnect.</p>
        </div>
        <Card className="p-12">
          <EmptyState
            icon={MessageSquare}
            title="Unable to load dashboard data"
            description={statsError instanceof Error ? statsError.message : 'Unable to fetch administrative metrics.'}
            actionText="Retry"
            onAction={() => refetch()}
          />
        </Card>
      </div>
    );
  }

  // Combined stats from stats endpoint and analytics endpoint
  const totalStudents = analytics?.totalStudents ?? stats?.totalStudents ?? 0;
  const pendingApprovals = analytics?.pendingApprovals ?? stats?.pendingVerifications ?? 0;
  const approvedStudents = analytics?.approvedStudents ?? Math.max(0, totalStudents - pendingApprovals);
  const rejectedStudents = analytics?.rejectedStudents ?? 0;
  const suspendedStudents = analytics?.suspendedStudents ?? 0;
  const activeStudents = analytics?.activeStudents ?? totalStudents;
  const totalStudyGroups = analytics?.totalStudyGroups ?? 0;
  const totalConnections = analytics?.totalConnections ?? stats?.totalSessions ?? 0;
  const activeUsers = analytics?.activeUsers ?? activeStudents;

  const approvalData = [
    { label: 'Approved', value: approvedStudents, color: '#10b981' },
    { label: 'Pending', value: pendingApprovals, color: '#f59e0b' },
    { label: 'Suspended', value: suspendedStudents, color: '#ef4444' },
    { label: 'Rejected', value: rejectedStudents, color: '#6b7280' },
  ];

  const registrationTrends = registrationsData || [];

  const universityDistribution = (universityData || []).map((u) => ({
    label: u.university,
    value: u.count,
    total: totalStudents,
    color: '#0284c7',
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Real-time operational summary & metrics for PeerConnect.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/verification"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            Review Pending ({pendingApprovals})
          </Link>
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
        ) : (
          <>
            <StatCard title="Total Students" value={totalStudents.toString()} icon={Users} color="brand-600" />
            <StatCard title="Pending Approvals" value={pendingApprovals.toString()} icon={UserCheck} color="brand-500" />
            <StatCard title="Approved Students" value={approvedStudents.toString()} icon={GraduationCap} color="brand-700" />
            <StatCard title="Active Students" value={activeStudents.toString()} icon={Activity} color="brand-600" />
            <StatCard title="Suspended / Rejected" value={(suspendedStudents + rejectedStudents).toString()} icon={UserX} color="brand-500" />
            <StatCard title="Total Study Groups" value={totalStudyGroups.toString()} icon={Users} color="brand-700" />
            <StatCard title="Peer Connections" value={totalConnections.toString()} icon={Network} color="brand-600" />
            <StatCard title="Active Users (30d)" value={activeUsers.toString()} icon={Star} color="brand-500" />
          </>
        )}
      </div>

      {/* Quick Actions Panel */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Quick Administrative Actions</h2>
          <span className="text-xs text-slate-500">Shortcut Hub</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link to="/verification" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-lg text-center transition-colors text-slate-700 hover:text-slate-900">
            <UserCheck className="w-5 h-5 text-brand-600 mx-auto mb-1" />
            <span className="text-xs font-medium block truncate">Pending Students</span>
          </Link>
          <Link to="/students" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-lg text-center transition-colors text-slate-700 hover:text-slate-900">
            <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <span className="text-xs font-medium block truncate">View Students</span>
          </Link>
          <Link to="/universities" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-lg text-center transition-colors text-slate-700 hover:text-slate-900">
            <PlusCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-xs font-medium block truncate">Add University</span>
          </Link>
          <Link to="/departments" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-lg text-center transition-colors text-slate-700 hover:text-slate-900">
            <PlusCircle className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <span className="text-xs font-medium block truncate">Add Department</span>
          </Link>
          <Link to="/programmes" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-lg text-center transition-colors text-slate-700 hover:text-slate-900">
            <PlusCircle className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <span className="text-xs font-medium block truncate">Add Programme</span>
          </Link>
          <Link to="/reports" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-lg text-center transition-colors text-slate-700 hover:text-slate-900">
            <ShieldAlert className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <span className="text-xs font-medium block truncate">View Reports</span>
          </Link>
        </div>
      </Card>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <DonutChart data={approvalData} title="Student Verification & Status Breakdown" totalLabel="Students" />
        </Card>

        <Card className="p-6">
          <BarChart data={registrationTrends.map((d) => ('date' in d ? { label: d.date, value: d.count } : { label: d.label, value: d.value }))} title="Registrations Trend (Weekly)" />
        </Card>

        <Card className="p-6">
          <ProgressDistribution items={universityDistribution} title="Top University Distribution" />
        </Card>
      </div>

      {/* Activity Overview & Secondary Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="text-base font-semibold text-slate-900">Platform Performance Summary</h2>
            <Link to="/analytics" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Full Analytics <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-6 bg-white space-y-4">
            {isLoading ? (
              <TableSkeleton rows={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500">New Students (30d)</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.newStudentsLast30Days || 0}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500">Average Platform Rating</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.averageRating?.toFixed(1) || '0.0'} ⭐</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500">Total Learning Sessions</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalSessions || 0}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-white">
            <h2 className="text-base font-semibold text-slate-900">System Activity Stream</h2>
          </div>
          <div className="flex-1 bg-white p-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 font-medium">New student registration received</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-slate-700 font-medium">Identity verification approved</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-slate-700 font-medium">New study group created</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
