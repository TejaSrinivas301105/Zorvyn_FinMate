const MONTH_ORDER = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const getInsights = (transactions) => {
    const expenses = transactions.filter(tx => tx.type === 'expense');
    const incomes  = transactions.filter(tx => tx.type === 'income');

    // Highest spending category 
    const byCategory = expenses.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
    }, {});
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

    // --- Monthly income vs expense ---
    const byMonth = transactions.reduce((acc, tx) => {
        const m = new Date(tx.date).toLocaleString('default', { month: 'short' });
        if (!acc[m]) acc[m] = { income: 0, expense: 0 };
        acc[m][tx.type] += tx.amount;
        return acc;
    }, {});

    const monthlyData = MONTH_ORDER
        .filter(m => byMonth[m])
        .map(m => ({ month: m, income: byMonth[m].income, expense: byMonth[m].expense }));

    // Month-over-month expense change
    const months = monthlyData.filter(m => m.expense > 0);
    const lastMonth   = months[months.length - 1];
    const secondLast  = months[months.length - 2];
    const expenseChange = secondLast
        ? (((lastMonth.expense - secondLast.expense) / secondLast.expense) * 100).toFixed(1)
        : null;

    //  Savings rate (latest month) 
    const savingsRate = lastMonth?.income
        ? (((lastMonth.income - lastMonth.expense) / lastMonth.income) * 100).toFixed(1)
        : null;

    //  Top income source 
    const byIncomeCategory = incomes.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
    }, {});
    const topIncome = Object.entries(byIncomeCategory).sort((a, b) => b[1] - a[1])[0];

    //  Biggest single expense 
    const biggestExpense = expenses.sort((a, b) => b.amount - a.amount)[0];

    return { topCategory, monthlyData, expenseChange, savingsRate, topIncome, biggestExpense, lastMonth };
};
