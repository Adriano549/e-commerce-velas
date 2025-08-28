import { Separator } from "@radix-ui/react-dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

interface OrderSummaryProps {
    subtotal: number;
}

export function OrderSummary({ subtotal }: OrderSummaryProps) {
    return (
        <Card>
            <CardHeader><CardTitle>Resumo do Pedido</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Entrega</span>
                    <span>Grátis</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Finalizar Compra</Link>
                </Button>
            </CardContent>
        </Card>
    );
}