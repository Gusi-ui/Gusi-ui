/**
 * CLOUDFLARE WORKER - Formulario de Contacto con Resend
 *
 * Solución con Cloudflare Workers + Resend:
 * - Cloudflare Workers (infraestructura)
 * - Resend (servicio de email recomendado por Cloudflare)
 * - 3,000 emails/mes gratis
 * - Integración oficial y simple
 */

import { Resend } from 'resend';
import { handleCreateCheckout, handleVerifySession, handleCustomerPortal } from './payments';
import { handleStripeWebhook } from './stripe-webhook';

const CONFIG = {
  emailDestino: 'info@alamia.es',
  emailRemitente: 'info@alamia.es',
  nombreRemitente: 'Formulario alamia.es',
  dominio: 'alamia.es',
  maxEnviosPorHora: 10,
  maxResenasPorHora: 3, // Límite de reseñas por hora por IP
  moderacionActivada: true, // Las reseñas requieren aprobación
  adminToken: null // Se configura como secret: ADMIN_TOKEN
};

const getRateLimitKv = (env) => env.RATE_LIMIT || env.REVIEWS_KV;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS Preflight - DEBE ser lo primero, sin ninguna validación
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('Origin') || request.headers.get('Referer');
      let allowedOrigin = `https://${CONFIG.dominio}`;
      
      if (origin) {
        if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
          // Extraer el origin completo del string
          try {
            const originUrl = new URL(origin);
            allowedOrigin = originUrl.origin;
          } catch (e) {
            // Si falla, usar el origin tal cual
            allowedOrigin = origin.includes('://') ? origin.split('/').slice(0, 3).join('/') : origin;
          }
        } else if (origin === `https://${CONFIG.dominio}`) {
          allowedOrigin = `https://${CONFIG.dominio}`;
        }
      }
      
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // Para requests reales, validar origen (más permisivo para desarrollo)
    const origin = request.headers.get('Origin');
    const referer = request.headers.get('Referer');
    
    // Permitir localhost en desarrollo (cualquier puerto)
    const isLocalhostOrigin = origin && (
      origin.startsWith('http://localhost') || 
      origin.startsWith('http://127.0.0.1')
    );
    
    // Permitir cualquier puerto localhost
    const isLocalhostPort = origin && origin.includes('localhost:');
    
    const isProduction = origin === `https://${CONFIG.dominio}`;
    
    // También permitir si el referer es localhost (cualquier puerto)
    const isLocalhostReferer = referer && (
      referer.startsWith('http://localhost') || 
      referer.startsWith('http://127.0.0.1')
    );
    
    // Si no es localhost ni producción, rechazar (pero permitir si no hay origin header)
    if (origin && !isLocalhostOrigin && !isLocalhostPort && !isProduction && !isLocalhostReferer) {
      return jsonError('Origen no autorizado', 403, request);
    }

    // Determinar ruta
    if (url.pathname === '/api/contacto' || url.pathname.endsWith('/api/contacto')) {
      return handleContacto(request, env);
    } else if (url.pathname === '/api/resenas' || url.pathname.endsWith('/api/resenas')) {
      return handleResenas(request, env);
    } else if (url.pathname === '/api/admin/resenas' || url.pathname.endsWith('/api/admin/resenas')) {
      return handleAdminResenas(request, env);
    } else if (
      url.pathname === '/api/payments/checkout' ||
      url.pathname.endsWith('/api/payments/checkout')
    ) {
      return handleCreateCheckout(request, env, request);
    } else if (
      url.pathname === '/api/payments/verify-session' ||
      url.pathname.endsWith('/api/payments/verify-session')
    ) {
      return handleVerifySession(request, env, request);
    } else if (
      url.pathname === '/api/payments/webhook' ||
      url.pathname.endsWith('/api/payments/webhook')
    ) {
      return handleStripeWebhook(request, env);
    } else if (
      url.pathname === '/api/payments/customer-portal' ||
      url.pathname.endsWith('/api/payments/customer-portal')
    ) {
      return handleCustomerPortal(request, env, request);
    } else {
      return jsonError('Ruta no encontrada', 404, request);
    }
  }
};

