export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          © {new Date().getFullYear()} rgamer-store.cl ·
          <span className="ml-1">
            Reciclaje tecnológico, hardware retro y PCs gamers a medida.
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <span>Contacto: info@rgamer-store.cl</span>
          <span className="hidden sm:inline">·</span>
          <span>Ubicación: Santiago, Chile</span>
        </div>
      </div>
    </footer>
  );
}
