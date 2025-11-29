"use client";

import { useEffect, useState } from "react";
import { getToken, isAdmin } from "../../lib/auth";

type ManagementReport = {
  total_products: number;
  total_stock: number;
  orders_count: number;
  total_income: number;
  recycling_requests: number;
};

type StatRow = {
  date: string;
  orders_count: number;
  total_clp: number;
  carts_count: number;
  items_sold: number;
};

export default function InformeGestion() {
  const [mgmt, setMgmt] = useState<ManagementReport | null>(null);
  const [stats, setStats] = useState<StatRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🛡 Solo admin
    if (!isAdmin()) {
      setError("No tienes permisos para ver este informe.");
      setLoading(false);
      return;
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/";
    const token = getToken();

    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) Informe de gestión
        const resMgmt = await fetch(
          `${API_BASE}api/index/management-report/`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!resMgmt.ok) {
          throw new Error("Error al cargar informe de gestión");
        }

        const mgmtData = (await resMgmt.json()) as ManagementReport;
        setMgmt(mgmtData);

        // 2) Stats por día (órdenes, carritos, etc.)
        const resStats = await fetch(
          `${API_BASE}api/shop/admin/stats/?days=30`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!resStats.ok) {
          throw new Error("Error al cargar estadísticas por día");
        }

        const statsData = await resStats.json();
        setStats(statsData.results || []);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el informe completo.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (!isAdmin()) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-red-400">
        No tienes permisos para ver este informe.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-zinc-200">
        Cargando informe de gestión...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-red-400">
        {error}
      </div>
    );
  }

  if (!mgmt) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-zinc-200">
        No hay datos de informe disponibles.
      </div>
    );
  }

  // Totales calculados desde stats
  const totalOrders = stats.reduce((acc, s) => acc + s.orders_count, 0);
  const totalRevenue = stats.reduce((acc, s) => acc + s.total_clp, 0);
  const totalCarts = stats.reduce((acc, s) => acc + s.carts_count, 0);
  const totalItems = stats.reduce((acc, s) => acc + s.items_sold, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-zinc-100">
      <h1 className="text-2xl font-semibold text-emerald-400">
        Informe de Gestión · Panel Administrativo
      </h1>

      {/* Bloque 1: KPI generales (del management-report) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-100">
          Resumen general del sistema
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card label="Total de productos" value={mgmt.total_products} />
          <Card label="Stock total" value={mgmt.total_stock} />
          <Card label="Órdenes registradas (histórico)" value={mgmt.orders_count} />
          <Card
            label="Ingresos totales (CLP histórico)"
            value={`$${mgmt.total_income.toLocaleString("es-CL")}`}
          />
          <Card
            label="Solicitudes de reciclaje"
            value={mgmt.recycling_requests}
          />
        </div>
      </section>

      {/* Bloque 2: Stats de los últimos 30 días (endpoint admin/stats) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-100">
          Últimos 30 días · Ventas, órdenes y carritos
        </h2>

        {/* Resumen rápido últimos 30 días */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card label="Órdenes (30 días)" value={totalOrders} />
          <Card
            label="Ventas (CLP, 30 días)"
            value={`$${totalRevenue.toLocaleString("es-CL")}`}
          />
          <Card label="Carritos (30 días)" value={totalCarts} />
          <Card label="Ítems vendidos (30 días)" value={totalItems} />
        </div>

        {/* Tabla por día */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mt-4">
          <table className="w-full text-sm">
            <thead className="bg-zinc-950">
              <tr>
                <th className="px-3 py-2 text-left">Fecha</th>
                <th className="px-3 py-2 text-right">Órdenes</th>
                <th className="px-3 py-2 text-right">Carritos</th>
                <th className="px-3 py-2 text-right">Ítems vendidos</th>
                <th className="px-3 py-2 text-right">Total CLP</th>
              </tr>
            </thead>
            <tbody>
              {stats.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-zinc-400"
                  >
                    No hay actividad registrada en los últimos 30 días.
                  </td>
                </tr>
              ) : (
                stats.map((row) => (
                  <tr key={row.date} className="border-t border-zinc-800">
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2 text-right">
                      {row.orders_count}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row.carts_count}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row.items_sold}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row.total_clp.toLocaleString("es-CL")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-zinc-500 mt-2">
          Más adelante podemos agregar gráficos (líneas o barras) sobre estos
          mismos datos para ver tendencias por día.
        </p>
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-zinc-50">{value}</div>
    </div>
  );
}