// ===== MANEJO DE CONTACTO =====
async function handleContacto(request, env) {
  if (request.method !== 'POST') {
    return jsonError('Método no permitido', 405);
  }

  try {
    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP');
    const rateKv = getRateLimitKv(env);
    if (rateKv) {
      const rateLimitOk = await verificarRateLimit(ip, rateKv);
      if (!rateLimitOk) {
        return jsonError('Demasiados intentos. Espera unos minutos.', 429, request);
      }
    }

    // Leer datos
    const datos = await request.json();

    // Validar
    const validacion = validarFormulario(datos);
    if (!validacion.valido) {
      return jsonError(validacion.mensaje, 400, request);
    }

    // Honeypot anti-spam
    if (datos._gotcha || datos.botcheck) {
      return jsonSuccess({ message: 'Mensaje enviado' }, 200, request);
    }

    // Sanitizar
    const nombre = sanitizar(datos.name);
    const email = sanitizar(datos.email);
    const servicio = sanitizar(datos.service);
    const mensaje = sanitizar(datos.message);

    // Verificar API key de Resend
    if (!env.RESEND_API_KEY) {
      return jsonError('Servicio de email no disponible', 500, request);
    }

    // Enviar email con Resend
    const enviado = await enviarEmailResend(
      env.RESEND_API_KEY,
      nombre,
      email,
      servicio,
      mensaje,
      ip
    );

    if (!enviado) {
      throw new Error('Error al enviar email');
    }

    // Registrar envío (rate limit)
    if (rateKv) {
      await registrarEnvio(ip, rateKv);
    }

    return jsonSuccess({
      message: 'Mensaje enviado correctamente',
      service: servicio
    }, 200, request);

  } catch (error) {
    // Log error para debugging (solo en producción, no expone detalles al cliente)
    return jsonError('Error al procesar el formulario', 500, request);
  }
}

// ===== MANEJO DE RESEÑAS =====
async function handleResenas(request, env) {
  // Verificar que existe KV para reseñas
  if (!env.REVIEWS_KV) {
    return jsonError('Servicio de reseñas no disponible', 500, request);
  }

  if (request.method === 'GET') {
    return await obtenerResenas(env.REVIEWS_KV, request, env);
  } else if (request.method === 'POST') {
    return await crearResena(request, env);
  } else {
    return jsonError('Método no permitido', 405, request);
  }
}

// Obtener todas las reseñas (solo aprobadas para público)
async function obtenerResenas(kv, request, env) {
  try {
    // 1. Obtener reseñas locales
    const reviewsKey = 'reviews:all';
    const localReviewsData = await kv.get(reviewsKey, 'json');
    const localReviews = (localReviewsData || []).filter(r => r.approved === true && !r.rejected);
    
    // 2. Obtener reseñas de Google (con caché)
    let googleReviews = [];
    try {
      if (env.GOOGLE_API_KEY && env.GOOGLE_PLACE_ID) {
        googleReviews = await obtenerResenasGoogle(env);
      }
    } catch (e) {
      console.error('Error fetching Google reviews:', e);
      // Fallback silencioso: si falla Google, mostramos solo locales
    }

    // 3. Combinar (Locales + Google)
    // Añadimos propiedad 'source' si no la tienen
    const formattedLocal = localReviews.map(r => ({ ...r, source: 'web' }));
    
    // Combinar y ordenar por fecha (más recientes primero)
    const allReviews = [...formattedLocal, ...googleReviews].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    return jsonSuccess({
      reviews: allReviews,
      total: allReviews.length,
      stats: {
        local: formattedLocal.length,
        google: googleReviews.length
      }
    }, 200, request);
  } catch (error) {
    return jsonError('Error al obtener reseñas', 500, request);
  }
}

