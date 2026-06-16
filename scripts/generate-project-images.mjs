/**
 * Generador de imágenes de proyectos (SVG 1200×630).
 *
 * Produce un set consistente de mockups de interfaz, uno por proyecto:
 * fondo oscuro uniforme + color de acento propio + una ventana de app con
 * un mockup acorde al dominio del proyecto. Sustituye a las antiguas
 * imágenes JPG duplicadas / fotos de stock genéricas.
 *
 * Uso: `node scripts/generate-project-images.mjs`
 * Salida: public/images/proyectos/{id}.svg
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../public/images/proyectos');

const FONT = 'system-ui, -apple-system, Segoe UI, sans-serif';

// Región de contenido dentro de la ventana de app.
const WIN = { x: 120, y: 128, w: 960, h: 344 };
const PAD = 28;
const CONTENT = {
  x: WIN.x + PAD,
  y: WIN.y + 56,
  w: WIN.w - PAD * 2,
  h: WIN.h - 56 - PAD,
};

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const text = (x, y, content, { size = 16, weight = 400, fill = '#e2e8f0', anchor = 'start', spacing, deco } = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${spacing ? ` letter-spacing="${spacing}"` : ''}${deco ? ` text-decoration="${deco}"` : ''}>${esc(content)}</text>`;

const rect = (x, y, w, h, { r = 0, fill = 'none', stroke, sw = 1, opacity } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"${fill ? ` fill="${fill}"` : ''}${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}${opacity != null ? ` opacity="${opacity}"` : ''}/>`;

const circle = (cx, cy, rad, { fill = 'none', opacity } = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}"${opacity != null ? ` opacity="${opacity}"` : ''}/>`;

const check = (x, y, accent) =>
  `<g transform="translate(${x}, ${y})"><circle cx="11" cy="11" r="11" fill="${accent}22"/><path d="M6 11 l3.5 3.5 l7 -7" fill="none" stroke="${accent}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>`;

// ---------- Arquetipos de mockup ----------

const dashboard = (a, a2) => {
  const { x, y, w } = CONTENT;
  let s = '';
  // tarjetas KPI
  const cardW = (w - 36) / 3;
  const kpis = [['Ventas', '€48.2k', a], ['Visitas', '12.480', a2], ['Conversión', '3,8%', a]];
  kpis.forEach(([label, val, c], i) => {
    const cx = x + i * (cardW + 18);
    s += rect(cx, y, cardW, 86, { r: 12, fill: '#0b1220', stroke: '#1e293b' });
    s += text(cx + 18, y + 32, label, { size: 14, fill: '#64748b' });
    s += text(cx + 18, y + 66, val, { size: 26, weight: 800, fill: c });
  });
  // gráfico de barras
  const gy = y + 116;
  const gh = 130;
  s += rect(x, gy, w, gh, { r: 12, fill: '#0b1220', stroke: '#1e293b' });
  const bars = [0.5, 0.72, 0.4, 0.85, 0.62, 0.95, 0.55, 0.78];
  const bw = 46;
  const gap = (w - 56 - bars.length * bw) / (bars.length - 1);
  bars.forEach((bv, i) => {
    const bh = Math.round((gh - 56) * bv);
    const bx = x + 28 + i * (bw + gap);
    const by = gy + gh - 24 - bh;
    s += rect(bx, by, bw, bh, { r: 6, fill: i % 2 ? a2 : a });
  });
  return s;
};

const kanban = (a, a2, cols) => {
  const { x, y, w, h } = CONTENT;
  let s = '';
  const colW = (w - 36) / 3;
  cols.forEach((col, i) => {
    const cx = x + i * (colW + 18);
    s += rect(cx, y, colW, h, { r: 12, fill: '#0b1220', stroke: '#1e293b' });
    s += text(cx + 16, y + 30, col.title, { size: 14, weight: 700, fill: i === 0 ? a : i === 1 ? a2 : '#94a3b8' });
    s += rect(cx + colW - 44, y + 16, 28, 20, { r: 6, fill: '#1e293b' });
    s += text(cx + colW - 30, y + 31, String(col.cards.length), { size: 12, weight: 700, fill: '#94a3b8', anchor: 'middle' });
    col.cards.forEach((card, j) => {
      const ky = y + 48 + j * 60;
      s += rect(cx + 14, ky, colW - 28, 48, { r: 8, fill: '#111827', stroke: '#1e293b' });
      s += rect(cx + 14, ky, 4, 48, { r: 2, fill: j % 2 ? a2 : a });
      s += text(cx + 28, ky + 22, card, { size: 13, weight: 600, fill: '#cbd5e1' });
      s += rect(cx + 28, ky + 32, 70, 8, { r: 4, fill: '#1e293b' });
    });
  });
  return s;
};

const ecommerce = (a, a2, labels) => {
  const { x, y, w } = CONTENT;
  let s = '';
  const cardW = (w - 54) / 4;
  for (let i = 0; i < 4; i++) {
    const cx = x + i * (cardW + 18);
    s += rect(cx, y, cardW, 150, { r: 12, fill: '#0b1220', stroke: '#1e293b' });
    s += rect(cx + 14, y + 14, cardW - 28, 78, { r: 8, fill: `${i % 2 ? a2 : a}22` });
    s += circle(cx + cardW / 2, y + 53, 22, { fill: `${i % 2 ? a2 : a}` , opacity: 0.55 });
    s += rect(cx + 14, y + 102, cardW - 50, 9, { r: 4, fill: '#1e293b' });
    s += text(cx + 14, y + 138, `€${(19 + i * 10)}`, { size: 16, weight: 800, fill: i % 2 ? a2 : a });
  }
  // barra de carrito
  const by = y + 174;
  s += rect(x, by, w, 56, { r: 12, fill: '#0b1220', stroke: '#1e293b' });
  s += text(x + 20, by + 35, labels.cart, { size: 15, fill: '#94a3b8' });
  s += rect(x + w - 168, by + 12, 152, 32, { r: 8, fill: a });
  s += text(x + w - 92, by + 33, labels.cta, { size: 14, weight: 700, fill: '#06121f', anchor: 'middle' });
  return s;
};

const calendar = (a, a2, labels) => {
  const { x, y, w, h } = CONTENT;
  let s = '';
  const leftW = w * 0.52;
  s += rect(x, y, leftW, h, { r: 12, fill: '#0b1220', stroke: '#1e293b' });
  s += text(x + 20, y + 32, labels.month, { size: 16, weight: 700, fill: '#e2e8f0' });
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const cellW = (leftW - 40) / 7;
  days.forEach((d, i) => {
    s += text(x + 20 + cellW * i + cellW / 2, y + 64, d, { size: 12, fill: '#64748b', anchor: 'middle' });
  });
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      const n = row * 7 + col + 8;
      const dx = x + 20 + cellW * col + cellW / 2;
      const dy = y + 96 + row * 40;
      const sel = n === 16;
      if (sel) s += circle(dx, dy - 5, 16, { fill: a });
      s += text(dx, dy, String(n), { size: 13, weight: sel ? 700 : 500, fill: sel ? '#06121f' : '#94a3b8', anchor: 'middle' });
    }
  }
  // panel derecho: slots + resumen
  const rx = x + leftW + 20;
  const rw = w - leftW - 20;
  s += rect(rx, y, rw, h, { r: 12, fill: '#0b1220', stroke: '#1e293b' });
  s += text(rx + 20, y + 32, labels.panel, { size: 15, weight: 700, fill: a2 });
  const slots = [[labels.s1, true], [labels.s2, false], [labels.s3, false]];
  slots.forEach(([t, on], i) => {
    const sy = y + 52 + i * 42;
    s += rect(rx + 20, sy, rw - 40, 32, { r: 8, fill: on ? `${a}22` : '#111827', stroke: on ? a : '#1e293b' });
    s += text(rx + 34, sy + 21, t, { size: 13, weight: on ? 700 : 500, fill: on ? a2 : '#94a3b8' });
  });
  s += rect(rx + 20, y + h - 50, rw - 40, 36, { r: 8, fill: a });
  s += text(rx + rw / 2, y + h - 26, labels.cta, { size: 14, weight: 700, fill: '#06121f', anchor: 'middle' });
  return s;
};

const landing = (a, a2, labels) => {
  const { x, y, w, h } = CONTENT;
  let s = '';
  s += rect(x, y + 6, w * 0.6, 18, { r: 9, fill: '#1e293b' });
  s += text(x, y + 70, labels.h1, { size: 38, weight: 800, fill: '#f8fafc' });
  s += text(x, y + 104, labels.sub, { size: 16, fill: '#94a3b8' });
  s += rect(x, y + 130, 168, 44, { r: 10, fill: a });
  s += text(x + 84, y + 158, labels.cta, { size: 15, weight: 700, fill: '#06121f', anchor: 'middle' });
  s += rect(x + 184, y + 130, 150, 44, { r: 10, fill: 'none', stroke: a2, sw: 2 });
  s += text(x + 259, y + 158, labels.cta2, { size: 15, weight: 600, fill: a2, anchor: 'middle' });
  // tarjeta de métrica a la derecha
  const cx = x + w - 250;
  s += rect(cx, y, 250, h, { r: 14, fill: '#0b1220', stroke: '#1e293b' });
  s += text(cx + 24, y + 44, labels.metricLabel, { size: 14, fill: '#64748b' });
  s += text(cx + 24, y + 96, labels.metric, { size: 44, weight: 800, fill: a2 });
  const spark = [0.4, 0.55, 0.48, 0.7, 0.65, 0.9];
  let path = '';
  spark.forEach((v, i) => {
    const px = cx + 24 + i * 36;
    const py = y + 200 - v * 80;
    path += `${i ? 'L' : 'M'}${px} ${py} `;
  });
  s += `<path d="${path}" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  return s;
};

const listView = (a, a2, labels) => {
  // lista con progreso/estado (educación, restaurante, menú)
  const { x, y, w } = CONTENT;
  let s = '';
  labels.rows.forEach((row, i) => {
    const ry = y + i * 64;
    s += rect(x, ry, w, 52, { r: 10, fill: '#0b1220', stroke: '#1e293b' });
    s += rect(x + 14, ry + 12, 28, 28, { r: 8, fill: `${i % 2 ? a2 : a}33` });
    s += text(x + 28, ry + 31, String(i + 1), { size: 14, weight: 700, fill: i % 2 ? a2 : a, anchor: 'middle' });
    s += text(x + 58, ry + 32, row.label, { size: 15, weight: 600, fill: '#cbd5e1' });
    if (row.progress != null) {
      const barW = 220;
      const barX = x + w - barW - 70;
      s += rect(barX, ry + 22, barW, 8, { r: 4, fill: '#1e293b' });
      s += rect(barX, ry + 22, Math.round(barW * row.progress), 8, { r: 4, fill: a });
      s += text(x + w - 20, ry + 32, `${Math.round(row.progress * 100)}%`, { size: 13, weight: 700, fill: a2, anchor: 'end' });
    } else if (row.tag) {
      s += rect(x + w - 120, ry + 14, 104, 26, { r: 13, fill: `${a}22` });
      s += text(x + w - 68, ry + 32, row.tag, { size: 12, weight: 700, fill: a2, anchor: 'middle' });
    }
  });
  return s;
};

const formView = (a, a2, labels) => {
  const { x, y, w, h } = CONTENT;
  let s = '';
  const leftW = w * 0.56;
  labels.fields.forEach((f, i) => {
    const fy = y + i * 58;
    s += text(x, fy + 14, f, { size: 13, weight: 600, fill: '#64748b' });
    s += rect(x, fy + 22, leftW, 34, { r: 8, fill: '#0b1220', stroke: i === 0 ? a : '#1e293b' });
    s += rect(x + 14, fy + 33, leftW * (0.3 + 0.15 * i), 10, { r: 5, fill: '#1e293b' });
  });
  // panel total
  const rx = x + leftW + 24;
  const rw = w - leftW - 24;
  s += rect(rx, y, rw, h, { r: 14, fill: '#0b1220', stroke: '#1e293b' });
  s += text(rx + 22, y + 40, labels.totalLabel, { size: 14, fill: '#64748b' });
  s += text(rx + rw / 2, y + 110, labels.total, { size: 40, weight: 800, fill: a2, anchor: 'middle' });
  s += `<line x1="${rx + 22}" y1="${y + 134}" x2="${rx + rw - 22}" y2="${y + 134}" stroke="#1e293b"/>`;
  s += rect(rx + 22, y + h - 48, rw - 44, 36, { r: 8, fill: a });
  s += text(rx + rw / 2, y + h - 24, labels.cta, { size: 14, weight: 700, fill: '#06121f', anchor: 'middle' });
  return s;
};

const realestate = (a, a2, labels) => {
  const { x, y, w } = CONTENT;
  let s = '';
  // barra de filtros
  s += rect(x, y, w, 40, { r: 10, fill: '#0b1220', stroke: '#1e293b' });
  labels.filters.forEach((f, i) => {
    const fx = x + 16 + i * 150;
    s += rect(fx, y + 8, 134, 24, { r: 12, fill: i === 0 ? `${a}22` : '#111827', stroke: i === 0 ? a : '#1e293b' });
    s += text(fx + 67, y + 24, f, { size: 12, weight: 600, fill: i === 0 ? a2 : '#94a3b8', anchor: 'middle' });
  });
  // tarjetas de propiedad
  const cardW = (w - 36) / 3;
  for (let i = 0; i < 3; i++) {
    const cx = x + i * (cardW + 18);
    const cy = y + 56;
    s += rect(cx, cy, cardW, 152, { r: 12, fill: '#0b1220', stroke: '#1e293b' });
    s += rect(cx + 12, cy + 12, cardW - 24, 80, { r: 8, fill: `${i % 2 ? a2 : a}22` });
    // pin
    s += `<path d="M${cx + cardW / 2} ${cy + 38} a14 14 0 1 0 0.01 0 M${cx + cardW / 2} ${cy + 52} l0 12" fill="none" stroke="${i % 2 ? a2 : a}" stroke-width="3"/>`;
    s += text(cx + 14, cy + 116, labels.price[i], { size: 17, weight: 800, fill: i % 2 ? a2 : a });
    s += rect(cx + 14, cy + 128, cardW - 70, 8, { r: 4, fill: '#1e293b' });
  }
  return s;
};

const terminal = (a, a2, labels) => {
  const { x, y, w, h } = CONTENT;
  let s = '';
  s += rect(x, y, w, h, { r: 12, fill: '#05140a', stroke: `${a}55` });
  const lines = labels.lines;
  lines.forEach((ln, i) => {
    const ly = y + 34 + i * 30;
    if (ln.prompt) s += text(x + 20, ly, '$', { size: 15, weight: 700, fill: a });
    s += text(x + (ln.prompt ? 40 : 20), ly, ln.t, { size: 15, weight: ln.prompt ? 600 : 400, fill: ln.dim ? '#3f6f4f' : a2 });
  });
  // cursor
  const cy = y + 34 + lines.length * 30;
  s += text(x + 20, cy, '$', { size: 15, weight: 700, fill: a });
  s += rect(x + 38, cy - 14, 11, 18, { fill: a2 });
  return s;
};

const ARCHETYPES = { dashboard, kanban, ecommerce, calendar, landing, listView, formView, realestate, terminal };

// ---------- Configuración por proyecto ----------

const PROJECTS = [
  {
    id: 'app-restaurante', label: 'APP MÓVIL', title: 'App Restaurante',
    subtitle: 'Menú digital, pedidos y reservas en tiempo real', accent: '#f87171', accent2: '#fca5a5',
    archetype: 'listView', data: { rows: [
      { label: 'Mesa 4 · 2× Brasa, 1× Vino', tag: 'En cocina' },
      { label: 'Mesa 7 · Menú del día', tag: 'Servido' },
      { label: 'Reserva 21:00 · 4 pax', tag: 'Confirmada' },
      { label: 'Mesa 2 · Postres', tag: 'Nuevo' },
    ] },
  },
  {
    id: 'dashboard-analytics', label: 'DASHBOARD', title: 'Analytics Dashboard',
    subtitle: 'KPIs de negocio en tiempo real, sin exportar Excel', accent: '#6366f1', accent2: '#818cf8',
    archetype: 'dashboard', data: {},
  },
  {
    id: 'ecommerce-boutique', label: 'E-COMMERCE', title: 'Boutique Online',
    subtitle: 'Tienda de moda con checkout en 3 clics', accent: '#ec4899', accent2: '#f472b6',
    archetype: 'ecommerce', data: { cart: 'Carrito · 3 artículos', cta: 'Pagar' },
  },
  {
    id: 'ecommerce-tech', label: 'E-COMMERCE', title: 'TechStore Online',
    subtitle: 'Catálogo de electrónica con stock en vivo', accent: '#06b6d4', accent2: '#22d3ee',
    archetype: 'ecommerce', data: { cart: 'Carrito · 2 artículos', cta: 'Comprar' },
  },
  {
    id: 'ecommerce-organico', label: 'E-COMMERCE', title: 'EcoMercado',
    subtitle: 'Tienda de producto ecológico y de proximidad', accent: '#16a34a', accent2: '#4ade80',
    archetype: 'ecommerce', data: { cart: 'Cesta · 5 productos', cta: 'Tramitar' },
  },
  {
    id: 'gestion-citas', label: 'AGENDA', title: 'Gestión de Citas',
    subtitle: 'Reserva online sin solapamientos', accent: '#0ea5e9', accent2: '#38bdf8',
    archetype: 'calendar', data: { month: 'Junio 2026', panel: 'Horarios', s1: '10:00 — Dra. López', s2: '11:00 — Disponible', s3: '12:00 — Disponible', cta: 'Confirmar cita' },
  },
  {
    id: 'plataforma-educativa', label: 'PLATAFORMA', title: 'Plataforma Educativa',
    subtitle: 'Cursos online con progreso por lección', accent: '#ea580c', accent2: '#fb923c',
    archetype: 'listView', data: { rows: [
      { label: 'Introducción al marketing', progress: 1 },
      { label: 'SEO y contenidos', progress: 0.66 },
      { label: 'Publicidad de pago', progress: 0.3 },
      { label: 'Analítica y CRO', progress: 0.05 },
    ] },
  },
  {
    id: 'portal-inmobiliario', label: 'PORTAL WEB', title: 'Portal Inmobiliario',
    subtitle: 'Búsqueda avanzada y captación de leads', accent: '#2563eb', accent2: '#60a5fa',
    archetype: 'realestate', data: { filters: ['Mataró', '2-3 hab', '< 250.000€'], price: ['185.000€', '232.000€', '149.000€'] },
  },
  {
    id: 'landing-saas', label: 'LANDING', title: 'MetricFlow SaaS',
    subtitle: 'Landing de producto con CRO optimizado', accent: '#7c3aed', accent2: '#a78bfa',
    archetype: 'landing', data: { h1: 'Tus métricas,', sub: 'claras y en tiempo real para tu equipo.', cta: 'Empezar gratis', cta2: 'Ver demo', metricLabel: 'Conversión', metric: '+38%' },
  },
  {
    id: 'gestor-tareas', label: 'PRODUCTIVIDAD', title: 'Gestor de Tareas',
    subtitle: 'Tablero Kanban para equipos', accent: '#3b82f6', accent2: '#60a5fa',
    archetype: 'kanban', data: { /* placeholder */ }, cols: [
      { title: 'Por hacer', cards: ['Diseño home', 'Wireframes', 'Copy landing'] },
      { title: 'En curso', cards: ['API pedidos', 'Tests e2e'] },
      { title: 'Hecho', cards: ['Setup repo', 'CI/CD'] },
    ],
  },
  {
    id: 'presupuestador-web', label: 'HERRAMIENTA', title: 'Presupuestador Web',
    subtitle: 'Cálculo de presupuesto en tiempo real', accent: '#059669', accent2: '#34d399',
    archetype: 'formView', data: { fields: ['Tipo de proyecto', 'Número de páginas', 'Funcionalidades'], totalLabel: 'Presupuesto estimado', total: '€1.450', cta: 'Solicitar' },
  },
  {
    id: 'menu-qr-cafe', label: 'MENÚ DIGITAL', title: 'Menú QR Café',
    subtitle: 'Carta digital con código QR en mesa', accent: '#d97706', accent2: '#fbbf24',
    archetype: 'listView', data: { rows: [
      { label: 'Café con leche', tag: '€1,80' },
      { label: 'Tostada de aguacate', tag: '€4,50' },
      { label: 'Zumo natural', tag: '€2,90' },
      { label: 'Brownie casero', tag: '€3,20' },
    ] },
  },
  {
    id: 'crm-leads', label: 'CRM', title: 'CRM de Leads',
    subtitle: 'Pipeline de ventas con seguimiento', accent: '#8b5cf6', accent2: '#a78bfa',
    archetype: 'kanban', data: {}, cols: [
      { title: 'Nuevos', cards: ['Marta — web', 'Hostal Sol', 'Clínica Vida'] },
      { title: 'Contactados', cards: ['Taller RM', 'Gimnasio Fit'] },
      { title: 'Cerrados', cards: ['Boutique Lu', 'Café Central'] },
    ],
  },
  {
    id: 'reservas-coworking', label: 'RESERVAS', title: 'Reservas Coworking',
    subtitle: 'Reserva de espacios y salas por horas', accent: '#14b8a6', accent2: '#2dd4bf',
    archetype: 'calendar', data: { month: 'Junio 2026', panel: 'Espacios', s1: 'Mesa 12 — 10:00', s2: 'Sala A — Ocupada', s3: 'Box 3 — Libre', cta: 'Reservar' },
  },
  {
    id: 'gusi-dev', label: 'PROYECTO PERSONAL', title: 'gusi.dev',
    subtitle: 'Terminal cyberpunk interactiva en producción', accent: '#22c55e', accent2: '#4ade80',
    archetype: 'terminal', data: { lines: [
      { prompt: true, t: 'whoami' },
      { t: 'jose martinez · freelance dev', dim: false },
      { prompt: true, t: 'menu --list' },
      { t: 'games · news · nasa-apod · chat', dim: true },
      { prompt: true, t: 'launch nexus-7' },
    ] },
  },
];

