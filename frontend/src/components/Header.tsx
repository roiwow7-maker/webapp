"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn, isAdmin, logout, getAuthUser } from "../lib/auth";

const baseNavLinks = [
  { href: "/", label: "Catálogo" },
  { href: "/carrito", label: "Carrito" },
  { href: "/reciclaje", label: "Recicla" },
  { href: "/acerca", label: "Qué es Rgamer-store" },
];

export default function Header() {
  const pathname = usePathname();

  const [logged, setLogged] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Esto solo corre en el cliente
    const l = isLoggedIn();
    const a = isAdmin();
    const user = getAuthUser();

    setLogged(l);
    setAdmin(a);
    setUsername(user?.username ?? null);
  }, []);

  // Construimos links de navegación base
  const navLinks = [...baseNavLinks];

  // Si es admin, agregamos el link a Informe (dashboard)
  if (admin) {
    navLinks.push({ href: "/informe", label: "Informe" });
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo / Marca */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald-500/60 bg-zinc-900 text-xs font-bold">
            RG
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">
              Rgamer-store<span className="text-emerald-400">.cl</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Hardware retro · PCs gamers
            </div>
          </div>
        </Link>

        {/* Navegación izquierda */}
        <nav className="flex items-center gap-3 text-sm">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  "rounded-md px-3 py-1 " +
                  (active
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/60"
                    : "text-zinc-300 hover:text-emerald-300 hover:bg-zinc-900 border border-transparent")
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zona derecha: usuario / login */}
        <div className="flex items-center gap-3 text-xs">
          {logged ? (
            <>
              {admin && (
                <span className="rounded-md border border-amber-400/60 bg-amber-500/10 px-2 py-1 text-amber-200">
                  Admin
                </span>
              )}
              {username && (
                <span className="text-zinc-300 hidden sm:inline">
                  Hola, <span className="font-semibold">{username}</span>
                </span>
              )}
              <button
                onClick={logout}
                className="rounded-md border border-zinc-700 px-3 py-1 text-zinc-300 hover:bg-zinc-800"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-zinc-700 px-3 py-1 text-zinc-200 hover:bg-zinc-900"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-emerald-500 px-3 py-1 text-black font-semibold hover:bg-emerald-400"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
