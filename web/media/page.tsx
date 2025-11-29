import { fetchProduct, type Product } from "@/lib/api";
import ProductDetailClient from "@/components/ProductDetailClient";
import Product3DViewer from '@/components/Product3Dviewer'


type Props = {
  params: Promise<{ id: string }>;
};

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

        {has3D && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Vista 3D</h2>
            <Product3DViewer src={(product.models3d[0] as any).file} />
          </div>
        )}
      </div>

      <ProductDetailClient product={product} initialVariant={initialVariant} />
    </div>
  );
}
