import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
    await prisma.product.deleteMany({});

    await prisma.product.createMany({
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
    })
    console.log('Seed finalizado com sucesso!');
}

seed()
    .then(() => {
        console.log('Velas inseridas com sucesso!');
        prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });