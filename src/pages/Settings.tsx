import { useState } from 'react';
import { Settings as SettingsIcon, RefreshCw, Shield, Bell, Globe, Server, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import { useSettings, useSaveSetting, useInitializeSettings } from '../hooks/useSettings';

export default function Settings() {
  const [activeCategory, setActiveCategory] = useState<'GENERAL' | 'REGISTRATION' | 'NOTIFICATIONS' | 'SECURITY' | 'SYSTEM'>('GENERAL');

  const { isLoading, refetch } = useSettings({ category: activeCategory });
  const saveMutation = useSaveSetting();
  const initMutation = useInitializeSettings();

  const handleSave = async (key: string, value: unknown) => {
    try {
      await saveMutation.mutateAsync({ key, data: { value } });
      toast.success(`Setting '${key}' saved successfully.`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save setting '${key}'.`);
    }
  };

  const handleInitialize = async () => {
    try {
      await initMutation.mutateAsync();
      toast.success('Default system settings initialized.');
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Failed to initialize settings.');
    }
  };

  const categories = [
    { label: 'General', value: 'GENERAL', icon: Globe },
    { label: 'Student Registration', value: 'REGISTRATION', icon: SettingsIcon },
    { label: 'Notifications', value: 'NOTIFICATIONS', icon: Bell },
    { label: 'Security & Auth', value: 'SECURITY', icon: Shield },
    { label: 'System & Health', value: 'SYSTEM', icon: Server },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-slate-500 mt-1">Configure global application preferences, security policies, and defaults.</p>
        </div>
        <Button variant="outline" onClick={handleInitialize} disabled={initMutation.isPending}>
          <RefreshCw className={`w-4 h-4 mr-2 ${initMutation.isPending ? 'animate-spin' : ''}`} /> Initialize Defaults
        </Button>
      </div>

      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value as any)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeCategory === cat.value
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      <Card className="p-6 bg-white space-y-6">
        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : (
          <div className="space-y-6">
            {activeCategory === 'GENERAL' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2">General Platform Configuration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Platform Name</label>
                    <Input defaultValue="PeerConnect Academic Platform" onBlur={(e) => handleSave('platform_name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Support Email</label>
                    <Input defaultValue="support@peerconnect.edu" onBlur={(e) => handleSave('support_email', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'REGISTRATION' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2">Student Registration Policies</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" onChange={(e) => handleSave('require_id_verification', e.target.checked)} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Require Student ID Verification</p>
                      <p className="text-xs text-slate-500">Students must submit student ID card before joining peer sessions.</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" onChange={(e) => handleSave('auto_approve_verified_email', e.target.checked)} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Institutional Email Domain Matching</p>
                      <p className="text-xs text-slate-500">Fast-track students registering with official university emails (.edu.gh).</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeCategory === 'NOTIFICATIONS' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2">Push & Email Notification Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" onChange={(e) => handleSave('enable_push_notifications', e.target.checked)} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Enable Mobile Push Notifications</p>
                      <p className="text-xs text-slate-500">Dispatch Firebase push alerts for tutoring requests and chat messages.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeCategory === 'SECURITY' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2">Security & Authentication Controls</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Access Token Expiry (Minutes)</label>
                    <Input type="number" defaultValue={60} onBlur={(e) => handleSave('jwt_access_expiry_minutes', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Max Failed Login Attempts</label>
                    <Input type="number" defaultValue={5} onBlur={(e) => handleSave('max_failed_logins', Number(e.target.value))} />
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'SYSTEM' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2">System Health & API Information</h3>
                <div className="p-4 bg-slate-900 text-white rounded-lg space-y-2 text-xs font-mono">
                  <p className="flex justify-between"><span>Environment:</span><span className="text-emerald-400">production / local</span></p>
                  <p className="flex justify-between"><span>Backend Base URL:</span><span className="text-blue-400">http://localhost:4000/api/v1</span></p>
                  <p className="flex justify-between"><span>Database Status:</span><span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Connected (Prisma PostgreSQL)</span></p>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
