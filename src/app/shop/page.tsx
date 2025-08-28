import PaginationControls from "@/components/shared/PaginationControls";
import ProductCard from "@/components/shared/ProductCard";
import ProductSearch from "@/components/shared/ProductSearch";
import { getProducts } from "@/services/productService";


export default async function VelasPage({
    searchParams
}
    : {
        searchParams?: Promise<{ q?: string; page?: string }>
    }) {
    const params = await searchParams;
    const query = params?.q;
    const currentPage = Number(params?.page) || 1;
    const { products, totalPages } = await getProducts(query, currentPage);

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Nossa Coleção</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Explore nossa seleção completa de velas aromáticas.
                </p>
            </div>
            <div className="mb-8 max-w-lg mx-auto">
                <ProductSearch />
            </div>

            {products.length === 0 ? (
                <p className="text-center">Nenhum produto encontrado.</p>
            ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
            <div className="mt-12 flex justify-center">
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/shop"
                />
            </div>
        </main>
    );
}