import { useState } from 'react';
import './index.css';

const collection = [
  { image: 'https://mochi-images-bucket.s3.us-east-2.amazonaws.com/imagesByProduct/d0914e18-cb29-4ccb-a374-d7a4be084945', url: 'https://www.mochizuma.com/product/6ad79d14607f021cdd8b856f/all', name: 'Pequeños grandes tesoros', tag: 'PARA TU COLECCIÓN' },
  { image: 'https://mochi-images-bucket.s3.us-east-2.amazonaws.com/imagesByProduct/e9cd9b46-7c31-469b-a335-f6c7e87f45df', url: 'https://www.mochizuma.com/product/698f7a6b524a1b095ce13382/all', name: 'Personajes con mucha alma', tag: 'EL UNIVERSO MOCHI' },
  { image: 'https://mochi-images-bucket.s3.us-east-2.amazonaws.com/imagesByProduct/502e8a93-e9d1-4fc0-a8d7-dd6a102fd343', url: 'https://www.mochizuma.com/product/6ad246fdd448fb4f335bb7d6/all', name: 'Tu próxima pieza favorita', tag: 'AMOR A PRIMERA VISTA' },
];
const mapUrl = 'https://maps.app.goo.gl/ERLEV6eXB4hqPjcH8';

function Flower({ className = '' }: { className?: string }) {
  return <span className={`flower ${className}`} aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ transform: `rotate(${i * 30}deg)` }} />)}<b /></span>;
}
function Arrow() { return <span aria-hidden="true">↗</span>; }

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <div className="announcement">DEL RECUERDO NACE LA MAGIA <span>✦</span> CELEBREMOS EL DÍA DE MUERTOS <span>✦</span> HECHO CON MUCHO CORAZÓN</div>
    <header className="header">
      <a href="#inicio" className="brand" aria-label="Mochi, inicio"><img src="https://mochi-images-bucket.s3.us-east-2.amazonaws.com/mochizuma_mascota_transparente.png" alt="" /><span>mochi<small>FIGURAS COLECCIONABLES</small></span></a>
      <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Cerrar ×' : 'Menú ☰'}</button>
      <nav id="navigation" className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Navegación principal">
        <a href="#coleccion" onClick={() => setMenuOpen(false)}>La colección</a>
        <a href="#nosotros" onClick={() => setMenuOpen(false)}>Nuestra esencia</a>
        <a href="https://mochizuma.com" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Tienda en línea <Arrow /></a>
        <a className="nav-visit" href="#visitanos" onClick={() => setMenuOpen(false)}>Visítanos <Arrow /></a>
      </nav>
    </header>
    <main id="contenido">
      <section className="hero section-shell" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span /> UNA TRADICIÓN QUE SIGUE VIVA</p>
          <h1>Hay pasiones<br />que viven<br /><em>para siempre.</em></h1>
          <p className="hero-description">Celebramos los recuerdos, el color y esas pequeñas figuras que nos llenan el corazón. Este Día de Muertos, dale más vida a tu colección.</p>
          <a className="button button-orange" href="#coleccion">Descubre la colección <Arrow /></a>
          <div className="hero-note"><span className="mini-star">✳</span><span>Desde Apaxco, con amor.<br /><strong>Para coleccionistas de corazón.</strong></span></div>
        </div>
        <div className="hero-art" aria-label="Mochi entre flores de cempasúchil">
          <div className="papel-string" aria-hidden="true">{['violet', 'orange', 'pink', 'violet', 'orange'].map((color, i) => <span className={`papel ${color}`} key={i}>✿</span>)}</div>
          <div className="arch"><span className="arch-caption">EL RECUERDO FLORECE</span><span className="art-star star-one">✧</span><span className="art-star star-two">✦</span><div className="mochi-halo" /><img className="hero-mochi" src="https://mochi-images-bucket.s3.us-east-2.amazonaws.com/mochizuma_mascota_transparente.png" alt="Mochizuma, nuestra mascota" /><div className="altar-line" /><span className="art-label">MUCHA MAGIA. MUCHO MOCHI.</span></div>
          <div className="edition-stamp">DÍA DE<br /><strong>MUERTOS</strong><span>✦ EDICIÓN DE TEMPORADA ✦</span></div>
          <Flower className="flower-one" /><Flower className="flower-two" /><Flower className="flower-three" />
          <div className="candle candle-one" aria-hidden="true"><i /></div><div className="candle candle-two" aria-hidden="true"><i /></div>
          <span className="art-footnote">EL AMOR NUNCA SE OLVIDA. SE COLECCIONA.</span>
        </div>
      </section>
      <div className="tradition-strip" aria-hidden="true"><span>Recuerdos que florecen</span> ✳ <span>Pasiones que trascienden</span> ✳ <span>Coleccionar es recordar</span> ✳ <span>Recuerdos que florecen</span> ✳</div>
      <section className="collection section-shell" id="coleccion">
        <div className="section-heading"><div><p className="eyebrow">TESOROS CON PERSONALIDAD</p><h2>Una colección <em>con alma.</em></h2></div><p>Hay una figura para cada historia.<br />Encuentra la que conecta contigo.</p></div>
        <div className="product-grid">{collection.map((item, index) => <a className="product-card" key={item.image} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver producto: ${item.name} (abre en una pestaña nueva)`}><div className="product-image"><img src={item.image} alt={`Fotografía de figuras coleccionables de Mochi: ${item.name.toLowerCase()}`} loading="lazy" /><span className="product-number">0{index + 1}</span><span className="expand-image" aria-hidden="true">↗</span></div><div className="product-info"><span>{item.tag}</span><h3>{item.name}</h3><p>Ver producto <span aria-hidden="true">↗</span></p></div></a>)}</div>
        <div style={{ textAlign: 'center' }}><a className="button button-orange" href="https://www.mochizuma.com/catalogo" target="_blank" rel="noopener noreferrer">Ver más productos <Arrow /></a></div>
        <p className="collection-note">✧ ¿Una figura te robó el corazón? Consulta sus detalles y disponibilidad en nuestra tienda en línea.</p>
      </section>
      <section className="story section-shell" id="nosotros"><div className="story-symbol" aria-hidden="true"><Flower /><span>✦</span></div><div><p className="eyebrow">NUESTRA ESENCIA</p><h2>Más que figuras.<br /><em>Un pedacito de ti.</em></h2><p>En Mochi Figuras Coleccionables damos vida a tu pasión por el coleccionismo. Desde Apaxco, Estado de México, buscamos esas piezas únicas que hacen especial tu colección.</p><p>Porque sabemos que una figura puede guardar una historia, un recuerdo o todo un universo.</p></div><span className="story-side" aria-hidden="true">HECHO DE RECUERDOS Y PASIÓN</span></section>
      <section className="visit section-shell" id="visitanos"><p className="eyebrow">AQUÍ EMPIEZA TU PRÓXIMA HISTORIA</p><h2>Nos vemos <em>en Mochi.</em></h2><p>Ven a descubrir tu próxima pieza favorita.<br />Te esperamos en Apaxco, Estado de México.</p><a className="button button-dark" href={mapUrl} target="_blank" rel="noopener noreferrer">Cómo llegar a la tienda <Arrow /></a><span className="visit-detail">Abrir ubicación en Google Maps ↗</span><div><a className="button button-dark" href="https://mochizuma.com" target="_blank" rel="noopener noreferrer">Visita nuestra tienda <Arrow /></a></div><Flower className="visit-flower left" /><Flower className="visit-flower right" /></section>
    </main>
    <footer className="footer"><a href="#inicio" className="footer-brand">mochi<span>✦</span></a><p>Hecho con corazón por Charli & Mochi.<br /><span>© {new Date().getFullYear()} · Apaxco, Estado de México</span></p><a href="#inicio">Volver arriba ↑</a></footer>
  </>;
}
export default App;
