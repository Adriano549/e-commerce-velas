// src/components/checkout/CheckoutClient.tsx
'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { AddressFromDb, ProductFromDb } from "@/types/cardItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";



interface CheckoutClientProps {
    addresses: AddressFromDb[];
}

export default function CheckoutClient({ addresses }: CheckoutClientProps) {
    const router = useRouter();
    const { items, clearCart } = useCartStore();

    const [productDetails, setProductDetails] = useState<Record<string, ProductFromDb>>({});
    const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(
        addresses.length > 0 ? addresses[0].id : undefined
    );
    const [error, setError] = useState<string | null>(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Busca os detalhes dos produtos no carrinho
    useEffect(() => {
        const fetchDetails = async () => {
            if (items.length === 0) return;
            const productIds = items.map(item => item.productId);
            const response = await fetch('/api/products/details', {
                method: 'POST',
                body: JSON.stringify({ ids: productIds })
            });
            const products: ProductFromDb[] = await response.json();
            const productsMap = products.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
            setProductDetails(productsMap);
        };
        fetchDetails();
    }, [items]);

    const detailedItems = useMemo(() => items.map(item => ({
        product: productDetails[item.productId],
        quantity: item.quantity,
    })).filter(item => item.product), [items, productDetails]);

    const subtotal = useMemo(() => detailedItems.reduce((acc, item) =>
        acc + Number(item.product.price) * item.quantity, 0), [detailedItems]);

    const handlePlaceOrder = async () => {
        setError(null);
        if (!selectedAddressId) {
            setError("Por favor, selecione um endereço de entrega.");
            return;
        }
        if (detailedItems.length === 0) {
            setError("O seu carrinho está vazio.");
            return;
        }
        setIsPlacingOrder(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items,
                    addressId: selectedAddressId,
                })
            });

            const newOrder = await response.json();

            if (!response.ok) {
                throw new Error(newOrder.message || 'Falha ao criar o pedido.');
            }


            clearCart();
            router.push(`/order-confirmation?orderId=${newOrder.id}`);

        } catch (err) {
            if (err instanceof Error) setError(err.message);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Coluna Esquerda: Endereço e Itens */}
            <div className="lg:col-span-2 space-y-8">
                {/* Seleção de Endereço */}
                <div>
                    <h1 className="text-2xl font-bold mb-4">Endereço de Entrega</h1>
                    {addresses.length > 0 ? (
                        <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                            {addresses.map(addr => (
                                <Label key={addr.id} htmlFor={addr.id} className="flex items-center p-4 border rounded-md cursor-pointer">
                                    <RadioGroupItem value={addr.id} id={addr.id} />
                                    <span className="ml-4 text-sm">
                                        {addr.street}, {addr.number} <br />
                                        {addr.city}, {addr.state} - {addr.zipCode}
                                    </span>
                                </Label>
                            ))}
                        </RadioGroup>
                    ) : (
                        <p className="text-muted-foreground">Você ainda não tem endereços guardados. <Link href="/profile" className="underline">Adicione um no seu perfil.</Link></p>
                    )}
                </div>

                {/* Revisão dos Itens */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Revisar Itens</h2>
                    <div className="space-y-4">
                        {detailedItems.map(item => (
                            <div key={item.product.id} className="flex items-center gap-4">
                                <Image src={item.product.image} alt={item.product.name} width={64} height={64} className="rounded-md object-cover" />
                                <div className="flex-grow">
                                    <p>{item.product.name}</p>
                                    <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                                </div>
                                <p>{(Number(item.product.price) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Coluna Direita: Resumo Final */}
            <div className="lg:col-span-1 sticky top-24">
                <Card>
                    <CardHeader><CardTitle>Resumo Final</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between font-bold text-lg border-t pt-4">
                            <span>Total</span>
                            <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button onClick={handlePlaceOrder} disabled={isPlacingOrder || detailedItems.length === 0} className="w-full" size="lg">
                            {isPlacingOrder ? "A processar..." : "Confirmar e Pagar"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}