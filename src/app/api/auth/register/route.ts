import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/schemas/creatUserValidation";
import { handleZodValidationError } from "@/lib/validationError";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return handleZodValidationError(validation.error);
        }

        const { name, email, password } = validation.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ error: "Usuario ja existente" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        return NextResponse.json(
            {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                },
                message: 'Usuário criado com sucesso!',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('ERRO NO REGISTRO:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}