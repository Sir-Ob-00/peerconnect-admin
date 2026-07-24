import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import Verification from './pages/Verification';
import Universities from './pages/Universities';
import Departments from './pages/Departments';
import Programmes from './pages/Programmes';
import Levels from './pages/Levels';
import StudyGroups from './pages/StudyGroups';
import Connections from './pages/Connections';
import Chats from './pages/Chats';
import Sessions from './pages/Sessions';
import Reports from './pages/Reports';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import Admins from './pages/Admins';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/study-groups" element={<StudyGroups />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}