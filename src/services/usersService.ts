import prisma from "@/lib/prisma";


export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                email: true,
                admin: true,
                createdAt: true,
            }
        });
        return users;
    } catch (error) {
        console.error("Falha ao buscar utilizadores:", error);
        return [];
    }
}