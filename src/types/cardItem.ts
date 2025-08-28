import { Product, Address, Prisma } from "@prisma/client";

export type CartItem = {
    productId: string;
    quantity: number;
};

export type ProductFromDb = Product;

export type AddressFromDb = Address

const _detailedOrderPayload = Prisma.validator<Prisma.OrderDefaultArgs>()({
    include: {
        orderProducts: {
            include: {
                product: true,
            },
        },
    },
});

export type DetailedOrder = Prisma.OrderGetPayload<typeof _detailedOrderPayload>;