// Función auxiliar para obtener reseñas de Google con caché en KV
async function obtenerResenasGoogle(env) {
  const CACHE_KEY = 'reviews:google_cache';
  const CACHE_TTL = 3600; // 1 hora en segundos
  
  // Intentar leer de caché
  const cachedData = await env.REVIEWS_KV.get(CACHE_KEY, 'json');
  
  // Si hay caché y es reciente (menos de 1 hora), usarla
  // Nota: KV metadata podría usarse, pero guardamos timestamp en el objeto para ser explícitos
  if (cachedData && cachedData.timestamp && (Date.now() - cachedData.timestamp < CACHE_TTL * 1000)) {
    return cachedData.reviews;
  }
  
  // Si no hay caché o expiró, consultar API de Google
  try {
    const url = `https://places.googleapis.com/v1/places/${env.GOOGLE_PLACE_ID}?fields=reviews,rating,userRatingCount&key=${env.GOOGLE_API_KEY}&languageCode=es`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.reviews) return [];
    
    // Formatear reseñas al formato de nuestra app
    const googleReviews = data.reviews.map(r => ({
      id: `google-${r.name?.split('/')?.pop() || Date.now()}`, // ID único basado en el recurso resource name
      name: r.authorAttribution?.displayName || 'Usuario de Google',
      rating: r.rating,
      message: r.originalText?.text || r.text?.text || '',
      date: r.publishTime, // Formato ISO viene de Google
      source: 'google',
      authorPhoto: r.authorAttribution?.photoUri,
      company: 'Google Reviews'
    }));
    
    // Guardar en caché KV
    await env.REVIEWS_KV.put(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      reviews: googleReviews
    }), { expirationTtl: CACHE_TTL }); // TTL a nivel de KV también
    
    return googleReviews;
    
  } catch (error) {
    console.error('Error refrescando Google Reviews:', error);
    // Si falla la API pero tenemos caché vieja, devolver caché vieja como fallback
    if (cachedData && cachedData.reviews) {
      return cachedData.reviews;
    }
    return [];
  }
}

// Crear nueva reseña
async function crearResena(request, env) {
  try {
    const ip = request.headers.get('CF-Connecting-IP');
    
    // Rate limiting para reseñas
    const rateKv = getRateLimitKv(env);
    if (rateKv) {
      const rateLimitOk = await verificarRateLimitResenas(ip, rateKv);
      if (!rateLimitOk) {
        return jsonError('Has enviado demasiadas reseñas. Espera unos minutos.', 429, request);
      }
    }

    // Leer datos
    const datos = await request.json();

    // Honeypot anti-spam
    if (datos.website || datos._gotcha) {
      return jsonSuccess({ message: 'Reseña recibida', requiresApproval: true }, 200, request);
    }

    // Validar reseña
    const validacion = validarResena(datos);
    if (!validacion.valido) {
      return jsonError(validacion.mensaje, 400, request);
    }

    // Sanitizar
    const nombre = sanitizar(datos.name);
    const email = sanitizar(datos.email);
    const company = datos.company ? sanitizar(datos.company) : null;
    const rating = parseInt(datos.rating);
    const message = sanitizar(datos.message);

    // Crear objeto de reseña
    const review = {
      id: Date.now().toString(),
      name: nombre,
      email: email,
      company: company,
      rating: rating,
      message: message,
      date: new Date().toISOString(),
      verified: false,
      approved: !CONFIG.moderacionActivada, // Si moderación está activa, requiere aprobación
      ip: ip,
      userAgent: request.headers.get('User-Agent') || 'Unknown'
    };

    // Obtener reseñas existentes
    const reviewsKey = 'reviews:all';
    const reviewsData = await env.REVIEWS_KV.get(reviewsKey, 'json');
    const reviews = reviewsData || [];

    // Agregar nueva reseña
    reviews.push(review);

    // Guardar en KV
    await env.REVIEWS_KV.put(reviewsKey, JSON.stringify(reviews));
    
    // Si moderación está activa, guardar también en pendientes
    if (CONFIG.moderacionActivada && !review.approved) {
      const pendingKey = 'reviews:pending';
      const pendingData = await env.REVIEWS_KV.get(pendingKey, 'json');
      const pending = pendingData || [];
      pending.push(review.id);
      await env.REVIEWS_KV.put(pendingKey, JSON.stringify(pending));
    }

    // Registrar envío (rate limit)
    if (rateKv) {
      await registrarResena(ip, rateKv);
    }

    const successMessage = CONFIG.moderacionActivada && !review.approved
      ? 'Reseña enviada. Será revisada antes de ser publicada.'
      : 'Reseña publicada correctamente';

    return jsonSuccess({
      message: successMessage,
      review: review,
      requiresApproval: CONFIG.moderacionActivada && !review.approved
    }, 200, request);

  } catch (error) {
    return jsonError('Error al procesar la reseña', 500, request);
  }
}

