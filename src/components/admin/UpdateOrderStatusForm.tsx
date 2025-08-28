'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StatusPedido } from '@prisma/client';
import { toast } from 'sonner';

interface UpdateOrderStatusFormProps {
    orderId: string;
    currentStatus: StatusPedido;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function UpdateOrderStatusForm({
    orderId,
    currentStatus,
    onSuccess,
    onCancel,
}: UpdateOrderStatusFormProps) {
    const [newStatus, setNewStatus] = useState<StatusPedido>(currentStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Falha ao atualizar o status.');
            }
            toast.success("Status do pedido atualizado com sucesso!");
            onSuccess();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-4 space-y-6">
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as StatusPedido)}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                    {Object.values(StatusPedido).map((status) => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="flex justify-end gap-4">
                <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={isLoading || newStatus === currentStatus}>
                    {isLoading ? 'A guardar...' : 'Guardar Alterações'}
                </Button>
            </div>
        </div>
    );
}