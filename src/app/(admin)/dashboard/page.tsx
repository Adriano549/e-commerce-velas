import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import OrdersPanel from "@/components/admin/OrdersPanel";
import UsersPanel from "@/components/admin/UsersPanel";
import { getProducts } from "@/services/productService";
import ProductsPanel from "@/components/admin/ProductsPanel";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams?: Promise<{ q?: string; page?: string }>
}) {
    const params = await searchParams;
    const query = params?.q;
    const currentPage = Number(params?.page) || 1;
    const { products, totalPages } = await getProducts(query, currentPage);


    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>


            <Tabs className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="products">Produtos</TabsTrigger>
                    <TabsTrigger value="orders">Pedidos</TabsTrigger>
                    <TabsTrigger value="users">Utilizadores</TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                    <ProductsPanel
                        initialProducts={products}
                        totalPages={totalPages}
                        currentPage={currentPage}
                    />
                </TabsContent>

                <TabsContent value="orders">
                    <OrdersPanel />
                </TabsContent>

                <TabsContent value="users">
                    <UsersPanel />
                </TabsContent>
            </Tabs>
        </div>
    );
}