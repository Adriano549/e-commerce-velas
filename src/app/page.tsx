import HeroSection from "@/components/shared/HeroSection";
import ProductCard from "@/components/shared/ProductCard";
import { getProducts } from "@/services/productService";


export default async function Home() {
  const { products } = await getProducts();

  return (
    <main>
      <HeroSection />

      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-center">
          Nossos Produtos
        </h2>

        {products.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
