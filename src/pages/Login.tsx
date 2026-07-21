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
    <div className="flex flex-col gap-8 w-full max-w-sm mx-auto p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 text-brand-600 rounded-xl mb-6">
          <span className="font-bold text-xl">PC</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
        <p className="text-slate-500 mt-2 text-sm">Enter your credentials to access the dashboard</p>
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

        <div className="space-y-1">
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
            <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700">Forgot password?</a>
          </div>
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
  );
}
