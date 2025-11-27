import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Plus, Edit2, Trash2, User, Mail, Shield } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
}

export default function Users() {
    const [page] = useState(1);
    const [search] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'VENDEDOR',
        phone: '',
    });

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['users', page, search],
        queryFn: async () => {
            const { data } = await apiClient.get('/users', {
                params: { page, limit: 10, search }
            });
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiClient.post('/auth/register', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            closeModal();
            alert('Usuario creado exitosamente');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Error al crear usuario');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await apiClient.patch(`/users/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            closeModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            const { password, ...updateData } = formData;
            updateMutation.mutate({
                id: editingUser.id,
                data: password ? { ...updateData, password } : updateData
            });
        } else {
            createMutation.mutate(formData);
        }
    };

    const openModal = (user?: UserData) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                email: user.email,
                password: '',
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                phone: '',
            });
        } else {
            setEditingUser(null);
            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                role: 'VENDEDOR',
                phone: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-8 h-8 text-primary" />
                    Usuarios
                </h1>
                <button
                    onClick={() => openModal()}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Usuario
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Usuario</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Rol</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Estado</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data?.data?.map((user: UserData) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                            {user.firstName[0]}{user.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <Shield className="w-3 h-3" />
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => openModal(user)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder="Ej: Juan"
                                    />
                                </div>
                                <div>
                                    <label className="label">Apellido</label>
                                    <input
                                        type="text"
                                        required
                                        className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        placeholder="Ej: Pérez"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!!editingUser}
                                    placeholder="usuario@deliciasjurasicas.com"
                                />
                            </div>
                            <div>
                                <label className="label">
                                    {editingUser ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    className="input w-full focus:ring-2 focus:ring-amarillo-500 focus:border-amarillo-500 transition-all"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    minLength={6}
                                    placeholder={editingUser ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"}
                                />
                            </div>
                            <div>
                                <label className="label">Rol</label>
                                <select
                                    className="input w-full"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="ADMIN">Administrador</option>
                                    <option value="PANADERO">Panadero</option>
                                    <option value="VENDEDOR">Vendedor</option>
                                    <option value="REPARTIDOR">Repartidor</option>
                                    <option value="CLIENTE">Cliente</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
