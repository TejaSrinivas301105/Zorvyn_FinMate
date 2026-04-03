import { motion } from 'framer-motion';

const InsightCard = ({ icon: Icon, title, value, sub, color, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07 }}
        className="bg-base-100 rounded-2xl p-5 shadow-md border border-base-200 flex items-start gap-4"
    >
        <div className={`p-3 rounded-xl ${color} shrink-0`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-sm text-base-content/60 mb-1">{title}</p>
            <p className="text-xl font-bold text-base-content">{value}</p>
            {sub && <p className="text-xs text-base-content/50 mt-1">{sub}</p>}
        </div>
    </motion.div>
);

export default InsightCard;
