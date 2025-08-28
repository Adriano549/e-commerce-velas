
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchCep } from '@/services/cepService';
import { AddressFromDb } from '@/types/cardItem';

interface AddressFormProps {
    initialData?: AddressFromDb | null;
    onSuccess: (address: AddressFromDb) => void;
    onCancel: () => void;
}

export default function AddressForm({ initialData, onSuccess, onCancel }: AddressFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cepLoading, setCepLoading] = useState(false);


    const [zipCode, setZipCode] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [complement, setComplement] = useState('');

    useEffect(() => {
        if (initialData) {
            setZipCode(initialData.zipCode);
            setStreet(initialData.street);
            setNumber(initialData.number);
            setNeighborhood(initialData.neighborhood);
            setCity(initialData.city);
            setState(initialData.state);
            setComplement(initialData.complement || '');
        } else {
            setZipCode(''); setStreet(''); setNumber(''); setNeighborhood('');
            setCity(''); setState(''); setComplement('');
        }
    }, [initialData]);


    const handleCepLookup = async () => {
        try {
            setCepLoading(true);
            setError(null);
            const data = await fetchCep(zipCode);
            setStreet(data.logradouro);
            setNeighborhood(data.bairro);
            setCity(data.localidade);
            setState(data.uf);
            setComplement(data.complemento);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro desconhecido ao buscar o CEP.');
            }
        } finally {
            setCepLoading(false);
        }
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const addressData = { street, number, neighborhood, city, state, zipCode, complement };
        const method = initialData ? 'PUT' : 'POST';
        const url = initialData ? `/api/addresses/${initialData.id}` : '/api/addresses';

        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(addressData) });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.errors ? Object.values(data.errors).join(', ') : 'Falha na operação');
            }
            onSuccess(data);
        } catch (err) {
            if (err instanceof Error) setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zipCode" className="text-right">CEP</Label>
                <Input id="zipCode" name="zipCode" className="col-span-3" value={zipCode} onChange={e => setZipCode(e.target.value)} onBlur={handleCepLookup} required />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="street" className="text-right">Rua</Label>
                <Input id="street" name="street" className="col-span-3" value={street} onChange={e => setStreet(e.target.value)} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="neighborhood" className="text-right">Bairro</Label>
                <Input id="neighborhood" name="neighborhood" className="col-span-3" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">Cidade</Label>
                <Input id="city" name="city" className="col-span-3" value={city} onChange={e => setCity(e.target.value)} required />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="number" className="text-right">Número</Label>
                <Input id="number" name="number" className="col-span-3" value={number} onChange={e => setNumber(e.target.value)} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">Estado</Label>
                <Input id="state" name="state" className="col-span-3" value={state} onChange={e => setState(e.target.value)} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="complement" className="text-right">Complemento</Label>
                <Input id="complement" name="complement" className="col-span-3" value={complement} onChange={e => setComplement(e.target.value)} />
            </div>

            {error && (
                <div className="col-span-4">
                    <Alert variant="destructive">
                        <AlertTitle>Erro ao Guardar</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}
            <div className="flex justify-end gap-4 mt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" disabled={isLoading || cepLoading}>
                    {isLoading ? 'A guardar...' : 'Guardar'}
                </Button>
            </div>
        </form>
    );
}