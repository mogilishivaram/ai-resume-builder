# Personal Finance Tracker

A modern, full-stack personal finance tracking application built with Next.js and Supabase.

## Features

✨ **Core Features:**
- 📊 Dashboard with financial overview (balance, income, expenses)
- 💰 Transaction management (add, edit, delete)
- 🔍 Search and filter transactions
- 🔐 Secure authentication (email/password)
- 👤 User-specific data isolation

🎨 **Design:**
- Modern "Warm Professional" design with Stone palette
- Responsive card-based UI with subtle shadows
- Clean typography using Plus Jakarta Sans and Inter fonts
- Smooth animations and transitions

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Authentication & Database**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI with Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn
- A Supabase account (free tier works great!)

### Setup Instructions

1. **Configure Supabase**
   - Follow the detailed setup guide in `/app/SUPABASE_SETUP.md`
   - This includes creating your Supabase project, database table, and getting your API credentials

2. **Add Your Supabase Credentials**
   - Open `/app/frontend/.env.local`
   - Replace the placeholder values with your actual Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     ```

3. **Restart the Frontend**
   ```bash
   sudo supervisorctl restart frontend
   ```

4. **Access Your App**
   - Navigate to your app URL
   - Sign up for a new account
   - Start tracking your finances!

## Project Structure

```
/app/
├── frontend/                       # Next.js application
│   ├── src/
│   │   ├── app/                   # App Router pages
│   │   │   ├── auth/              # Authentication pages (login, signup)
│   │   │   ├── dashboard/         # Dashboard page
│   │   │   ├── transactions/      # Transactions page
│   │   │   ├── layout.js          # Root layout with AuthProvider
│   │   │   └── page.js            # Home page (redirects)
│   │   ├── components/            # React components
│   │   │   ├── ui/                # Shadcn UI components
│   │   │   └── AuthProvider.js    # Auth context provider
│   │   └── utils/
│   │       └── supabase/          # Supabase client utilities
│   │           ├── client.js      # Browser client
│   │           └── server.js      # Server client
│   ├── .env.local                 # Environment variables (Supabase config)
│   └── package.json               # Dependencies
├── SUPABASE_SETUP.md              # Detailed Supabase setup guide
└── README.md                      # This file
```

## Key Features Explained

### Authentication
- Secure email/password authentication powered by Supabase Auth
- Session management with JWT tokens stored in secure HTTP-only cookies
- Persistent login state across page refreshes
- Protected routes that redirect to login if unauthenticated

### Dashboard
- Real-time financial overview with:
  - Total balance calculation (income - expenses)
  - Total income from all income transactions
  - Total expenses from all expense transactions
- Recent transactions list (last 5 transactions)
- Quick action buttons for easy navigation
- Responsive Bento Grid layout

### Transactions
- Full CRUD operations (Create, Read, Update, Delete)
- Transaction fields:
  - Type (income or expense)
  - Amount (validated to be positive)
  - Category (custom text)
  - Date (defaults to today)
  - Note (optional)
- Search functionality (search by category or note)
- Filter by type (all, income only, expenses only)
- Edit transactions in-place with modal dialog
- Delete with confirmation dialog
- Responsive table layout

### Security
- Row Level Security (RLS) policies ensure users can only access their own data
- Amount validation (must be positive)
- Type validation (must be income or expense)
- Server-side authentication checks on all protected pages

## Design System

The app follows the "Warm Professional" design guidelines:

- **Colors:**
  - Base: Stone (warm grey) palette
  - Income: Emerald green
  - Expense: Rose red
  - Primary: Stone 900 (Obsidian)

- **Typography:**
  - Headings: Plus Jakarta Sans (modern, geometric)
  - Body: Inter (clean, legible)
  - Numbers: Tabular nums for alignment

- **Layout:**
  - Asymmetric Bento Grid for visual interest
  - Card-based design with rounded corners (12px)
  - Generous spacing (2-3x normal)
  - Glassmorphism effect on header

## Troubleshooting

### "Invalid supabaseUrl" error
- Make sure you've added your Supabase credentials to `/app/frontend/.env.local`
- Restart the frontend after updating: `sudo supervisorctl restart frontend`

### Can't log in
- Verify you've created the transactions table in Supabase (see SUPABASE_SETUP.md Step 3)
- Check if email confirmation is enabled in Supabase (you may want to disable it for testing)

### Transactions not showing
- Ensure Row Level Security policies are applied (see SUPABASE_SETUP.md Step 3)
- Verify you're logged in with the correct account
- Check Supabase Table Editor to see if data exists

## Next Steps & Enhancements

Once your app is running, consider these potential improvements:

1. **Analytics Dashboard**
   - Add charts to visualize spending trends over time
   - Category breakdown pie charts
   - Monthly comparison graphs

2. **Budgeting Features**
   - Set monthly budgets per category
   - Budget alerts when approaching limits
   - Progress bars for budget tracking

3. **Export & Reports**
   - Export transactions to CSV
   - Generate monthly/yearly reports
   - Tax-ready categorization

4. **Mobile App**
   - Progressive Web App (PWA) support
   - Native mobile apps with React Native

5. **Recurring Transactions**
   - Set up recurring income/expenses
   - Automatic transaction creation

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review `/app/SUPABASE_SETUP.md` for setup details
3. Verify your Supabase project is active in the dashboard

---

Built with ❤️ using Next.js and Supabase
