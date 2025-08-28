'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductFromDb } from "@/types/cardItem";

interface ProductFormProps {
    initialData?: ProductFromDb | null;
    onSuccess: () => void;
}

export default function ProductForm({ initialData, onSuccess }: ProductFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number | string>('');
    const [image, setImage] = useState('');
    const [stock, setStock] = useState<number | string>('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setPrice(Number(initialData.price));
            setImage(initialData.image);
            setStock(initialData.stock);
        }
    }, [initialData]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const productData = { name, description, price: Number(price), image, stock: Number(stock) };
        const method = initialData ? 'PUT' : 'POST';
        const url = initialData ? `/api/products/${initialData.id}` : '/api/products';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(Object.values(data.errors || {}).join(', ') || 'Falha na operação');
            }

            onSuccess();

        } catch (err) {
            if (err instanceof Error) setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Preço</Label>
                    <Input id="price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Estoque</Label>
                    <Input id="stock" type="number" step="1" value={stock} onChange={e => setStock(e.target.value)} required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input id="image" type="url" value={image} onChange={e => setImage(e.target.value)} required />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'A guardar...' : (initialData ? 'Atualizar Produto' : 'Criar Produto')}
                </Button>
            </div>
        </form>
    );
}