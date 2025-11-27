import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Clock, Star, ChefHat } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductCard from '@/components/shop/ProductCard';

export default function Home() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['featured-products'],
        queryFn: () => productsApi.getFeatured(),
    });

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center bg-gray-900 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent"></div>

                {/* Floating Shapes */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-slide-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold tracking-wide uppercase">
                                <Star className="w-4 h-4 fill-current" />
                                <span>La mejor pastelería temática</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                                Sabores que <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                                    Hacen Historia
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                                Descubre nuestra colección exclusiva de pasteles artesanales inspirados en la era jurásica. Calidad premium en cada mordida.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/shop" className="btn btn-primary btn-lg shadow-glow-verde flex items-center gap-2 text-white hover:scale-105 transition-transform">
                                    <ShoppingBag className="w-5 h-5" />
                                    Ver Catálogo
                                </Link>
                                <Link to="/about" className="btn btn-lg bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 font-bold flex items-center gap-2 hover:scale-105">
                                    <Star className="w-5 h-5" />
                                    Conocer Más
                                </Link>
                            </div>

                            <div className="flex items-center gap-8 pt-8 border-t border-gray-800">
                                <div>
                                    <p className="text-3xl font-bold text-white">15k+</p>
                                    <p className="text-gray-400 text-sm">Clientes Felices</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-white">50+</p>
                                    <p className="text-gray-400 text-sm">Variedades</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-white">4.9</p>
                                    <p className="text-gray-400 text-sm">Calificación</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image/Card */}
                        <div className="hidden md:block relative animate-fade-in">
                            <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?q=80&w=1000&auto=format&fit=crop"
                                    alt="Pastel Premium"
                                    className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
                                />
                                <div className="absolute bottom-10 left-10 right-10 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-gray-900">T-Rex Green Cake</p>
                                            <p className="text-sm text-gray-500">Edición Limitada</p>
                                        </div>
                                        <span className="text-primary-600 font-bold text-xl">$45.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Por qué elegirnos</h2>
                        <p className="text-gray-600 text-lg">No solo vendemos pasteles, creamos experiencias gastronómicas inolvidables con los mejores ingredientes.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={ChefHat}
                            title="Artesanal & Fresco"
                            description="Cada pastel es horneado el mismo día de su entrega por nuestros chefs expertos."
                            color="bg-orange-50 text-orange-600"
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Entrega Express"
                            description="Sistema de logística optimizado para que tu pedido llegue perfecto y a tiempo."
                            color="bg-blue-50 text-blue-600"
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Calidad Garantizada"
                            description="Si no estás 100% satisfecho con el sabor o la presentación, te lo reponemos."
                            color="bg-green-50 text-green-600"
                        />
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1626202378372-c26662283f9e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-primary-400 font-bold tracking-wider uppercase mb-2">Nuestra Esencia</h3>
                                <h2 className="text-4xl font-bold mb-6">Misión</h2>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    "Ofrecer experiencias gastronómicas únicas a través de la repostería temática de alta calidad, fusionando la creatividad con el sabor artesanal para deleitar a nuestros clientes en cada celebración."
                                </p>
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold mb-6">Visión</h2>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    "Ser la pastelería temática líder en la región, reconocida por nuestra innovación, calidad y servicio excepcional, expandiendo nuestra huella jurásica a nuevos horizontes."
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full"></div>
                            <img
                                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1989&auto=format&fit=crop"
                                alt="Chef decorando pastel"
                                className="relative rounded-2xl shadow-2xl transform md:rotate-3 hover:rotate-0 transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">Catálogo Exclusivo</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Favoritos del Parque</h2>
                        </div>
                        <Link to="/shop" className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group">
                            Ver todo el menú
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20"><LoadingSpinner /></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products?.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/shop" className="btn btn-secondary w-full">
                            Ver todo el menú
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
    return (
        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${color} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}