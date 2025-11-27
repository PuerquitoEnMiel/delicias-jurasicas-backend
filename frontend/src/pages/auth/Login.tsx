import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex bg-beige-50">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626202158826-62d2d4c0627c?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-chocolate-900/90 to-gray-900/90"></div>

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <div className="w-16 h-16 bg-verde-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-verde-500/30 transform rotate-3">
                        <span className="text-4xl">🦖</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Bienvenido a la <br />Aventura Culinaria</h1>
                    <p className="text-xl text-beige-100 leading-relaxed">
                        Gestiona tu imperio de sabores prehistóricos con las herramientas más avanzadas del mercado.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-warm-xl border-2 border-beige-100">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-chocolate-900 mb-2">Iniciar Sesión</h2>
                        <p className="text-chocolate-600">Ingresa tus credenciales para acceder</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="form-label ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chocolate-400" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="form-input pl-12"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="form-label">Contraseña</label>
                                <a href="#" className="text-sm text-verde-600 hover:text-verde-700 font-medium transition-colors">¿Olvidaste tu contraseña?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chocolate-400" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="form-input pl-12"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full group shadow-glow-verde"
                        >
                            {isLoading ? (
                                'Iniciando sesión...'
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-chocolate-600">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="text-verde-600 font-bold hover:text-verde-700 hover:underline transition-colors">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-8 pt-8 border-t border-beige-100">
                        <p className="text-xs font-bold text-chocolate-400 uppercase tracking-wider mb-4 text-center">Credenciales de Demo</p>
                        <div className="grid grid-cols-1 gap-2 text-xs text-chocolate-700 bg-amarillo-50 p-4 rounded-xl border border-amarillo-200">
                            <div className="flex justify-between">
                                <span className="font-semibold">Admin:</span>
                                <span className="font-mono">admin@deliciasjurasicas.com</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Pass:</span>
                                <span className="font-mono">Admin123!</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
