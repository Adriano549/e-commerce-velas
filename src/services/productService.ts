import prisma from "@/lib/prisma"
import { ProductFromDb } from "@/types/cardItem";

export async function findProductById(id: string) {
    const product = await prisma.product.findUnique({
        where: {
            id
        },
    });
    return product
}

export async function getProducts(
    query?: string | null,
    page: number = 1
): Promise<{ products: ProductFromDb[], total: number, totalPages: number, currentPage: number }> {
    try {
        const url = new URL(`${process.env.NEXTAUTH_URL}/api/products`);
        if (query) {
            url.searchParams.set('q', query);
        }
        url.searchParams.set('page', String(page));
        url.searchParams.set('limit', '8');

        const response = await fetch(url, {
            cache: 'no-store',
        });
        if (!response.ok) {
            throw new Error('Falha ao buscar produtos.');
        }

        return response.json();
    } catch (error) {
        console.error("Erro no getProducts:", error);
        return { products: [], total: 0, totalPages: 0, currentPage: 1 };
    }
}

export async function getProductById(id: string): Promise<ProductFromDb | null> {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${id}`, {
            cache: 'no-store',
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error('Falha ao buscar o produto.');
        }

        return response.json();
    } catch (error) {
        console.error("Erro no getProductById:", error);
        return null;
    }
}