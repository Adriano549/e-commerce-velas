'use client';

import { useState } from 'react';
import { AddressFromDb } from '@/types/cardItem';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import AddressList from '../profile/AddressList';
import AddressForm from '../profile/AddressForm';
import { deleteAddress } from '@/services/addressService';
import { toast } from 'sonner';

interface AddressManagerProps {
    initialAddresses: AddressFromDb[];
}

export default function AddressManager({ initialAddresses }: AddressManagerProps) {
    const [addresses, setAddresses] = useState<AddressFromDb[]>(initialAddresses);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressFromDb | null>(null);

    const handleDelete = async (addressId: string) => {
        const result = await deleteAddress(addressId);
        if (result.success) {
            setAddresses(current => current.filter(addr => addr.id !== addressId));
            toast.success("Endereço apagado com sucesso!");
        } else {
            toast.error(result.error);
        }
    };

    const handleOpenEdit = (address: AddressFromDb) => {
        setEditingAddress(address);
        setIsDialogOpen(true);
    };

    const handleOpenCreate = () => {
        setEditingAddress(null);
        setIsDialogOpen(true);
    };

    const handleFormSuccess = (newOrUpdatedAddress: AddressFromDb) => {
        if (editingAddress) {
            setAddresses(current => current.map(addr => addr.id === newOrUpdatedAddress.id ? newOrUpdatedAddress : addr));
            toast.success("Endereço atualizado com sucesso!");
        } else {
            setAddresses(current => [...current, newOrUpdatedAddress]);
            toast.success("Endereço criado com sucesso!");
        }
        setIsDialogOpen(false);
    };

    return (
        <div className="mt-4">
            <AddressList
                addresses={addresses}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />

            <Button variant="outline" className="mt-6 w-full" onClick={handleOpenCreate}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Novo Endereço
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? 'Editar Endereço' : 'Novo Endereço'}</DialogTitle>
                    </DialogHeader>
                    <AddressForm
                        initialData={editingAddress}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}