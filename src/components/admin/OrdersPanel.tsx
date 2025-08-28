import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAdminOrders } from "@/services/orderService";
import OrderActions from "./OrderActions";


export default async function AdminOrdersPage() {
    const orders = await getAdminOrders();

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Gerir Pedidos</h1>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pedido ID</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead><span className="sr-only">Ações</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.id.substring(0, 8)}...</TableCell>
                                <TableCell>{order.user.name || order.user.email}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                                <TableCell><Badge>{order.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    {new Number(order.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </TableCell>
                                <TableCell>
                                    <OrderActions
                                        orderId={order.id}
                                        currentStatus={order.status}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}