import { useState } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = ['Salary', 'Freelance', 'Housing', 'Food', 'Transport', 'Health', 'Entertainment', 'Others'];
const empty = { description: '', amount: '', category: 'Salary', type: 'income', date: '' };

const AddTransactionModal = ({ tx, onAdd, onClose }) => {
    const [form, setForm] = useState(tx ? { ...tx, amount: String(tx.amount) } : empty);
    const [errors, setErrors] = useState({});

    const set = (field, value) => { setForm(f => ({ ...f, [field]: value })); setErrors(e => ({ ...e, [field]: '' })); };

    const validate = () => {
        const e = {};
        if (!form.description.trim()) e.description = 'Description is required';
        if (!form.amount || isNaN(form.amount) || +form.amount <= 0) e.amount = 'Enter a valid amount';
        if (!form.date) e.date = 'Date is required';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        onAdd({ ...form, amount: parseFloat(form.amount), id: tx?.id ?? Date.now() });
        onClose();
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold">{tx ? 'Edit Transaction' : 'Add Transaction'}</h3>
                    <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}><X size={16} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <input
                            className={`input input-bordered w-full ${errors.description ? 'input-error' : ''}`}
                            placeholder="Description"
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                        />
                        {errors.description && <p className="text-error text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <input
                                className={`input input-bordered w-full ${errors.amount ? 'input-error' : ''}`}
                                type="number"
                                placeholder="Amount"
                                value={form.amount}
                                onChange={e => set('amount', e.target.value)}
                            />
                            {errors.amount && <p className="text-error text-xs mt-1">{errors.amount}</p>}
                        </div>
                        <div>
                            <input
                                className={`input input-bordered w-full ${errors.date ? 'input-error' : ''}`}
                                type="date"
                                value={form.date}
                                onChange={e => set('date', e.target.value)}
                            />
                            {errors.date && <p className="text-error text-xs mt-1">{errors.date}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <select className="select select-bordered w-full" value={form.category} onChange={e => set('category', e.target.value)}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <select className="select select-bordered w-full" value={form.type} onChange={e => set('type', e.target.value)}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <button className="btn btn-primary w-full" type="submit">
                        {tx ? 'Save Changes' : 'Add Transaction'}
                    </button>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose} />
        </div>
    );
};

export default AddTransactionModal;
