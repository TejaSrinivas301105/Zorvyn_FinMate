import { Wallet, TrendingUp, TrendingDown, LayoutDashboard } from 'lucide-react';
import SummaryCard from '../Components/SummaryCard';
import BalanceTrend from '../Components/BalanceTrend';
import SpendingBreakdown from '../Components/SpendingBreakdown';
import { useApp } from '../context/AppContext';

const DashBoard = () => {
    const { transactions } = useApp();

    const income   = transactions.filter(tx => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
    const expenses = transactions.filter(tx => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
    const balance  = income - expenses;

    const cards = [
        { title: 'Total Balance',  amount: balance,  icon: Wallet,       color: 'bg-indigo-500',  trend: 12, index: 0 },
        { title: 'Total Income',   amount: income,   icon: TrendingUp,   color: 'bg-emerald-500', trend: 8,  index: 1 },
        { title: 'Total Expenses', amount: expenses, icon: TrendingDown, color: 'bg-rose-500',    trend: -3, index: 2 },
    ];

    if (transactions.length === 0)
        return (
            <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-4 text-base-content/40 p-6">
                <LayoutDashboard size={56} strokeWidth={1.2} />
                <p className="text-lg font-medium">No data yet</p>
                <p className="text-sm text-center">Add transactions to see your dashboard come to life</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold text-base-content mb-5">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-5">
                {cards.map(card => <SummaryCard key={card.title} {...card} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                <BalanceTrend />
                <SpendingBreakdown />
            </div>
        </div>
    );
};

export default DashBoard;
