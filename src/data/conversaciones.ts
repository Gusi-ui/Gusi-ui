import { projectServices, maintenanceService } from '@/data/services';

/**
 * Conversaciones de ejemplo del hero. La portada enseña una distinta en cada
 * visita (ver Hero.astro). Son ejemplos rotulados como tales: no presentarlas
 * como clientes reales.
 *
 * Las cifras salen de los datos de servicios: si cambia un precio, el hero no
 * puede quedarse contando el antiguo. Por eso aquí no hay ningún número escrito
 * a mano salvo las horas de los mensajes.
 */

/** Un trozo de mensaje: texto normal o una cifra que va en negrita. */
export type Trozo = string | { fuerte: string };

export type Mensaje = {
  de: 'cliente' | 'jose';
  hora: string;
  texto: Trozo[];
};

export type Conversacion = {
  id: string;
  mensajes: Mensaje[];
};

const servicio = (slug: string) => projectServices.find((s) => s.slug === slug);

const desarrollo = servicio('desarrollo-web');
const precioWeb = `${desarrollo?.price ?? 250} €`;
const plazoWeb =
  desarrollo?.features.find((f) => f.startsWith('Entrega en'))?.replace('Entrega en ', '') ??
  '7–10 días';
const precioOptimizacion = `${servicio('optimizacion-web')?.price ?? 190} €`;
const precioBackend = `${servicio('backend-apis')?.price ?? 400} €`;
const precioMantenimiento = `${maintenanceService.price} € al mes`;

export const conversaciones: Conversacion[] = [
  {
    id: 'fisio',
    mensajes: [
      {
        de: 'cliente',
        hora: '10:12',
        texto: ['Hola, tengo una clínica de fisio y me pasan el día llamando para pedir cita'],
      },
      {
        de: 'jose',
        hora: '10:20',
        texto: [
          'Eso se arregla con reserva online y recordatorio. Una web sencilla parte de ',
          { fuerte: precioWeb },
          ' y está en ',
          { fuerte: plazoWeb },
          '; la agenda te la presupuesto aparte',
        ],
      },
      {
        de: 'cliente',
        hora: '10:21',
        texto: ['¿Y si luego quiero cambiar horarios o precios?'],
      },
      {
        de: 'jose',
        hora: '10:23',
        texto: [
          'Con el mantenimiento, ',
          { fuerte: precioMantenimiento },
          ', tienes una hora de cambios incluida',
        ],
      },
    ],
  },
  {
    id: 'tienda-lenta',
    mensajes: [
      {
        de: 'cliente',
        hora: '18:40',
        texto: ['Buenas, tengo una tienda online y la web tarda una eternidad en cargar en el móvil'],
      },
      {
        de: 'jose',
        hora: '18:52',
        texto: [
          'Lo primero es medir qué la frena. La optimización cuesta ',
          { fuerte: precioOptimizacion },
          ', pago único, y empieza por una auditoría de velocidad',
        ],
      },
      {
        de: 'cliente',
        hora: '18:53',
        texto: ['¿Y cómo sé que ha mejorado de verdad?'],
      },
      {
        de: 'jose',
        hora: '18:55',
        texto: ['Te paso un informe con las métricas de Google de antes y de después'],
      },
    ],
  },
  {
    id: 'electricista',
    mensajes: [
      {
        de: 'cliente',
        hora: '08:05',
        texto: ['Hola, soy electricista y cuando me buscan en Google no salgo por ningún lado'],
      },
      {
        de: 'jose',
        hora: '08:31',
        texto: [
          'Te hago una web con tus servicios y el SEO básico ya configurado. Parte de ',
          { fuerte: precioWeb },
          ' y está lista en ',
          { fuerte: plazoWeb },
        ],
      },
      {
        de: 'cliente',
        hora: '08:33',
        texto: ['Yo de ordenadores no entiendo nada, eh'],
      },
      {
        de: 'jose',
        hora: '08:36',
        texto: [
          'No hace falta. Con el mantenimiento, ',
          { fuerte: precioMantenimiento },
          ', me encargo yo de actualizaciones y copias de seguridad',
        ],
      },
    ],
  },
  {
    id: 'bar-carta',
    mensajes: [
      {
        de: 'cliente',
        hora: '16:18',
        texto: ['Tengo un bar y cada semana tengo que rehacer la carta en PDF para cambiar un plato'],
      },
      {
        de: 'jose',
        hora: '16:30',
        texto: [
          'Mejor una carta en la web con un panel para cambiar platos y precios tú mismo. Con panel de gestión parte de ',
          { fuerte: precioBackend },
        ],
      },
      {
        de: 'cliente',
        hora: '16:32',
        texto: ['¿Se puede pagar con Bizum?'],
      },
      {
        de: 'jose',
        hora: '16:33',
        texto: ['Sí, con tarjeta o Bizum, y es un pago único'],
      },
    ],
  },
  {
    id: 'yoga-reservas',
    mensajes: [
      {
        de: 'cliente',
        hora: '12:47',
        texto: ['Hola, doy clases de yoga y apunto las reservas en una libreta. Ya no doy abasto'],
      },
      {
        de: 'jose',
        hora: '13:02',
        texto: [
          'Con una web de reservas cada alumno se apunta solo y tú lo ves todo en un panel. Parte de ',
          { fuerte: precioBackend },
        ],
      },
      {
        de: 'cliente',
        hora: '13:04',
        texto: ['¿Y si mañana quiero añadir un horario nuevo?'],
      },
      {
        de: 'jose',
        hora: '13:05',
        texto: [
          'Lo añades desde el panel. Y si algo se complica, el mantenimiento son ',
          { fuerte: precioMantenimiento },
        ],
      },
    ],
  },
];
