'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '../auth/actions';
import Link from 'next/link';
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, Plus, LogOut, LayoutDashboard, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function DashboardClient({ user, balance, income, expenses, recentTransactions }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-stone-900">E1 Finance</h1>
              <nav className="hidden md:flex items-center gap-2">
                <Link href="/dashboard">
                  <Button
                    variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
                    className="gap-2"
                    data-testid="nav-dashboard-link"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/transactions">
                  <Button
                    variant={currentPage === 'transactions' ? 'secondary' : 'ghost'}
                    className="gap-2"
                    data-testid="nav-transactions-link"
                  >
                    <Receipt className="h-4 w-4" />
                    Transactions
                  </Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-600" data-testid="user-email-display">{user.email}</span>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="gap-2"
                data-testid="signout-button"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h2>
          <p className="text-stone-600">Your financial overview at a glance</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Balance Card - Larger */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-8 text-white shadow-sm" data-testid="balance-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-stone-300 text-sm font-medium mb-2">Total Balance</p>
                <h3 className="text-5xl font-bold tracking-tighter tabular-nums" data-testid="balance-amount">{formatCurrency(balance)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-300">
              <TrendingUp className="h-4 w-4" />
              <span>Updated just now</span>
            </div>
          </div>

          {/* Income Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow" data-testid="income-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <ArrowUpCircle className="h-5 w-5 text-emerald-700" />
              </div>
            </div>
            <p className="text-stone-500 text-sm font-medium mb-1">Total Income</p>
            <h3 className="text-2xl font-bold text-emerald-700 tabular-nums" data-testid="income-amount">{formatCurrency(income)}</h3>
          </div>

          {/* Expenses Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow" data-testid="expenses-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <ArrowDownCircle className="h-5 w-5 text-rose-700" />
              </div>
            </div>
            <p className="text-stone-500 text-sm font-medium mb-1">Total Expenses</p>
            <h3 className="text-2xl font-bold text-rose-700 tabular-nums" data-testid="expenses-amount">{formatCurrency(expenses)}</h3>
          </div>

          {/* Quick Actions */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 bg-white rounded-xl p-6 border border-stone-100 shadow-sm" data-testid="quick-actions-card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/transactions">
                <Button className="w-full justify-start gap-3 h-12 rounded-lg bg-stone-900 hover:bg-stone-800" data-testid="add-transaction-button">
                  <Plus className="h-5 w-5" />
                  Add New Transaction
                </Button>
              </Link>
              <Link href="/transactions">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-lg" data-testid="view-all-transactions-button">
                  <Receipt className="h-5 w-5" />
                  View All Transactions
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="col-span-12 md:col-span-6 lg:col-span-7 bg-white rounded-xl p-6 border border-stone-100 shadow-sm" data-testid="recent-transactions-card">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 mb-4">No transactions yet</p>
                <Link href="/transactions">
                  <Button size="sm" data-testid="add-first-transaction-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first transaction
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
                    data-testid={`transaction-item-${transaction.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpCircle className="h-5 w-5 text-emerald-700" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 text-rose-700" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">{transaction.category}</p>
                        {transaction.note && (
                          <p className="text-sm text-stone-500">{transaction.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold tabular-nums ${
                        transaction.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-stone-500">{format(new Date(transaction.date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
