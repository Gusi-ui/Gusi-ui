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

const CONFIG = {
  emailDestino: 'info@alamia.es',
  emailRemitente: 'info@alamia.es',
  nombreRemitente: 'Formulario Gusi.dev',
  dominio: 'alamia.es',
  maxEnviosPorHora: 10
};

export default {
  async fetch(request, env, ctx) {
    // CORS Preflight
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    // Solo POST
    if (request.method !== 'POST') {
      return jsonError('Método no permitido', 405);
    }

    try {
      console.log('✅ Request recibido');

      // Validar origen
      if (!validarOrigen(request)) {
        console.log('❌ Origen no autorizado');
        return jsonError('Origen no autorizado', 403);
      }

      // Rate limiting
      const ip = request.headers.get('CF-Connecting-IP');
      if (env.RATE_LIMIT) {
        const rateLimitOk = await verificarRateLimit(ip, env.RATE_LIMIT);
        if (!rateLimitOk) {
          return jsonError('Demasiados intentos. Espera unos minutos.', 429);
        }
      }

      // Leer datos
      const datos = await request.json();
      console.log('✅ Datos recibidos');

      // Validar
      const validacion = validarFormulario(datos);
      if (!validacion.valido) {
        return jsonError(validacion.mensaje, 400);
      }

      // Honeypot anti-spam
      if (datos._gotcha || datos.botcheck) {
        console.log('🤖 Bot detectado');
        return jsonSuccess({ message: 'Mensaje enviado' });
      }

      // Sanitizar
      const nombre = sanitizar(datos.name);
      const email = sanitizar(datos.email);
      const servicio = sanitizar(datos.service);
      const mensaje = sanitizar(datos.message);

      console.log('✅ Validación completada');

      // Verificar API key de Resend
      if (!env.RESEND_API_KEY) {
        console.error('❌ API key de Resend no configurada');
        return jsonError('Servicio de email no disponible', 500);
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
      if (env.RATE_LIMIT) {
        await registrarEnvio(ip, env.RATE_LIMIT);
      }

      console.log('✅ Email enviado exitosamente');

      return jsonSuccess({
        message: 'Mensaje enviado correctamente',
        service: servicio
      });

    } catch (error) {
      console.error('❌ Error:', error.message);
      console.error('Stack:', error.stack);
      return jsonError('Error al procesar el formulario', 500);
    }
  }
};

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

    console.log('📧 Enviando email con Resend...');

    const { data, error } = await resend.emails.send({
      from: `${CONFIG.nombreRemitente} <${CONFIG.emailRemitente}>`,
      to: [CONFIG.emailDestino],
      reply_to: `${nombreUsuario} <${emailUsuario}>`,
      subject: asunto,
      html: generarEmailHTML(nombreUsuario, emailUsuario, nombreServicio, mensaje, fecha, ip)
    });

    if (error) {
      console.error('❌ Error de Resend:', error);
      return false;
    }

    console.log('✅ Email enviado:', data.id);
    return true;

  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    console.error('Stack:', error.stack);
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
    'http://127.0.0.1'
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
    console.error('Error rate limit:', error);
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
    console.error('Error al registrar:', error);
  }
}

// ===== RESPUESTAS =====
function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': `https://${CONFIG.dominio}`,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

function jsonSuccess(data, status = 200) {
  return new Response(JSON.stringify({ success: true, ...data }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': `https://${CONFIG.dominio}`,
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  });
}

function jsonError(message, status = 400) {
  return new Response(JSON.stringify({ success: false, message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': `https://${CONFIG.dominio}`,
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  });
}
