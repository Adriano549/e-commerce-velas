'use client';

import { useEffect, useMemo, useState, useCallback } from "react";
import { useCartStore } from "@/store/cartStore";
import { ProductFromDb } from "@/types/cardItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CartItem } from "./cardItem";
import { OrderSummary } from "./OrderSumary";

export default function CartPageClient() {
    const { items, removeFromCart, updateQuantity } = useCartStore();
    const [productDetails, setProductDetails] = useState<Record<string, ProductFromDb>>({});
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);


    const productIds = useMemo(() => {
        return Array.from(new Set(items.map(item => item.productId)));
    }, [items]);

    const fetchProductDetails = useCallback(async (ids: string[]) => {
        if (ids.length === 0) {
            setProductDetails({});
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await fetch('/api/products/details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids }),
            });

            if (!response.ok) throw new Error("Falha ao buscar detalhes dos produtos.");

            const products: ProductFromDb[] = await response.json();

            const productsMap = products.reduce((acc, product) => {
                acc[product.id] = product;
                return acc;
            }, {} as Record<string, ProductFromDb>);

            setProductDetails(productsMap);

        } catch (error) {
            console.error(error);
            setProductDetails({});
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
        if (!isClient) return;

        const missingIds = productIds.filter(id => !productDetails[id]);

        if (missingIds.length > 0) {
            fetchProductDetails(productIds);
        } else if (productIds.length === 0) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [isClient, fetchProductDetails, productIds, productDetails]);

    const detailedItems = useMemo(() => {
        return items.map(item => ({
            product: productDetails[item.productId],
            quantity: item.quantity,
        })).filter(item => item.product);
    }, [items, productDetails]);

    const subtotal = useMemo(() => {
        return detailedItems.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
    }, [detailedItems]);

    if (!isClient || loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-4">A carregar carrinho...</span>
            </div>
        );
    }

    if (detailedItems.length === 0) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">O seu carrinho está vazio</h1>
                <Button asChild>
                    <Link href="/velas">Continuar a comprar</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold mb-6">Meu Carrinho</h1>
                <div className="space-y-4">
                    {detailedItems.map(item => (
                        <CartItem
                            key={item.product.id}
                            item={item}
                            onUpdateQuantity={updateQuantity}
                            onRemoveItem={removeFromCart}
                        />
                    ))}
                </div>
            </div>
            <div className="lg:col-span-1 sticky top-24">
                <OrderSummary subtotal={subtotal} />
            </div>
        </div>
    );
}