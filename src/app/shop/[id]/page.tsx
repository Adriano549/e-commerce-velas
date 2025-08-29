import { getProductById } from "@/services/productService";
import { notFound } from 'next/navigation';
import AddToCartForm from "@/components/shared/AddToCartForm";
import ProductImage from "@/components/shared/ProductImage";

interface ProductDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    const price = new Number(product.price).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <main className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="relative aspect-square w-full">
                    <ProductImage
                        src={product.image}
                        alt={product.name}
                        fill
                        className="rounded-lg object-cover"
                    />
                </div>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{product.name}</h1>
                    <p className="mt-4 text-3xl">{price}</p>
                    <div className="mt-6 border-t pt-6">
                        <h2 className="text-lg font-semibold">Descrição</h2>
                        <p className="mt-2 text-muted-foreground">{product.description}</p>
                    </div>

                    <AddToCartForm product={product} />

                    <p className="mt-4 text-sm text-muted-foreground">Estoque disponível: {product.stock} unidades</p>
                </div>
            </div>
        </main>
    );
}