import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import Verification from './pages/Verification';
import Sessions from './pages/Sessions';
import Reports from './pages/Reports';
import Reviews from './pages/Reviews';

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
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reviews" element={<Reviews />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}