# Running the Demo (No Database Required)

The application has been modified to work without Supabase. All data is stored in local component state (in-memory only).

## How to Run

1. Navigate to the project directory:
   ```powershell
   cd .gemini\antigravity\scratch\calendar-finance-app
   ```

2. Start the development server:
   ```powershell
   npm run dev
   ```

3. Open your browser to: `http://localhost:3000`

## What You'll See

- **Calendar View**: A beautiful monthly calendar with today's date highlighted
- **Interactive Dates**: Click any date to open the Day View modal
- **Day View Features**:
  - **Todos Tab**: Add tasks, toggle completion, delete items
  - **Expenses Tab**: Add expenses with amounts and categories, see totals
  - **Notes Tab**: Write and save daily notes

## Important Notes

⚠️ **Data is NOT persistent** - All data is stored in memory and will be lost on page refresh. This is a UI demo only.

To enable full persistence, you'll need to:
1. Set up a Supabase project
2. Run the SQL schema from `schema.sql`
3. Add your credentials to `.env.local`
4. Restore the original Supabase integration (available in git history)