// Validar reseña
function validarResena(datos) {
  const errores = [];

  if (!datos.name || datos.name.trim().length < 2) {
    errores.push('El nombre debe tener al menos 2 caracteres.');
  }

  // Validar nombre (no solo números o caracteres especiales)
  if (datos.name && /^[0-9\s\-_]+$/.test(datos.name)) {
    errores.push('El nombre debe contener letras.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!datos.email || !emailRegex.test(datos.email)) {
    errores.push('El email no es válido.');
  }

  // Validar dominio de email (rechazar dominios temporales comunes)
  const emailDomain = datos.email?.split('@')[1]?.toLowerCase();
  const tempEmailDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com'];
  if (emailDomain && tempEmailDomains.some(domain => emailDomain.includes(domain))) {
    errores.push('Por favor, usa un email válido y permanente.');
  }

  const rating = parseInt(datos.rating);
  if (!rating || rating < 1 || rating > 5) {
    errores.push('La valoración debe ser entre 1 y 5 estrellas.');
  }

  if (!datos.message || datos.message.trim().length < 10) {
    errores.push('El mensaje debe tener al menos 10 caracteres.');
  }

  if (datos.message && datos.message.length > 1000) {
    errores.push('El mensaje no puede exceder 1000 caracteres.');
  }

  // Detección básica de spam en el mensaje
  const spamPatterns = [
    /(http|https|www\.)/gi, // URLs
    /[A-Z]{10,}/g, // Muchas mayúsculas seguidas
    /(.)\1{5,}/g, // Caracteres repetidos
  ];
  
  let spamScore = 0;
  spamPatterns.forEach(pattern => {
    if (pattern.test(datos.message || '')) {
      spamScore++;
    }
  });
  
  if (spamScore >= 2) {
    errores.push('El mensaje contiene contenido sospechoso.');
  }

  if (!datos.consent) {
    errores.push('Debes aceptar que tu reseña sea publicada.');
  }

  return {
    valido: errores.length === 0,
    mensaje: errores.join(' ')
  };
}

// Rate limiting para reseñas
async function verificarRateLimitResenas(ip, kv) {
  try {
    const key = `rate:resenas:${ip}`;
    const data = await kv.get(key, 'json');
    const now = Date.now();
    const hora = 3600000;

    if (!data) return true;

    const enviosRecientes = data.envios.filter(t => now - t < hora);
    return enviosRecientes.length < CONFIG.maxResenasPorHora;

  } catch (error) {
    // En caso de error, permitir la acción (fail-open)
    return true;
  }
}

async function registrarResena(ip, kv) {
  try {
    const key = `rate:resenas:${ip}`;
    const now = Date.now();
    const hora = 3600000;

    const data = await kv.get(key, 'json') || { envios: [] };
    data.envios.push(now);
    data.envios = data.envios.filter(t => now - t < hora);

    await kv.put(key, JSON.stringify(data), { expirationTtl: 3600 });
  } catch (error) {
    // Error silencioso - no crítico para la funcionalidad
  }
}

// ===== ADMINISTRACIÓN DE RESEÑAS =====
async function handleAdminResenas(request, env) {
  // Verificar autenticación
  const authHeader = request.headers.get('Authorization');
  const adminToken = env.ADMIN_TOKEN || CONFIG.adminToken;
  
  if (!adminToken) {
    return jsonError('Panel de administración no configurado', 503, request);
  }
  
  if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
    return jsonError('No autorizado', 401, request);
  }

  if (request.method === 'GET') {
    return await obtenerTodasResenas(env.REVIEWS_KV, request);
  } else if (request.method === 'POST') {
    return await moderarResena(request, env);
  } else {
    return jsonError('Método no permitido', 405, request);
  }
}

// Obtener todas las reseñas (incluyendo pendientes) - Solo para admin
async function obtenerTodasResenas(kv, request) {
  try {
    const reviewsKey = 'reviews:all';
    const reviewsData = await kv.get(reviewsKey, 'json');
    const allReviews = reviewsData || [];
    
    const approved = allReviews.filter(r => r.approved === true);
    const pending = allReviews.filter(r => r.approved !== true);
    
    return jsonSuccess({
      all: allReviews,
      approved: approved,
      pending: pending,
      stats: {
        total: allReviews.length,
        approved: approved.length,
        pending: pending.length
      }
    }, 200, request);
  } catch (error) {
    return jsonError('Error al obtener reseñas', 500, request);
  }
}

