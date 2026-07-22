import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/background-1.jpg')" }}>
      <div className="absolute inset-0 bg-slate-900/60" />
      <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}