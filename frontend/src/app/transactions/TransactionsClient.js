'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '../auth/actions';
import Link from 'next/link';
import { ArrowUpCircle, ArrowDownCircle, Plus, LogOut, LayoutDashboard, Receipt, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function TransactionsClient({ user, initialTransactions }) {
  const router = useRouter();
  const supabase = createClient();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

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

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const amount = parseFloat(formData.get('amount'));
    
    if (amount <= 0) {
      toast.error('Amount must be positive');
      setLoading(false);
      return;
    }

    const newTransaction = {
      user_id: user.id,
      amount,
      type: formData.get('type'),
      category: formData.get('category'),
      note: formData.get('note') || null,
      date: formData.get('date') || new Date().toISOString().split('T')[0],
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([newTransaction])
      .select()
      .single();

    if (error) {
      toast.error('Failed to add transaction');
      console.error(error);
    } else {
      toast.success('Transaction added successfully');
      setTransactions([data, ...transactions]);
      setIsAddOpen(false);
      e.target.reset();
      router.refresh();
    }

    setLoading(false);
  };

  const handleEditTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const amount = parseFloat(formData.get('amount'));
    
    if (amount <= 0) {
      toast.error('Amount must be positive');
      setLoading(false);
      return;
    }

    const updatedData = {
      amount,
      type: formData.get('type'),
      category: formData.get('category'),
      note: formData.get('note') || null,
      date: formData.get('date'),
    };

    const { error } = await supabase
      .from('transactions')
      .update(updatedData)
      .eq('id', editingTransaction.id);

    if (error) {
      toast.error('Failed to update transaction');
      console.error(error);
    } else {
      toast.success('Transaction updated successfully');
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id ? { ...t, ...updatedData } : t
      ));
      setIsEditOpen(false);
      setEditingTransaction(null);
      router.refresh();
    }

    setLoading(false);
  };

  const handleDeleteTransaction = async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete transaction');
      console.error(error);
    } else {
      toast.success('Transaction deleted successfully');
      setTransactions(transactions.filter(t => t.id !== id));
      router.refresh();
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (transaction.note && transaction.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

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
                  <Button variant="ghost" className="gap-2" data-testid="nav-dashboard-link">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/transactions">
                  <Button variant="secondary" className="gap-2" data-testid="nav-transactions-link">
                    <Receipt className="h-4 w-4" />
                    Transactions
                  </Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-600" data-testid="user-email-display">{user.email}</span>
              <Button onClick={handleSignOut} variant="ghost" size="sm" className="gap-2" data-testid="signout-button">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">Transactions</h2>
            <p className="text-stone-600">Manage all your income and expenses</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 h-11 rounded-full bg-stone-900 hover:bg-stone-800" data-testid="add-transaction-button">
                <Plus className="h-5 w-5" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" data-testid="add-transaction-dialog">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue="expense" required>
                    <SelectTrigger data-testid="add-type-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    data-testid="add-amount-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    type="text"
                    required
                    placeholder="e.g., Groceries, Salary"
                    data-testid="add-category-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                    data-testid="add-date-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note (optional)</Label>
                  <Input
                    id="note"
                    name="note"
                    type="text"
                    placeholder="Add a note..."
                    data-testid="add-note-input"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1"
                    data-testid="add-cancel-button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                    data-testid="add-submit-button"
                  >
                    {loading ? 'Adding...' : 'Add Transaction'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger data-testid="filter-type-select">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expenses Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden" data-testid="transactions-list">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16">
              <Receipt className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 mb-6">
                {searchQuery || filterType !== 'all' ? 'No transactions found matching your filters' : 'No transactions yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-6 hover:bg-stone-50 transition-colors"
                  data-testid={`transaction-row-${transaction.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpCircle className="h-6 w-6 text-emerald-700" />
                      ) : (
                        <ArrowDownCircle className="h-6 w-6 text-rose-700" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900 text-lg">{transaction.category}</p>
                      {transaction.note && (
                        <p className="text-sm text-stone-500">{transaction.note}</p>
                      )}
                      <p className="text-xs text-stone-400 mt-1">{format(new Date(transaction.date), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold tabular-nums ${
                        transaction.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-stone-500 capitalize">{transaction.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog open={isEditOpen && editingTransaction?.id === transaction.id} onOpenChange={(open) => {
                        setIsEditOpen(open);
                        if (!open) setEditingTransaction(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTransaction(transaction)}
                            data-testid={`edit-button-${transaction.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md" data-testid="edit-transaction-dialog">
                          <DialogHeader>
                            <DialogTitle>Edit Transaction</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleEditTransaction} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-type">Type</Label>
                              <Select name="type" defaultValue={editingTransaction?.type} required>
                                <SelectTrigger data-testid="edit-type-select">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="income">Income</SelectItem>
                                  <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-amount">Amount</Label>
                              <Input
                                id="edit-amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                defaultValue={editingTransaction?.amount}
                                required
                                data-testid="edit-amount-input"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-category">Category</Label>
                              <Input
                                id="edit-category"
                                name="category"
                                type="text"
                                defaultValue={editingTransaction?.category}
                                required
                                data-testid="edit-category-input"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-date">Date</Label>
                              <Input
                                id="edit-date"
                                name="date"
                                type="date"
                                defaultValue={editingTransaction?.date}
                                required
                                data-testid="edit-date-input"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-note">Note (optional)</Label>
                              <Input
                                id="edit-note"
                                name="note"
                                type="text"
                                defaultValue={editingTransaction?.note || ''}
                                data-testid="edit-note-input"
                              />
                            </div>
                            <div className="flex gap-3 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsEditOpen(false);
                                  setEditingTransaction(null);
                                }}
                                className="flex-1"
                                data-testid="edit-cancel-button"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1"
                                data-testid="edit-submit-button"
                              >
                                {loading ? 'Saving...' : 'Save Changes'}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" data-testid={`delete-button-${transaction.id}`}>
                            <Trash2 className="h-4 w-4 text-rose-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-testid="delete-confirmation-dialog">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this transaction? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-testid="delete-cancel-button">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="bg-rose-600 hover:bg-rose-700"
                              data-testid="delete-confirm-button"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
