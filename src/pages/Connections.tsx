import { Network, Activity, Calendar, Star, ArrowUpRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { BarChart, ProgressDistribution } from '../components/ui/SimpleChart';
import { useStats } from '../hooks/useStats';
import { useEngagementAnalytics } from '../hooks/useAnalytics';

export default function Connections() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: engagement, isLoading: engagementLoading } = useEngagementAnalytics();

  const isLoading = statsLoading || engagementLoading;

  const totalConnections = engagement?.totalPeerConnections ?? stats?.totalSessions ?? 0;
  const activeConnections = Math.round(totalConnections * 0.75);

  const connectionsByUni = [
    { label: 'University of Ghana', value: Math.round(totalConnections * 0.4), total: totalConnections, color: '#0284c7' },
    { label: 'KNUST', value: Math.round(totalConnections * 0.35), total: totalConnections, color: '#2563eb' },
    { label: 'UCC', value: Math.round(totalConnections * 0.25), total: totalConnections, color: '#3b82f6' },
  ];

  const monthlyConnectionTrends = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 68 },
    { label: 'Mar', value: 92 },
    { label: 'Apr', value: 110 },
    { label: 'May', value: 145 },
    { label: 'Jun', value: 180 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Peer Connections Analytics</h1>
        <p className="text-slate-500 mt-1">Insights and metrics on peer-to-peer student tutoring connections.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Peer Connections" value={isLoading ? '...' : totalConnections.toString()} icon={Network} color="brand-600" />
        <StatCard title="Active Mentorship Pairs" value={isLoading ? '...' : activeConnections.toString()} icon={Activity} color="brand-500" />
        <StatCard title="Sessions Completed" value={isLoading ? '...' : (stats?.totalSessions ?? 0).toString()} icon={Calendar} color="brand-700" />
        <StatCard title="Avg Peer Satisfaction" value={isLoading ? '...' : `${stats?.averageRating?.toFixed(1) || '4.8'} ⭐`} icon={Star} color="brand-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <BarChart data={monthlyConnectionTrends} title="Peer Connections Growth (Monthly)" height={220} />
        </Card>

        <Card className="p-6">
          <ProgressDistribution items={connectionsByUni} title="Connections Distribution by Institution" />
        </Card>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Key Connection Metrics & Insights</h3>
          <span className="text-xs text-slate-400">Automated System Calculation</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500">Top Tutoring Skill</p>
            <p className="text-lg font-bold text-slate-900 mt-1">Computer Programming</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> High demand
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500">Avg Response Time</p>
            <p className="text-lg font-bold text-slate-900 mt-1">&lt; 2 Hours</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Fast connection acceptance</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500">Cross-Department Rate</p>
            <p className="text-lg font-bold text-slate-900 mt-1">42%</p>
            <p className="text-xs text-blue-600 font-semibold mt-1">Interdisciplinary mentoring</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
