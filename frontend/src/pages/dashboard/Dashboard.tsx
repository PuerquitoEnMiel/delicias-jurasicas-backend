import { useQuery } from '@tanstack/react-query';
import {
    Package,
    ShoppingBag,
    Factory,
    DollarSign,
} from 'lucide-react';
import { productsApi } from '@/api/products';
import { ordersApi } from '@/api/orders';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LowStockAlert from '@/components/dashboard/LowStockAlert';

export default function Dashboard() {
    const { data: products, isLoading: loadingProducts } = useQuery({
        queryKey: ['dashboard-products'],
        queryFn: () => productsApi.getAll({ limit: 5 }),
    });

    const { data: orders, isLoading: loadingOrders } = useQuery({
        queryKey: ['dashboard-orders'],
        queryFn: () => ordersApi.getAll(1, 10),
    });

    if (loadingProducts || loadingOrders) {
        return <LoadingSpinner />;
    }

    const stats = [
        {
            label: 'Total Productos',
            value: products?.meta?.total || 0,
            icon: Package,
            bgColor: 'from-verde-400 to-verde-600',
            iconBg: 'bg-verde-100',
            iconColor: 'text-verde-700',
            shadow: 'shadow-verde',
        },
        {
            label: 'Pedidos Pendientes',
            value: orders?.data?.filter((o: any) => o.status === 'PENDING').length || 0,
            icon: ShoppingBag,
            bgColor: 'from-amarillo-400 to-amarillo-600',
            iconBg: 'bg-amarillo-100',
            iconColor: 'text-amarillo-700',
            shadow: 'shadow-amarillo',
        },
        {
            label: 'En Producción',
            value: 0,
            icon: Factory,
            bgColor: 'from-chocolate-400 to-chocolate-600',
            iconBg: 'bg-chocolate-100',
            iconColor: 'text-chocolate-700',
            shadow: 'shadow-chocolate',
        },
        {
            label: 'Ventas Hoy',
            value: '$0.00',
            icon: DollarSign,
            bgColor: 'from-naranja-400 to-naranja-600',
            iconBg: 'bg-naranja-100',
            iconColor: 'text-naranja-700',
            shadow: 'shadow-lg shadow-naranja-400/30',
        },
    ];

    return (
        <div>
            <h1 className="text-4xl font-bold text-chocolate-800 mb-8 drop-shadow-sm">
                Dashboard Principal 🦖
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 border-2 border-beige-200 shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-4 rounded-xl ${stat.iconBg} ${stat.shadow}`}>
                                    <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-chocolate-600 mb-2">{stat.label}</p>
                            <p className={`text-3xl font-bold bg-gradient-to-r ${stat.bgColor} bg-clip-text text-transparent`}>
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl p-6 border-2 border-beige-200 shadow-warm">
                    <h2 className="text-2xl font-bold text-chocolate-800 mb-4 pb-3 border-b-2 border-beige-200">
                        Pedidos Recientes
                    </h2>
                    <div className="space-y-3">
                        {orders?.data && orders.data.length > 0 ? (
                            orders.data.slice(0, 5).map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between py-3 px-4 bg-beige-50 rounded-xl hover:bg-beige-100 transition-colors border border-beige-200">
                                    <div>
                                        <p className="font-bold text-chocolate-800">{order.customerName}</p>
                                        <p className="text-xs text-chocolate-600">{order.orderNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-verde-600 text-lg">${order.total.toFixed(2)}</p>
                                        <span className={`badge badge-${order.status === 'PENDING' ? 'warning' :
                                            order.status === 'COMPLETED' ? 'success' :
                                                'info'
                                            } text-xs`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-chocolate-500 text-center py-8 bg-beige-50 rounded-xl">No hay pedidos recientes</p>
                        )}
                    </div>
                </div>

                {/* Low Stock Alert */}
                <LowStockAlert />
            </div>
        </div>
    );
}
