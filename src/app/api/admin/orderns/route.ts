// src/app/api/admin/orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { errorHandler } from "@/lib/erorrHandler";


export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.admin) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
        }

        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(orders, { status: 200 });

    } catch (error) {
        return errorHandler(error, '[API_ADMIN_ORDERS_GET]');
    }
}