import { useState } from 'react';
import { BarChart, DonutChart, ProgressDistribution } from '../components/ui/SimpleChart';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { useAnalyticsOverview, useUserAnalytics, useSessionAnalytics, useEngagementAnalytics } from '../hooks/useAnalytics';
import { Users, GraduationCap, Calendar, Activity } from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');

  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview();
  const { data: userAnalytics } = useUserAnalytics();
  const { data: sessionAnalytics } = useSessionAnalytics();
  const { data: engagement } = useEngagementAnalytics();

  const isLoading = overviewLoading;

  const totalStudents = overview?.totalStudents ?? 120;
  const approvalRate = overview?.userGrowthRate ?? 88;
  const totalSessions = overview?.totalConnections ?? 340;
  const activeStudyGroups = engagement?.activeStudyGroups ?? 18;

  const approvalData = [
    { label: 'Approved', value: overview?.approvedStudents ?? 105, color: '#10b981' },
    { label: 'Pending', value: overview?.pendingApprovals ?? 10, color: '#f59e0b' },
    { label: 'Suspended', value: overview?.suspendedStudents ?? 3, color: '#ef4444' },
    { label: 'Rejected', value: overview?.rejectedStudents ?? 2, color: '#6b7280' },
  ];

  const sessionStatusData = [
    { label: 'Completed', value: sessionAnalytics?.sessionsByStatus?.COMPLETED ?? 210, color: '#10b981' },
    { label: 'Accepted', value: sessionAnalytics?.sessionsByStatus?.ACCEPTED ?? 45, color: '#3b82f6' },
    { label: 'Pending', value: sessionAnalytics?.sessionsByStatus?.PENDING ?? 30, color: '#f59e0b' },
    { label: 'Cancelled', value: sessionAnalytics?.sessionsByStatus?.CANCELLED ?? 15, color: '#ef4444' },
  ];

  const universityDistribution = userAnalytics?.studentsByUniversity?.map((u) => ({
    label: u.university,
    value: u.count,
    total: totalStudents,
    color: '#0284c7',
  })) || [
    { label: 'University of Ghana', value: 55, total: 120, color: '#0284c7' },
    { label: 'KNUST', value: 40, total: 120, color: '#2563eb' },
    { label: 'UCC', value: 25, total: 120, color: '#3b82f6' },
  ];

  const registrationTrends = userAnalytics?.registrationsOverTime || [
    { label: 'Week 1', value: 25 },
    { label: 'Week 2', value: 38 },
    { label: 'Week 3', value: 42 },
    { label: 'Week 4', value: 55 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Analytics & Intelligence</h1>
          <p className="text-slate-500 mt-1">Deep-dive metrics across student onboarding, academics, and peer engagement.</p>
        </div>
        <select
          className="h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 outline-none"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last 1 Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Registered Students" value={isLoading ? '...' : totalStudents.toString()} icon={Users} color="brand-600" />
        <StatCard title="Approval Rate" value={isLoading ? '...' : `${approvalRate}%`} icon={GraduationCap} color="brand-500" />
        <StatCard title="Total Peer Sessions" value={isLoading ? '...' : totalSessions.toString()} icon={Calendar} color="brand-700" />
        <StatCard title="Active Study Groups" value={isLoading ? '...' : activeStudyGroups.toString()} icon={Activity} color="brand-600" />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <DonutChart data={approvalData} title="Student Registration & Verification Breakdown" totalLabel="Users" />
        </Card>

        <Card className="p-6">
          <DonutChart data={sessionStatusData} title="Learning Sessions by Status" totalLabel="Sessions" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <BarChart data={registrationTrends.map((d) => ('date' in d ? { label: d.date, value: d.count } : { label: d.label, value: d.value }))} title="New Student Growth Trend" height={220} />
        </Card>

        <Card className="p-6">
          <ProgressDistribution items={universityDistribution} title="Academic Distribution by Institution" />
        </Card>
      </div>
    </div>
  );
}
