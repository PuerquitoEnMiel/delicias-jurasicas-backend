import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem(product, quantity);
        setTimeout(() => {
            setIsAdding(false);
            setQuantity(1);
        }, 600);
    };

    const price = product.salePrice || 0;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border-2 border-beige-200 shadow-warm hover:shadow-warm-lg hover:-translate-y-2 transition-all duration-300">
            {/* Image */}
            <div className="relative h-56 bg-gradient-to-br from-beige-50 to-beige-100 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-20 h-20 text-beige-400" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-chocolate-800 mb-2 line-clamp-2 group-hover:text-verde-600 transition-colors">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-sm text-chocolate-600 mb-4 line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-verde-600">
                        ${price.toFixed(2)}
                    </span>
                </div>

                {/* Quantity Counter */}
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg bg-beige-200 hover:bg-beige-300 text-chocolate-700 flex items-center justify-center transition-colors border border-beige-400"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-chocolate-800 bg-beige-50 py-2 rounded-lg border border-beige-300">
                        {quantity}
                    </span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-beige-200 hover:bg-beige-300 text-chocolate-700 flex items-center justify-center transition-colors border border-beige-400"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`w-full btn ${isAdding ? 'btn-primary scale-95' : 'btn-secondary'} flex items-center justify-center gap-2`}
                >
                    <ShoppingCart className="w-5 h-5" />
                    {isAdding ? '¡Agregado!' : 'Agregar al carrito'}
                </button>
            </div>
        </div>
    );
}
