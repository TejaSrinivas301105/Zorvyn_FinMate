import { motion } from 'framer-motion';

const SummaryCard = ({ title, amount, icon: Icon, color, trend, index = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07 }}
        className="bg-base-100 rounded-2xl p-4 md:p-5 shadow-md flex items-center gap-4 border border-base-200"
    >
        <div className={`p-3 rounded-xl ${color} shrink-0`}>
            <Icon size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-base-content/60 truncate">{title}</p>
            <p className="text-xl md:text-2xl font-bold text-base-content">
                {amount > 0 ? `₹${amount.toLocaleString()}` : '₹0'}
            </p>
        </div>
        {trend !== undefined && (
            <span className={`text-xs md:text-sm font-medium shrink-0 ${trend >= 0 ? 'text-success' : 'text-error'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
            </span>
        )}
    </motion.div>
);

export default SummaryCard;
