import { z } from "zod";

enum StatusPedido {
    PENDENTE = 'PENDENTE',
    PROCESSANDO = 'PROCESSANDO',
    ENVIADO = 'ENVIADO',
    ENTREGUE = 'ENTREGUE',
    CANCELADO = 'CANCELADO'
}

const orderItemSchema = z.object({
    productId: z.uuid("ID do produto inválido."),
    quantity: z.number().int().positive("A quantidade deve ser no mínimo 1."),
});

export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1, "O pedido deve conter ao menos um item."),
    addressId: z.uuid("ID do endereço inválido.")
})

export const updateOrderSchema = z.object({
    status: z.enum(StatusPedido, "Status do pedido inválido."),
});