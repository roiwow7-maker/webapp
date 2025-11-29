import { fetchProduct, type Product } from "@/lib/api";
import ProductDetailClient from "@/components/ProductDetailClient";
import Product3DViewer from "@/components/Product3Dviewer";

type Props = {
  params: Promise<{ id: string }>;
};

// Normaliza la URL del modelo 3D para que siempre apunte al dominio público
function fixMediaUrl(url?: string | null): string {
  if (!url) return "";

  // 1) Si viene como URL absoluta (http o https)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const u = new URL(url);

      // Si NO es tu dominio, forzamos a usar rgamer-store.cl
      if (!u.hostname.includes("rgamer-store.cl")) {
        return `https://www.rgamer-store.cl${u.pathname}`;
      }

      // Si ya es https y ya es tu dominio, la dejamos igual
      if (u.protocol === "https:") {
        return url;
      }

      // Si es http pero tu dominio, lo pasamos a https
      return `https://www.rgamer-store.cl${u.pathname}`;
    } catch {
      // Si falla el new URL, seguimos abajo
    }
  }

  // 2) Si viene como ruta relativa "/media/..."
  if (url.startsWith("/")) {
    return `https://www.rgamer-store.cl${url}`;
  }

  // 3) Si viene sin slash inicial, asumimos que le falta "/"
  if (!url.startsWith("https://www.rgamer-store.cl")) {
    return `https://www.rgamer-store.cl${url.startsWith("/") ? "" : "/"}${url}`;
  }

  return url;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);

  let product: Product | null = null;

  try {
    product = await fetchProduct(numericId);
  } catch (err) {
    console.error("Error cargando producto:", err);
  }

  if (!product) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-red-600">Producto no encontrado</p>
      </div>
    );
  }

  const initialVariant = product.variants[0];

  const has3D =
    Array.isArray(product.models3d) &&
    product.models3d.length > 0 &&
    (product.models3d[0] as any)?.file;

  const modelSrc = has3D
    ? fixMediaUrl((product.models3d[0] as any).file)
    : "";

  // 👇 Esto ayuda a verificar en consola qué URL final está usando
  console.log("Modelo 3D URL normalizada:", modelSrc);

  return (
    <div className="grid md:grid-cols-2 gap-8 p-4">
      <div className="border rounded-2xl p-4 space-y-4">
        {product.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0].image}
            alt={product.images[0].alt || product.title}
            className="w-full rounded-xl"
          />
        )}

        {has3D && modelSrc && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Vista 3D</h2>
            <Product3DViewer src={modelSrc} />
          </div>
        )}
      </div>

      <ProductDetailClient product={product} initialVariant={initialVariant} />
    </div>
  );
}
