# Zorvyn — Personal Finance Dashboard

A responsive personal finance dashboard built with React, Tailwind CSS, DaisyUI, and Recharts. It allows users to track income and expenses, visualize spending patterns, gain financial insights, and manage transactions with role-based access control.

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

```bash
cd Frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool |
| Tailwind CSS v4 | Utility-first styling |
| DaisyUI v5 | Component library + theming |
| Recharts | Charts and visualizations |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Router v7 | Client-side routing |
| localStorage | Data persistence |

---

## Project Structure

```
src/
├── Components/
│   ├── NavBar.jsx              # Sticky nav with links, role switcher, theme toggle
│   ├── SummaryCard.jsx         # Reusable stat card for dashboard
│   ├── BalanceTrend.jsx        # Line chart — monthly balance trend
│   ├── SpendingBreakdown.jsx   # Donut chart — expenses by category
│   ├── TransactionFilters.jsx  # Basic + advanced filter controls
│   ├── TransactionTable.jsx    # Table (desktop) + card (mobile) with grouping
│   ├── AddTransactionModal.jsx # Add / Edit transaction modal with validation
│   ├── InsightCard.jsx         # Reusable insight stat card
│   └── ExportMenu.jsx          # CSV / JSON export dropdown
├── Pages/
│   ├── DashBoard.jsx           # Summary cards + charts
│   ├── Transactions.jsx        # Full transaction list with filters
│   └── Insights.jsx            # Insight cards + monthly bar chart
├── context/
│   └── AppContext.jsx          # Single unified state store
├── data/
│   └── transactions.js         # Mock data source (swap for real API here)
└── utils/
    ├── insightsHelper.js       # Pure functions for insight computations
    └── exportHelpers.js        # CSV and JSON export logic
```

---

## Features

### Dashboard
- Total Balance, Income, and Expenses summary cards derived from live transaction data
- Balance Trend line chart grouped by month
- Spending Breakdown donut chart by category
- Empty state when no transactions exist

### Transactions
- Full transaction list with date, description, category, type, and amount
- Responsive — table on desktop, card view on mobile
- Basic filters — search, type, category, sort
- Advanced filters — date range, amount range
- Grouping — group by month or category with subtotals per group
- Active filter tags showing what is currently applied
- Export filtered data as CSV or JSON

### Insights
- Highest spending category
- Month-over-month expense change percentage
- Savings rate for the latest month
- Top income source
- Biggest single expense
- Most profitable month
- Monthly Income vs Expenses grouped bar chart

### Role-Based UI
- Viewer — read-only access, no add/edit/delete controls
- Admin — Add Transaction button, Edit and Delete per row
- Role switcher in NavBar, persisted to localStorage

### Dark Mode
- Toggle between Forest (light) and Dim (dark) DaisyUI themes
- Sun/Moon toggle button in NavBar
- Theme persisted to localStorage across refreshes

### Data Persistence
- Transactions, role, and theme all persisted to localStorage
- Data survives page refresh and browser restarts
- Keys namespaced with `zorvyn_` prefix

---

## State Management Approach

All application state lives in a single `AppContext` — no external state library needed at this scale.

```
AppContext holds:
├── transactions          — full list, persisted to localStorage
├── filteredTransactions  — computed via useMemo from transactions + filters
├── groupedTransactions   — computed via useMemo when groupBy is active
├── filters               — search, type, category, sort, dateRange, amountRange, groupBy
├── role                  — viewer | admin, persisted to localStorage
└── theme                 — forest | dim, persisted to localStorage
```

**Why this approach:**
- Single source of truth — every page reads the same data
- Adding a transaction on Transactions page immediately reflects on Dashboard cards and Insights charts
- Filters persist when navigating between pages
- `useMemo` ensures filtering/grouping only recomputes when dependencies actually change
- Swapping mock data for a real API only requires changing `AppContext` — no component changes needed

---

## Role-Based Access Control

| Feature | Viewer | Admin |
|---|---|---|
| View Dashboard | ✅ | ✅ |
| View Transactions | ✅ | ✅ |
| View Insights | ✅ | ✅ |
| Add Transaction | ❌ | ✅ |
| Edit Transaction | ❌ | ✅ |
| Delete Transaction | ❌ | ✅ |
| Export Data | ✅ | ✅ |

Switch roles using the dropdown in the NavBar. Role is persisted across refreshes.

---

## Data Layer

All transaction data lives in `src/data/transactions.js` and exports a single `TRANSACTIONS` array. To swap in a mock API or real API:

```js
// src/data/transactions.js

// Option 1 — mock API module
import { getMockTransactions } from './mockApi';
export const TRANSACTIONS = getMockTransactions();

// Option 2 — real API (change useState in AppContext instead)
// Replace useState(TRANSACTIONS) with a useEffect + fetch call
```

No other file needs to change because all components read exclusively from `AppContext`.

---

## Export

Exports always reflect the currently filtered/grouped view — not the full dataset.

- CSV — includes headers (ID, Date, Description, Category, Type, Amount), descriptions quoted to handle commas
- JSON — pretty-printed with 2-space indentation
- Filename auto-stamped with today's date e.g. `transactions_2025-07-11.csv`
- Export button disabled when no transactions match current filters

---

## Theming

Two DaisyUI themes configured:

| Theme | Mode | Key |
|---|---|---|
| `forest` | Light | Default |
| `dim` | Dark | Toggle in NavBar |

Theme is applied to `<html data-theme>` and persisted in localStorage under `zorvyn_theme`.

---

## Edge Cases Handled

- Empty transactions list — full-page empty states on Dashboard, Insights, and Transactions
- No expense data — SpendingBreakdown shows empty state instead of broken chart
- No chart data — BalanceTrend shows empty state
- Filter returns zero results — TransactionTable shows empty state with helpful message
- Form validation in AddTransactionModal — inline errors for missing description, invalid amount, missing date
- Export disabled when filtered list is empty
- Insights N/A fallback when insufficient data for calculations
- Long descriptions truncated in mobile card view
- Amount display shows ₹0 instead of breaking on zero balance
