'use client';

import { ProductFromDb } from "@/types/cardItem";
import { Button } from "@/components/ui/button";
import { Card, } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import ProductImage from "../shared/ProductImage";

type DetailedCartItem = {
    product: ProductFromDb;
    quantity: number;
};

interface CartItemProps {
    item: DetailedCartItem;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onRemoveItem: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
    return (
        <Card className="flex items-center p-4 gap-4 justify-between">
            <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 flex-shrink-0">
                    <ProductImage
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
                <div>
                    <h3 className="font-medium text-base">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">{Number(item.product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{item.quantity}</span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                >
                    <Plus className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveItem(item.product.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    );
}