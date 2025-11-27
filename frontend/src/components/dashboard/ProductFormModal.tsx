import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { X, Save, Loader2, Plus, Trash2, Image as ImageIcon, Package, DollarSign, Layers, FileText, ChefHat } from 'lucide-react';
import { ProductType, MeasureUnit } from '@/types';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit?: any;
}

export default function ProductFormModal({ isOpen, onClose, productToEdit }: ProductFormModalProps) {
    const queryClient = useQueryClient();
    const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            sku: '',
            description: '',
            type: ProductType.PRODUCTO_TERMINADO,
            salePrice: 0,
            costPrice: 0,
            currentStock: 0,
            minStock: 0,
            measureUnit: MeasureUnit.UN,
            imageUrl: '',
            recipe: {
                ingredients: [] as { ingredientId: string; quantity: number; unit: string }[]
            }
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "recipe.ingredients"
    });

    const selectedType = watch('type');
    const imageUrlValue = watch('imageUrl');
    const showRecipe = selectedType === ProductType.PRODUCTO_TERMINADO || selectedType === ProductType.SEMI_ELABORADO;

    // Fetch ingredients (raw materials)
    const { data: ingredients } = useQuery({
        queryKey: ['ingredients-list'],
        queryFn: () => productsApi.getAll({ type: ProductType.INSUMO, limit: 100 }),
        enabled: isOpen && showRecipe
    });

    useEffect(() => {
        if (productToEdit) {
            setValue('name', productToEdit.name);
            setValue('sku', productToEdit.sku);
            setValue('description', productToEdit.description);
            setValue('type', productToEdit.type);
            setValue('salePrice', productToEdit.salePrice);
            setValue('costPrice', productToEdit.costPrice);
            setValue('currentStock', productToEdit.currentStock);
            setValue('minStock', productToEdit.minStock);
            setValue('measureUnit', productToEdit.measureUnit);
            setValue('imageUrl', productToEdit.images?.[0]?.url || '');

            // Load existing recipe if available
            if (productToEdit.recipe?.ingredients) {
                const formattedIngredients = productToEdit.recipe.ingredients.map((ri: any) => ({
                    ingredientId: ri.ingredient.id,
                    quantity: ri.quantity,
                    unit: ri.unit
                }));
                setValue('recipe.ingredients', formattedIngredients);
            } else {
                setValue('recipe.ingredients', []);
            }
        } else {
            reset();
            setValue('type', ProductType.PRODUCTO_TERMINADO);
            setValue('measureUnit', MeasureUnit.UN);
            setValue('imageUrl', '');
            setValue('recipe.ingredients', []);
        }
    }, [productToEdit, isOpen, setValue, reset]);

    const mutation = useMutation({
        mutationFn: (data: any) => {
            // Clean up data based on type
            if (!showRecipe) {
                delete data.recipe;
            }

            if (productToEdit) {
                return productsApi.update(productToEdit.id, data);
            } else {
                return productsApi.create(data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            onClose();
            reset();
            // alert(productToEdit ? 'Producto actualizado' : 'Producto creado');
        },
        onError: (error: any) => {
            alert(`Error: ${error.response?.data?.message || 'Algo salió mal'}`);
        },
    });

    const onSubmit = (data: any) => {
        // Convert numbers
        data.salePrice = parseFloat(data.salePrice as any);
        data.costPrice = parseFloat(data.costPrice as any);
        data.currentStock = parseFloat(data.currentStock as any);
        data.minStock = parseFloat(data.minStock as any);

        if (data.recipe?.ingredients) {
            data.recipe.ingredients = data.recipe.ingredients.map((i: any) => ({
                ...i,
                quantity: parseFloat(i.quantity)
            }));
        }

        // Handle Image URL -> images array
        if (data.imageUrl) {
            data.images = [{ url: data.imageUrl, isPrimary: true }];
        } else {
            data.images = [];
        }
        delete data.imageUrl;

        mutation.mutate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <p className="text-sm text-gray-500">Completa la información del producto</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-8 flex-1 custom-scrollbar">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                        {/* Section: Basic Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">
                                <FileText className="w-5 h-5 text-primary-500" />
                                <h3>Información General</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="form-label">Nombre del Producto</label>
                                    <input
                                        {...register('name', { required: 'El nombre es requerido' })}
                                        className="form-input"
                                        placeholder="Ej. Pastel de Chocolate T-Rex"
                                    />
                                    {errors.name && <span className="form-error">{errors.name.message as string}</span>}
                                </div>

                                <div>
                                    <label className="form-label">SKU (Código)</label>
                                    <input
                                        {...register('sku', { required: 'El SKU es requerido' })}
                                        className="form-input font-mono uppercase"
                                        placeholder="Ej. PAS-CHO-001"
                                    />
                                    {errors.sku && <span className="form-error">{errors.sku.message as string}</span>}
                                </div>

                                <div className="col-span-2">
                                    <label className="form-label">Descripción</label>
                                    <textarea
                                        {...register('description')}
                                        className="form-textarea"
                                        rows={3}
                                        placeholder="Descripción detallada del producto, ingredientes destacados, etc."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Section: Image & Type */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">
                                <ImageIcon className="w-5 h-5 text-primary-500" />
                                <h3>Imagen y Categoría</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="form-label">URL de Imagen</label>
                                        <div className="relative">
                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                {...register('imageUrl')}
                                                className="form-input pl-10"
                                                placeholder="https://ejemplo.com/imagen.jpg"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Pega la URL de una imagen para previsualizarla.</p>
                                    </div>

                                    <div>
                                        <label className="form-label">Tipo de Producto</label>
                                        <select {...register('type')} className="form-select">
                                            <option value={ProductType.PRODUCTO_TERMINADO}>Producto Terminado (Venta)</option>
                                            <option value={ProductType.INSUMO}>Insumo (Materia Prima)</option>
                                            <option value={ProductType.SEMI_ELABORADO}>Semi Elaborado (Base)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-center items-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 h-48 overflow-hidden">
                                    {imageUrlValue ? (
                                        <img
                                            src={imageUrlValue}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Error+de+Imagen';
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <span className="text-sm">Vista previa de imagen</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section: Pricing & Inventory */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">
                                <DollarSign className="w-5 h-5 text-primary-500" />
                                <h3>Precios e Inventario</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="form-label">Precio Venta</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('salePrice', { required: true, min: 0 })}
                                            className="form-input pl-8"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label">Costo Producción</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('costPrice', { required: true, min: 0 })}
                                            className="form-input pl-8"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label">Stock Actual</label>
                                    <input
                                        type="number"
                                        step="any"
                                        {...register('currentStock', { required: true, min: 0 })}
                                        className="form-input"
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Stock Mínimo</label>
                                    <input
                                        type="number"
                                        step="any"
                                        {...register('minStock', { required: true, min: 0 })}
                                        className="form-input"
                                    />
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="form-label">Unidad de Medida</label>
                                    <select {...register('measureUnit')} className="form-select">
                                        <option value={MeasureUnit.UN}>Unidad (UN)</option>
                                        <option value={MeasureUnit.KG}>Kilogramo (KG)</option>
                                        <option value={MeasureUnit.GR}>Gramo (GR)</option>
                                        <option value={MeasureUnit.LT}>Litro (LT)</option>
                                        <option value={MeasureUnit.ML}>Mililitro (ML)</option>
                                        <option value={MeasureUnit.DOC}>Docena (DOC)</option>
                                        <option value={MeasureUnit.PZA}>Pieza (PZA)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Recipe Section */}
                        {showRecipe && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <ChefHat className="w-5 h-5 text-primary-500" />
                                        <h3>Receta / Insumos</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => append({ ingredientId: '', quantity: 1, unit: MeasureUnit.GR })}
                                        className="btn btn-sm btn-outline text-primary-600 hover:bg-primary-50 flex items-center gap-1 text-sm py-1.5 px-3 rounded-lg border-primary-200"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Agregar Insumo
                                    </button>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
                                    {fields.length === 0 && (
                                        <div className="text-center py-8">
                                            <Layers className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500 italic">No hay insumos agregados a la receta.</p>
                                            <p className="text-xs text-gray-400">Agrega los ingredientes necesarios para este producto.</p>
                                        </div>
                                    )}

                                    {fields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-12 gap-4 items-end bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                            <div className="col-span-5">
                                                <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wider">Insumo</label>
                                                <select
                                                    {...register(`recipe.ingredients.${index}.ingredientId` as const, { required: true })}
                                                    className="form-select text-sm py-2"
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {ingredients?.data?.map((ing: any) => (
                                                        <option key={ing.id} value={ing.id}>
                                                            {ing.name} ({ing.measureUnit})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-3">
                                                <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wider">Cantidad</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    {...register(`recipe.ingredients.${index}.quantity` as const, { required: true, min: 0.001 })}
                                                    className="form-input text-sm py-2"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wider">Unidad</label>
                                                <select
                                                    {...register(`recipe.ingredients.${index}.unit` as const)}
                                                    className="form-select text-sm py-2"
                                                >
                                                    <option value={MeasureUnit.KG}>KG</option>
                                                    <option value={MeasureUnit.GR}>GR</option>
                                                    <option value={MeasureUnit.LT}>LT</option>
                                                    <option value={MeasureUnit.ML}>ML</option>
                                                    <option value={MeasureUnit.UN}>UN</option>
                                                </select>
                                            </div>
                                            <div className="col-span-1 flex justify-center pb-1">
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                    title="Eliminar insumo"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-outline bg-white hover:bg-gray-100 text-gray-700 border-gray-300 px-6"
                        disabled={mutation.isPending}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform hover:-translate-y-0.5 transition-all"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
                    </button>
                </div>
            </div>
        </div>
    );
}
