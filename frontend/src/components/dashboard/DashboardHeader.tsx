import { User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import NotificationsPopover from './NotificationsPopover';

export default function DashboardHeader() {
    const { user } = useAuthStore();

    return (
        <header className="bg-white border-b-2 border-beige-300 shadow-warm px-8 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-chocolate-800">
                        Bienvenido, {user?.firstName || 'Usuario'}
                    </h1>
                    <p className="text-sm text-chocolate-600 mt-1">
                        Panel de administración - {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <NotificationsPopover />

                    {/* Profile */}
                    <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-verde-400 to-verde-600 text-white rounded-xl hover:from-verde-500 hover:to-verde-700 transition-all duration-200 shadow-md hover:shadow-lg border-2 border-verde-300"
                    >
                        <User className="w-5 h-5" />
                        <span className="font-medium">{user?.email}</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
