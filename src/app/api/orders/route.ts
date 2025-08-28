import { createOrderSchema } from "@/lib/schemas/orderValidation";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/lib/erorrHandler";
import { processCart } from "@/services/cartService";
import { createOrderInDb } from "@/services/orderService";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { handleZodValidationError } from "@/lib/validationError";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                orderProducts: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            }
        });
        return NextResponse.json(orders, { status: 200 });

    } catch (error) {
        return errorHandler(error, '[API_ORDERS_GET]');
    }
}


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }
        const userId = session.user.id;

        const body = await request.json();
        const validation = createOrderSchema.safeParse(body);
        if (!validation.success) {
            return handleZodValidationError(validation.error);
        }
        const { items, addressId } = validation.data;

        const address = await prisma.address.findUnique({ where: { id: addressId } });
        if (!address || address.userId !== userId) {
            return NextResponse.json({ message: "Endereço inválido ou não pertence ao usuário." }, { status: 403 });
        }

        const cartResult = await processCart(items);
        if (cartResult.error) {
            return NextResponse.json({ message: cartResult.error }, { status: cartResult.status as number });
        }

        const newOrder = await createOrderInDb({
            userId,
            total: cartResult.total!,
            shippingAddress: address,
            items,
            productsFromDb: cartResult.products!,
        });

        return NextResponse.json(newOrder, { status: 201 });

    } catch (error) {
        return errorHandler(error, '[API_ORDERS_POST]');
    }
}