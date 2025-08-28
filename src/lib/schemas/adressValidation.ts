import { z } from "zod";

export const createAddressSchema = z.object({
    street: z.string("A rua é obrigatória."),
    number: z.string("O número é obrigatório."),
    neighborhood: z.string("O bairro é obrigatório."),
    city: z.string("A cidade é obrigatória."),
    state: z.string("O estado é obrigatório."),
    zipCode: z.string("O CEP é obrigatório."),
    complement: z.string().optional(),
});

export const updateAddressSchema = z.object({
    number: z.string().nonempty("O número é obrigatório.").optional(),
    complement: z.string().optional(),
});