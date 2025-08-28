import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { errorHandler } from "@/lib/erorrHandler";
import { createAddressSchema } from "@/lib/schemas/adressValidation";
import { handleZodValidationError } from "@/lib/validationError";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
        });

        return NextResponse.json(addresses, { status: 200 });
    } catch (error) {
        return errorHandler(error, '[API_ADDRESSES_GET]');
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const body = await request.json();
        const validation = createAddressSchema.safeParse(body);
        if (!validation.success) {
            return handleZodValidationError(validation.error);
        }

        const newAddress = await prisma.address.create({
            data: {
                ...validation.data,
                userId: session.user.id,
            }
        });

        return NextResponse.json(newAddress, { status: 201 });
    } catch (error) {
        return errorHandler(error, '[API_ADDRESSES_POST]');
    }
}