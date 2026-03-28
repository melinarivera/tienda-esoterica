/* =============================================
   LA MÁGICA BRUJA EFSUN · main.js
   Bosque Encantado · Cursor Varita · Canvas
   ============================================= */

'use strict';

// ==============================
// CURSOR — VARITA MÁGICA
// ==============================
const wand = document.getElementById('cursor-wand');
const trailContainer = document.getElementById('cursor-trail');

let mouseX = 0, mouseY = 0;
let sparkColors = ['#c9a84c', '#e8c96a', '#f5e4a8', '#6abf8a', '#e8899b', '#fff8e0'];
let lastSpark = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  wand.style.left = mouseX + 'px';
  wand.style.top  = mouseY + 'px';

  // Destellos de varita
  const now = Date.now();
  if (now - lastSpark > 40) {
    createSpark(mouseX, mouseY);
    lastSpark = now;
  }
});

document.addEventListener('mousedown', () => wand.classList.add('clicking'));
document.addEventListener('mouseup',   () => wand.classList.remove('clicking'));

function createSpark(x, y) {
  const count = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'trail-spark';
    const angle = Math.random() * Math.PI * 2;
    const dist  = Math.random() * 30 + 10;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    const size  = Math.random() * 3 + 1.5;

    spark.style.cssText = `
      left: ${x}px; top: ${y}px;
      width: ${size}px; height: ${size}px;
      background: ${color};
      box-shadow: 0 0 4px ${color};
      --tx: ${tx}px; --ty: ${ty}px;
      animation-duration: ${Math.random() * 400 + 300}ms;
    `;
    trailContainer.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
  }
}

// Click: explosión de magia
document.addEventListener('click', e => {
  for (let i = 0; i < 12; i++) {
    const spark = document.createElement('div');
    spark.className = 'trail-spark';
    const angle = (i / 12) * Math.PI * 2;
    const dist  = Math.random() * 50 + 20;
    const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    spark.style.cssText = `
      left: ${e.clientX}px; top: ${e.clientY}px;
      width: 4px; height: 4px;
      background: ${color};
      box-shadow: 0 0 6px ${color};
      --tx: ${Math.cos(angle) * dist}px;
      --ty: ${Math.sin(angle) * dist}px;
      animation-duration: 700ms;
    `;
    trailContainer.appendChild(spark);
    setTimeout(() => spark.remove(), 800);
  }
});

// ==============================
// CANVAS — BOSQUE ENCANTADO
// ==============================
const canvas = document.getElementById('forest-canvas');
const ctx = canvas.getContext('2d');

let W, H;
let trees = [], fireflies = [], mist = [], moonbeams = [];
let t = 0;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initScene();
}

// --- ÁRBOLES ---
function initTrees() {
  trees = [];
  const layers = [
    { count: 5,  scale: 1,    yBase: 0.82, opacity: 0.9,  color: '#0a1a0e' },
    { count: 7,  scale: 0.75, yBase: 0.78, opacity: 0.7,  color: '#0c1f12' },
    { count: 9,  scale: 0.55, yBase: 0.73, opacity: 0.5,  color: '#102817' },
    { count: 11, scale: 0.35, yBase: 0.68, opacity: 0.3,  color: '#173520' },
  ];
  layers.forEach(layer => {
    for (let i = 0; i < layer.count; i++) {
      trees.push({
        x: (i / (layer.count - 1)) * W * 1.1 - W * 0.05 + (Math.random() - 0.5) * (W / layer.count),
        yBase: H * layer.yBase,
        h: H * (0.25 + Math.random() * 0.15) * layer.scale,
        w: W * (0.04 + Math.random() * 0.02) * layer.scale,
        opacity: layer.opacity,
        color: layer.color,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.003 + Math.random() * 0.003,
        layer: layer.scale,
        branches: Math.floor(Math.random() * 4) + 3,
      });
    }
  });
  trees.sort((a, b) => a.layer - b.layer);
}

