// src/lib/api.ts
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://www.rgamer-store.cl/" ;




export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt: string;
  sort: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  attributes: Record<string, any>;
  price_clp: number;
  stock: number;
  weight_g: number;
}

export interface Product {
  id: number;
  sku_root: string;
  title: string;
  brand: Brand;
  category: Category;
  short_desc: string;
  long_desc: string;
  condition: string;
  grade: string;
  publish: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  models3d: any[];
}

// Obtener lista de productos
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}api/index/products/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error cargando productos");
  }

  return res.json();
}

// Obtener un solo producto por ID
export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}api/index/products/${id}/`);
  if (!res.ok) throw new Error("Producto no encontrado");
  return res.json() as Promise<Product>;
}
