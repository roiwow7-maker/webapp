export default function AcercaPage() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold text-zinc-50">
        Acerca de Rgamer-store.cl
      </h1>

      <p className="text-sm md:text-base text-zinc-300">
        Rgamer-store.cl nace de una mezcla de pasión por el hardware retro, la
        reparación de computadores y la idea de darle una segunda vida a la
        tecnología. El objetivo no es solo vender partes y PCs, sino también
        rescatar equipos que marcaron épocas, reducir residuos electrónicos y
        ofrecer alternativas accesibles para estudiantes, gamers y entusiastas.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-50">
          ¿Quién está detrás del proyecto?
        </h2>
        <p className="text-sm text-zinc-300">
          Detrás de Rgamer-store.cl estoy yo, Roy, técnico y estudiante de
          informática, con años de experiencia reparando PCs, armando equipos a
          medida y coleccionando hardware antiguo. Vengo del mundo del{" "}
          <span className="font-semibold text-emerald-400">
            reciclaje y reacondicionamiento
          </span>{" "}
          de computadores, y este proyecto es la evolución natural de ese
          trabajo.
        </p>
        <p className="text-sm text-zinc-300">
          La tienda combina tres cosas que me representan:
        </p>
        <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
          <li>Hardware retro y de colección.</li>
          <li>Equipos reacondicionados listos para uso diario.</li>
          <li>
            Componentes para que puedas armar tu propio PC, ya sea moderno o
            clásico.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-50">
          Enfoque en sostenibilidad
        </h2>
        <p className="text-sm text-zinc-300">
          Muchos computadores y partes se botan aún teniendo vida útil. En
          Rgamer-store.cl la idea es{" "}
          <span className="font-semibold text-emerald-400">
            reparar, reutilizar y reciclar
          </span>{" "}
          antes que desechar. Eso significa:
        </p>
        <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
          <li>Reparar y testear componentes en vez de tirarlos a la basura.</li>
          <li>Usar piezas recuperadas para armar PCs funcionales y económicos.</li>
          <li>
            Rescatar hardware retro que tiene valor histórico o para
            coleccionistas.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-50">
          ¿Qué ofrece la tienda?
        </h2>
        <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
          <li>PCs completos listos para usar (oficina, hogar, gamer, retro).</li>
          <li>Partes sueltas: placas madres, CPUs, RAM, GPUs, fuentes, etc.</li>
          <li>Equipos retro para coleccionistas y entusiastas.</li>
          <li>
            Servicio de reciclaje y recepción de hardware en desuso (ver sección
            de reciclaje).
          </li>
          <li>
            Asesoría para armar PCs según tu presupuesto y necesidades
            específicas.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-50">Próximos pasos</h2>
        <p className="text-sm text-zinc-300">
          Este sitio es parte de un proyecto que sigue creciendo: integración
          con pasarelas de pago chilenas, catálogo 3D de equipos, un ensamblador
          virtual de PCs y más funcionalidades pensadas para amantes del
          hardware. La idea es que Rgamer-store.cl sea mucho más que una tienda:
          un espacio para compartir y mantener vivo el mundo del PC clásico y
          moderno.
        </p>
      </section>
    </div>
  );
}
