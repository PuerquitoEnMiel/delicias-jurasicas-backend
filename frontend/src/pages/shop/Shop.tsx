import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import ProductCard from '@/components/shop/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Search, Filter } from 'lucide-react';

export default function Shop() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['products', { search, category, page }],
        queryFn: () =>
            productsApi.getAll({
                search: search || undefined,
                category: category || undefined,
                page,
                limit: 12,
            }),
    });

    return (
        <div className="min-h-screen gradient-warm">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-beige-200 via-beige-100 to-beige-200 border-b-4 border-amarillo-400 shadow-lg">
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl font-bold text-chocolate-800 mb-4 drop-shadow-sm">
                            🦖 Delicias Prehistóricas
                        </h1>
                        <p className="text-xl text-chocolate-600 mb-8">
                            Descubre nuestra colección de pasteles y delicias temáticas
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-chocolate-500 w-6 h-6" />
                                <input
                                    type="text"
                                    placeholder="Buscar tu delicia favorita..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-input pl-14 pr-6 py-4 text-lg shadow-warm-md border-3 border-beige-400 focus:border-verde-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="container mx-auto px-4 py-12">
                {/* Category Filter */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-chocolate-600" />
                        <h2 className="text-2xl font-bold text-chocolate-800">Nuestros Productos</h2>
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="form-select py-3 px-4 bg-white border-2 border-beige-400 text-chocolate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <option value="">Todas las categorías</option>
                        <option value="pasteles">Pasteles</option>
                        <option value="galletas">Galletas</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="especiales">Especiales</option>
                    </select>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                            {data?.data?.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Empty State */}
                        {(!data?.data || data.data.length === 0) && (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-warm-md border-2 border-beige-200">
                                <div className="text-6xl mb-4">🦕</div>
                                <h3 className="text-2xl font-bold text-chocolate-800 mb-2">
                                    No hay productos disponibles
                                </h3>
                                <p className="text-chocolate-600">
                                    Intenta con una búsqueda diferente
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {data?.meta && data.meta.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="btn btn-outline px-6"
                                >
                                    ← Anterior
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-10 h-10 rounded-lg font-bold transition-all ${pageNum === page
                                                ? 'bg-gradient-to-br from-verde-400 to-verde-600 text-white shadow-lg shadow-verde-500/30'
                                                : 'bg-white text-chocolate-700 border-2 border-beige-300 hover:border-verde-400 hover:shadow-md'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                                    disabled={page === data.meta.totalPages}
                                    className="btn btn-outline px-6"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
