"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "../../store/cart";
import { getSessionKey } from "../../lib/session";

const SHOP_CART_URL = "/api/shop/cart/";

type UiCartItem = {
  variantId: number;
  title: string;
  variantSku: string;
  price_clp: number;
  quantity: number;
};

export default function CartPage() {
  // 🧠 Zustand: para que el header / icono de carrito sigan sincronizados
  const clearStore = useCartStore((s) => s.clear);
  const addItemToStore = useCartStore((s) => s.addItem);

  // 🖥 Estado local que realmente se renderiza en esta página
  const [items, setItems] = useState<UiCartItem[]>([]);
  const [loading, setLoading] = useState(true);
const loadCart = async () => {
  try {
    const sessionKey = getSessionKey();
    console.log("🧪 Cart: usando session", sessionKey);

    // 💥 Query param anti-caché
    const url = `${SHOP_CART_URL}?ts=${Date.now()}`;

    const res = await fetch(url, {
      headers: {
        "X-Session": sessionKey,
      },
      cache: "no-store",
    });

    console.log("🧪 Cart: status", res.status);

    if (!res.ok) {
      console.error("Error al cargar carrito del servidor:", res.status);
      setItems([]);
      clearStore();
      return;
    }

    const data = await res.json();
    console.log("🧪 Cart: datos del servidor", data);

    if (!data || !Array.isArray(data.items)) {
      console.error("🧪 Cart: data.items no es array", data);
      setItems([]);
      clearStore();
      return;
    }

    const uiItems: UiCartItem[] = data.items.map((item: any) => ({
      variantId: item.variant.id,
      title: item.variant.title,
      variantSku: item.variant.sku,
      price_clp: item.variant.price_clp,
      quantity: item.quantity,
    }));

    setItems(uiItems);

    clearStore();
    for (const item of data.items) {
      const fakeProduct = {
        id: item.variant.product_id,
        title: item.variant.title,
      } as any;

      const fakeVariant = {
        id: item.variant.id,
        sku: item.variant.sku,
        attributes: {},
        price_clp: item.variant.price_clp,
        stock: 0,
        weight_g: 0,
      };

      addItemToStore(fakeProduct, fakeVariant, item.quantity);
    }
  } catch (err) {
    console.error("Error cargando carrito desde el servidor:", err);
    setItems([]);
    clearStore();
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const handleClearCart = async () => {
  const sessionKey = getSessionKey();

  try {
    const url = `${SHOP_CART_URL}clear/?ts=${Date.now()}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "X-Session": sessionKey,
      },
      cache: "no-store",
    });

    console.log("🧪 Cart CLEAR: status", res.status);

    if (!res.ok) {
      console.error("Error al vaciar carrito en el servidor:", res.status);
    }
  } catch (err) {
    console.error("Error de red al vaciar carrito:", err);
  } finally {
    setItems([]);
    clearStore();
    setLoading(true);
    await loadCart();
  }
};

const updateQuantity = async (variantId: number, newQuantity: number) => {
  const sessionKey = getSessionKey();

  try {
    const url = `${SHOP_CART_URL}update/?ts=${Date.now()}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Session": sessionKey,
      },
      body: JSON.stringify({ variant_id: variantId, quantity: newQuantity }),
      cache: "no-store",
    });

    console.log("🧪 Cart update: status", res.status);

    if (!res.ok) {
      console.error(
        "Error al actualizar cantidad en el servidor:",
        res.status
      );
      return;
    }
  } catch (err) {
    console.error("Error de red al actualizar cantidad:", err);
    return;
  }

  setLoading(true);
  await loadCart();
};


  const totalPrice = () =>
    items.reduce(
      (acc, item) => acc + item.price_clp * item.quantity,
      0
    );

  if (loading) {
    return (
      <div className="p-4 text-sm text-zinc-400">
        Cargando carrito...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Carrito de compras</h1>
          <p className="text-sm text-zinc-400">
            Revisa los productos antes de confirmar tu pedido.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-emerald-400 hover:text-emerald-300"
        >
          ← Volver al catálogo
        </Link>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-400">
          Tu carrito está vacío. Agrega productos desde el catálogo.
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
              >
                <div>
                  <div className="text-sm font-medium text-zinc-50">
                    {item.title}
                  </div>
                  <div className="text-xs text-zinc-400">
                    SKU: {item.variantSku}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="px-2 py-1 rounded bg-zinc-800 text-zinc-200"
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <span className="text-sm text-zinc-300">
                      {item.quantity}
                    </span>

                    <button
                      className="px-2 py-1 rounded bg-zinc-800 text-zinc-200"
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-400">
                    $
                    {(item.price_clp * item.quantity).toLocaleString("es-CL")}{" "}
                    CLP
                  </div>
                  <button
                    className="mt-2 text-xs text-red-400 hover:text-red-300"
                    onClick={() => updateQuantity(item.variantId, 0)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
            <div className="text-sm text-zinc-400">
              Total:{" "}
              <span className="text-lg font-semibold text-emerald-400">
                ${totalPrice().toLocaleString("es-CL")} CLP
              </span>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                onClick={handleClearCart}
              >
                Vaciar carrito
              </button>
              <Link
                href="/checkout"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-400 flex items-center justify-center"
              >
                Continuar al checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
