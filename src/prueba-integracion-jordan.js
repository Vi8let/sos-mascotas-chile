import { calcularPuntaje } from './motor-coincidencias/algoritmo-puntuacion.js';
import { crearNotificacionMatch, obtenerNotificaciones } from './servicio-notificaciones/gestor-alertas.js';

/**
 * Script de prueba para validar que el motor de coincidencia y el 
 * servicio de notificaciones funcionan en conjunto.
 */

console.log("🚀 Iniciando Simulación de Integración - SOS Mascotas Chile\n");

// ESCENARIO: Un usuario perdió un Labrador dorado en Santiago Centro.
const mascotaPerdida = {
    id: "UUID-PERDIDA-001",
    usuarioId: "USER-JORDAN-101",
    mascota: {
        especie: "Perro",
        raza: "Labrador",
        colorPrimario: "Dorado",
        nombre: "Bobby"
    },
    ubicacion: { latituditud: -33.4489, longitud: -70.6693 },
    fechaSuceso: "2024-05-01T12:00:00Z"
};

// ESCENARIO: Alguien reporta haber visto un perro similar a pocas cuadras al día siguiente.
const mascotaAvistada = {
    id: "UUID-AVISTAMIENTO-999",
    mascota: {
        especie: "Perro",
        raza: "Labrador",
        colorPrimario: "Dorado"
    },
    ubicacion: { latituditud: -33.4500, longitud: -70.6685 },
    fechaSuceso: "2024-05-02T10:00:00Z"
};

// 1. Ejecutar el Algoritmo de Puntuación
const scoreFinal = calcularPuntaje(mascotaPerdida, mascotaAvistada);
console.log(`📍 Resultado del Matching: ${scoreFinal}% de coincidencia.`);

// 2. Lógica de Negocio: Notificar solo si es mayor al 70%
if (scoreFinal > 70) {
    console.log("✅ Umbral superado. Generando alerta para el dueño...");
    crearNotificacionMatch(
        mascotaPerdida.usuarioId, 
        mascotaPerdida.mascota.nombre, 
        scoreFinal
    );
} else {
    console.log("⚠️ Puntaje insuficiente para generar notificación.");
}

// 3. Verificar resultados en el servicio de notificaciones
const alertasUsuario = obtenerNotificaciones("USER-JORDAN-101");
console.log("\n🔔 Bandeja de entrada del usuario:");
console.table(alertasUsuario);

console.log("\n✅ Simulación completada con éxito.");
