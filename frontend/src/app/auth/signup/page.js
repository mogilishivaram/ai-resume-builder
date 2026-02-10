'use client';

import { useState } from 'react';
import { signUp } from '../actions';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData) {
    setLoading(true);
    setError('');
    
    const result = await signUp(formData);
    
    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success('Account created successfully!');
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex bg-gradient-to-br from-emerald-900 to-emerald-800 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">Start Your Journey</h1>
          <p className="text-emerald-100 text-lg">Join thousands of users taking control of their finances</p>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold">✓</div>
            <div>
              <h3 className="text-white font-semibold">Track expenses</h3>
              <p className="text-emerald-200 text-sm">Monitor where your money goes</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold">✓</div>
            <div>
              <h3 className="text-white font-semibold">Manage income</h3>
              <p className="text-emerald-200 text-sm">Keep all your earnings organized</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold">✓</div>
            <div>
              <h3 className="text-white font-semibold">Stay on budget</h3>
              <p className="text-emerald-200 text-sm">Make informed financial decisions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="text-stone-500 mt-2">Start tracking your finances today</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" data-testid="signup-email-label">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-11 rounded-lg"
                data-testid="signup-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" data-testid="signup-password-label">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
                className="h-11 rounded-lg"
                data-testid="signup-password-input"
              />
              <p className="text-xs text-stone-500">Must be at least 6 characters</p>
            </div>

            {error && (
              <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg" data-testid="signup-error-message">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium"
              data-testid="signup-submit-button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-stone-500">Already have an account? </span>
            <Link href="/auth/login" className="text-stone-900 font-medium hover:underline" data-testid="login-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
