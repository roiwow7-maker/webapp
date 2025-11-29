"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cart";
import { getSessionKey } from "../../lib/session";

// Función para obtener la URL base del backend
function getApiBase() {
  if (process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE; // debe terminar en "/"
  }
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:8000/`;
  }
  return "http://127.0.0.1:8000/";
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clear = useCartStore((s) => s.clear);

  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Campos del formulario
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const apiBase = getApiBase();

  // ---------------------------
  //   🔥 SINCRONIZACIÓN INICIAL
  // ---------------------------
  useEffect(() => {
    // Al cargar checkout, podemos refrescar desde backend si quieres
    // Pero lo dejo opcional. Si quieres, puedo agregarlo completo.
  }, []);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }
    if (!customerName || !customerEmail) {
      setError("Nombre y correo son obligatorios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sessionKey = getSessionKey();

      // ---------------------------
      //   🔥 1. Checkout en backend
      // ---------------------------
      const res = await fetch(`${apiBase}api/shop/checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session": sessionKey ?? "",
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          customer_notes: customerNotes,
          payment_method: "MANUAL",
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        console.error("Error en checkout:", res.status, data);
        setError(
          (data && (data.detail || data.error)) ||
            `No se pudo procesar el checkout (código ${res.status}).`
        );
        return;
      }

      // ---------------------------
      //   🔥 2. Limpiar FRONTEND
      // ---------------------------
      clear(); // Zustand

      // ---------------------------
      //   🔥 3. Limpiar BACKEND (doble seguridad)
      // ---------------------------
      await fetch(`${apiBase}api/shop/cart/clear/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session": sessionKey ?? "",
        },
      });

      // ---------------------------
      //   🔥 4. Mostrar orden creada
      // ---------------------------
      setOrderId(data.order_id);
    } catch (err) {
      console.error("Error de red:", err);
      setError(
        "No se pudo conectar con el servidor. Asegúrate de que el backend está encendido."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  //     UI: Orden creada
  // ---------------------------
  if (orderId) {
    return (
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold">¡Gracias por tu compra!</h1>
        <p className="text-sm text-zinc-300">Tu orden fue creada correctamente.</p>
        <p className="text-xs text-zinc-400">Número de orden:</p>
        <p className="text-2xl font-semibold text-emerald-400">#{orderId}</p>

        <Link
          href="/"
          className="inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // ---------------------------
  //         UI NORMAL
  // ---------------------------
  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Checkout</h1>
          <p className="text-sm text-zinc-400">Ingresa tus datos y confirma tu pedido.</p>
        </div>
        <Link href="/carrito" className="text-sm text-emerald-400 hover:text-emerald-300">
          ← Volver al carrito
        </Link>
      </header>

      {/* RESUMEN DEL CARRITO */}
      {items.length === 0 ? (
        <p className="text-sm text-zinc-400">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          {items.map((item) => (
            <div key={item.variantId} className="flex items-center justify-between text-sm">
              <div>
                <div className="font-medium text-zinc-50">{item.title}</div>
                <div className="text-xs text-zinc-400">SKU: {item.variantSku}</div>
                <div className="text-xs text-zinc-400">Cantidad: {item.quantity}</div>
              </div>
              <div className="text-right text-sm text-emerald-400">
                ${(item.price_clp * item.quantity).toLocaleString("es-CL")} CLP
              </div>
            </div>
          ))}
          <div className="mt-3 border-t border-zinc-800 pt-3 text-right text-sm text-zinc-300">
            Total:{" "}
            <span className="text-lg font-semibold text-emerald-400">
              ${totalPrice().toLocaleString("es-CL")} CLP
            </span>
          </div>
        </div>
      )}

      {/* FORMULARIO CLIENTE */}
      <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        {/* Nombre */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Nombre completo *</label>
          <input
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Correo electrónico *</label>
          <input
            type="email"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Teléfono</label>
          <input
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Dirección</label>
          <input
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Notas adicionales (opcional)</label>
          <textarea
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            rows={3}
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
          />
        </div>
      </div>

      {/* ERROR */}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* BOTÓN CHECKOUT */}
      <button
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:bg-zinc-700"
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
      >
        {loading ? "Procesando..." : "Confirmar pedido"}
      </button>
    </div>
  );
}
