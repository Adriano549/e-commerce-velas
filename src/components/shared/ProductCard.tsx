'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ProductFromDb } from "@/types/cardItem";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
    product: ProductFromDb;
}

export default function ProductCard({ product }: ProductCardProps) {

    const price = new Number(product.price).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="relative h-60 w-full overflow-hidden rounded-md">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <CardTitle>{product.name}</CardTitle>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
                <p className="text-2xl font-bold">{price}</p>
                <div className="flex w-full  gap-1">
                    <Button asChild variant="secondary" size="sm" className="flex-1 text-xs">
                        <Link href={`/shop/${product.id}`}>Ver Detalhes</Link>
                    </Button>
                    <AddToCartButton
                        productId={product.id}
                        productName={product.name}
                        stock={product.stock}
                        size="sm"
                        className="flex-1 text-xs"
                    />
                </div>
            </CardFooter>
        </Card>
    );
}