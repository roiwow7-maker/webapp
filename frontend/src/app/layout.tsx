import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";


export const metadata: Metadata = {
  title: "Rgamer-store · Catálogo de hardware",
  description:
    "Tienda de hardware retro, PCs gamers y reciclaje tecnológico de Rgamer-store.cl",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-zinc-950 text-zinc-50">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
