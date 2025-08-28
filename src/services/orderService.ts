import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AddressFromDb, CartItem, ProductFromDb } from "@/types/cardItem";
import { getServerSession } from "next-auth";

interface CreateOrderData {
    userId: string;
    total: number;
    shippingAddress: AddressFromDb;
    items: CartItem[];
    productsFromDb: ProductFromDb[];
}


export async function createOrderInDb(data: CreateOrderData) {
    const { userId, total, shippingAddress, items, productsFromDb } = data;

    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: { userId, total, shippingAddress },
        });

        for (const item of items) {
            const product = productsFromDb.find(p => p.id === item.productId)!;
            await tx.orderProduct.create({
                data: {
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtPurchase: product.price,
                },
            });

            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }
        return order;
    });
}
export async function getOrdersByUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return [];
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
            orderProducts: {
                include: { product: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return orders;
}