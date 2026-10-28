import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
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

function FlowerRain() {
  const [paused, setPaused] = useState(false);
  return <>
    <div className={`flower-rain${paused ? ' is-paused' : ''}`} aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => <span className="falling-flower" key={index} style={{
        left: `${(index * 37 + 7) % 100}%`,
        '--fall-duration': `${14 + (index * 7) % 13}s`,
        '--fall-delay': `${-((index * 11) % 27)}s`,
        '--flower-size': `${16 + (index * 7) % 19}px`,
        '--drift': `${index % 2 ? -65 : 65}px`,
      } as CSSProperties}><Flower /></span>)}
    </div>
    <button className="rain-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}>
      <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span> {paused ? 'Reanudar flores' : 'Pausar flores'}
    </button>
  </>;
}

function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const enabled = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let x = 0;
    let y = 0;
    const move = (event: PointerEvent) => {
      if (!enabled.matches || event.pointerType === 'touch') return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        if (glow.current) {
          glow.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          glow.current.style.opacity = '1';
        }
      });
    };
    const hide = () => { if (glow.current) glow.current.style.opacity = '0'; };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    enabled.addEventListener('change', hide);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      enabled.removeEventListener('change', hide);
    };
  }, []);
  return <div className="cursor-glow" ref={glow} aria-hidden="true"><span /></div>;
}

// An original, gentle waltz synthesized locally; no external audio downloads.
const melody = [69, 72, 76, 74, 72, 71, 69, 0, 64, 68, 71, 74, 72, 71, 69, 0,
  72, 76, 79, 77, 76, 74, 72, 0, 71, 74, 77, 76, 74, 71, 69, 0];

