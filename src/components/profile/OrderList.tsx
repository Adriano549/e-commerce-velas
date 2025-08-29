import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { DetailedOrder } from "@/types/cardItem";
import { Separator } from "@/components/ui/separator";
import ProductImage from "../shared/ProductImage";

interface OrderListProps {
    orders: DetailedOrder[];
}

export default function OrderList({ orders }: OrderListProps) {
    if (orders.length === 0) {
        return <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>;
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {orders.map((order) => {
                const orderDate = new Date(order.createdAt).toLocaleDateString('pt-BR');
                const total = new Number(order.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                const shippingAddress = order.shippingAddress as { street?: string, city?: string };

                return (
                    <AccordionItem value={order.id} key={order.id}>
                        <AccordionTrigger>
                            <div className="flex justify-between w-full pr-4 text-sm text-left">
                                <span className="flex-1">Pedido #{order.id.substring(0, 8)}...</span>
                                <span className="flex-1 hidden md:block">{orderDate}</span>
                                <span className="flex-1 font-bold text-right">{total}</span>
                                <span className="ml-4 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">{order.status}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 space-y-4 bg-muted/50 rounded-b-md">
                            {order.orderProducts.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 flex-shrink-0">
                                        <ProductImage
                                            src={item.product.image}
                                            alt={item.product.name}
                                            fill
                                            className="rounded-md object-cover"
                                        />
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
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">Endereço de Entrega</h4>
                                <p className="text-sm text-muted-foreground">
                                    {shippingAddress.street}, {shippingAddress.city}
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    );
}