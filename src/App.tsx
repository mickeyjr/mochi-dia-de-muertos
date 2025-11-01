import "./index.css";
import { useEffect, useState } from "react";

function App() {
  const images = [
    "https://mochi-images-bucket.s3.us-east-2.amazonaws.com/imagesByProduct/mochi3.jpg", // Catrina figura
    "https://mochi-images-bucket.s3.us-east-2.amazonaws.com/imagesByProduct/mochi2.jpg", // Calavera decorativa
    "https://mochi-images-bucket.s3.us-east-2.amazonaws.com/imagesByProduct/mochi1.jpeg", // Figura de altar
  ];

  // 🌼 Pétalos de cempasúchil
  const [petalos, setPetalos] = useState<number[]>([]);

  useEffect(() => {
    const count = 20; // cantidad de pétalos visibles
    setPetalos(Array.from({ length: count }, (_, i) => i));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-between bg-gradient-to-b from-morado via-oscuro to-black font-body">
      {/* 🌼 Pétalos animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {petalos.map((i) => (
          <span
            key={i}
            className="petalo"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${6 + Math.random() * 5}s`,
              transform: `scale(${0.6 + Math.random() * 0.8})`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="w-full text-center py-10 z-10">
        <h1 className="text-5xl md:text-6xl font-titulo text-naranja drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
          💀 Tienda Mochi 💐
        </h1>
        <p className="mt-3 text-lg md:text-xl text-white/90">
          En Mochi Figuras Coleccionables damos vida a tu pasión por el coleccionismo. Estamos orgullosamente a tu servicio desde Apaxco, Estado de México, trayéndote las piezas más únicas y especiales para tu colección.
        </p>
      </header>

      {/* Galería */}
      <main className="z-10 flex flex-col items-center gap-6 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.1)] w-[90%] md:w-[70%] max-w-5xl">
        <h2 className="text-3xl font-titulo text-naranja">Colección Especial 💫</h2>
        <p className="text-white/80 text-center mb-6 max-w-xl">
          Nos dedicamos a encontrar esa figura que tanto deseas esa pieza que le da el toque especial a tu colección para que no tengas que preocuparte por nada más que disfrutarla.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-xl overflow-hidden border-4 border-naranja shadow-[0_0_25px_rgba(249,115,22,0.5)] hover:scale-105 transition-transform duration-300 bg-black/50"
            >
              <img
                src={src}
                alt={`Figura ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full bg-morado/90 py-6 text-center mt-10 text-white border-t border-white/20 shadow-inner z-10">
        <p className="text-sm md:text-base">
          Hecho con 💜 por <span className="font-semibold">Charli & Mochi</span> — Tienda de Figuras Coleccionables 2025
        </p>
        <div className="flex justify-center gap-3 mt-3 text-xl">
          <span className="text-naranja">🕯️</span>
          <span className="text-verde">🌼</span>
          <span className="text-white">💀</span>
          <span className="text-naranja">🕯️</span>
        </div>
        <div className="mt-4">
          <a
            href="https://maps.app.goo.gl/ERLEV6eXB4hqPjcH8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:text-naranja underline transition-colors"
          >
            📍 Nos ubicamos aquí
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
