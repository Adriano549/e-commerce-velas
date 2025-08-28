'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductFromDb } from '@/types/cardItem';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';
import ProductActions from './ProductActions';
import ProductForm from './ProductForm';
import ProductSearch from '../shared/ProductSearch';
import PaginationControls from '../shared/PaginationControls';

interface ProductDashboardClientProps {
    initialProducts: ProductFromDb[];
    totalPages: number;
    currentPage: number;
}

export default function ProductDashboardClient({
    initialProducts,
    totalPages,
    currentPage,
}: ProductDashboardClientProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductFromDb | null>(null);

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (product: ProductFromDb) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleSuccess = () => {
        setIsDialogOpen(false);
        router.refresh();
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gerir Produtos</h1>
                <Button onClick={handleOpenCreate}>Adicionar Novo Produto</Button>
            </div>

            <div className="mb-8 max-w-sm">
                <ProductSearch />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">Imagem</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Estoque</TableHead>
                            <TableHead><span className="sr-only">Ações</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image alt={product.name} className="aspect-square rounded-md object-cover" height="64" src={product.image} width="64" />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{Number(product.price)}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                    <ProductActions
                                        productId={product.id}
                                        onEdit={() => handleOpenEdit(product)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-8 flex justify-center">
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/dashboard/products"
                />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
                    </DialogHeader>
                    <ProductForm
                        initialData={editingProduct}
                        onSuccess={handleSuccess}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}