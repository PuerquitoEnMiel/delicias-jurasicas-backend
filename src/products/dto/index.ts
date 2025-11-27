import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, Min, ValidateNested } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { ProductType, MeasureUnit } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateRecipeDto {
    @ApiProperty()
    @IsOptional()
    ingredients: {
        ingredientId: string;
        quantity: number;
        unit: MeasureUnit;
    }[];
}

export class CreateProductImageDto {
    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isPrimary?: boolean;
}

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    sku: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: ProductType })
    @IsEnum(ProductType)
    type: ProductType;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    currentStock?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minStock?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    maxStock?: number;

    @ApiProperty({ enum: MeasureUnit })
    @IsEnum(MeasureUnit)
    measureUnit: MeasureUnit;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    salePrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    costPrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    recipe?: CreateRecipeDto;

    @ApiProperty({ required: false, type: [CreateProductImageDto] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateProductImageDto)
    images?: CreateProductImageDto[];
}



export class UpdateProductDto extends CreateProductDto { }

export class ProductFilterDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({ enum: ProductType, required: false })
    @IsOptional()
    @IsEnum(ProductType)
    type?: ProductType;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Boolean)
    isActive?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Boolean)
    isFeatured?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string;
}
