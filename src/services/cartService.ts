import prisma from "@/lib/prisma";
import { CartItem } from "@/types/cardItem";

export async function processCart(items: CartItem[]) {
    const productIds = items.map(item => item.productId);
    const productsFromDb = await prisma.product.findMany({
        where: { id: { in: productIds } },
    });

    if (productsFromDb.length !== productIds.length) {
        return { error: "Um ou mais produtos não foram encontrados.", status: 404, products: null, total: null };
    }

    let total = 0;
    for (const item of items) {
        const product = productsFromDb.find(p => p.id === item.productId)!;
        if (product.stock < item.quantity) {
            return { error: `Estoque insuficiente para o produto: ${product.name}`, status: 409, products: null, total: null };
        }
        total += product.price.toNumber() * item.quantity;
    }

    return { products: productsFromDb, total, error: null };
}