"use client";

import React, { useEffect } from "react";

export default function Product3DViewer({ src }: { src: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Si ya está cargado, no lo volvemos a inyectar
    // @ts-ignore
    if (window.customElements?.get("model-viewer")) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    document.head.appendChild(script);
  }, []);

  if (!src) return null;

  const html = `
    <model-viewer
      src="${src}"
      alt="Modelo 3D del producto"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      style="width: 100%; height: 500px; background: transparent;"
    ></model-viewer>
  `;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
