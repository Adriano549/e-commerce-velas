import { authOptions } from "@/lib/auth";
import { errorHandler } from "@/lib/erorrHandler";
import { updateAddressSchema } from "@/lib/schemas/adressValidation";
import { verifyAddressOwner } from "@/services/addressService";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleZodValidationError } from "@/lib/validationError";

interface Params {
    id: string;
}

export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const verification = await verifyAddressOwner(session.user.id, id);
        if (verification.error) {
            return NextResponse.json({ message: verification.error }, { status: verification.status });
        }
        const address = await prisma.address.findUnique({
            where: { id },
        });

        return NextResponse.json(address, { status: 200 });
    } catch (error) {
        return errorHandler(error, `[ADDRESSES_GET_BY_ID]`);
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const verification = await verifyAddressOwner(session.user.id, id);
        if (verification.error) {
            return NextResponse.json({ message: verification.error }, { status: verification.status });
        }

        const body = await request.json();
        const validation = updateAddressSchema.safeParse(body);
        if (!validation.success) {
            return handleZodValidationError(validation.error);
        }

        const updatedAddress = await prisma.address.update({
            where: { id },
            data: validation.data,
        });

        return NextResponse.json(updatedAddress, { status: 200 });
    } catch (error) {
        return errorHandler(error, `[ADDRESSES_PUT]`);
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params
        console.log(id, 'o id');
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }


        const verification = await verifyAddressOwner(session.user.id, id);
        if (verification.error) {
            return NextResponse.json({ message: verification.error }, { status: verification.status });
        }

        await prisma.address.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Endereço apagado com sucesso" }, { status: 200 });
    } catch (error) {
        return errorHandler(error, `[ADDRESSES_DELETE]`);
    }
}