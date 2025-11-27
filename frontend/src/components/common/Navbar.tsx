import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, LogOut, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const { getItemCount } = useCartStore();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-beige-100/95 backdrop-blur-md border-b-2 border-beige-300 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-chocolate-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-chocolate-400 to-chocolate-600 rounded-full p-3 text-white shadow-lg shadow-chocolate-500/30 group-hover:scale-105 transition-transform duration-300 border-2 border-chocolate-300">
                                <span className="text-2xl">🦖</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-chocolate-800 group-hover:text-verde-600 transition-colors">
                                Delicias Jurásicas
                            </span>
                            <span className="text-xs text-chocolate-600">Pastelería & Cafetería</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-chocolate-700 hover:text-verde-600 font-medium transition-colors duration-200 hover:scale-105"
                        >
                            Home
                        </Link>
                        <Link
                            to="/shop"
                            className="text-chocolate-700 hover:text-verde-600 font-medium transition-colors duration-200 hover:scale-105"
                        >
                            Tienda
                        </Link>
                        {isAuthenticated && user?.role !== 'CLIENTE' && (
                            <Link
                                to="/dashboard"
                                className="text-chocolate-700 hover:text-verde-600 font-medium transition-colors duration-200 hover:scale-105"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="text-chocolate-700 hover:text-verde-600 font-medium transition-colors">
                                    {user?.firstName || user?.email}
                                </Link>
                                <Link
                                    to="/cart"
                                    className="relative p-3 bg-white rounded-xl hover:bg-beige-50 transition-all duration-200 shadow-sm hover:shadow-md border border-beige-300"
                                >
                                    <ShoppingCart className="w-5 h-5 text-chocolate-700" />
                                    {getItemCount() > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-gradient-to-br from-amarillo-400 to-amarillo-600 text-chocolate-800 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-amarillo-500/40 border-2 border-white">
                                            {getItemCount()}
                                        </span>
                                    )}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline btn-sm flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline btn-sm">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm">
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg bg-white border-2 border-beige-300 text-chocolate-700 hover:bg-beige-50 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-beige-300 bg-white/50 backdrop-blur-sm rounded-b-2xl mb-2">
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/"
                                className="px-4 py-3 text-chocolate-700 hover:bg-verde-50 hover:text-verde-600 rounded-lg transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/shop"
                                className="px-4 py-3 text-chocolate-700 hover:bg-verde-50 hover:text-verde-600 rounded-lg transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Tienda
                            </Link>
                            {isAuthenticated && user?.role !== 'CLIENTE' && (
                                <Link
                                    to="/dashboard"
                                    className="px-4 py-3 text-chocolate-700 hover:bg-verde-50 hover:text-verde-600 rounded-lg transition-colors font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            )}
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="px-4 py-3 text-chocolate-700 hover:bg-verde-50 hover:text-verde-600 rounded-lg transition-colors font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Perfil
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="px-4 py-3 text-chocolate-700 hover:bg-verde-50 hover:text-verde-600 rounded-lg transition-colors font-medium flex items-center justify-between"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>Carrito</span>
                                        {getItemCount() > 0 && (
                                            <span className="bg-amarillo-500 text-chocolate-800 text-xs font-bold rounded-full px-2 py-1">
                                                {getItemCount()}
                                            </span>
                                        )}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="mx-4 btn btn-outline btn-sm"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="mx-4 btn btn-outline btn-sm"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="mx-4 btn btn-primary btn-sm"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
