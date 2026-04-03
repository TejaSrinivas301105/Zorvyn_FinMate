export const exportCSV = (transactions, filename = 'transactions') => {
    if (!transactions.length) return;

    const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(tx => [
        tx.id,
        tx.date,
        `"${tx.description.replace(/"/g, '""')}"`,
        tx.category,
        tx.type,
        tx.amount,
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    triggerDownload(`${filename}.csv`, 'text/csv', csv);
};

export const exportJSON = (transactions, filename = 'transactions') => {
    if (!transactions.length) return;
    const json = JSON.stringify(transactions, null, 2);
    triggerDownload(`${filename}.json`, 'application/json', json);
};

const triggerDownload = (filename, type, content) => {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};
