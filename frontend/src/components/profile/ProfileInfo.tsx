import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { usersApi, UpdateProfileDto } from '@/api/users';
import { User, Lock, Save, Mail, Phone, AlertCircle } from 'lucide-react';

export default function ProfileInfo() {
    const { user, setUser } = useAuthStore();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        password: '',
    });

    const updateProfileMutation = useMutation({
        mutationFn: usersApi.updateProfile,
        onSuccess: (updatedUser) => {
            setUser({ ...user!, ...updatedUser });
            setFormData(prev => ({ ...prev, password: '' }));
            alert('Perfil actualizado correctamente');
        },
        onError: () => {
            alert('Error al actualizar perfil');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: UpdateProfileDto = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
        };
        if (formData.password) {
            data.password = formData.password;
        }
        updateProfileMutation.mutate(data);
    };

    return (
        <div className="space-y-6">
            {/* Información Personal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-verde-50 to-beige-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-verde-500 rounded-lg">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        Información Personal
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre
                            </label>
                            <input
                                type="text"
                                className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                required
                                placeholder="Ej: Juan"
                            />
                        </div>

                        {/* Apellido */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Apellido
                            </label>
                            <input
                                type="text"
                                className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                required
                                placeholder="Ej: Pérez"
                            />
                        </div>

                        {/* Email (solo lectura) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                Email
                            </label>
                            <input
                                type="email"
                                className="input w-full bg-gray-100 text-gray-600 cursor-not-allowed opacity-75"
                                value={user?.email}
                                disabled
                            />
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                El email no puede modificarse
                            </p>
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Ej: +52 123 456 7890"
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Cambiar Contraseña */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-amarillo-50 to-naranja-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-amarillo-500 rounded-lg">
                            <Lock className="w-5 h-5 text-gray-900" />
                        </div>
                        Seguridad
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="max-w-md">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            className="input w-full focus:ring-2 focus:ring-amarillo-500 focus:border-amarillo-500 transition-all"
                            placeholder="Mínimo 6 caracteres (dejar vacío para no cambiar)"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            minLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Deja este campo vacío si no deseas cambiar tu contraseña.
                        </p>
                    </div>
                </form>
            </div>

            {/* Botón de guardar */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2 px-8"
                    disabled={updateProfileMutation.isPending}
                    onClick={handleSubmit}
                >
                    <Save className="w-5 h-5" />
                    {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );
}
