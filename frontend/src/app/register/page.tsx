"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("https://www.rgamer-store.cl/api/user/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || data.errors || "Error al registrar usuario.");
        return;
      }

      // Registro exitoso
      setMessage("Registro exitoso. Ahora puedes iniciar sesión.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("Error de red o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Render error o success
  const renderMessage = () => {
    if (!message) return null;

    return (
      <div
        className={`mb-3 text-sm p-2 rounded ${
          typeof message === "string"
            ? message.includes("exitoso")
              ? "bg-emerald-800 text-emerald-200"
              : "bg-red-800 text-red-200"
            : "bg-red-800 text-red-200"
        }`}
      >
        {typeof message === "string" ? message : message.join(", ")}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-zinc-900 p-6 rounded-lg border border-zinc-700">
      <h1 className="text-xl font-bold mb-4 text-emerald-400">Registro de usuario</h1>

      {renderMessage()}

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm mb-1 text-zinc-300">Nombre de usuario</label>
          <input
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
            type="text"
            required
            minLength={3}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ej: retro_master"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1 text-zinc-300">Correo electrónico</label>
          <input
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.cl"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1 text-zinc-300">Contraseña</label>
          <input
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {/* Botón */}
        <button
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold p-2 rounded disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-4 text-xs text-zinc-400 text-center">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}
