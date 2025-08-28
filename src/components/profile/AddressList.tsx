// src/components/profile/AddressList.tsx
'use client';

import { AddressFromDb } from "@/types/cardItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from 'lucide-react';

interface AddressListProps {
    addresses: AddressFromDb[];
    onEdit: (address: AddressFromDb) => void;
    onDelete: (addressId: string) => void;
}

export default function AddressList({ addresses, onEdit, onDelete }: AddressListProps) {

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
                <Card key={address.id} className="flex flex-col">
                    <CardContent className="pt-6 flex-grow text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">{address.street}, {address.number}</p>
                        <p>{address.neighborhood}, {address.city} - {address.state}</p>
                        <p>CEP: {address.zipCode}</p>
                        <p>Complemento: {address.complement}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t p-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(address)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                                    <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onDelete(address.id)} className="bg-destructive hover:bg-destructive/90">Apagar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}