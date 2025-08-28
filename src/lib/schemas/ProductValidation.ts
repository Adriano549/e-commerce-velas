import { z } from "zod";

export const productSchema = z.object({
    name: z.string()
        .min(5, "O nome deve ter no mínimo 3 caracteres.")
        .max(50, "O nome deve ter no máximo 50 caracteres."),
    description: z.string()
        .min(10, "Descrição é obrigatória.")
        .max(500, "Descrição não pode exceder 500 caracteres"),
    price: z.number()
        .positive("Preço deve ser um número positivo."),
    image: z.url("URL da imagem deve ser válida."),
    stock: z.number()
        .int("O estoque deve ser um número inteiro.")
        .nonnegative("O estoque não pode ser negativo.")
})

export const updateProductSchema = productSchema.partial()