# Supabase Setup Instructions

Follow these steps to set up your Supabase project and database for the Personal Finance Tracker.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: Personal Finance Tracker (or any name you prefer)
   - **Database Password**: Create a strong password (save it somewhere safe)
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Free tier is sufficient for this project
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be provisioned

## Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`
4. Copy both values - you'll need them in Step 4

## Step 3: Create the Transactions Table

1. In your Supabase dashboard, click on **SQL Editor** (in the left sidebar)
2. Click **"New query"**
3. Copy and paste the following SQL script:

```sql
-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  note TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only view their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own transactions
CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own transactions
CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own transactions
CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
5. You should see "Success. No rows returned" - this means the table was created successfully
6. Click on **Table Editor** in the sidebar to verify the `transactions` table exists

## Step 4: Configure Your App

1. Open the file `/app/frontend/.env.local`
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Step 5: Restart the Frontend Server

After updating the environment variables, restart the frontend server:

```bash
sudo supervisorctl restart frontend
```

## Step 6: Test Your Setup

1. Navigate to your app URL (you should be automatically redirected to the login page)
2. Click on **"Sign up"** to create a new account
3. Enter an email and password (minimum 6 characters)
4. Check your email for a confirmation link (check spam folder if needed)
   - **Note**: By default, Supabase requires email confirmation. You can disable this in Supabase Dashboard → Authentication → Settings → Email Auth → "Enable email confirmations" (toggle off for testing)
5. After confirming, log in with your credentials
6. You should see your dashboard!

## Optional: Disable Email Confirmation (For Testing)

If you want to skip email confirmation during development:

1. Go to your Supabase Dashboard
2. Click on **Authentication** in the sidebar
3. Click on **Settings** → **Auth Settings**
4. Find **"Enable email confirmations"**
5. Toggle it **OFF**
6. Now new signups will work immediately without email confirmation

## Troubleshooting

### "Invalid API key" error
- Double-check that you copied the **anon/public** key, not the service_role key
- Make sure there are no extra spaces in your .env.local file

### "Failed to fetch" error
- Verify your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Make sure you included `https://` in the URL
- Check if your Supabase project is running (green status in dashboard)

### Can't see transactions
- Make sure you're logged in with the account that created the transactions
- Check that Row Level Security policies are applied (Step 3)
- Verify the transaction was actually created in Supabase Table Editor

### Email confirmation not arriving
- Check your spam/junk folder
- Or disable email confirmation (see Optional section above)

---

## You're All Set! 🎉

Your Personal Finance Tracker is now fully configured and ready to use. Start tracking your income and expenses!

### Next Steps:
- Add your first transaction
- Explore the dashboard to see your financial summary
- Use filters and search to find specific transactions
