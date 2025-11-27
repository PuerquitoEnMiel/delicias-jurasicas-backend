import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingBag,
    TrendingUp,
    FileText,
    Truck,
    DollarSign,
    BarChart3,
    LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function DashboardSidebar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['ADMIN', 'PANADERO', 'VENDEDOR'] },
        { icon: DollarSign, label: 'Caja', path: '/dashboard/cash-box', roles: ['ADMIN', 'VENDEDOR'] },
        { icon: ShoppingBag, label: 'Órdenes', path: '/dashboard/orders', roles: ['ADMIN', 'VENDEDOR', 'PANADERO'] },
        { icon: Package, label: 'Productos', path: '/dashboard/products', roles: ['ADMIN', 'PANADERO'] },
        { icon: FileText, label: 'Producción', path: '/dashboard/production', roles: ['ADMIN', 'PANADERO'] },
        { icon: TrendingUp, label: 'Inventario', path: '/dashboard/inventory', roles: ['ADMIN', 'PANADERO'] },
        { icon: Truck, label: 'Proveedores', path: '/dashboard/suppliers', roles: ['ADMIN'] },
        { icon: BarChart3, label: 'Reportes', path: '/dashboard/reports', roles: ['ADMIN'] },
        { icon: Users, label: 'Usuarios', path: '/dashboard/users', roles: ['ADMIN'] },
    ];

    const filteredMenuItems = menuItems.filter(
        (item) => !item.roles || item.roles.includes(user?.role || '')
    );

    return (
        <aside className="w-64 bg-gradient-to-br from-chocolate-800 to-chocolate-900 text-beige-50 min-h-screen border-r-4 border-amarillo-500 shadow-xl flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-chocolate-600">
                    <div className="bg-gradient-to-br from-chocolate-500 to-chocolate-700 rounded-full p-2.5 text-white shadow-lg border-2 border-chocolate-400">
                        <span className="text-2xl">🦖</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-amarillo-300">Delicias Jurásicas</h2>
                        <p className="text-xs text-beige-300">Panel de Control</p>
                    </div>
                </div>

                {/* User Info */}
                <div className="mb-6 p-4 bg-chocolate-700/50 rounded-xl border border-chocolate-600">
                    <p className="text-sm font-semibold text-amarillo-300">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-beige-300 mt-1">{user?.role}</p>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2 flex-1">
                    {filteredMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-verde-500 to-verde-600 text-white shadow-lg shadow-verde-500/30 border-2 border-verde-400'
                                        : 'text-beige-200 hover:bg-chocolate-700 hover:text-verde-300 border-2 border-transparent hover:border-chocolate-600'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="mt-auto pt-6 border-t-2 border-chocolate-600">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 border-2 border-transparent hover:border-red-500/30 transition-all duration-200 group"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
