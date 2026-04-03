import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { PieChart as PieIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'];

const SpendingBreakdown = () => {
    const { transactions } = useApp();

    const data = Object.entries(
        transactions.filter(tx => tx.type === 'expense').reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-base-100 rounded-2xl p-4 md:p-5 shadow-md border border-base-200"
        >
            <h2 className="text-base font-semibold text-base-content mb-4">Spending Breakdown</h2>
            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[220px] gap-2 text-base-content/40">
                    <PieIcon size={40} strokeWidth={1.2} />
                    <p className="text-sm">No expense data to display</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={v => [`₹${v.toLocaleString()}`, '']} />
                        <Legend iconType="circle" iconSize={8} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </motion.div>
    );
};

export default SpendingBreakdown;
