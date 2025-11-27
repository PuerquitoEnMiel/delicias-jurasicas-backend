import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { UserPlus } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const { register: registerUser, isLoading } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            await registerUser({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
            });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrarse');
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
                    <div className="w-16 h-16 bg-amarillo-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amarillo-500/30 transform -rotate-3">
                        <span className="text-4xl">🦖</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Únete a la <br />Manada</h1>
                    <p className="text-xl text-beige-100 leading-relaxed">
                        Crea tu cuenta y comienza a disfrutar de los sabores más legendarios de la historia.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-warm-xl border-2 border-beige-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-chocolate-900 mb-2">Crear Cuenta</h2>
                        <p className="text-chocolate-600">Completa tus datos para registrarte</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="form-label ml-1">Nombre</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Juan"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="lastName" className="form-label ml-1">Apellido</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Pérez"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="form-label ml-1">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phone" className="form-label ml-1">Teléfono (opcional)</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className="form-input"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="555-1234-5678"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="form-label ml-1">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="form-label ml-1">Confirmar Contraseña</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repite tu contraseña"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full flex items-center justify-center gap-2 shadow-glow-verde mt-4"
                        >
                            {isLoading ? (
                                <>Creando cuenta...</>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Registrarse
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-chocolate-600">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="text-verde-600 font-bold hover:text-verde-700 hover:underline transition-colors">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