function MusicPlayer() {
  const [expanded, setExpanded] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof AudioContext === 'undefined') return;
    const context = new AudioContext();
    const output = context.createGain();
    output.gain.value = 0.7 * 0.35;
    output.connect(context.destination);
    audio.current = context;
    master.current = output;
    let disposed = false;
    let hasStarted = false;
    const syncPlayback = () => {
      if (disposed) return;
      if (context.state === 'running') hasStarted = true;
      setPlaying(context.state === 'running');
    };
    context.onstatechange = syncPlayback;
    const startAutomatically = () => {
      // A blocked autoplay attempt can be retried within a user gesture.
      void context.resume().then(syncPlayback).catch(() => {});
    };
    const startOnInteraction = (event: Event) => {
      if (hasStarted || (event.target instanceof Element && event.target.closest('.music-dock'))) return;
      if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return;
      startAutomatically();
    };
    startAutomatically();
    window.addEventListener('pointerdown', startOnInteraction);
    window.addEventListener('keydown', startOnInteraction);
    return () => {
      disposed = true;
      window.removeEventListener('pointerdown', startOnInteraction);
      window.removeEventListener('keydown', startOnInteraction);
      context.onstatechange = null;
      void context.close();
      audio.current = null;
      master.current = null;
    };
  }, []);
  useEffect(() => {
    if (audio.current && master.current) master.current.gain.setTargetAtTime(volume / 100 * 0.35, audio.current.currentTime, 0.08);
  }, [volume, playing]);

  useEffect(() => {
    if (!playing || !audio.current || !master.current) return;
    const context = audio.current;
    const output = master.current;
    let nextNote = context.currentTime + 0.1;
    let beat = 0;
    const sound = (midi: number, time: number, duration: number, strength: number, type: OscillatorType) => {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
      envelope.gain.setValueAtTime(0, time);
      envelope.gain.linearRampToValueAtTime(strength, time + 0.015);
      envelope.gain.exponentialRampToValueAtTime(0.001, time + duration);
      oscillator.connect(envelope);
      envelope.connect(output);
      oscillator.start(time);
      oscillator.stop(time + duration + 0.02);
      oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
    };
    const schedule = () => {
      nextNote = Math.max(nextNote, context.currentTime);
      while (nextNote < context.currentTime + 0.3) {
        const note = melody[beat % melody.length];
        if (note) {
          sound(note, nextNote, 0.85, 0.6, 'triangle');
          sound(note + 12, nextNote, 0.35, 0.12, 'sine');
        }
        if (beat % 3 === 0) sound([45, 48, 50, 52][Math.floor(beat / 6) % 4], nextNote, 1.3, 0.35, 'sine');
        nextNote += 0.42;
        beat++;
      }
    };
    schedule();
    const timer = window.setInterval(schedule, 100);
    return () => window.clearInterval(timer);
  }, [playing]);

  const toggle = async () => {
    setBusy(true);
    try {
      if (!audio.current) {
        audio.current = new AudioContext();
        master.current = audio.current.createGain();
        master.current.gain.value = volume / 100 * 0.35;
        master.current.connect(audio.current.destination);
      }
      if (playing) await audio.current.suspend();
      else await audio.current.resume();
      setPlaying(!playing);
      setError('');
    } catch {
      setError('No se pudo iniciar el audio. Intenta de nuevo.');
    } finally { setBusy(false); }
  };

  return <aside className="music-dock" aria-label="Música de fondo">
    <button className={`music-dock-toggle${playing ? ' is-playing' : ''}`} onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="background-music-controls"><span aria-hidden="true">♫</span><span>Música de fondo<small>{playing ? 'Reproduciendo' : 'Activar música'}</small></span><span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
    <div id="background-music-controls" className="music-player" hidden={!expanded}>
    <span className={`music-icon${playing ? ' is-playing' : ''}`} aria-hidden="true">♫</span>
    <div className="music-copy"><strong>Un vals entre flores</strong><span>Melodía original · ambiente de Día de Muertos</span></div>
    <button className="music-button" onClick={toggle} disabled={busy} aria-pressed={playing}><span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span> {playing ? 'Pausar música' : 'Escuchar música'}</button>
    <label className="music-volume">Volumen<input type="range" min="0" max="100" value={volume} onChange={event => setVolume(Number(event.target.value))} /></label>
    <p className="music-error" role="status">{error}</p>
    </div>
  </aside>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState(collection[0]);
  const previewDialog = useRef<HTMLDialogElement>(null);
  const mainContent = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = Array.from(mainContent.current?.querySelectorAll('section') ?? []);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const updateSections = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const fadeDistance = Math.min(420, viewportHeight * 0.5);

      sections.forEach(section => {
        if (reducedMotion.matches) {
          section.classList.remove('scroll-scene');
          return;
        }

        const { top, bottom } = section.getBoundingClientRect();
        const entering = Math.max(0, Math.min(1, (viewportHeight - top) / fadeDistance));
        const leaving = Math.max(0, Math.min(1, (bottom - 100) / fadeDistance));
        const visibility = Math.min(entering, leaving);
        section.style.setProperty('--scene-opacity', String(visibility));
        section.style.setProperty('--scene-scale', String(0.96 + visibility * 0.04));
        section.style.setProperty('--scene-offset', `${(1 - entering) * 65 - (1 - leaving) * 45}px`);
        section.classList.add('scroll-scene');
      });
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateSections);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    reducedMotion.addEventListener('change', scheduleUpdate);
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    sections.forEach(section => resizeObserver.observe(section));

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      reducedMotion.removeEventListener('change', scheduleUpdate);
      resizeObserver.disconnect();
      sections.forEach(section => {
        section.classList.remove('scroll-scene');
        section.style.removeProperty('--scene-opacity');
        section.style.removeProperty('--scene-scale');
        section.style.removeProperty('--scene-offset');
      });
    };
  }, []);

  const openPreview = (item: typeof collection[number]) => {
    setPreview(item);
    previewDialog.current?.showModal();
  };
  return <>
    <FlowerRain />
    <CursorGlow />
    <MusicPlayer />
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <div className="announcement">DEL RECUERDO NACE LA MAGIA <span>✦</span> CELEBREMOS EL DÍA DE MUERTOS <span>✦</span> HECHO CON MUCHO CORAZÓN</div>
    <header className="header">
      <a href="#inicio" className="brand" aria-label="Mochi, inicio"><img src="https://mochi-images-bucket.s3.us-east-2.amazonaws.com/mochizuma_mascota_transparente.png" alt="" /><span>mochi<small>FIGURAS COLECCIONABLES</small></span></a>
      <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Cerrar ×' : 'Menú ☰'}</button>
      <nav id="navigation" className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Navegación principal">
        <a href="#coleccion" onClick={() => setMenuOpen(false)}>La colección</a>
        <a href="#nosotros" onClick={() => setMenuOpen(false)}>Nuestra esencia</a>
        <a href="#calaverita" onClick={() => setMenuOpen(false)}>Calaverita ♫</a>
        <a href="https://mochizuma.com" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Tienda en línea <Arrow /></a>
        <a className="nav-visit" href="#visitanos" onClick={() => setMenuOpen(false)}>Visítanos <Arrow /></a>
      </nav>
    </header>
    <main id="contenido" ref={mainContent}>
      <section className="hero section-shell" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span /> UNA TRADICIÓN QUE SIGUE VIVA</p>
          <h1>Hay pasiones<br />que viven<br /><em>para siempre.</em></h1>
          <p className="hero-description">Celebramos los recuerdos, el color y esas pequeñas figuras que nos llenan el corazón. Este Día de Muertos, dale más vida a tu colección.</p>
          <div className="hero-actions"><a className="button button-orange" href="#coleccion">Descubre la colección <Arrow /></a><a className="text-link" href="#visitanos">Conoce la tienda <span aria-hidden="true">↓</span></a></div><div className="hero-chips"><span>✦ Figuras con personalidad</span><span>♡ Pasión por coleccionar</span></div>
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
        <div className="collection-toolbar"><span>La selección Mochi <b>03 piezas</b></span><span>Explora. Acércate. Enamórate.</span></div>
        <div className="product-grid">{collection.map((item, index) => <article className="product-card" key={item.image}>
          <div className="product-image"><a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver producto: ${item.name} (abre en una pestaña nueva)`}><img src={item.image} alt={`Figuras coleccionables de Mochi: ${item.name.toLowerCase()}`} loading="lazy" /></a><span className="product-number">0{index + 1}</span><button className="quick-view" onClick={() => openPreview(item)} aria-label={`Vista rápida: ${item.name}`}>Vista rápida <span aria-hidden="true">＋</span></button></div>
          <div className="product-info"><span>{item.tag}</span><h3>{item.name}</h3><a className="product-link" href={item.url} target="_blank" rel="noopener noreferrer">Ver producto <Arrow /></a></div>
        </article>)}</div>
        <div className="catalog-cta"><span className="catalog-spark" aria-hidden="true">✳</span><div><h3>Tu próxima historia está por aquí.</h3><p>Esto es solo el comienzo. Descubre más figuras en el catálogo.</p></div><a className="button button-orange" href="https://www.mochizuma.com/catalogo" target="_blank" rel="noopener noreferrer">Ver más productos <Arrow /></a></div>
        <p className="collection-note">✧ ¿Una figura te robó el corazón? Consulta sus detalles y disponibilidad en nuestra tienda en línea.</p>
      </section>
      <section className="story section-shell" id="nosotros"><div className="story-symbol" aria-hidden="true"><Flower /><span>✦</span></div><div><p className="eyebrow">NUESTRA ESENCIA</p><h2>Más que figuras.<br /><em>Un pedacito de ti.</em></h2><p>En Mochi Figuras Coleccionables damos vida a tu pasión por el coleccionismo. Desde Apaxco, Estado de México, buscamos esas piezas únicas que hacen especial tu colección.</p><p>Porque sabemos que una figura puede guardar una historia, un recuerdo o todo un universo.</p></div><span className="story-side" aria-hidden="true">HECHO DE RECUERDOS Y PASIÓN</span></section>
      <section className="discover section-shell" aria-labelledby="discover-title">
        <div className="section-heading"><div><p className="eyebrow">HAZ ESPACIO PARA ALGO ESPECIAL</p><h2 id="discover-title">Tu colección empieza <em>con una conexión.</em></h2></div></div>
        <div className="journey-grid">{[
          { number: '01', icon: '✧', title: 'Encuentra tu favorita', text: 'Explora nuestra selección o recorre el catálogo completo.', href: 'https://www.mochizuma.com/catalogo', label: 'Explorar catálogo' },
          { number: '02', icon: '♡', title: 'Conoce cada detalle', text: 'Abre el producto en la tienda para consultar sus detalles y disponibilidad.', href: '#coleccion', label: 'Ver la selección' },
          { number: '03', icon: '⌖', title: 'Vive la experiencia Mochi', text: '¿Prefieres descubrirlas en persona? Encuéntranos en Apaxco.', href: '#visitanos', label: 'Planea tu visita' },
        ].map(step => <a className="journey-card" href={step.href} key={step.number}><div><span className="journey-icon" aria-hidden="true">{step.icon}</span><span className="step-number">{step.number}</span></div><h3>{step.title}</h3><p>{step.text}</p><span className="journey-link">{step.label} <Arrow /></span></a>)}</div>
      </section>
      <section className="calaverita section-shell" id="calaverita" aria-labelledby="calaverita-title">
        <div className="calaverita-intro"><p className="eyebrow">VERSOS, FLORES Y UN POQUITO DE HUMOR</p><h2 id="calaverita-title">Hasta la Muerte<br /><em>quiere un Mochi.</em></h2><p>Una calaverita para quienes coleccionan con el corazón.</p></div>
        <article className="poem-card"><span className="poem-ornament" aria-hidden="true">✦ ☠ ✦</span><p className="poem-caption">LA CALACA COLECCIONISTA</p>
          <p>Por las calles de Apaxco<br />la Catrina se paseó;<br />vio las figuras de Mochi<br />y en la puerta se quedó.</p>
          <p>«Vengo por un coleccionista»,<br />dijo con mucha emoción;<br />pero al mirar la vitrina<br />¡se le alegró el corazón!</p>
          <p>Mochi le mostró una pieza,<br />la más linda del lugar;<br />y la flaca, muy coqueta,<br />ya no se quiso marchar.</p>
          <p>Hoy presume sus tesoros<br />entre flores de panteón:<br />«¡Que me espere el camposanto,<br />voy a ampliar mi colección!»</p>
          <span className="poem-signature">Con cariño, Mochi <span aria-hidden="true">♡</span></span><Flower className="poem-flower" />
        </article>
      </section>
      <section className="faq section-shell" aria-labelledby="faq-title"><div><p className="eyebrow">ANTES DE ENAMORARTE</p><h2 id="faq-title">Unas pequeñas <em>respuestas.</em></h2><p>Para que disfrutes cada paso de tu próxima colección.</p></div><div className="faq-list">{[
        ['¿Dónde puedo ver más figuras?', 'En nuestro catálogo en línea encontrarás más productos. Usa el botón “Ver más productos” para seguir explorando.'],
        ['¿Cómo consulto el precio y la disponibilidad?', 'Selecciona “Ver producto” en la figura que te guste. Su página en la tienda es el lugar para consultar los detalles y la disponibilidad.'],
        ['¿Puedo visitar la tienda?', '¡Sí! Estamos en Apaxco, Estado de México. En la sección “Visítanos” puedes abrir nuestra ubicación en Google Maps y planear tu recorrido.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">＋</span></summary><p>{answer}</p></details>)}</div></section>
      <section className="visit section-shell" id="visitanos"><p className="eyebrow">AQUÍ EMPIEZA TU PRÓXIMA HISTORIA</p><h2>Nos vemos <em>en Mochi.</em></h2><p>Ven a descubrir tu próxima pieza favorita.<br />Te esperamos en Apaxco, Estado de México.</p><a className="button button-dark" href={mapUrl} target="_blank" rel="noopener noreferrer">Cómo llegar a la tienda <Arrow /></a><span className="visit-detail">Abrir ubicación en Google Maps ↗</span><div><a className="button button-dark" href="https://mochizuma.com" target="_blank" rel="noopener noreferrer">Visita nuestra tienda <Arrow /></a></div><Flower className="visit-flower left" /><Flower className="visit-flower right" /></section>
    </main>
    <div className="mobile-catalog"><span>Encuentra tu próxima favorita <span aria-hidden="true">✦</span></span><a href="https://www.mochizuma.com/catalogo" target="_blank" rel="noopener noreferrer">Ver catálogo <Arrow /></a></div>
    <dialog className="photo-dialog" ref={previewDialog} aria-labelledby="preview-title" onClick={event => { if (event.target === event.currentTarget) previewDialog.current?.close(); }}>
      <form method="dialog"><button className="dialog-close" aria-label="Cerrar vista rápida">×</button></form>
      <img src={preview.image} alt={preview.name} />
      <div className="preview-info"><p className="eyebrow">{preview.tag}</p><h3 id="preview-title">{preview.name}</h3><p>Una mirada más de cerca a tu próxima pieza favorita.</p><a className="button button-orange" href={preview.url} target="_blank" rel="noopener noreferrer">Ver detalles en la tienda <Arrow /></a><small>Consulta precio y disponibilidad en la tienda en línea.</small></div>
    </dialog>
    <footer className="footer"><a href="#inicio" className="footer-brand">mochi<span>✦</span></a><p>Hecho con corazón por Charli & Mochi.<br /><span>© {new Date().getFullYear()} · Apaxco, Estado de México</span></p><a href="#inicio">Volver arriba ↑</a></footer>
  </>;
}
export default App;
