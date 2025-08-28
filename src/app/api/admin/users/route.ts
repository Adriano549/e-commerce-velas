import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { errorHandler } from "@/lib/erorrHandler";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.admin) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
        }

        const users = await prisma.user.findMany();
        return NextResponse.json(users);

    } catch (error) {
        return errorHandler(error, '[API_ADMIN_ORDERS_GET]');
    }
}