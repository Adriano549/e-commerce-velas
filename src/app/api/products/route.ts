import { errorHandler } from "@/lib/erorrHandler"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/schemas/ProductValidation"
import { verifyAdminSession } from "@/lib/session"
import { handleZodValidationError } from "@/lib/validationError"
import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const sortBy = searchParams.get('sortBy') || 'name_asc';

        const [sortField, sortOrder] = sortBy.split('_') as ['name' | 'price', 'asc' | 'desc'];
        const orderByCondition = { [sortField]: sortOrder };
        const whereCondition: Prisma.ProductWhereInput = query
            ? {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            }
            : {};

        const [products, totalProducts] = await Promise.all([
            prisma.product.findMany({
                where: whereCondition,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: orderByCondition,
            }),
            prisma.product.count({
                where: whereCondition,
            })
        ]);

        return NextResponse.json({
            products,
            total: totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
        }, { status: 200 });
    } catch (error) {
        return errorHandler(error, '[API_PRODUCTS_POST]');
    }
}

export async function POST(req: NextRequest) {
    try {
        const adminCheck = await verifyAdminSession();
        if (!adminCheck.authorized) {
            return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
        }
        const body = await req.json()
        const validation = productSchema.safeParse(body)
        if (!validation.success) {
            return handleZodValidationError(validation.error);
        }

        const NewProduct = await prisma.product.create({
            data: validation.data,
        })
        return NextResponse.json(NewProduct, { status: 201 })
    } catch (error) {
        return errorHandler(error, '[API_PRODUCTS_POST]')
    }
}