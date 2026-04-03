import { useState } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';

const CATEGORIES = ['All', 'Housing', 'Food', 'Transport', 'Health', 'Entertainment', 'Salary', 'Freelance', 'Others'];

const DEFAULT_FILTERS = {
    search: '', type: 'All', category: 'All', sort: 'date-desc',
    dateFrom: '', dateTo: '', minAmount: '', maxAmount: '', groupBy: 'none'
};

const TransactionFilters = ({ filters, onChange }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const hasAdvancedFilters = filters.dateFrom || filters.dateTo || filters.minAmount || filters.maxAmount;
    const hasBasicFilters    = filters.search || filters.type !== 'All' || filters.category !== 'All';
    const hasActiveFilters   = hasBasicFilters || hasAdvancedFilters || filters.groupBy !== 'none';

    const reset = () => onChange(DEFAULT_FILTERS);
    const set   = (field, value) => onChange({ ...filters, [field]: value });

    return (
        <div className="flex flex-col gap-3 mb-5">

            {/* Basic Filters Row */}
            <div className="flex flex-wrap gap-3">
                <label className="input input-bordered flex items-center gap-2 flex-1 min-w-48">
                    <Search size={16} className="opacity-50 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={filters.search}
                        onChange={e => set('search', e.target.value)}
                        className="grow min-w-0"
                    />
                    {filters.search && (
                        <button onClick={() => set('search', '')} className="opacity-50 hover:opacity-100">
                            <X size={14} />
                        </button>
                    )}
                </label>

                <select className="select select-bordered w-full sm:w-auto" value={filters.type} onChange={e => set('type', e.target.value)}>
                    <option value="All">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <select className="select select-bordered w-full sm:w-auto" value={filters.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                </select>

                <select className="select select-bordered w-full sm:w-auto" value={filters.sort} onChange={e => set('sort', e.target.value)}>
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="amount-desc">Highest Amount</option>
                    <option value="amount-asc">Lowest Amount</option>
                </select>

                {/* Advanced Toggle */}
                <button
                    onClick={() => setShowAdvanced(p => !p)}
                    className={`btn btn-sm gap-1 w-full sm:w-auto ${hasAdvancedFilters ? 'btn-primary' : 'btn-outline'}`}
                >
                    <SlidersHorizontal size={14} />
                    Advanced
                    <ChevronDown size={13} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvanced && (
                <div className="bg-base-200/60 rounded-xl p-4 flex flex-wrap gap-4 border border-base-200">

                    {/* Date Range */}
                    <div className="flex flex-col gap-1 flex-1 min-w-48">
                        <label className="text-xs font-medium text-base-content/60">Date Range</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                className="input input-bordered input-sm flex-1"
                                value={filters.dateFrom}
                                onChange={e => set('dateFrom', e.target.value)}
                            />
                            <span className="text-base-content/40 text-sm">to</span>
                            <input
                                type="date"
                                className="input input-bordered input-sm flex-1"
                                value={filters.dateTo}
                                onChange={e => set('dateTo', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Amount Range */}
                    <div className="flex flex-col gap-1 flex-1 min-w-48">
                        <label className="text-xs font-medium text-base-content/60">Amount Range (₹)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="input input-bordered input-sm flex-1"
                                value={filters.minAmount}
                                onChange={e => set('minAmount', e.target.value)}
                            />
                            <span className="text-base-content/40 text-sm">to</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="input input-bordered input-sm flex-1"
                                value={filters.maxAmount}
                                onChange={e => set('maxAmount', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Group By */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-base-content/60">Group By</label>
                        <select className="select select-bordered select-sm" value={filters.groupBy} onChange={e => set('groupBy', e.target.value)}>
                            <option value="none">No Grouping</option>
                            <option value="month">Month</option>
                            <option value="category">Category</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Active filter tags + reset */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                    {filters.type !== 'All'      && <span className="badge badge-outline badge-sm">{filters.type}</span>}
                    {filters.category !== 'All'  && <span className="badge badge-outline badge-sm">{filters.category}</span>}
                    {filters.dateFrom            && <span className="badge badge-outline badge-sm">From {filters.dateFrom}</span>}
                    {filters.dateTo              && <span className="badge badge-outline badge-sm">To {filters.dateTo}</span>}
                    {filters.minAmount           && <span className="badge badge-outline badge-sm">Min ₹{filters.minAmount}</span>}
                    {filters.maxAmount           && <span className="badge badge-outline badge-sm">Max ₹{filters.maxAmount}</span>}
                    {filters.groupBy !== 'none'  && <span className="badge badge-primary badge-sm">Grouped by {filters.groupBy}</span>}
                    <button onClick={reset} className="btn btn-ghost btn-xs gap-1 text-base-content/60">
                        <X size={12} /> Clear all
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionFilters;
