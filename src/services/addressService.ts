import prisma from "@/lib/prisma";
import { Address } from "@prisma/client";
import { AddressFromDb } from "@/types/cardItem";


export async function getAddressesByUserId(userId: string): Promise<Address[]> {
    try {
        const addresses = await prisma.address.findMany({
            where: { userId },
        });
        return addresses;
    } catch (error) {
        console.error("Erro ao buscar endereços:", error);
        return [];
    }
}

export async function verifyAddressOwner(userId: string, addressId: string) {
    const address = await prisma.address.findUnique({
        where: { id: addressId },
    });
    if (!address) {
        return { error: "Endereço não encontrado", status: 404 };
    }
    if (address.userId !== userId) {
        return { error: "Não autorizado", status: 403 };
    }
    return { address };
}

type AddressFormData = Omit<AddressFromDb, 'id' | 'userId'>;

export async function deleteAddress(addressId: string) {
    try {
        const response = await fetch(`/api/addresses/${addressId}`, { method: 'DELETE' });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Falha ao apagar o endereço.');
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function createAddress(addressData: AddressFormData) {
    try {
        const response = await fetch('/api/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addressData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.errors ? Object.values(data.errors).join(', ') : 'Falha ao criar endereço');
        }
        return { success: true, data };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