// Moderar reseña (aprobar o rechazar)
async function moderarResena(request, env) {
  try {
    const datos = await request.json();
    const { action, reviewId } = datos; // action: 'approve' o 'reject'
    
    if (!action || !reviewId) {
      return jsonError('Acción y ID de reseña requeridos', 400, request);
    }
    
    if (action !== 'approve' && action !== 'reject') {
      return jsonError('Acción inválida. Use "approve" o "reject"', 400, request);
    }
    
    const reviewsKey = 'reviews:all';
    const reviewsData = await env.REVIEWS_KV.get(reviewsKey, 'json');
    const reviews = reviewsData || [];
    
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) {
      return jsonError('Reseña no encontrada', 404, request);
    }
    
    if (action === 'approve') {
      reviews[reviewIndex].approved = true;
      reviews[reviewIndex].approvedAt = new Date().toISOString();
      
      // Remover de pendientes
      const pendingKey = 'reviews:pending';
      const pendingData = await env.REVIEWS_KV.get(pendingKey, 'json');
      const pending = (pendingData || []).filter(id => id !== reviewId);
      await env.REVIEWS_KV.put(pendingKey, JSON.stringify(pending));
    } else {
      // Rechazar: eliminar de KV para no acumular basura
      const rejectedId = reviews[reviewIndex].id;
      const cleaned = reviews.filter(r => r.id !== rejectedId);
      await env.REVIEWS_KV.put(reviewsKey, JSON.stringify(cleaned));

      const pendingKey = 'reviews:pending';
      const pendingData = await env.REVIEWS_KV.get(pendingKey, 'json');
      const pending = (pendingData || []).filter(id => id !== rejectedId);
      await env.REVIEWS_KV.put(pendingKey, JSON.stringify(pending));

      return jsonSuccess({
        message: 'Reseña rechazada y eliminada correctamente',
        reviewId: rejectedId
      }, 200, request);
    }
    
    await env.REVIEWS_KV.put(reviewsKey, JSON.stringify(reviews));
    
    return jsonSuccess({
      message: `Reseña ${action === 'approve' ? 'aprobada' : 'rechazada'} correctamente`,
      review: reviews[reviewIndex]
    }, 200, request);
    
  } catch (error) {
    return jsonError('Error al moderar reseña', 500, request);
  }
}

// ===== ENVÍO CON RESEND =====
async function enviarEmailResend(apiKey, nombreUsuario, emailUsuario, servicio, mensaje, ip) {
  try {
    const resend = new Resend(apiKey);

    const nombreServicio = {
      'web': 'Desarrollo Web',
      'mobile': 'App Móvil',
      'ecommerce': 'E-Commerce',
      'maintenance': 'Mantenimiento',
      'other': 'Otro Servicio'
    }[servicio] || servicio;

    const fecha = new Date().toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const asunto = `Nuevo mensaje desde Gusi.dev - ${nombreServicio}`;

    const { data, error } = await resend.emails.send({
      from: `${CONFIG.nombreRemitente} <${CONFIG.emailRemitente}>`,
      to: [CONFIG.emailDestino],
      reply_to: `${nombreUsuario} <${emailUsuario}>`,
      subject: asunto,
      html: generarEmailHTML(nombreUsuario, emailUsuario, nombreServicio, mensaje, fecha, ip)
    });

    if (error) {
      return false;
    }

    return true;

  } catch (error) {
    return false;
  }
}

