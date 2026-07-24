import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, Calendar,
  MessageSquare, Star, LogOut, Menu, Building2,
  BookOpen, GraduationCap, Layers, Network,
  ShieldAlert, BarChart3, Bell, Shield, UserCog, Settings
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useCurrentAdmin, useLogout } from '../hooks/useAuth';
import { clearTokens } from '../services/api';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Student Management',
    items: [
      { name: 'Students', path: '/students', icon: Users },
      { name: 'Verification', path: '/verification', icon: UserCheck },
    ],
  },
  {
    title: 'Academic Management',
    items: [
      { name: 'Universities', path: '/universities', icon: Building2 },
      { name: 'Departments', path: '/departments', icon: BookOpen },
      { name: 'Programmes', path: '/programmes', icon: GraduationCap },
      { name: 'Levels', path: '/levels', icon: Layers },
    ],
  },
  {
    title: 'PeerConnect Operations',
    items: [
      { name: 'Study Groups', path: '/study-groups', icon: Users },
      { name: 'Connections', path: '/connections', icon: Network },
      { name: 'Chats & Messages', path: '/chats', icon: MessageSquare },
      { name: 'Sessions', path: '/sessions', icon: Calendar },
    ],
  },
  {
    title: 'Moderation & Feedback',
    items: [
      { name: 'Reports & Complaints', path: '/reports', icon: ShieldAlert },
      { name: 'Reviews & Feedback', path: '/reviews', icon: Star },
    ],
  },
  {
    title: 'Insights & System',
    items: [
      { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'Notifications', path: '/notifications', icon: Bell },
      { name: 'Audit Logs', path: '/audit-logs', icon: Shield },
      { name: 'Admin Team', path: '/admins', icon: UserCog },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { data: admin, isLoading, error } = useCurrentAdmin();
  const logout = useLogout();

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (error) {
      clearTokens();
      navigate('/login');
    }
  }, [error, navigate]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        navigate('/login');
      },
    });
  };

  if (isLoading && localStorage.getItem('accessToken')) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium">Loading PeerConnect Admin...</div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden relative bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-brand-700 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
            <span className="text-xl font-bold tracking-tight">PeerConnect Admin</span>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-brand-200/80 mb-1">
                  {group.title}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                        isActive
                          ? "bg-white/20 text-white shadow-sm"
                          : "text-brand-100 hover:bg-white/10 hover:text-white"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-xs font-semibold text-brand-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                {(admin.firstName?.[0] || 'A').toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800">
                  {admin.firstName} {admin.lastName}
                </p>
                <p className="text-[10px] text-slate-400 font-medium capitalize">
                  {admin.role || 'Administrator'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto relative z-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
