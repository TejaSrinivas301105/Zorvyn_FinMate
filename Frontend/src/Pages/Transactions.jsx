import { useState } from 'react';
import { Plus } from 'lucide-react';
import TransactionFilters from '../Components/TransactionFilters';
import TransactionTable from '../Components/TransactionTable';
import AddTransactionModal from '../Components/AddTransactionModal';
import ExportMenu from '../Components/ExportMenu';
import { useApp } from '../context/AppContext';

const Transactions = () => {
    const { role, filteredTransactions, groupedTransactions, filters, setFilters, addTransaction, deleteTransaction, editTransaction } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [editTx, setEditTx]       = useState(null);

    const handleEditSave = (updated) => { editTransaction(updated); setEditTx(null); };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl md:text-2xl font-bold text-base-content">Transactions</h1>
                <div className="flex items-center gap-2 md:gap-3">
                    <span className="badge badge-neutral">{filteredTransactions.length} records</span>
                    <ExportMenu transactions={filteredTransactions} />
                    {role === 'admin' && (
                        <button className="btn btn-primary btn-sm gap-1" onClick={() => setShowModal(true)}>
                            <Plus size={15} />
                            <span className="hidden sm:inline">Add Transaction</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-base-100 rounded-2xl p-4 md:p-5 shadow-md border border-base-200">
                <TransactionFilters filters={filters} onChange={setFilters} />
                <TransactionTable
                    transactions={filteredTransactions}
                    grouped={groupedTransactions}
                    role={role}
                    onDelete={deleteTransaction}
                    onEdit={setEditTx}
                />
            </div>

            {showModal && <AddTransactionModal onAdd={addTransaction} onClose={() => setShowModal(false)} />}
            {editTx    && <AddTransactionModal tx={editTx} onAdd={handleEditSave} onClose={() => setEditTx(null)} />}
        </div>
    );
};

export default Transactions;
