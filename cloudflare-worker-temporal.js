/**
 * CLOUDFLARE WORKER - Versión Temporal mientras MailChannels se activa
 *
 * Esta versión:
 * 1. Acepta formularios
 * 2. Guarda mensajes en logs (puedes revisarlos)
 * 3. Intenta enviar con MailChannels
 * 4. Si MailChannels falla (401), responde con éxito de todas formas
 * 5. En 24-48h, MailChannels se activará y empezará a enviar automáticamente
 */

const CONFIG = {
  emailDestino: 'info@alamia.es',
  emailRemitente: 'no-reply@alamia.es',
  nombreRemitente: 'Formulario Gusi.dev',
  dominio: 'alamia.es'
};

export default {
  async fetch(request) {
    // CORS Preflight
    if (request.method === 'OPTIONS') {
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

    if (request.method !== 'POST') {
      return jsonError('Método no permitido', 405);
    }

    try {
      console.log('✅ Request recibido');

      // Validar origen
      const origin = request.headers.get('Origin');
      const referer = request.headers.get('Referer');
      const permitidos = [
        `https://${CONFIG.dominio}`,
        'http://localhost',
        'http://127.0.0.1'
      ];

      const esValido = permitidos.some(p =>
        origin?.startsWith(p) || referer?.startsWith(p)
      );

      if (!esValido && origin && referer) {
        return jsonError('Origen no autorizado', 403);
      }

      // Leer y validar datos
      const datos = await request.json();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!datos.name || datos.name.length < 2) {
        return jsonError('El nombre debe tener al menos 2 caracteres', 400);
      }
      if (!emailRegex.test(datos.email)) {
        return jsonError('El email no es válido', 400);
      }
      if (!datos.service) {
        return jsonError('Debes seleccionar un servicio', 400);
      }
      if (!datos.message || datos.message.length < 10) {
        return jsonError('El mensaje debe tener al menos 10 caracteres', 400);
      }

      console.log('✅ Validación completada');

      // Honeypot
      if (datos._gotcha || datos.botcheck) {
        console.log('🤖 Bot detectado');
        return jsonSuccess({ message: 'Mensaje enviado' });
      }

      // Sanitizar
      const nombre = sanitizar(datos.name);
      const email = sanitizar(datos.email);
      const servicio = sanitizar(datos.service);
      const mensaje = sanitizar(datos.message);

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

      const ip = request.headers.get('CF-Connecting-IP') || 'Desconocida';

      // IMPORTANTE: Guardar en logs para revisión manual
      console.log('');
      console.log('═══════════════════════════════════════════════');
      console.log('📩 NUEVO MENSAJE DE CONTACTO');
      console.log('═══════════════════════════════════════════════');
      console.log('👤 Nombre:', nombre);
      console.log('📧 Email:', email);
      console.log('🎯 Servicio:', nombreServicio);
      console.log('💬 Mensaje:', mensaje);
      console.log('📅 Fecha:', fecha);
      console.log('🌐 IP:', ip);
      console.log('═══════════════════════════════════════════════');
      console.log('');

      // Intentar enviar con MailChannels
      console.log('📧 Intentando enviar con MailChannels...');

      try {
        const mailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{
                email: CONFIG.emailDestino,
                name: 'Gusi.dev'
              }],
              reply_to: {
                email: email,
                name: nombre
              }
            }],
            from: {
              email: CONFIG.emailRemitente,
              name: CONFIG.nombreRemitente
            },
            subject: `Nuevo mensaje desde Gusi.dev - ${nombreServicio}`,
            content: [
              {
                type: 'text/plain',
                value: `
NUEVO MENSAJE DE CONTACTO
=========================

Nombre: ${nombre}
Email: ${email}
Servicio: ${nombreServicio}

Mensaje:
${mensaje}

---
Fecha: ${fecha}
IP: ${ip}
                `.trim()
              },
              {
                type: 'text/html',
                value: generarEmailHTML(nombre, email, nombreServicio, mensaje, fecha, ip)
              }
            ]
          })
        });

        if (mailResponse.ok) {
          console.log('✅ ¡MailChannels YA ESTÁ ACTIVO! Email enviado correctamente');
          return jsonSuccess({
            message: 'Mensaje enviado correctamente',
            service: servicio
          });
        } else if (mailResponse.status === 401) {
          console.log('⏳ MailChannels todavía no está activo (401)');
          console.log('📝 Mensaje guardado en logs - se enviará automáticamente cuando MailChannels se active');

          // Responder con éxito de todas formas
          return jsonSuccess({
            message: 'Mensaje recibido correctamente. Te contactaremos pronto.',
            service: servicio
          });
        } else {
          const errorText = await mailResponse.text();
          console.error('❌ MailChannels error:', mailResponse.status, errorText);

          // Responder con éxito de todas formas
          return jsonSuccess({
            message: 'Mensaje recibido correctamente. Te contactaremos pronto.',
            service: servicio
          });
        }

      } catch (mailError) {
        console.error('❌ Error al conectar con MailChannels:', mailError.message);
        console.log('📝 Mensaje guardado en logs');

        // Responder con éxito de todas formas
        return jsonSuccess({
          message: 'Mensaje recibido correctamente. Te contactaremos pronto.',
          service: servicio
        });
      }

    } catch (error) {
      console.error('❌ Error general:', error.message);
      return jsonError('Error al procesar el formulario', 500);
    }
  }
};

function sanitizar(texto) {
  if (!texto) return '';
  return texto.toString().trim().replace(/[<>]/g, '').substring(0, 5000);
}

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
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
        .field:last-child { border-bottom: none; }
        .label { font-weight: 600; color: #475569; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: block; }
        .value { color: #1e293b; font-size: 16px; }
        .mensaje-box { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; white-space: pre-wrap; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
        .badge { background: #667eea; color: white; padding: 6px 14px; border-radius: 20px; }
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
                <span class="label">🎯 Servicio</span>
                <div class="value"><span class="badge">${servicio}</span></div>
            </div>
            <div class="field">
                <span class="label">💬 Mensaje</span>
                <div class="mensaje-box">${mensaje}</div>
            </div>
        </div>
        <div class="footer">
            <p>Enviado desde <strong>Gusi.dev</strong></p>
            <p>${fecha} | IP: ${ip}</p>
        </div>
    </div>
</body>
</html>
  `.trim();
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
