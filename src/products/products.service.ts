import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto';
import { ProductType } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateProductDto) {
        // Verificar SKU único
        const existing = await this.prisma.product.findUnique({
            where: { sku: dto.sku },
        });

        if (existing) {
            throw new BadRequestException('El SKU ya existe');
        }

        // Validar que productos terminados tengan precio de venta
        if (dto.type === ProductType.PRODUCTO_TERMINADO && !dto.salePrice) {
            throw new BadRequestException(
                'Los productos terminados deben tener precio de venta',
            );
        }

        const { recipe, images, ...productData } = dto;

        return this.prisma.product.create({
            data: {
                ...productData,
                recipe: recipe ? {
                    create: {
                        name: `Receta de ${productData.name}`,
                        yieldQuantity: 1,
                        yieldUnit: productData.measureUnit,
                        ingredients: {
                            create: recipe.ingredients.map(i => ({
                                ingredientId: i.ingredientId,
                                quantity: i.quantity,
                                unit: i.unit,
                            })),
                        },
                    },
                } : undefined,
                images: images ? {
                    create: images.map(img => ({
                        url: img.url,
                        isPrimary: img.isPrimary || false,
                    })),
                } : undefined,
            },
            include: {
                category: true,
                images: true,
                recipe: {
                    include: {
                        ingredients: true
                    }
                }
            },
        });
    }

    async findAll(filters: ProductFilterDto) {
        const { page = 1, limit = 20, type, isActive, isFeatured, categoryId, search } = filters;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (type) where.type = type;
        if (typeof isActive === 'boolean') where.isActive = isActive;
        if (typeof isFeatured === 'boolean') where.isFeatured = isFeatured;
        if (categoryId) where.categoryId = categoryId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    category: true,
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                    _count: {
                        select: {
                            orderItems: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
                recipe: {
                    include: {
                        ingredients: {
                            include: {
                                ingredient: true,
                            },
                        },
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        return product;
    }

    async update(id: string, dto: UpdateProductDto) {
        await this.findOne(id);

        if (dto.sku) {
            const existing = await this.prisma.product.findFirst({
                where: { sku: dto.sku, NOT: { id } },
            });
            if (existing) {
                throw new BadRequestException('El SKU ya existe');
            }
        }

        const { recipe, images, ...productData } = dto;

        // If recipe is provided, we need to handle it carefully
        if (recipe) {
            // First check if product has a recipe
            const currentProduct = await this.findOne(id);

            if (currentProduct.recipe) {
                // Delete existing ingredients
                await this.prisma.recipeIngredient.deleteMany({
                    where: { recipeId: currentProduct.recipe.id }
                });

                // Add new ingredients
                await this.prisma.recipeIngredient.createMany({
                    data: recipe.ingredients.map(i => ({
                        recipeId: currentProduct.recipe.id,
                        ingredientId: i.ingredientId,
                        quantity: i.quantity,
                        unit: i.unit,
                    }))
                });
            } else {
                // Create new recipe
                await this.prisma.recipe.create({
                    data: {
                        productId: id,
                        name: `Receta de ${productData.name || currentProduct.name}`,
                        yieldQuantity: 1,
                        yieldUnit: productData.measureUnit || currentProduct.measureUnit,
                        ingredients: {
                            create: recipe.ingredients.map(i => ({
                                ingredientId: i.ingredientId,
                                quantity: i.quantity,
                                unit: i.unit,
                            })),
                        }
                    }
                });
            }
        }

        return this.prisma.product.update({
            where: { id },
            data: {
                ...productData,
                images: images ? {
                    deleteMany: {},
                    create: images.map(img => ({
                        url: img.url,
                        isPrimary: img.isPrimary || false,
                    })),
                } : undefined,
            },
            include: {
                category: true,
                images: true,
                recipe: {
                    include: {
                        ingredients: true
                    }
                }
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        // Soft delete
        return this.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async getFeatured() {
        return this.prisma.product.findMany({
            where: {
                isActive: true,
                isFeatured: true,
                type: ProductType.PRODUCTO_TERMINADO,
            },
            include: {
                category: true,
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
            },
            take: 10,
        });
    }

    async getLowStock() {
        const products = await this.prisma.product.findMany({
            where: {
                isActive: true,
                minStock: { not: null },
            },
        });

        return products
            .filter(p => p.currentStock <= (p.minStock || 0))
            .sort((a, b) => a.currentStock - b.currentStock);
    }
}
