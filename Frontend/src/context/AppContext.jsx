import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { TRANSACTIONS } from '../data/transactions';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('zorvyn_transactions');
        return saved ? JSON.parse(saved) : TRANSACTIONS;
    });
    const [filters, setFilters] = useState({
        search: '', type: 'All', category: 'All', sort: 'date-desc',
        dateFrom: '', dateTo: '', minAmount: '', maxAmount: '', groupBy: 'none'
    });
    const [role, setRole]       = useState(() => localStorage.getItem('zorvyn_role') || 'viewer');
    const [theme, setTheme]     = useState(() => localStorage.getItem('zorvyn_theme') || 'forest');

    useEffect(() => {
        localStorage.setItem('zorvyn_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('zorvyn_role', role);
    }, [role]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('zorvyn_theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'forest' ? 'dim' : 'forest');
    const addTransaction    = (tx)      => setTransactions(prev => [tx, ...prev]);
    const deleteTransaction = (id)      => setTransactions(prev => prev.filter(tx => tx.id !== id));
    const editTransaction   = (updated) => setTransactions(prev => prev.map(tx => tx.id === updated.id ? updated : tx));

    const filteredTransactions = useMemo(() => {
        let list = [...transactions];

        if (filters.search)
            list = list.filter(tx =>
                tx.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                tx.category.toLowerCase().includes(filters.search.toLowerCase()) ||
                tx.type.toLowerCase().includes(filters.search.toLowerCase())
            );

        if (filters.type !== 'All')     list = list.filter(tx => tx.type === filters.type);
        if (filters.category !== 'All') list = list.filter(tx => tx.category === filters.category);
        if (filters.dateFrom)           list = list.filter(tx => tx.date >= filters.dateFrom);
        if (filters.dateTo)             list = list.filter(tx => tx.date <= filters.dateTo);
        if (filters.minAmount)          list = list.filter(tx => tx.amount >= parseFloat(filters.minAmount));
        if (filters.maxAmount)          list = list.filter(tx => tx.amount <= parseFloat(filters.maxAmount));

        list.sort((a, b) => {
            if (filters.sort === 'date-desc')   return new Date(b.date) - new Date(a.date);
            if (filters.sort === 'date-asc')    return new Date(a.date) - new Date(b.date);
            if (filters.sort === 'amount-desc') return b.amount - a.amount;
            if (filters.sort === 'amount-asc')  return a.amount - b.amount;
        });

        return list;
    }, [transactions, filters]);

    const groupedTransactions = useMemo(() => {
        if (filters.groupBy === 'none') return null;

        return filteredTransactions.reduce((acc, tx) => {
            const key = filters.groupBy === 'month'
                ? new Date(tx.date).toLocaleString('default', { month: 'long', year: 'numeric' })
                : tx.category;
            if (!acc[key]) acc[key] = { transactions: [], income: 0, expense: 0 };
            acc[key].transactions.push(tx);
            acc[key][tx.type] += tx.amount;
            return acc;
        }, {});
    }, [filteredTransactions, filters.groupBy]);

    return (
        <AppContext.Provider value={{
            transactions, filteredTransactions, groupedTransactions,
            addTransaction, deleteTransaction, editTransaction,
            filters, setFilters,
            role, setRole,
            theme, toggleTheme,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