function drawTree(tree, t) {
  const sway = Math.sin(t * tree.swaySpeed + tree.sway) * 3 * tree.layer;
  ctx.save();
  ctx.globalAlpha = tree.opacity;
  ctx.translate(tree.x + sway * 0.1, tree.yBase);

  // Tronco
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(
    sway * 0.3, -tree.h * 0.3,
    sway * 0.6, -tree.h * 0.6,
    sway,       -tree.h
  );
  ctx.lineWidth  = tree.w;
  ctx.strokeStyle = tree.color;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Ramas
  for (let b = 0; b < tree.branches; b++) {
    const progress = 0.3 + (b / tree.branches) * 0.65;
    const bx = sway * progress;
    const by = -tree.h * progress;
    const blen = tree.h * (0.15 + Math.random() * 0.1) * (1 - progress + 0.3);
    const bdir = (b % 2 === 0 ? 1 : -1) * (0.5 + Math.random() * 0.5);

    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(
      bx + bdir * blen * 0.5, by - blen * 0.4,
      bx + bdir * blen, by - blen * 0.6
    );
    ctx.lineWidth   = tree.w * 0.35;
    ctx.strokeStyle = tree.color;
    ctx.stroke();

    // Follaje (elipses)
    ctx.beginPath();
    ctx.ellipse(
      bx + bdir * blen, by - blen * 0.7,
      blen * 0.5, blen * 0.65,
      bdir * 0.3,
      0, Math.PI * 2
    );
    ctx.fillStyle = tree.color;
    ctx.globalAlpha = tree.opacity * 0.6;
    ctx.fill();
    ctx.globalAlpha = tree.opacity;
  }

  // Copa principal
  ctx.beginPath();
  ctx.ellipse(sway, -tree.h, tree.w * 3, tree.h * 0.35, 0, 0, Math.PI * 2);
  ctx.fillStyle   = tree.color;
  ctx.globalAlpha = tree.opacity * 0.7;
  ctx.fill();

  ctx.restore();
}

// --- LUCIÉRNAGAS ---
function initFireflies() {
  fireflies = [];
  for (let i = 0; i < 60; i++) {
    fireflies.push({
      x: Math.random() * W,
      y: H * 0.2 + Math.random() * H * 0.6,
      r: Math.random() * 1.8 + 0.5,
      speed: 0.2 + Math.random() * 0.4,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.02,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      color: Math.random() > 0.5 ? '#c9a84c' : '#6abf8a',
      glowR: Math.random() * 12 + 6,
    });
  }
}

function drawFireflies(t) {
  fireflies.forEach(f => {
    f.angle += f.angleSpeed + Math.sin(t * 0.01 + f.pulse) * 0.005;
    f.x += Math.cos(f.angle) * f.speed;
    f.y += Math.sin(f.angle) * f.speed * 0.5 - 0.1;
    if (f.x < 0) f.x = W;
    if (f.x > W) f.x = 0;
    if (f.y < H * 0.1) f.y = H * 0.8;
    if (f.y > H * 0.9) f.y = H * 0.2;

    const opacity = (Math.sin(t * f.pulseSpeed + f.pulse) + 1) * 0.5;
    if (opacity < 0.05) return;

    // Glow
    const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.glowR);
    grd.addColorStop(0, f.color.replace(')', `, ${opacity * 0.5})`).replace('rgb', 'rgba').replace('#c9a84c', `rgba(201,168,76,${opacity * 0.35})`).replace('#6abf8a', `rgba(106,191,138,${opacity * 0.35})`));
    grd.addColorStop(1, 'transparent');

    // Glow halo
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.glowR, 0, Math.PI * 2);
    const alpha = opacity * 0.3;
    if (f.color === '#c9a84c') {
      ctx.fillStyle = `rgba(201,168,76,${alpha})`;
    } else {
      ctx.fillStyle = `rgba(106,191,138,${alpha})`;
    }
    ctx.fill();

    // Punto central
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = f.color === '#c9a84c'
      ? `rgba(245,228,168,${opacity})`
      : `rgba(180,255,200,${opacity})`;
    ctx.fill();
  });
}