// ---------- Render de la imagen completa ----------

const render = (p) => {
  const a = p.accent;
  const a2 = p.accent2;
  const inner =
    p.archetype === 'kanban'
      ? kanban(a, a2, p.cols)
      : ARCHETYPES[p.archetype](a, a2, p.data);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(p.title)}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1a"/>
      <stop offset="55%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0b1220"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${a2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${circle(150, 110, 130, { fill: a, opacity: 0.1 })}
  ${circle(1080, 540, 200, { fill: a2, opacity: 0.08 })}
  ${text(120, 96, p.label, { size: 22, weight: 700, fill: a2, spacing: 3 })}
  ${rect(WIN.x, WIN.y, WIN.w, WIN.h, { r: 18, fill: '#0d1424', stroke: '#1e293b', sw: 1.5 })}
  ${rect(WIN.x, WIN.y, WIN.w, 44, { r: 18, fill: '#111a2e' })}
  ${rect(WIN.x, WIN.y + 26, WIN.w, 18, { fill: '#111a2e' })}
  ${circle(WIN.x + 26, WIN.y + 22, 6, { fill: '#ef4444' })}
  ${circle(WIN.x + 48, WIN.y + 22, 6, { fill: '#f59e0b' })}
  ${circle(WIN.x + 70, WIN.y + 22, 6, { fill: '#22c55e' })}
  ${rect(WIN.x + 96, WIN.y + 12, WIN.w - 130, 20, { r: 10, fill: '#0b1220' })}
  ${text(WIN.x + 116, WIN.y + 26, `alamia.es/proyectos/${p.id}`, { size: 12, fill: '#475569' })}
  ${inner}
  ${text(120, 545, p.title, { size: 50, weight: 800, fill: '#ffffff' })}
  ${text(120, 586, p.subtitle, { size: 21, fill: '#94a3b8' })}
  ${text(1080, 586, 'alamia.es', { size: 18, weight: 700, fill: a2, anchor: 'end' })}
</svg>
`;
};

mkdirSync(OUT_DIR, { recursive: true });
let count = 0;
for (const p of PROJECTS) {
  writeFileSync(resolve(OUT_DIR, `${p.id}.svg`), render(p), 'utf8');
  count++;
}
console.log(`✓ Generadas ${count} imágenes SVG en public/images/proyectos/`);
