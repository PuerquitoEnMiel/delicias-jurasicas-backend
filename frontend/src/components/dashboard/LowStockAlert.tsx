import { AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';

export default function LowStockAlert() {
    const { data } = useQuery({
        queryKey: ['low-stock'],
        queryFn: () => productsApi.getLowStock(),
    });

    // Always render the container to maintain layout consistency
    const hasAlerts = data && data.length > 0;

    return (
        <div className="bg-gradient-to-br from-amarillo-50 to-naranja-50 rounded-2xl p-6 border-2 border-amarillo-300 shadow-warm h-full">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-amarillo-200">
                <div className="p-3 bg-amarillo-400 rounded-xl shadow-lg">
                    <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-chocolate-800">
                    Alertas de Stock Bajo
                </h2>
            </div>

            {!hasAlerts ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 bg-verde-100 rounded-full flex items-center justify-center mb-3">
                        <AlertTriangle className="w-6 h-6 text-verde-600" />
                    </div>
                    <p className="text-chocolate-800 font-medium">¡Todo en orden!</p>
                    <p className="text-sm text-chocolate-600">No hay productos con stock bajo.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {data.map((product: any) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-amarillo-200 hover:border-naranja-300 transition-all shadow-sm hover:shadow-md"
                        >
                            <div>
                                <p className="font-bold text-chocolate-800">{product.name}</p>
                                <p className="text-xs text-chocolate-600">SKU: {product.sku}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-naranja-600">
                                    {product.currentStock} {product.measureUnit}
                                </p>
                                <p className="text-xs text-chocolate-600">
                                    Mín: {product.minStock || 0}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
