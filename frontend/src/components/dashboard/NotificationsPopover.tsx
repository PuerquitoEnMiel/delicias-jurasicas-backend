import { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, ShoppingBag, DollarSign, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Notification {
    id: string;
    title: string;
    description: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Nueva Orden Recibida',
        description: 'Orden #ORD-2024-001 por $450.00',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
        read: false,
    },
    {
        id: '2',
        title: 'Alerta de Stock Bajo',
        description: 'El insumo "Harina de Trigo" está por debajo del mínimo.',
        type: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        read: false,
    },
    {
        id: '3',
        title: 'Cierre de Caja',
        description: 'Juan Pérez ha cerrado la Caja Principal.',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
    },
    {
        id: '4',
        title: 'Producto Actualizado',
        description: 'Se actualizó el precio de "Pastel Volcán".',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
    },
];

export default function NotificationsPopover() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <ShoppingBag className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'error': return <X className="w-5 h-5 text-red-500" />;
            case 'info': default: return <CheckCircle className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 bg-beige-100 hover:bg-beige-200 rounded-xl transition-all duration-200 border-2 border-beige-300 hover:shadow-md group"
            >
                <Bell className={`w-5 h-5 text-chocolate-700 transition-transform ${isOpen ? 'rotate-12' : 'group-hover:rotate-12'}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-naranja-400 to-naranja-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-beige-200 overflow-hidden z-50 animate-fadeIn origin-top-right">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-900">Notificaciones</h3>
                            <p className="text-xs text-gray-500">Historial de actividad del sistema</p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
                            >
                                Marcar todo leído
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No tienes notificaciones nuevas</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => markAsRead(notification.id)}
                                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4 ${!notification.read ? 'bg-primary-50/30' : ''}`}
                                    >
                                        <div className={`mt-1 p-2 rounded-full bg-white shadow-sm border border-gray-100 h-fit`}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {notification.title}
                                                </h4>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: es })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                {notification.description}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="self-center">
                                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                        <button className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
                            Ver historial completo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
