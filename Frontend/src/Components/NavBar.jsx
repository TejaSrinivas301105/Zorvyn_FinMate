import { useState } from 'react';
import { NavLink } from 'react-router';
import { LayoutDashboard, ArrowLeftRight, Wallet, ShieldCheck, Eye, Lightbulb, Menu, X, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const links = [
    { to: '/Dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { to: '/Transactions', label: 'Transactions', icon: ArrowLeftRight  },
    { to: '/Insights',     label: 'Insights',     icon: Lightbulb       },
];

const NavBar = () => {
    const { role, setRole, theme, toggleTheme } = useApp();
    const [menuOpen, setMenuOpen] = useState(false);
    const isDark = theme === 'dim';

    const linkClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive ? 'bg-primary text-primary-content' : 'text-base-content/70 hover:bg-base-200'
        }`;

    const ThemeToggle = () => (
        <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 ${
                isDark
                    ? 'bg-base-300 border-base-content/20 text-base-content'
                    : 'bg-base-200 border-base-content/20 text-base-content'
            }`}
        >
            {isDark ? <Moon size={15} className="text-indigo-400" /> : <Sun size={15} className="text-amber-500" />}
            <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
        </button>
    );

    return (
        <nav className="bg-base-100 border-b border-base-200 px-4 md:px-6 py-3 shadow-sm sticky top-0 z-50">
            <div className="flex items-center justify-between">

                {/* Brand */}
                <div className="flex items-center gap-2 text-primary font-bold text-xl">
                    <Wallet size={22} />
                    <span>Zorvyn</span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink key={to} to={to} className={linkClass}>
                            <Icon size={16} />
                            {label}
                        </NavLink>
                    ))}
                </div>

                {/* Desktop Right Controls */}
                <div className="hidden md:flex items-center gap-3">
                    <ThemeToggle />
                    <div className="w-px h-5 bg-base-content/20" />
                    <span className={`badge gap-1 ${role === 'admin' ? 'badge-success' : 'badge-warning'}`}>
                        {role === 'admin' ? <ShieldCheck size={12} /> : <Eye size={12} />}
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                    <select className="select select-bordered select-sm" value={role} onChange={e => setRole(e.target.value)}>
                        <option value="viewer">Viewer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Mobile Right Controls */}
                <div className="md:hidden flex items-center gap-2">
                    <ThemeToggle />
                    <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setMenuOpen(o => !o)}>
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden mt-3 pb-3 flex flex-col gap-1 border-t border-base-200 pt-3">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink key={to} to={to} className={linkClass} onClick={() => setMenuOpen(false)}>
                            <Icon size={16} />
                            {label}
                        </NavLink>
                    ))}
                    <div className="flex items-center gap-2 px-2 pt-2 border-t border-base-200 mt-1">
                        <span className={`badge gap-1 ${role === 'admin' ? 'badge-success' : 'badge-warning'}`}>
                            {role === 'admin' ? <ShieldCheck size={12} /> : <Eye size={12} />}
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                        <select className="select select-bordered select-sm flex-1" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="viewer">Viewer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
