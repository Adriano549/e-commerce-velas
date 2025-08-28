import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { errorHandler } from "@/lib/erorrHandler";
import { updateOrderSchema } from "@/lib/schemas/orderValidation";
import { handleZodValidationError } from "@/lib/validationError";

interface RouteContext {
    params: Promise<{ id: string }>;
}
export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                orderProducts: {
                    include: { product: true },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ message: "Pedido não encontrado" }, { status: 404 });
        }

        if (order.userId !== session.user.id && !session.user.admin) {
            return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        return errorHandler(error, `[ORDERS_GET_BY_ID]`);
    }
}

export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }
        if (!session?.user?.admin) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
        }

        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            return NextResponse.json({ message: "Pedido não encontrado" }, { status: 404 });
        }

        const body = await request.json();
        const validation = updateOrderSchema.safeParse(body);
        if (!validation.success) {
            return handleZodValidationError(validation.error)
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: validation.data.status,
            },
        });

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        return errorHandler(error, `[ORDERS_PUT]`);
    }
}