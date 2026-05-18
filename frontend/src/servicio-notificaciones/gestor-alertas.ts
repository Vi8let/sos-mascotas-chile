/**
 * Gestor de alertas y notificaciones.
 * Encargado de crear y administrar los avisos para los usuarios.
 */

interface NotificacionSimulada {
  id: string;
  usuarioId: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  prioridad: "ALTA" | "MEDIA";
}

const notificacionesSimuladas: NotificacionSimulada[] = [];

/**
 * Crea una notificacion de coincidencia basada en el puntaje del motor.
 */
export const crearNotificacionMatch = (usuarioId: string, mascotaNombre: string, puntaje: number) => {
  const nuevaNotificacion: NotificacionSimulada = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(7),
    usuarioId,
    titulo: "Buenas noticias! Posible coincidencia",
    mensaje: `Tu reporte de "${mascotaNombre}" tiene una coincidencia del ${puntaje}% con un nuevo avistamiento.`,
    fecha: new Date().toISOString(),
    leida: false,
    prioridad: puntaje > 85 ? "ALTA" : "MEDIA",
  };

  notificacionesSimuladas.push(nuevaNotificacion);

  console.log(`[ServicioNotificaciones] Alerta creada para Usuario ${usuarioId} con score ${puntaje}`);

  return nuevaNotificacion;
};

/**
 * Recupera todas las notificaciones de un usuario especifico.
 */
export const obtenerNotificaciones = (usuarioId: string) => {
  return notificacionesSimuladas.filter((notificacion) => notificacion.usuarioId === usuarioId);
};

/**
 * Cambia el estado de una notificacion a leida.
 */
export const marcarLeida = (id: string) => {
  const index = notificacionesSimuladas.findIndex((notificacion) => notificacion.id === id);
  if (index !== -1) {
    notificacionesSimuladas[index].leida = true;
  }
};
