import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliersApi, Supplier, CreateSupplierDto } from '@/api/suppliers';
import { Plus, Search, Edit2, Trash2, Truck, Phone, Mail, MapPin } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Suppliers() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [formData, setFormData] = useState<CreateSupplierDto>({
        name: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        taxId: '',
        isActive: true,
    });

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['suppliers', page, search],
        queryFn: () => suppliersApi.getAll(page, 10, search),
    });

    const createMutation = useMutation({
        mutationFn: suppliersApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            closeModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateSupplierDto> }) =>
            suppliersApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            closeModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: suppliersApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSupplier) {
            updateMutation.mutate({ id: editingSupplier.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const openModal = (supplier?: Supplier) => {
        if (supplier) {
            setEditingSupplier(supplier);
            setFormData({
                name: supplier.name,
                contactName: supplier.contactName || '',
                email: supplier.email || '',
                phone: supplier.phone || '',
                address: supplier.address || '',
                taxId: supplier.taxId || '',
                isActive: supplier.isActive,
            });
        } else {
            setEditingSupplier(null);
            setFormData({
                name: '',
                contactName: '',
                email: '',
                phone: '',
                address: '',
                taxId: '',
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Truck className="w-8 h-8 text-primary" />
                    Proveedores
                </h1>
                <button
                    onClick={() => openModal()}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Proveedor
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, contacto o email..."
                        className="input pl-10 w-full max-w-md"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((supplier) => (
                    <div key={supplier.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{supplier.name}</h3>
                                {supplier.contactName && (
                                    <p className="text-sm text-gray-500">Contacto: {supplier.contactName}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModal(supplier)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(supplier.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            {supplier.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {supplier.email}
                                </div>
                            )}
                            {supplier.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {supplier.phone}
                                </div>
                            )}
                            {supplier.address && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {supplier.address}
                                </div>
                            )}
                            {supplier.taxId && (
                                <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                                    RUC/RFC: {supplier.taxId}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {data?.meta && (
                <div className="mt-6 flex justify-center gap-2">
                    <button
                        className="btn btn-secondary"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Anterior
                    </button>
                    <span className="flex items-center px-4 text-gray-600">
                        Página {page} de {data.meta.totalPages}
                    </span>
                    <button
                        className="btn btn-secondary"
                        disabled={page === data.meta.totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="label">Nombre de la Empresa</label>
                                <input
                                    type="text"
                                    required
                                    className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Harina del Valle S.A."
                                />
                            </div>
                            <div>
                                <label className="label">Nombre de Contacto</label>
                                <input
                                    type="text"
                                    className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                    value={formData.contactName}
                                    onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="contacto@empresa.com"
                                    />
                                </div>
                                <div>
                                    <label className="label">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+52 123 456 7890"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Dirección</label>
                                <input
                                    type="text"
                                    className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Calle Principal #123, Col. Centro"
                                />
                            </div>
                            <div>
                                <label className="label">RUC / RFC</label>
                                <input
                                    type="text"
                                    className="input w-full focus:ring-2 focus:ring-verde-500 focus:border-verde-500 transition-all"
                                    value={formData.taxId}
                                    onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                                    placeholder="ABC123456XYZ"
                                />
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
