import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
    try {
        const existingProducts = await prisma.product.count();
        if (existingProducts > 0) {
            return NextResponse.json({
                message: 'Seed já foi executado - produtos já existem',
                count: existingProducts
            });
        }

        const products = await prisma.product.createMany({
            data: [
                {
                    name: 'Vela Lavanda Relaxante',
                    description: 'Perfeita para relaxar após um dia longo.',
                    price: 29.90,
                    image: 'https://drive.google.com/uc?export=view&id=1H9vRD9R3MmRhYtuqdOVMxfC0Qg0adk--',
                    stock: 10,
                },
                {
                    name: 'Vela Baunilha Doce',
                    description: 'Aroma doce e acolhedor de baunilha.',
                    price: 24.90,
                    image: 'https://drive.google.com/uc?export=view&id=1M4BJ5l1GYUDdBmXw7DONtHVz2V-GZOzp',
                    stock: 15,
                },
                {
                    name: 'Vela Canela & Maçã',
                    description: 'Mistura quente e acolhedora.',
                    price: 27.90,
                    image: 'https://drive.google.com/uc?export=view&id=1YmRXgKtG1SVczQiY6apudgtw5WWMoqfw',
                    stock: 8,
                },
                {
                    name: 'Vela Eucalipto Refrescante',
                    description: 'Refresca e purifica o ambiente.',
                    price: 25.90,
                    image: 'https://drive.google.com/uc?export=view&id=1453MgL8xMJVsfCgdq9loUMBrlm545t2m',
                    stock: 12,
                },
                {
                    name: 'Vela Jasmim Floral',
                    description: 'Aroma suave e elegante de jasmim.',
                    price: 28.90,
                    image: 'https://drive.google.com/uc?export=view&id=1k25MKhS3xxUEgfvLvvhveHA0QSDj4b7H',
                    stock: 9,
                },
                {
                    name: 'Vela Rosas Vermelhas',
                    description: 'Romântica e clássica.',
                    price: 32.90,
                    image: 'https://drive.google.com/uc?export=view&id=1Sk5l_TschTQXScm3WkAdmClykfc_eax-',
                    stock: 6,
                },
                {
                    name: 'Vela Oceano Fresco',
                    description: 'Sinta a brisa do mar dentro de casa.',
                    price: 26.90,
                    image: 'https://drive.google.com/uc?export=view&id=1unt8Mw1dllLrueMEyX6shxIR1l229_3z',
                    stock: 11,
                },
                {
                    name: 'Vela Capim-Limão',
                    description: 'Cítrica e energizante.',
                    price: 23.90,
                    image: 'https://drive.google.com/uc?export=view&id=13PA3XxyC3UXOAXygh9JeKf6BYbNRd_UC',
                    stock: 14,
                },
                {
                    name: 'Vela Café Torrado',
                    description: 'Cheirinho de café fresco.',
                    price: 27.50,
                    image: 'https://drive.google.com/uc?export=view&id=1cuud1ORuoZNH2nrnXFz9FKwuXtXg2T4B',
                    stock: 7,
                },
                {
                    name: 'Vela Pinho Natural',
                    description: 'Aroma de floresta natural.',
                    price: 26.00,
                    image: 'https://drive.google.com/uc?export=view&id=1Zr-16ic_wQY3IchQPBrWG-CgnvaGTJYG',
                    stock: 10,
                },
                {
                    name: 'Vela Chocolate Quente',
                    description: 'Aconchegante como uma bebida quente.',
                    price: 29.00,
                    image: 'https://drive.google.com/uc?export=view&id=1hvdnMO4uuABSF7yMOFsruv-MwMO_0UQ8',
                    stock: 5,
                },
                {
                    name: 'Vela Frutas Vermelhas',
                    description: 'Doce e frutada.',
                    price: 24.50,
                    image: 'https://drive.google.com/uc?export=view&id=1FmJeIUHwADzOX86VK58CGijAdMFgrAqz',
                    stock: 13,
                }

            ],
        });

        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@email.com' }
        });

        if (!existingAdmin) {
            const bcrypt = await import('bcryptjs');
            const hashedPassword = await bcrypt.hash('Admin@1234', 12);

            await prisma.user.create({
                data: {
                    name: 'Administrador',
                    email: 'admin@email.com',
                    password: hashedPassword,
                    admin: true,
                }
            });
        }

        return NextResponse.json({
            message: 'Seed executado com sucesso!',
            productsCreated: products.count,
            adminCreated: !existingAdmin
        });

    } catch (error) {
        console.error('Erro no seed:', error);
        return NextResponse.json({
            error: 'Falha ao executar seed',
            details: error instanceof Error ? error.message : 'Erro desconhecido'
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET() {
    try {
        const productCount = await prisma.product.count();
        const userCount = await prisma.user.count();

        return NextResponse.json({
            products: productCount,
            users: userCount,
            needsSeed: productCount === 0
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({
            error: 'Erro ao verificar status'
        }, { status: 500 });
    }
}