// ===== GENERAR HTML DEL EMAIL =====
function generarEmailHTML(nombre, email, servicio, mensaje, fecha, ip) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
        .field:last-child { border-bottom: none; }
        .label { font-weight: 600; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block; }
        .value { color: #1e293b; font-size: 16px; }
        .mensaje-box { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; margin-top: 8px; white-space: pre-wrap; }
        .footer { background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 14px; color: #64748b; }
        .badge { display: inline-block; background: #667eea; color: white; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 500; }
        a { color: #667eea; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📩 Nuevo Mensaje de Contacto</h1>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">👤 Nombre</span>
                <div class="value"><strong>${nombre}</strong></div>
            </div>
            <div class="field">
                <span class="label">📧 Email</span>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="field">
                <span class="label">🎯 Servicio Solicitado</span>
                <div class="value"><span class="badge">${servicio}</span></div>
            </div>
            <div class="field">
                <span class="label">💬 Mensaje</span>
                <div class="mensaje-box">${mensaje}</div>
            </div>
        </div>
        <div class="footer">
            <p>Enviado desde <strong>Gusi.dev - Portfolio Profesional</strong></p>
            <p style="margin: 5px 0; font-size: 12px;">
                📅 ${fecha}<br>
                🌐 IP: ${ip}
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

// ===== FUNCIONES DE VALIDACIÓN =====
function validarOrigen(request) {
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');

  const permitidos = [
    `https://${CONFIG.dominio}`,
    'http://localhost',
    'http://127.0.0.1',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  return permitidos.some(p =>
    origin?.startsWith(p) || referer?.startsWith(p)
  );
}

function validarFormulario(datos) {
  const errores = [];

  if (!datos.name || datos.name.trim().length < 2) {
    errores.push('El nombre debe tener al menos 2 caracteres.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!datos.email || !emailRegex.test(datos.email)) {
    errores.push('El email no es válido.');
  }

  const serviciosValidos = ['web', 'mobile', 'ecommerce', 'maintenance', 'other'];
  if (!datos.service || !serviciosValidos.includes(datos.service)) {
    errores.push('El servicio no es válido.');
  }

  if (!datos.message || datos.message.trim().length < 10) {
    errores.push('El mensaje debe tener al menos 10 caracteres.');
  }

  return {
    valido: errores.length === 0,
    mensaje: errores.join(' ')
  };
}

function sanitizar(texto) {
  if (!texto) return '';
  return texto
    .toString()
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 5000);
}

// ===== RATE LIMITING =====
async function verificarRateLimit(ip, kv) {
  try {
    const key = `rate:${ip}`;
    const data = await kv.get(key, 'json');
    const now = Date.now();
    const hora = 3600000;

    if (!data) return true;

    const enviosRecientes = data.envios.filter(t => now - t < hora);
    return enviosRecientes.length < CONFIG.maxEnviosPorHora;

  } catch (error) {
    // En caso de error, permitir la acción (fail-open)
    return true;
  }
}

async function registrarEnvio(ip, kv) {
  try {
    const key = `rate:${ip}`;
    const now = Date.now();
    const hora = 3600000;

    const data = await kv.get(key, 'json') || { envios: [] };
    data.envios.push(now);
    data.envios = data.envios.filter(t => now - t < hora);

    await kv.put(key, JSON.stringify(data), { expirationTtl: 3600 });
  } catch (error) {
    // Error silencioso - no crítico para la funcionalidad
  }
}

// ===== RESPUESTAS =====
function getCORSOrigin(request) {
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');
  
  // Lista de orígenes permitidos
  const allowedOrigins = [
    `https://${CONFIG.dominio}`,
    'http://localhost',
    'http://127.0.0.1',
    'http://localhost:8000',
    'http://localhost:3000',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:3000'
  ];
  
  // Si hay origin y está en la lista permitida, usarlo
  if (origin) {
    const matched = allowedOrigins.find(allowed => origin.startsWith(allowed));
    if (matched) {
      return origin;
    }
    
    // Si el origin es localhost (cualquier puerto), permitirlo
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return origin;
    }
  }
  
  // Si no hay origin, intentar extraer del referer
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;
      
      if (refererOrigin.startsWith('http://localhost') || 
          refererOrigin.startsWith('http://127.0.0.1') ||
          refererOrigin === `https://${CONFIG.dominio}`) {
        return refererOrigin;
      }
    } catch (e) {
      // Si falla al parsear, continuar
    }
  }
  
  // Por defecto, devolver el dominio de producción
  return `https://${CONFIG.dominio}`;
}

function handleCORS(request) {
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');
  
  // Determinar el origen permitido
  let allowedOrigin = `https://${CONFIG.dominio}`;
  
  if (origin) {
    // Permitir cualquier localhost
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      allowedOrigin = origin;
    } else if (origin === `https://${CONFIG.dominio}`) {
      allowedOrigin = origin;
    }
  } else if (referer) {
    // Si no hay origin, extraer del referer
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;
      if (refererOrigin.startsWith('http://localhost') || 
          refererOrigin.startsWith('http://127.0.0.1')) {
        allowedOrigin = refererOrigin;
      }
    } catch (e) {
      // Ignorar errores de parsing
    }
  }
  
  // Headers CORS completos
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'false',
    'Access-Control-Max-Age': '86400'
  };
  
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

function jsonSuccess(data, status = 200, request = null) {
  const origin = request ? getCORSOrigin(request) : `https://${CONFIG.dominio}`;
  return new Response(JSON.stringify({ success: true, ...data }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

function jsonError(message, status = 400, request = null) {
  const origin = request ? getCORSOrigin(request) : `https://${CONFIG.dominio}`;
  return new Response(JSON.stringify({ success: false, message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