// --- NIEBLA ---
function initMist() {
  mist = [];
  for (let i = 0; i < 8; i++) {
    mist.push({
      x: Math.random() * W,
      y: H * (0.5 + Math.random() * 0.5),
      w: W * (0.3 + Math.random() * 0.5),
      h: H * (0.05 + Math.random() * 0.08),
      speed: 0.08 + Math.random() * 0.12,
      opacity: 0.02 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function drawMist(t) {
  mist.forEach(m => {
    m.x += m.speed;
    if (m.x > W + m.w) m.x = -m.w;

    const opacity = m.opacity * (0.6 + 0.4 * Math.sin(t * 0.005 + m.phase));
    const grd = ctx.createRadialGradient(
      m.x, m.y, 0,
      m.x, m.y, m.w * 0.5
    );
    grd.addColorStop(0, `rgba(130,200,160,${opacity})`);
    grd.addColorStop(1, 'transparent');

    ctx.save();
    ctx.scale(1, m.h / m.w * 4);
    ctx.beginPath();
    ctx.arc(m.x, m.y * (m.w / m.h * 0.25), m.w * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.restore();
  });
}

// --- RAYOS DE LUNA ---
function initMoonbeams() {
  moonbeams = [];
  const moonX = W * 0.75;
  const moonY = H * 0.12;
  for (let i = 0; i < 6; i++) {
    const angle = 0.6 + i * 0.25;
    moonbeams.push({
      startX: moonX,
      startY: moonY,
      angle,
      length: H * (0.4 + Math.random() * 0.4),
      width:  W * (0.015 + Math.random() * 0.02),
      opacity: 0.015 + Math.random() * 0.025,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function drawMoonbeams(t) {
  moonbeams.forEach(mb => {
    const opacity = mb.opacity * (0.7 + 0.3 * Math.sin(t * 0.008 + mb.phase));
    const endX = mb.startX + Math.cos(mb.angle) * mb.length;
    const endY = mb.startY + Math.sin(mb.angle) * mb.length;

    const grd = ctx.createLinearGradient(mb.startX, mb.startY, endX, endY);
    grd.addColorStop(0, `rgba(240,230,180,${opacity})`);
    grd.addColorStop(0.5, `rgba(220,210,160,${opacity * 0.5})`);
    grd.addColorStop(1, 'transparent');

    ctx.save();
    ctx.translate(mb.startX, mb.startY);
    ctx.rotate(mb.angle - Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(-mb.width / 2, 0);
    ctx.lineTo(mb.width / 2, 0);
    ctx.lineTo(mb.width * 0.1, mb.length);
    ctx.lineTo(-mb.width * 0.1, mb.length);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.restore();
  });
}

// --- ESTRELLAS ---
let stars = [];
function initStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.6,
      r: Math.random() * 1.2 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    });
  }
}

function drawStars(t) {
  stars.forEach(s => {
    const alpha = 0.3 + 0.5 * ((Math.sin(t * s.pulseSpeed + s.pulse) + 1) * 0.5);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(240,235,210,${alpha})`;
    ctx.fill();
  });
}

// --- LUNA ---
function drawMoon() {
  const mx = W * 0.75;
  const my = H * 0.12;
  const mr = Math.min(W, H) * 0.045;

  // Halo exterior
  const halo = ctx.createRadialGradient(mx, my, mr, mx, my, mr * 4);
  halo.addColorStop(0, 'rgba(240,225,170,0.08)');
  halo.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(mx, my, mr * 4, 0, Math.PI * 2);
  ctx.fillStyle = halo;
  ctx.fill();

  // Luna
  const lgrd = ctx.createRadialGradient(mx - mr * 0.25, my - mr * 0.25, 0, mx, my, mr);
  lgrd.addColorStop(0, 'rgba(255,248,220,0.95)');
  lgrd.addColorStop(0.7, 'rgba(230,215,170,0.9)');
  lgrd.addColorStop(1, 'rgba(200,185,140,0.85)');
  ctx.beginPath();
  ctx.arc(mx, my, mr, 0, Math.PI * 2);
  ctx.fillStyle = lgrd;
  ctx.fill();

  // Cráteres sutiles
  [[0.25,0.15,0.12],[-0.15,0.3,0.08],[0.1,-0.2,0.07]].forEach(([ox,oy,r]) => {
    ctx.beginPath();
    ctx.arc(mx + mr * ox, my + mr * oy, mr * r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,185,140,0.3)';
    ctx.fill();
  });
}

// --- SUELO (hierba, niebla base) ---
function drawGround() {
  // Degradado suelo
  const grd = ctx.createLinearGradient(0, H * 0.75, 0, H);
  grd.addColorStop(0, 'transparent');
  grd.addColorStop(0.5, 'rgba(10,20,14,0.4)');
  grd.addColorStop(1, 'rgba(5,8,10,0.95)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, H * 0.75, W, H * 0.25);

  // Niebla suelo
  const fog = ctx.createLinearGradient(0, H * 0.78, 0, H * 0.88);
  fog.addColorStop(0, 'transparent');
  fog.addColorStop(0.5, 'rgba(60,120,80,0.06)');
  fog.addColorStop(1, 'transparent');
  ctx.fillStyle = fog;
  ctx.fillRect(0, H * 0.78, W, H * 0.1);
}

// --- INICIALIZAR ESCENA ---
function initScene() {
  initTrees();
  initFireflies();
  initMist();
  initMoonbeams();
  initStars();
}

// --- LOOP PRINCIPAL ---
function renderForest() {
  t++;
  ctx.clearRect(0, 0, W, H);

  // Fondo cielo bosque
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#02050a');
  sky.addColorStop(0.25, '#050c0e');
  sky.addColorStop(0.6, '#080e0d');
  sky.addColorStop(1, '#0a1208');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  drawStars(t);
  drawMoon();
  drawMoonbeams(t);
  drawMist(t);

  // Árboles por capas (atrás → adelante)
  trees.forEach(tree => drawTree(tree, t));

  drawGround();
  drawFireflies(t);

  requestAnimationFrame(renderForest);
}

window.addEventListener('resize', resize);
resize();
renderForest();

// ==============================
// NAVEGACIÓN — SCROLL
// ==============================
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ==============================
// SCROLL REVEAL
// ==============================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ==============================
// HORÓSCOPO IA
// ==============================
const PROMPTS = {
  Aries:       'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica y específica para una persona {nombre} de signo Aries sobre {area}. Usa referencias a Marte, el fuego y la valentía. Tono: místico, cálido y poético. 3 párrafos.',
  Tauro:       'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica para {nombre} de signo Tauro sobre {area}. Usa referencias a Venus, la tierra y la abundancia. Tono: místico, sensual y poético. 3 párrafos.',
  Géminis:     'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica para {nombre} de signo Géminis sobre {area}. Usa referencias a Mercurio, el aire y la dualidad. Tono: místico, curioso y poético. 3 párrafos.',
  Cáncer:      'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica para {nombre} de signo Cáncer sobre {area}. Usa referencias a la Luna, el agua y las emociones. Tono: místico, emotivo y poético. 3 párrafos.',
  Leo:         'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica para {nombre} de signo Leo sobre {area}. Usa referencias al Sol, el fuego y el brillo. Tono: místico, apasionado y poético. 3 párrafos.',
  Virgo:       'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica para {nombre} de signo Virgo sobre {area}. Usa referencias a Mercurio, la tierra y la pureza. Tono: místico, detallado y poético. 3 párrafos.',
  Libra:       'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica para {nombre} de signo Libra sobre {area}. Usa referencias a Venus, el aire y el equilibrio. Tono: místico, armonioso y poético. 3 párrafos.',
  Escorpio:    'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica para {nombre} de signo Escorpio sobre {area}. Usa referencias a Plutón, el agua y la transformación. Tono: místico, intenso y poético. 3 párrafos.',
  Sagitario:   'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica para {nombre} de signo Sagitario sobre {area}. Usa referencias a Júpiter, el fuego y la libertad. Tono: místico, aventurero y poético. 3 párrafos.',
  Capricornio: 'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica para {nombre} de signo Capricornio sobre {area}. Usa referencias a Saturno, la tierra y la ambición. Tono: místico, sabio y poético. 3 párrafos.',
  Acuario:     'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica para {nombre} de signo Acuario sobre {area}. Usa referencias a Urano, el aire y la originalidad. Tono: místico, visionario y poético. 3 párrafos.',
  Piscis:      'Eres una bruja esotérica llamada Efsun. Escribe una lectura astral mágica para {nombre} de signo Piscis sobre {area}. Usa referencias a Neptuno, el agua y la intuición. Tono: místico, soñador y poético. 3 párrafos.',
};

const AREAS = {
  general:  'tu camino de vida en general',
  amor:     'el amor y las relaciones sentimentales',
  trabajo:  'el trabajo, el dinero y la prosperidad',
  salud:    'la salud, el bienestar y la energía vital',
  familia:  'la familia y los vínculos más cercanos',
};

async function generarHoroscopo() {
  const signo  = document.getElementById('signo').value;
  const nombre = document.getElementById('nombre-horo').value.trim() || 'querida alma';
  const area   = document.getElementById('area-horo').value;

  if (!signo) {
    alert('Por favor selecciona tu signo zodiacal ✦');
    return;
  }

  const btn = document.querySelector('.btn-horo');
  btn.innerHTML = '<span>🔮</span> Consultando los astros...';
  btn.disabled = true;

  const prompt = (PROMPTS[signo] || PROMPTS['Aries'])
    .replace('{nombre}', nombre)
    .replace('{area}', AREAS[area] || 'tu camino de vida');

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    const texto = data.content?.[0]?.text || '';

    const resultado = document.getElementById('horo-resultado');
    document.getElementById('horo-titulo').textContent = `✦ Lectura astral · ${nombre} · ${signo}`;
    document.getElementById('horo-texto').textContent = texto || 'Los astros guardan silencio por ahora. Escríbeme por WhatsApp para tu lectura personalizada.';
    resultado.style.display = 'block';
    resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (err) {
    const resultado = document.getElementById('horo-resultado');
    document.getElementById('horo-titulo').textContent = '✦ Los astros te llaman';
    document.getElementById('horo-texto').textContent = 'Los planetas están en movimiento. Escríbeme directamente por WhatsApp para recibir tu lectura personalizada de la mano de Efsun.';
    resultado.style.display = 'block';
  }

  btn.innerHTML = '<span>🔮</span> Obtener mi lectura astral';
  btn.disabled = false;
}

// Exponer al global para onclick del HTML
window.generarHoroscopo = generarHoroscopo;

// ==============================
// SMOOTH SCROLL LINKS
// ==============================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
