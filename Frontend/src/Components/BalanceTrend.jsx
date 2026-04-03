import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MONTH_ORDER = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const BalanceTrend = () => {
    const { transactions } = useApp();

    const grouped = transactions.reduce((acc, tx) => {
        const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
        if (!acc[month]) acc[month] = 0;
        acc[month] += tx.type === 'income' ? tx.amount : -tx.amount;
        return acc;
    }, {});

    const data = MONTH_ORDER.filter(m => grouped[m] !== undefined).map(m => ({ month: m, balance: grouped[m] }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-base-100 rounded-2xl p-4 md:p-5 shadow-md border border-base-200"
        >
            <h2 className="text-base font-semibold text-base-content mb-4">Balance Trend</h2>
            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[220px] gap-2 text-base-content/40">
                    <TrendingUp size={40} strokeWidth={1.2} />
                    <p className="text-sm">No data to display</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v / 1000}k`} width={55} />
                        <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Balance']} />
                        <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </motion.div>
    );
};

export default BalanceTrend;
