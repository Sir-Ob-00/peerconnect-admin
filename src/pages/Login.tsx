import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import type { LoginRequest } from '../types/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const login = useLogin();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields.');
      return;
    }

    const credentials: LoginRequest = { email, password };

    login.mutate(credentials, {
      onSuccess: () => {
        toast.success('Logged in successfully');
        navigate('/dashboard');
      },
      onError: (err) => {
        setFormError(err instanceof Error ? err.message : 'Login failed');
      },
    });
  };

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
      <div className="hidden md:flex flex-col justify-center p-8 lg:p-12 bg-brand-600 text-white">
        <div className="w-16 h-16 mb-8">
          <img src="/logo.png" alt="PeerConnect" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-3xl font-bold mb-4 leading-tight">PeerConnect<br />Admin Portal</h1>
        <p className="text-slate-300 text-lg leading-relaxed">
          Manage students, review verifications, monitor sessions, and keep the platform running smoothly.
        </p>
      </div>

      <div className="p-8 md:p-12 flex flex-col justify-center">
        <div className="md:hidden text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4">
            <img src="/logo.png" alt="PeerConnect" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-2 text-sm">Enter your credentials to access the dashboard</p>
        </div>

        <div className="hidden md:block mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
          <p className="text-slate-500 mt-1">Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {formError}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={login.isPending}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={login.isPending}
          />

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" disabled={login.isPending} />
              Remember me
            </label>
          </div>

          <Button type="submit" className="w-full h-11" disabled={login.isPending}>
            {login.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
