import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, TrendingDown, PiggyBank, Zap, Award, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getInsights } from '../utils/insightsHelper';
import InsightCard from '../Components/InsightCard';

const Insights = () => {
    const { transactions } = useApp();

    if (transactions.length === 0)
        return (
            <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-4 text-base-content/40 p-6">
                <Lightbulb size={56} strokeWidth={1.2} />
                <p className="text-lg font-medium">No insights yet</p>
                <p className="text-sm text-center">Add some transactions to generate insights</p>
            </div>
        );

    const { topCategory, monthlyData, expenseChange, savingsRate, topIncome, biggestExpense, lastMonth } = getInsights(transactions);

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold text-base-content mb-5">Insights</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-5">
                <InsightCard index={0} icon={ShoppingBag} color="bg-rose-500"
                    title="Highest Spending Category"
                    value={topCategory[0]}
                    sub={`₹${topCategory[1].toLocaleString()} total spent`}
                />
                <InsightCard index={1}
                    icon={expenseChange >= 0 ? TrendingUp : TrendingDown}
                    color={expenseChange >= 0 ? 'bg-orange-500' : 'bg-emerald-500'}
                    title="Expenses vs Last Month"
                    value={expenseChange !== null ? `${expenseChange >= 0 ? '+' : ''}${expenseChange}%` : 'N/A'}
                    sub={`${lastMonth?.month} expenses: ₹${lastMonth?.expense.toLocaleString()}`}
                />
                <InsightCard index={2} icon={PiggyBank} color="bg-indigo-500"
                    title="Savings Rate"
                    value={savingsRate !== null ? `${savingsRate}%` : 'N/A'}
                    sub={`Based on ${lastMonth?.month} income vs expenses`}
                />
                <InsightCard index={3} icon={Award} color="bg-cyan-500"
                    title="Top Income Source"
                    value={topIncome[0]}
                    sub={`₹${topIncome[1].toLocaleString()} earned`}
                />
                <InsightCard index={4} icon={Zap} color="bg-amber-500"
                    title="Biggest Single Expense"
                    value={biggestExpense.description}
                    sub={`₹${biggestExpense.amount.toLocaleString()} · ${biggestExpense.date}`}
                />
                <InsightCard index={5} icon={TrendingUp} color="bg-violet-500"
                    title="Most Profitable Month"
                    value={[...monthlyData].sort((a, b) => (b.income - b.expense) - (a.income - a.expense))[0]?.month ?? 'N/A'}
                    sub="Highest net income month"
                />
            </div>

            {monthlyData.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-base-100 rounded-2xl p-4 md:p-5 shadow-md border border-base-200"
                >
                    <h2 className="text-base font-semibold text-base-content mb-4">Monthly Income vs Expenses</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={monthlyData} barCategoryGap="30%">
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} width={55} />
                            <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="income"  name="Income"  fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </div>
    );
};

export default Insights;
