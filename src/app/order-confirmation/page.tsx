import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

interface OrderConfirmationPageProps {
    searchParams: Promise<{
        orderId?: string;
    }>;
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect('/login');
    }

    const { orderId } = await searchParams;
    if (!orderId) {
        notFound();
    }

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            orderProducts: {
                include: {
                    product: true,
                },
            },
        },
    });


    if (!order || order.userId !== session.user.id) {
        notFound();
    }

    const subtotal = new Number(order.total).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    const shippingAddress = order.shippingAddress as { street?: string, number?: string, city?: string, state?: string };


    return (
        <main className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-3xl font-bold tracking-tight text-green-600 mb-2">Obrigado pela sua compra!</h1>
                <p className="text-lg text-muted-foreground">O seu pedido foi confirmado com sucesso.</p>
                <p className="text-sm text-muted-foreground mt-4">Número do Pedido: {order.id}</p>
            </div>

            <div className="max-w-4xl mx-auto mt-10 border rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold">Resumo do Pedido</h2>

                <div className="space-y-4">
                    {order.orderProducts.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 flex-shrink-0">
                                <Image src={item.product.image} alt={item.product.name} fill className="rounded-md object-cover" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                            </div>
                            <p className="font-medium">
                                {new Number(item.priceAtPurchase).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    ))}
                </div>

                <Separator />

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Entrega</span>
                        <span>Grátis</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{subtotal}</span>
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
                    <div className="text-sm text-muted-foreground">
                        <p>{shippingAddress.street}, {shippingAddress.number}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state}</p>
                    </div>
                </div>
            </div>
            <div className="text-center mt-8">
                <Button asChild>
                    <Link href="/shop">Continuar a Comprar</Link>
                </Button>
            </div>
        </main>
    );
}