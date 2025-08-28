'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoreHorizontal } from 'lucide-react';
import { StatusPedido } from '@prisma/client';
import UpdateOrderStatusForm from './UpdateOrderStatusForm';


interface OrderActionsProps {
    orderId: string;
    currentStatus: StatusPedido;
}

export default function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSuccess = () => {
        setIsDialogOpen(false);
        router.refresh();
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                        Mudar Status
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Atualizar Status do Pedido</DialogTitle>
                    </DialogHeader>
                    <UpdateOrderStatusForm
                        orderId={orderId}
                        currentStatus={currentStatus}
                        onSuccess={handleSuccess}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}