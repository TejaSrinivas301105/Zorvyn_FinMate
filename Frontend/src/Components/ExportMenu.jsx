import { Download, FileText, FileJson } from 'lucide-react';
import { exportCSV, exportJSON } from '../utils/exportHelpers';

const ExportMenu = ({ transactions }) => {
    const disabled = !transactions.length;
    const label    = `transactions_${new Date().toISOString().slice(0, 10)}`;

    return (
        <div className="dropdown dropdown-end">
            <button
                tabIndex={0}
                disabled={disabled}
                className="btn btn-outline btn-sm gap-1"
                title={disabled ? 'No data to export' : 'Export data'}
            >
                <Download size={15} />
                <span className="hidden sm:inline">Export</span>
            </button>

            <ul tabIndex={0} className="dropdown-content menu bg-base-100 border border-base-200 rounded-xl shadow-lg w-44 p-1 mt-2 z-50">
                <li>
                    <button
                        className="flex items-center gap-2 text-sm"
                        onClick={() => exportCSV(transactions, label)}
                    >
                        <FileText size={15} className="text-emerald-500" />
                        Export as CSV
                    </button>
                </li>
                <li>
                    <button
                        className="flex items-center gap-2 text-sm"
                        onClick={() => exportJSON(transactions, label)}
                    >
                        <FileJson size={15} className="text-indigo-500" />
                        Export as JSON
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ExportMenu;
