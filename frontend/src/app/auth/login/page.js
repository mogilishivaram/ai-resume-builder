'use client';

import { useState } from 'react';
import { signIn } from '../actions';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData) {
    setLoading(true);
    setError('');
    
    const result = await signIn(formData);
    
    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex bg-gradient-to-br from-stone-900 to-stone-800 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">E1 Personal Finance</h1>
          <p className="text-stone-300 text-lg">Track, manage, and grow your wealth with confidence</p>
        </div>
        <div className="relative z-10">
          <blockquote className="text-stone-300 text-xl italic">
            "A budget is telling your money where to go instead of wondering where it went."
          </blockquote>
          <p className="text-stone-400 mt-2">— John C. Maxwell</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-stone-500 mt-2">Sign in to your account to continue</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" data-testid="login-email-label">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-11 rounded-lg"
                data-testid="login-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" data-testid="login-password-label">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="h-11 rounded-lg"
                data-testid="login-password-input"
              />
            </div>

            {error && (
              <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg" data-testid="login-error-message">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium"
              data-testid="login-submit-button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-stone-500">Don't have an account? </span>
            <Link href="/auth/signup" className="text-stone-900 font-medium hover:underline" data-testid="signup-link">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
