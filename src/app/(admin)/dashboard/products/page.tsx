import { getProducts } from "@/services/productService";
import ProductDashboardClient from "@/components/admin/ProductDashboardClient";

export default async function AdminProductsPage({ searchParams
}
    : {
        searchParams?: Promise<{ q?: string; page?: string }>
    }) {
    const params = await searchParams;
    const query = params?.q;
    const currentPage = Number(params?.page) || 1;
    const { products, totalPages } = await getProducts(query, currentPage);

    return (
        <ProductDashboardClient
            initialProducts={products}
            totalPages={totalPages}
            currentPage={currentPage}
        />
    );
}