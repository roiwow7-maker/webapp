// frontend/app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { saveToken } from "../../lib/auth";

export default function LoginPage() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState<string | string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/user/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // 👀 Manejo de error usando res.ok (como tu snippet)
      if (!res.ok) {
        setError(
          data?.detail ||
            data?.error ||
            "Error al iniciar sesión"
        );
        return;
      }

      // 🔐 Guardar token JWT
      if (data.access) {
        // Sigue usando tu helper
        saveToken(data.access);
        // Y además el nombre estándar que quieres
        localStorage.setItem("accessToken", data.access);
      }

      // 👤 Normalizar datos de usuario (2 formatos posibles)
      const user =
        data.user ??
        ({
          id: data.id,
          username: data.username,
          email: data.email,
          is_staff: data.is_staff,
        } as any);

      if (user) {
        // Nombre que quieres usar en el resto de la app
        localStorage.setItem("user", JSON.stringify(user));
        // Si ya usabas "auth_user" en otras partes, lo dejamos también
        localStorage.setItem("auth_user", JSON.stringify(user));
      }

      // 🔁 Redirigir después de login
      window.location.href = "/";
    } catch (err) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4 text-zinc-100">
      <h1 className="text-2xl font-semibold">Iniciar sesión</h1>

      {error && (
        <div className="mb-2 text-sm text-red-400 bg-zinc-900 border border-red-500/50 rounded p-2">
          {Array.isArray(error) ? error.join(", ") : error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Usuario</label>
          <input
            className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
            value={username}
            onChange={(e) => setU(e.target.value)}
            placeholder="Tu usuario"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Contraseña</label>
          <input
            className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
            type="password"
            value={password}
            onChange={(e) => setP(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-emerald-500 text-black font-semibold py-2 text-sm hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-xs text-zinc-400">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="text-emerald-400 hover:text-emerald-300"
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
