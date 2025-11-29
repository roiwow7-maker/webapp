import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";

export const revalidate = 0;

export default async function Home() {
  const products = await fetchProducts();

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h1 className="text-xl font-semibold">
          Catálogo de hardware · Rgamer-store
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Componentes reciclados, retro y modernos, probados y listos para
          seguir dando batalla.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 && (
          <p className="text-sm text-zinc-400">
            No hay productos todavía. Agrega algunos en el panel de
            administración de Django.
          </p>
        )}

        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </div>
  );
}
