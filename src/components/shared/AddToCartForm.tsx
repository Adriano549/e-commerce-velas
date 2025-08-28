'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';
import { ProductFromDb } from '@/types/cardItem';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface AddToCartFormProps {
    product: ProductFromDb;
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
    const [quantity, setQuantity] = useState(1);
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product.id);
        }
        toast.success(`${quantity} x ${product.name} adicionado(s) ao carrinho!`);
    };

    const handleQuantityChange = (amount: number) => {
        setQuantity((prevQuantity) => {
            const newQuantity = prevQuantity + amount;
            if (newQuantity < 1) return 1;
            if (newQuantity > product.stock) return product.stock;

            return newQuantity;
        });
    };

    return (
        <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">Quantidade:</p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-16 text-center"
                    min={1}
                    max={product.stock}
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                >
                    <Plus className="h-4 w-4" />
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                    {quantity >= product.stock && "Limite de estoque atingido"}
                </p>
            </div>
            <Button
                size="lg"
                className="w-full mt-4"
                onClick={handleAddToCart}
                type="button"
                disabled={product.stock === 0}
            >
                {product.stock === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
            </Button>
        </div>
    );
}