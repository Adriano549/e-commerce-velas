'use client';

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface AddToCartButtonProps extends React.ComponentProps<typeof Button> {
    productId: string;
    productName: string;
    stock: number;
}

export default function AddToCartButton({ productId, productName, stock, ...props }: AddToCartButtonProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    const isOutOfStock = stock === 0;

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        addToCart(productId);
        toast.success(`${productName} foi adicionado ao carrinho!`);
    };

    return (
        <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            {...props}
        >
            {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </Button>
    );
}