import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { errorHandler } from '@/lib/erorrHandler';
import { findProductById } from '@/services/productService';
import { updateProductSchema } from '@/lib/schemas/ProductValidation';
import { verifyAdminSession } from '@/lib/session';
import { handleZodValidationError } from '@/lib/validationError';


interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function GET(
    request: NextRequest,
    context: RouteContext) {
    try {
        const { id } = await context.params;
        console.log(id, 'teste id');


        if (!id) {
            return NextResponse.json({ message: 'ID do produto não fornecido.' }, { status: 400 });
        }
        const product = await findProductById(id);
        if (!product) {
            return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        return errorHandler(error, `[PRODUCTS_GET_BY_ID] ${context.params}`);
    }
}

export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    const { id } = await context.params;
    try {
        const adminCheck = await verifyAdminSession();
        if (!adminCheck.authorized) {
            return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
        }

        const product = await findProductById(id);
        if (!product) {
            return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
        }
        const body = await request.json();
        const validation = updateProductSchema.safeParse(body);
        if (!validation.success) {
            return handleZodValidationError(validation.error);
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: validation.data,
        });
        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        return errorHandler(error, `[PRODUCTS_PUT: ${id}]`);
    }
}

export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {

    try {
        const { id } = await context.params;

        const adminCheck = await verifyAdminSession();
        if (!adminCheck.authorized) {
            return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
        }

        const product = await findProductById(id);
        if (!product) {
            return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
        }
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ message: 'Produto deletado com sucesso' }, { status: 200 });
    } catch (error) {
        return errorHandler(error, `[PRODUCTS_DELETE: ]`);
    }
}