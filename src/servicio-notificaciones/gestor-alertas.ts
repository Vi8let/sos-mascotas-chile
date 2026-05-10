/**
 * Gestor de Alertas y Notificaciones.
 * Encargado de crear y administrar los avisos para los usuarios.
 */

// Base de datos simulada para el estado de las notificaciones
const notificacionesSimuladas = [];

/**
 * Crea una notificación de coincidencia basada en el puntaje del motor.
 * @param {string} usuarioId - ID del dueño del reporte.
 * @param {string} mascotaNombre - Nombre o descripción breve de la mascota.
 * @param {number} puntaje - Resultado del algoritmo de matching.
 */
export const crearNotificacionMatch = (usuarioId, mascotaNombre, puntaje) => {
    const nuevaNotificacion = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(7),
        usuarioId: usuarioId,
        titulo: "¡Buenas noticias! Posible coincidencia",
        mensaje: `Tu reporte de "${mascotaNombre}" tiene una coincidencia del ${puntaje}% con un nuevo avistamiento.`,
        fecha: new Date().toISOString(),
        leida: false,
        prioridad: puntaje > 85 ? 'ALTA' : 'MEDIA'
    };

    notificacionesSimuladas.push(nuevaNotificacion);
    
    // Log para verificar el flujo en la consola de evaluación
    console.log(`[ServicioNotificaciones] Alerta creada para Usuario ${usuarioId} con score ${puntaje}`);
    
    return nuevaNotificacion;
};

/**
 * Recupera todas las notificaciones de un usuario específico.
 */
export const obtenerNotificaciones = (usuarioId) => {
    return notificacionesSimuladas.filter(n => n.usuarioId === usuarioId);
};

/**
 * Cambia el estado de una notificación a 'leída'.
 */
export const marcarLeida = (id) => {
    const index = notificacionesSimuladas.findIndex(n => n.id === id);
    if (index !== -1) {
        notificacionesSimuladas[index].leida = true;
    }
};
