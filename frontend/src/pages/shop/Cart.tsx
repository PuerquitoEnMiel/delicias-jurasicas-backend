import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';

export default function Cart() {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

    const handleCheckout = () => {
        if (items.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen gradient-warm flex items-center justify-center px-4 py-20">
                <div className="text-center bg-white rounded-3xl p-12 shadow-warm-xl border-2 border-beige-300 max-w-md">
                    <div className="bg-gradient-to-br from-beige-100 to-beige-200 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-chocolate-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-chocolate-800 mb-3">
                        Tu carrito está vacío
                    </h2>
                    <p className="text-chocolate-600 mb-8 text-lg">
                        ¡Agrega algunos productos deliciosos! 🦖
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="btn btn-primary btn-lg w-full"
                    >
                        Explorar Productos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-warm py-8">
            <div className="container mx-auto px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline mb-6 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Seguir Comprando
                </button>

                <h1 className="text-4xl font-bold text-chocolate-800 mb-8 drop-shadow-sm">
                    🛒 Carrito de Compras
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            const price = item.product.salePrice || 0;
                            return (
                                <div
                                    key={item.product.id}
                                    className="bg-white rounded-2xl p-6 border-2 border-beige-200 shadow-warm hover:shadow-warm-md transition-all"
                                >
                                    <div className="flex gap-6">
                                        {/* Image */}
                                        <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-beige-100 to-beige-200 flex-shrink-0">
                                            {item.product.images && item.product.images.length > 0 ? (
                                                <img
                                                    src={item.product.images[0].url}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-12 h-12 text-beige-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-chocolate-800 mb-2">
                                                {item.product.name}
                                            </h3>
                                            {item.product.description && (
                                                <p className="text-sm text-chocolate-600 mb-3 line-clamp-2">
                                                    {item.product.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between">
                                                {/* Quantity Counter */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                                                        }
                                                        className="w-10 h-10 rounded-lg bg-beige-200 hover:bg-beige-300 text-chocolate-700 flex items-center justify-center transition-colors border border-beige-400"
                                                    >
                                                        <Minus className="w-5 h-5" />
                                                    </button>
                                                    <span className="w-14 text-center font-bold text-chocolate-800 bg-beige-50 py-2 rounded-lg border border-beige-300">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="w-10 h-10 rounded-lg bg-beige-200 hover:bg-beige-300 text-chocolate-700 flex items-center justify-center transition-colors border border-beige-400"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                {/* Price & Remove */}
                                                <div className="text-right flex items-center gap-4">
                                                    <div>
                                                        <p className="text-2xl font-bold text-verde-600">
                                                            ${(price * item.quantity).toFixed(2)}
                                                        </p>
                                                        <p className="text-sm text-chocolate-600">
                                                            ${price.toFixed(2)} c/u
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.product.id)}
                                                        className="p-3 bg-red-100 hover:bg-red-200 rounded-xl transition-colors border-2 border-red-300"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-red-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-verde-50 to-verde-100 rounded-2xl p-8 border-4 border-verde-300 shadow-warm-lg sticky top-24">
                            <h2 className="text-2xl font-bold text-chocolate-800 mb-6 pb-4 border-b-2 border-verde-300">
                                Resumen del Pedido
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-chocolate-700 font-medium">Subtotal:</span>
                                    <span className="text-xl font-bold text-chocolate-800">
                                        ${getTotal().toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-chocolate-700 font-medium">Envío:</span>
                                    <span className="text-lg font-semibold text-verde-600">GRATIS</span>
                                </div>
                                <div className="divider-warm my-4"></div>
                                <div className="flex justify-between items-center bg-white p-4 rounded-xl border-2 border-verde-300">
                                    <span className="text-xl font-bold text-chocolate-800">Total:</span>
                                    <span className="text-3xl font-bold text-verde-600">
                                        ${getTotal().toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button onClick={handleCheckout} className="btn btn-primary btn-lg w-full">
                                    Proceder al Pago
                                </button>
                                <button
                                    onClick={clearCart}
                                    className="w-full text-red-600 hover:text-red-700 font-medium py-3 transition-colors"
                                >
                                    Vaciar Carrito
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t-2 border-verde-300">
                                <p className="text-sm text-chocolate-600 text-center">
                                    🦖 Compra segura garantizada
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
