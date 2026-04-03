import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownCircle, ArrowUpCircle, Pencil, Trash2, ReceiptText } from 'lucide-react';

const TxRow = ({ tx, isAdmin, onEdit, onDelete }) => (
    <motion.tr
        key={tx.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="hover:bg-base-200/50 transition-colors"
    >
        <td className="text-sm text-base-content/60 whitespace-nowrap">{tx.date}</td>
        <td className="font-medium">{tx.description}</td>
        <td><span className="badge badge-ghost badge-sm">{tx.category}</span></td>
        <td>
            <span className={`flex items-center gap-1 text-sm font-medium w-fit ${tx.type === 'income' ? 'text-success' : 'text-error'}`}>
                {tx.type === 'income' ? <ArrowUpCircle size={15} /> : <ArrowDownCircle size={15} />}
                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
            </span>
        </td>
        <td className={`text-right font-semibold ${tx.type === 'income' ? 'text-success' : 'text-error'}`}>
            {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
        </td>
        {isAdmin && (
            <td className="text-center">
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onEdit(tx)} className="btn btn-ghost btn-xs text-info"><Pencil size={14} /></button>
                    <button onClick={() => onDelete(tx.id)} className="btn btn-ghost btn-xs text-error"><Trash2 size={14} /></button>
                </div>
            </td>
        )}
    </motion.tr>
);

const TxCard = ({ tx, isAdmin, onEdit, onDelete }) => (
    <motion.div
        key={tx.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-base-200/50 rounded-xl p-4 flex items-center gap-3 border border-base-200"
    >
        <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
            {tx.type === 'income' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{tx.description}</p>
            <p className="text-xs text-base-content/50">{tx.date} · <span className="badge badge-ghost badge-xs">{tx.category}</span></p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
            <span className={`font-semibold text-sm ${tx.type === 'income' ? 'text-success' : 'text-error'}`}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
            </span>
            {isAdmin && (
                <div className="flex gap-1">
                    <button onClick={() => onEdit(tx)} className="btn btn-ghost btn-xs text-info"><Pencil size={13} /></button>
                    <button onClick={() => onDelete(tx.id)} className="btn btn-ghost btn-xs text-error"><Trash2 size={13} /></button>
                </div>
            )}
        </div>
    </motion.div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-base-content/40">
        <ReceiptText size={48} strokeWidth={1.2} />
        <p className="text-base font-medium">No transactions found</p>
        <p className="text-sm">Try adjusting your filters or add a new transaction</p>
    </div>
);

const GroupSection = ({ label, group, isAdmin, onEdit, onDelete }) => {
    const net = group.income - group.expense;
    return (
        <div className="mb-4">
            {/* Group Header */}
            <div className="flex items-center justify-between px-1 py-2 mb-2 border-b border-base-200">
                <span className="text-sm font-semibold text-base-content">{label}</span>
                <div className="flex items-center gap-3 text-xs">
                    {group.income > 0 && <span className="text-success">+₹{group.income.toLocaleString()}</span>}
                    {group.expense > 0 && <span className="text-error">-₹{group.expense.toLocaleString()}</span>}
                    <span className={`font-bold ${net >= 0 ? 'text-success' : 'text-error'}`}>
                        Net: {net >= 0 ? '+' : ''}₹{net.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-base-200">
                <table className="table w-full">
                    <tbody>
                        <AnimatePresence>
                            {group.transactions.map(tx => (
                                <TxRow key={tx.id} tx={tx} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex flex-col gap-2">
                <AnimatePresence>
                    {group.transactions.map(tx => (
                        <TxCard key={tx.id} tx={tx} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

const TransactionTable = ({ transactions, grouped, role, onDelete, onEdit }) => {
    const isAdmin = role === 'admin';

    if (!transactions.length) return <EmptyState />;

    // Grouped view
    if (grouped) {
        const entries = Object.entries(grouped);
        if (!entries.length) return <EmptyState />;
        return (
            <div>
                {entries.map(([label, group]) => (
                    <GroupSection key={label} label={label} group={group} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </div>
        );
    }

    // Flat view
    return (
        <>
            <div className="hidden md:block overflow-x-auto rounded-xl border border-base-200">
                <table className="table w-full">
                    <thead className="bg-base-200 text-base-content/70 text-sm">
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th className="text-right">Amount</th>
                            {isAdmin && <th className="text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {transactions.map(tx => (
                                <TxRow key={tx.id} tx={tx} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
            <div className="md:hidden flex flex-col gap-3">
                <AnimatePresence>
                    {transactions.map(tx => (
                        <TxCard key={tx.id} tx={tx} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
};

export default TransactionTable;
