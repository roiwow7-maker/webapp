import Link from "next/link";
import type { Product } from "@/lib/api";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const variant = product.variants[0];

  return (
    <div className="border border-zinc-800 rounded-xl p-4 flex flex-col gap-2 bg-zinc-900/60">
      <div className="aspect-video mb-2 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0].image}
            alt={product.images[0].alt || product.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-xs text-zinc-400">Sin imagen</span>
        )}
      </div>

      <span className="text-xs uppercase text-zinc-400">
        {product.brand?.name} · {product.category?.name}
      </span>

      <h2 className="font-semibold text-zinc-50 line-clamp-1">
        {product.title}
      </h2>

      <p className="text-sm text-zinc-300 line-clamp-2">
        {product.short_desc}
      </p>

      {variant && (
        <p className="mt-1 font-bold text-emerald-400">
          ${variant.price_clp.toLocaleString("es-CL")} CLP
        </p>
      )}

      <Link
        href={`/producto/${product.id}`}
        className="mt-3 inline-flex items-center justify-center rounded-lg border border-emerald-500 px-3 py-1.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/10"
      >
        Ver detalle
      </Link>
    </div>
  );
}
