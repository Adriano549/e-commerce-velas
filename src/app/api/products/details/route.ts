import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { errorHandler } from "@/lib/erorrHandler";

const schema = z.object({
    ids: z.array(z.uuid()),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = schema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "IDs de produto inválidos" }, { status: 400 });
        }

        const { ids } = validation.data;

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        return errorHandler(error, '[API_PRODUCTS_DETAILS_POST]');
    }
}