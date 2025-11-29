"use client";

import { useState } from "react";
import type { Product, ProductVariant } from "../lib/api";
import { useCartStore } from "../store/cart";
import { getSessionKey } from "../lib/session";
import { API_BASE } from "../lib/api";  

interface Props {
  product: Product;
  initialVariant?: ProductVariant;
}

export default function ProductDetailClient({ product, initialVariant }: Props) {
  const [variant] = useState<ProductVariant | undefined>(initialVariant);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = async () => {
    if (!variant) return;

    // 1) Agregar al carrito local (Zustand)
    addItem(product, variant, 1);

    // 2) Obtener session key
    const sessionKey = getSessionKey();

    try {
      const res = await fetch(`${API_BASE}api/shop/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session": sessionKey,
        },
        body: JSON.stringify({
          variant_id: variant.id,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(
          "Error HTTP al guardar en servidor:",
          res.status,
          text,
        );
        alert(
          `Se agregó localmente, pero el servidor respondió ${res.status}. Revisa la consola.`
        );
        return;
      }

      alert("Producto agregado al carrito (local + servidor) ✅");
    } catch (error) {
      console.error("Error de red enviando al backend:", error);
      alert("Se agregó localmente, pero falló la conexión con el servidor");
    }
  };

  return (
    <div className="space-y-4">
      <span className="text-xs uppercase text-zinc-400">
        {product.brand?.name} · {product.category?.name}
      </span>

      <h1 className="text-2xl font-bold">{product.title}</h1>

      <p className="text-sm text-zinc-300">{product.short_desc}</p>

      <p className="text-sm text-zinc-400 whitespace-pre-line">
        {product.long_desc}
      </p>

      {variant && (
        <p className="mt-4 text-2xl font-bold text-emerald-400">
          ${variant.price_clp.toLocaleString("es-CL")} CLP
        </p>
      )}

      <button
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:bg-zinc-700"
        onClick={handleAddToCart}
        disabled={!variant}
      >
        Agregar al carrito
      </button>
    </div>
  );
}
