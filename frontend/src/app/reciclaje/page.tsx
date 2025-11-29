"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

// Construimos el endpoint usando la base del .env
const RECYCLING_URL = `${API_BASE}api/shop/recycling-requests/`;

export default function ReciclajePage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [tipoEquipo, setTipoEquipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviado(false);

    if (!nombre || !email) {
      setError("Por favor ingresa al menos tu nombre y correo.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(RECYCLING_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          email,
          tipo_equipo: tipoEquipo,
          descripcion,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(
          "Error al enviar solicitud de reciclaje:",
          res.status,
          text
        );
        setError(
          `Hubo un problema al enviar tu solicitud (código ${res.status}). Intenta nuevamente.`
        );
        return;
      }

      setEnviado(true);
      setNombre("");
      setEmail("");
      setTipoEquipo("");
      setDescripcion("");
    } catch (err) {
      console.error("Error de red:", err);
      setError("No se pudo conectar con el servidor. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-50">
          Reciclaje y reacondicionamiento tecnológico
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-2xl">
          Rgamer-store.cl está enfocado en darle una segunda vida a hardware
          clásico y moderno: PCs, partes sueltas, monitores CRT, tarjetas de
          video, placas madres y más. Si tienes equipos en desuso, podemos
          evaluarlos, reciclarlos o reacondicionarlos.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-50">
            ¿Qué tipo de hardware recibimos?
          </h2>
          <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
            <li>PCs completos (oficina, gamer, retro, servidores pequeños).</li>
            <li>
              Placas madres, procesadores, RAM DDR/DDR2/DDR3/DDR4, tarjetas de
              video AGP/PCIe.
            </li>
            <li>
              Monitores, especialmente CRT y LCD que se puedan reutilizar o
              restaurar.
            </li>
            <li>
              Fuentes de poder ATX, gabinetes antiguos, unidades ópticas,
              discos duros y SSD.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-zinc-50">
            ¿Qué hacemos con tu hardware?
          </h2>
          <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
            <li>Evaluación técnica del estado del equipo o componente.</li>
            <li>
              Reacondicionamiento para venta como equipo usado o retro para
              coleccionistas.
            </li>
            <li>
              Aprovechamiento de piezas útiles y reciclaje responsable de lo
              que ya no se puede recuperar.
            </li>
            <li>
              Según el caso, se pueden ofrecer{" "}
              <span className="font-semibold text-emerald-400">
                descuentos en compras
              </span>{" "}
              a cambio de tu hardware.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 md:p-5">
          <h2 className="text-lg font-semibold text-zinc-50 mb-3">
            Cuéntame qué quieres reciclar
          </h2>

          {enviado && (
            <div className="mb-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
              Gracias por enviar la información. Te contactaré a la brevedad
              para coordinar la evaluación del equipo. 🖥️♻️
            </div>
          )}

          {error && (
            <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Nombre</label>
              <input
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Tipo de equipo o componentes
              </label>
              <input
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                placeholder="Ej: PC Pentium 4, CRT 17'', varias placas madres AM2..."
                value={tipoEquipo}
                onChange={(e) => setTipoEquipo(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Descripción (estado, faltantes, detalles)
              </label>
              <textarea
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar datos para evaluación"}
            </button>

            <p className="text-[11px] text-zinc-500">
              * Tus datos se almacenan solo para gestionar esta solicitud de
              reciclaje. Más adelante se puede integrar con un sistema de correos
              o panel de administración más avanzado.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

