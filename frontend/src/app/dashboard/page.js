import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch transactions for calculations
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  // Calculate totals
  const income = transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
  const expenses = transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
  const balance = income - expenses;

  // Get recent transactions (last 5)
  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <DashboardClient 
      user={user}
      balance={balance}
      income={income}
      expenses={expenses}
      recentTransactions={recentTransactions}
    />
  );
}
